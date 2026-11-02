import { maru } from '@/apis/instance';
import { token } from '@/utils/token';

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  phoneNumber: string;
  password: string;
}

export const postLogin = async (body: LoginRequest) => {
  const { data } = await maru.post<{ accessToken: string; refreshToken: string }>('/auth', body);
  return data;
};

export const deleteLogout = async () => {
  await maru.delete('/auth', { headers: { 'Refresh-Token': token.getRefresh() ?? '' } });
};

export const postVerification = async (phoneNumber: string) => {
  await maru.post('/users/verification', { phoneNumber });
};

export const patchVerification = async (phoneNumber: string, code: string) => {
  await maru.patch('/users/verification', { phoneNumber, code });
};

export const postSignUp = async (body: SignUpRequest) => {
  await maru.post('/users', body);
};
