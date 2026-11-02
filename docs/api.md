# API 명세

mock 서버(`src/mocks/`)는 **백엔드 팀이 만든 서버**라고 생각하세요. 과제에서는 mock 서버 코드를 수정하지 않습니다.
모든 경로 앞에는 `/api`가 붙습니다. 에러 응답은 `{ "message": string }` 형태입니다.

## 인증

- 로그인하면 `accessToken`과 `refreshToken`을 받습니다.
- 인증이 필요한 요청은 `Authorization: Bearer {accessToken}` 헤더를 보냅니다.
- `accessToken`의 유효시간은 **1분**, `refreshToken`은 **1일**입니다.
- `refreshToken`은 **한 번만 사용할 수 있습니다.** 재발급하면 새 `refreshToken`이 발급되고, 이전 것은 즉시 무효가 됩니다.

| Method | Path                | 요청                              | 응답                                        |
| ------ | ------------------- | --------------------------------- | ------------------------------------------- |
| POST   | /users/verification | `{ phoneNumber }`                 | 204. 인증번호는 `123456` 고정, 유효시간 3분 |
| PATCH  | /users/verification | `{ phoneNumber, code }`           | 204                                         |
| POST   | /users              | `{ name, phoneNumber, password }` | 201                                         |
| POST   | /auth               | `{ phoneNumber, password }`       | `{ accessToken, refreshToken }`             |
| PATCH  | /auth               | 헤더 `Refresh-Token`              | `{ accessToken, refreshToken }`             |
| DELETE | /auth               | 헤더 `Refresh-Token`              | 204                                         |
| GET    | /users/me           | -                                 | `{ name, phoneNumber }`                     |

## 일정

| Method | Path       | 응답                                                                         |
| ------ | ---------- | ---------------------------------------------------------------------------- |
| GET    | /schedules | `{ applicationStart, applicationEnd, firstAnnouncement, finalAnnouncement }` |

시각은 한국 시간(KST) 기준이며 `YYYY-MM-DDTHH:mm:ss` 형식입니다.

- 원서 접수: `applicationStart` 이상, `applicationEnd` 미만
- 1차 발표: `firstAnnouncement` 이후
- 최종 발표: `finalAnnouncement` 이후

## 원서

| Method | Path             | 요청                          | 응답                                                                |
| ------ | ---------------- | ----------------------------- | ------------------------------------------------------------------- |
| GET    | /schools?q=      | -                             | `[{ code, name, region }]`                                          |
| GET    | /forms/me/status | -                             | `{ status: 'NOT_STARTED' \| 'DRAFT' \| 'SUBMITTED', submittedAt? }` |
| GET    | /forms/draft     | -                             | 임시저장된 원서. 없으면 404                                         |
| PUT    | /forms/draft     | 원서 전체                     | `{ form, savedAt }`                                                 |
| POST   | /forms           | 제출용 원서                   | 201                                                                 |
| POST   | /files/profile   | `multipart/form-data`, `file` | `{ url }`                                                           |

제출 규칙:

- 접수 기간에만 제출할 수 있습니다. 제출한 원서는 수정할 수 없습니다 (409).
- 자기소개서와 학업계획서는 각각 **1000자 이하**입니다. **줄바꿈은 2자로 계산합니다** (기존 입학 시스템과의 호환).
- 증명사진은 jpg/png, 2MB 이하입니다.
- `submittedAt`은 제출한 경우에만 내려옵니다.

## 결과

| Method | Path           | 응답                                         |
| ------ | -------------- | -------------------------------------------- |
| GET    | /results/first | `{ name, passed, message }`. 발표 전이면 403 |
| GET    | /results/final | `{ name, passed, message }`. 발표 전이면 403 |
