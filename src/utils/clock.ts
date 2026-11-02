import dayjs from 'dayjs';

const OFFSET_KEY = 'mini-maru:time-offset';

const getOffset = () => {
  if (typeof window === 'undefined') return 0;
  return Number(localStorage.getItem(OFFSET_KEY) ?? 0);
};

export const now = () => dayjs().add(getOffset(), 'millisecond');

export const setNow = (target: dayjs.Dayjs) => {
  localStorage.setItem(OFFSET_KEY, String(target.diff(dayjs())));
};

export const resetNow = () => {
  localStorage.removeItem(OFFSET_KEY);
};

export const isTimeShifted = () => getOffset() !== 0;
