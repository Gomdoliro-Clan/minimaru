import { useQuery } from '@tanstack/react-query';
import { maru } from '@/apis/instance';
import type { Result } from '@/types/result';

const getResult = async (kind: 'first' | 'final') => {
  const { data } = await maru.get<Result>(`/results/${kind}`);
  return data;
};

export const useResultQuery = (kind: 'first' | 'final', enabled: boolean) =>
  useQuery({
    queryKey: ['result', kind],
    queryFn: () => getResult(kind),
    enabled,
  });
