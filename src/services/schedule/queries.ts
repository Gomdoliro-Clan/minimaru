import { useQuery } from '@tanstack/react-query';
import { maru } from '@/apis/instance';
import type { Schedule } from '@/types/schedule';

const getSchedule = async () => {
  const { data } = await maru.get<Schedule>('/schedules');
  return data;
};

export const useScheduleQuery = () =>
  useQuery({
    queryKey: ['schedule'],
    queryFn: getSchedule,
  });
