const ACCESS_TOKEN_KEY = 'mini-maru:access-token';
const REFRESH_TOKEN_KEY = 'mini-maru:refresh-token';

export const token = {
  getAccess: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  set: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  exists: () => Boolean(localStorage.getItem(REFRESH_TOKEN_KEY)),
};
