import { isAxiosError } from 'axios';

export const getErrorMessage = (error: unknown, fallback = '잠시 후 다시 시도해주세요.') => {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
};
