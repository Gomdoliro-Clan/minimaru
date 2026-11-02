import type { AchievementLevel, Semester, Subject } from '@/types/form';

export const SEMESTERS: Semester[] = ['2-1', '2-2', '3-1'];
export const SUBJECTS: Subject[] = ['국어', '영어', '수학', '사회', '과학'];
export const ACHIEVEMENT_LEVELS: AchievementLevel[] = ['A', 'B', 'C', 'D', 'E', '-'];

export const SEMESTER_WEIGHTS: Record<Semester, number> = {
  '2-1': 3,
  '2-2': 3,
  '3-1': 4,
};

export const ACHIEVEMENT_SCORE: Record<AchievementLevel, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  '-': 0,
};

export const MAX_SUBJECT_SCORE = 120;
export const MAX_ATTENDANCE_SCORE = 15;
export const MAX_VOLUNTEER_SCORE = 15;

export const DOCUMENT_MAX_LENGTH = 1000;

export const FORM_STEPS = [
  '지원자 정보',
  '보호자 정보',
  '출신학교',
  '전형 선택',
  '성적 입력',
  '자기소개서',
  '최종 확인',
] as const;
