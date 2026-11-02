const toBase64Url = (value: object) => {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
};

export const ACCESS_TOKEN_TTL_SECONDS = 60;
export const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24;

export const createAccessToken = (phoneNumber: string, name: string) => {
  const header = toBase64Url({ alg: 'HS256', typ: 'JWT' });
  const payload = toBase64Url({
    sub: phoneNumber,
    name,
    exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL_SECONDS,
  });
  return `${header}.${payload}.mock-signature`;
};

export const verifyAccessToken = (token: string): string | null => {
  const [, payload, signature] = token.split('.');
  if (!payload || signature !== 'mock-signature') return null;
  try {
    const { sub, exp } = fromBase64Url(payload);
    if (exp * 1000 < Date.now()) return null;
    return sub;
  } catch {
    return null;
  }
};

export const createRefreshToken = () => crypto.randomUUID();
