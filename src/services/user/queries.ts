import { useQuery } from '@tanstack/react-query';
import { maru } from '@/apis/instance';
import type { User } from '@/types/user';
import { token } from '@/utils/token';

const getUser = async () => {
  const { data } = await maru.get<User>('/users/me');
  return data;
};

export const useUserQuery = () =>
  useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    enabled: token.exists(),
  });
