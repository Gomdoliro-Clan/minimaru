import type { Form } from '@/types/form';

interface UserRecord {
  name: string;
  phoneNumber: string;
  password: string;
}

interface Verification {
  code: string;
  expiresAt: number;
  verified: boolean;
}

interface Submission {
  form: unknown;
  submittedAt: string;
}

interface Database {
  users: Record<string, UserRecord>;
  verifications: Record<string, Verification>;
  refreshTokens: Record<string, { phoneNumber: string; expiresAt: number }>;
  drafts: Record<string, Form>;
  submissions: Record<string, Submission>;
}

const DB_KEY = 'mini-maru:db';

const createEmpty = (): Database => ({
  users: {},
  verifications: {},
  refreshTokens: {},
  drafts: {},
  submissions: {},
});

export const readDb = (): Database => {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) return createEmpty();
  try {
    return { ...createEmpty(), ...JSON.parse(raw) };
  } catch {
    return createEmpty();
  }
};

export const updateDb = (updater: (db: Database) => void) => {
  const db = readDb();
  updater(db);
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  return db;
};

export const resetDb = () => {
  localStorage.removeItem(DB_KEY);
  Object.keys(localStorage)
    .filter((key) => key.startsWith('mini-maru:profile:'))
    .forEach((key) => localStorage.removeItem(key));
};

export const saveProfile = (id: string, dataUrl: string) => {
  localStorage.setItem(`mini-maru:profile:${id}`, dataUrl);
};

export const readProfile = (id: string) => localStorage.getItem(`mini-maru:profile:${id}`);
