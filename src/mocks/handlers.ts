import { delay, http, HttpResponse } from 'msw';
import dayjs from 'dayjs';
import { now } from '@/utils/clock';
import type { Form } from '@/types/form';
import { readDb, readProfile, saveProfile, updateDb } from './db';
import {
  createAccessToken,
  createRefreshToken,
  REFRESH_TOKEN_TTL_SECONDS,
  verifyAccessToken,
} from './jwt';
import { SCHOOLS } from './schools';

const SCHEDULE = {
  applicationStart: '2027-10-13T09:00:00',
  applicationEnd: '2027-10-16T17:00:00',
  firstAnnouncement: '2027-10-23T14:00:00',
  finalAnnouncement: '2027-11-03T14:00:00',
};

const VERIFICATION_CODE = '123456';
const VERIFICATION_TTL_MS = 3 * 60 * 1000;
const DOCUMENT_MAX_LENGTH = 1000;
const PROFILE_MAX_SIZE = 2 * 1024 * 1024;

const error = (status: number, message: string) => HttpResponse.json({ message }, { status });

const networkDelay = () => delay(150 + Math.random() * 250);

const getAuthPhone = (request: Request) => {
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) return null;
  return verifyAccessToken(authorization.slice('Bearer '.length));
};

const issueTokens = (phoneNumber: string, name: string) => {
  const accessToken = createAccessToken(phoneNumber, name);
  const refreshToken = createRefreshToken();
  updateDb((db) => {
    db.refreshTokens[refreshToken] = {
      phoneNumber,
      expiresAt: Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000,
    };
  });
  return { accessToken, refreshToken };
};

// 백엔드는 줄바꿈을 CRLF(2자)로 저장한다. docs/api.md 참고
const countDocumentLength = (text: string) => text.replace(/\r?\n/g, '\r\n').length;

const isApplicationPeriod = () => {
  const current = now();
  return (
    !current.isBefore(dayjs(SCHEDULE.applicationStart)) &&
    current.isBefore(dayjs(SCHEDULE.applicationEnd))
  );
};

const digitSum = (phoneNumber: string) =>
  phoneNumber.split('').reduce((acc, digit) => acc + Number(digit), 0);

const toDataUrl = async (file: File) => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return `data:${file.type};base64,${btoa(binary)}`;
};

export const handlers = [
  http.post('/api/users/verification', async ({ request }) => {
    await networkDelay();
    const { phoneNumber } = (await request.json()) as { phoneNumber: string };
    if (!/^01[016789]\d{7,8}$/.test(phoneNumber)) {
      return error(400, '전화번호 형식이 올바르지 않습니다.');
    }
    if (readDb().users[phoneNumber]) {
      return error(409, '이미 가입된 전화번호입니다.');
    }
    updateDb((db) => {
      db.verifications[phoneNumber] = {
        code: VERIFICATION_CODE,
        expiresAt: Date.now() + VERIFICATION_TTL_MS,
        verified: false,
      };
    });
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch('/api/users/verification', async ({ request }) => {
    await networkDelay();
    const { phoneNumber, code } = (await request.json()) as { phoneNumber: string; code: string };
    const verification = readDb().verifications[phoneNumber];
    if (!verification) return error(404, '인증번호를 먼저 요청해주세요.');
    if (verification.expiresAt < Date.now()) return error(410, '인증번호가 만료되었습니다.');
    if (verification.code !== code) return error(400, '인증번호가 일치하지 않습니다.');
    updateDb((db) => {
      db.verifications[phoneNumber].verified = true;
    });
    return new HttpResponse(null, { status: 204 });
  }),

  http.post('/api/users', async ({ request }) => {
    await networkDelay();
    const { name, phoneNumber, password } = (await request.json()) as {
      name: string;
      phoneNumber: string;
      password: string;
    };
    const db = readDb();
    if (db.users[phoneNumber]) return error(409, '이미 가입된 전화번호입니다.');
    if (!db.verifications[phoneNumber]?.verified) return error(403, '전화번호 인증이 필요합니다.');
    updateDb((draft) => {
      draft.users[phoneNumber] = { name, phoneNumber, password };
      delete draft.verifications[phoneNumber];
    });
    return new HttpResponse(null, { status: 201 });
  }),

  http.post('/api/auth', async ({ request }) => {
    await networkDelay();
    const { phoneNumber, password } = (await request.json()) as {
      phoneNumber: string;
      password: string;
    };
    const user = readDb().users[phoneNumber];
    if (!user || user.password !== password) {
      return error(401, '전화번호 또는 비밀번호가 일치하지 않습니다.');
    }
    return HttpResponse.json(issueTokens(user.phoneNumber, user.name));
  }),

  http.patch('/api/auth', async ({ request }) => {
    await networkDelay();
    const refreshToken = request.headers.get('Refresh-Token') ?? '';
    const db = readDb();
    const record = db.refreshTokens[refreshToken];
    if (!record || record.expiresAt < Date.now()) {
      return error(401, '유효하지 않은 토큰입니다.');
    }
    // refresh token은 한 번만 사용할 수 있다 (rotation)
    updateDb((draft) => {
      delete draft.refreshTokens[refreshToken];
    });
    const user = db.users[record.phoneNumber];
    return HttpResponse.json(issueTokens(user.phoneNumber, user.name));
  }),

  http.delete('/api/auth', async ({ request }) => {
    await networkDelay();
    const refreshToken = request.headers.get('Refresh-Token') ?? '';
    updateDb((db) => {
      delete db.refreshTokens[refreshToken];
    });
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('/api/users/me', async ({ request }) => {
    await networkDelay();
    const phoneNumber = getAuthPhone(request);
    if (!phoneNumber) return error(401, '인증이 필요합니다.');
    const user = readDb().users[phoneNumber];
    return HttpResponse.json({ name: user.name, phoneNumber: user.phoneNumber });
  }),

  http.get('/api/schedules', async () => {
    await networkDelay();
    return HttpResponse.json(SCHEDULE);
  }),

  http.get('/api/schools', async ({ request }) => {
    await networkDelay();
    const q = new URL(request.url).searchParams.get('q')?.trim() ?? '';
    if (!q) return HttpResponse.json([]);
    return HttpResponse.json(SCHOOLS.filter((school) => school.name.includes(q)));
  }),

  http.get('/api/forms/me/status', async ({ request }) => {
    await networkDelay();
    const phoneNumber = getAuthPhone(request);
    if (!phoneNumber) return error(401, '인증이 필요합니다.');
    const db = readDb();
    const submission = db.submissions[phoneNumber];
    if (submission) {
      return HttpResponse.json({ status: 'SUBMITTED', submittedAt: submission.submittedAt });
    }
    return HttpResponse.json({ status: db.drafts[phoneNumber] ? 'DRAFT' : 'NOT_STARTED' });
  }),

  http.get('/api/forms/draft', async ({ request }) => {
    await networkDelay();
    const phoneNumber = getAuthPhone(request);
    if (!phoneNumber) return error(401, '인증이 필요합니다.');
    const draft = readDb().drafts[phoneNumber];
    if (!draft) return error(404, '임시저장된 원서가 없습니다.');
    return HttpResponse.json(draft);
  }),

  http.put('/api/forms/draft', async ({ request }) => {
    const phoneNumber = getAuthPhone(request);
    if (!phoneNumber) return error(401, '인증이 필요합니다.');
    if (readDb().submissions[phoneNumber]) return error(409, '이미 제출된 원서입니다.');
    const form = (await request.json()) as Form;
    const savedAt = new Date().toISOString();
    updateDb((db) => {
      db.drafts[phoneNumber] = form;
    });
    await delay(200 + Math.random() * 1300);
    return HttpResponse.json({ form, savedAt });
  }),

  http.post('/api/forms', async ({ request }) => {
    await networkDelay();
    const phoneNumber = getAuthPhone(request);
    if (!phoneNumber) return error(401, '인증이 필요합니다.');
    if (!isApplicationPeriod()) return error(403, '원서 접수 기간이 아닙니다.');
    if (readDb().submissions[phoneNumber]) return error(409, '이미 제출된 원서입니다.');
    const form = (await request.json()) as {
      document: { coverLetter: string; studyPlan: string };
    };
    if (
      countDocumentLength(form.document.coverLetter) > DOCUMENT_MAX_LENGTH ||
      countDocumentLength(form.document.studyPlan) > DOCUMENT_MAX_LENGTH
    ) {
      return error(400, '글자 수 제한을 초과했습니다.');
    }
    updateDb((db) => {
      db.submissions[phoneNumber] = { form, submittedAt: now().format('YYYY-MM-DDTHH:mm:ss') };
      delete db.drafts[phoneNumber];
    });
    return new HttpResponse(null, { status: 201 });
  }),

  http.post('/api/files/profile', async ({ request }) => {
    await networkDelay();
    const phoneNumber = getAuthPhone(request);
    if (!phoneNumber) return error(401, '인증이 필요합니다.');
    const file = (await request.formData()).get('file');
    if (!(file instanceof File)) return error(400, '파일이 없습니다.');
    if (file.size > PROFILE_MAX_SIZE) return error(413, '파일 크기는 2MB 이하여야 합니다.');
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      return error(415, 'jpg, png 파일만 업로드할 수 있습니다.');
    }
    const id = crypto.randomUUID();
    try {
      saveProfile(id, await toDataUrl(file));
    } catch {
      return error(507, '저장 공간이 부족합니다. 개발자 도구에서 localStorage를 비워주세요.');
    }
    return HttpResponse.json({ url: `/api/files/profile/${id}` });
  }),

  http.get('/api/files/profile/:id', async ({ params }) => {
    const dataUrl = readProfile(String(params.id));
    if (!dataUrl) return new HttpResponse(null, { status: 404 });
    const [meta, base64] = dataUrl.split(',');
    const type = meta.slice('data:'.length, meta.indexOf(';'));
    const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
    return new HttpResponse(bytes, { headers: { 'Content-Type': type } });
  }),

  http.get('/api/results/first', async ({ request }) => {
    await networkDelay();
    const phoneNumber = getAuthPhone(request);
    if (!phoneNumber) return error(401, '인증이 필요합니다.');
    if (now().isBefore(dayjs(SCHEDULE.firstAnnouncement))) {
      return error(403, '아직 1차 합격자 발표 전입니다.');
    }
    const db = readDb();
    if (!db.submissions[phoneNumber]) return error(404, '제출된 원서가 없습니다.');
    const passed = digitSum(phoneNumber) % 2 === 0;
    return HttpResponse.json({
      name: db.users[phoneNumber].name,
      passed,
      message: passed
        ? '1차 전형에 합격하셨습니다. 2차 전형(심층면접)은 10월 26일 09:00까지 입실해주세요.'
        : '아쉽게도 1차 전형에 합격하지 못했습니다.',
    });
  }),

  http.get('/api/results/final', async ({ request }) => {
    await networkDelay();
    const phoneNumber = getAuthPhone(request);
    if (!phoneNumber) return error(401, '인증이 필요합니다.');
    if (now().isBefore(dayjs(SCHEDULE.finalAnnouncement))) {
      return error(403, '아직 최종 합격자 발표 전입니다.');
    }
    const db = readDb();
    if (!db.submissions[phoneNumber]) return error(404, '제출된 원서가 없습니다.');
    const passed = digitSum(phoneNumber) % 2 === 0 && Number(phoneNumber.at(-1)) % 2 === 0;
    return HttpResponse.json({
      name: db.users[phoneNumber].name,
      passed,
      message: passed
        ? '최종 합격을 축하드립니다! 등록 안내는 추후 문자로 전달됩니다.'
        : '아쉽게도 최종 합격하지 못했습니다.',
    });
  }),
];
