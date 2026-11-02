import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import type { Phase, Schedule } from '@/types/schedule';
import { now } from './clock';

dayjs.locale('ko');

export const getPhase = (schedule: Schedule): Phase => {
  const current = now();

  if (current.isBefore(dayjs(schedule.applicationStart))) return 'BEFORE_APPLICATION';
  if (current.isBefore(dayjs(schedule.applicationEnd), 'day')) return 'APPLICATION';
  if (current.isBefore(dayjs(schedule.firstAnnouncement))) return 'AFTER_APPLICATION';
  if (current.isBefore(dayjs(schedule.finalAnnouncement))) return 'FIRST_ANNOUNCED';
  return 'FINAL_ANNOUNCED';
};

export const formatScheduleDate = (date: string) => dayjs(date).format('YYYY.MM.DD (dd) hh:mm');
