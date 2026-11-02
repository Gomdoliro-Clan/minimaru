import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { token } from '@/utils/token';

export const useLoginGuard = () => {
  const router = useRouter();
  const isLoggedIn = token.exists();

  useEffect(() => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  return isLoggedIn;
};
