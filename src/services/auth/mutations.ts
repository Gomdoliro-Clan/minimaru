import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { token } from '@/utils/token';
import { getErrorMessage } from '@/utils/error';
import type { LoginRequest, SignUpRequest } from './api';
import { deleteLogout, patchVerification, postLogin, postSignUp, postVerification } from './api';

export const useLoginMutation = (onError: (message: string) => void) => {
  const router = useRouter();

  return useMutation({
    mutationFn: (body: LoginRequest) => postLogin(body),
    onSuccess: ({ accessToken, refreshToken }) => {
      token.set(accessToken, refreshToken);
      router.push('/');
    },
    onError: (error) => onError(getErrorMessage(error)),
  });
};

export const useLogoutMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: deleteLogout,
    onSettled: () => {
      token.clear();
      router.push('/login');
    },
  });
};

export const useRequestVerificationMutation = () =>
  useMutation({
    mutationFn: (phoneNumber: string) => postVerification(phoneNumber),
    onError: (error) => alert(getErrorMessage(error)),
  });

export const useVerifyMutation = () =>
  useMutation({
    mutationFn: ({ phoneNumber, code }: { phoneNumber: string; code: string }) =>
      patchVerification(phoneNumber, code),
    onError: (error) => alert(getErrorMessage(error)),
  });

export const useSignUpMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (body: SignUpRequest) => postSignUp(body),
    onSuccess: () => {
      alert('회원가입이 완료되었습니다.');
      router.push('/login');
    },
    onError: (error) => alert(getErrorMessage(error)),
  });
};
