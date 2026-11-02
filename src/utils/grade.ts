import {
  ACHIEVEMENT_SCORE,
  MAX_ATTENDANCE_SCORE,
  MAX_SUBJECT_SCORE,
  MAX_VOLUNTEER_SCORE,
  SEMESTER_WEIGHTS,
  SEMESTERS,
  SUBJECTS,
} from '@/constants/form';
import type { AchievementLevel, Attendance, Form, Subject } from '@/types/form';

const round = (value: number) => Math.round(value * 100) / 100;

const toNumber = (value: string) => Number(value) || 0;

const getSemesterAverage = (levels: Record<Subject, AchievementLevel>) => {
  const scores = SUBJECTS.map((subject) => levels[subject])
    .filter((level) => level !== '-')
    .map((level) => ACHIEVEMENT_SCORE[level]);

  if (scores.length === 0) return 0;

  const average = scores.reduce((acc, score) => acc + score, 0) / scores.length;
  return Number(average.toFixed(2));
};

export const calculateSubjectScore = (subjects: Form['grade']['subjects']) => {
  const totalWeight = SEMESTERS.reduce((acc, semester) => acc + SEMESTER_WEIGHTS[semester], 0);
  const weightedAverage =
    SEMESTERS.reduce(
      (acc, semester) => acc + getSemesterAverage(subjects[semester]) * SEMESTER_WEIGHTS[semester],
      0,
    ) / totalWeight;

  return round((weightedAverage / 5) * MAX_SUBJECT_SCORE);
};

export const calculateGedSubjectScore = (gedScores: Form['grade']['gedScores']) => {
  const average =
    SUBJECTS.reduce((acc, subject) => acc + toNumber(gedScores[subject]), 0) / SUBJECTS.length;
  return round((average / 100) * MAX_SUBJECT_SCORE);
};

export const calculateAttendanceScore = (attendance: Attendance) => {
  const convertedAbsence = Math.floor(
    (toNumber(attendance.latenessCount) +
      toNumber(attendance.earlyLeaveCount) +
      toNumber(attendance.classAbsenceCount)) /
      3,
  );
  const absence = toNumber(attendance.absenceCount) + convertedAbsence;
  return Math.max(MAX_ATTENDANCE_SCORE - absence * 3, 0);
};

export const calculateVolunteerScore = (hours: string) => {
  const value = toNumber(hours);
  if (value >= 15) return MAX_VOLUNTEER_SCORE;
  if (value >= 7) return 10;
  return 5;
};

export const calculateScores = (form: Form) => {
  if (form.education.graduationType === 'QUALIFICATION_EXAMINATION') {
    return {
      subject: calculateGedSubjectScore(form.grade.gedScores),
      attendance: MAX_ATTENDANCE_SCORE,
      volunteer: MAX_VOLUNTEER_SCORE,
    };
  }

  return {
    subject: calculateSubjectScore(form.grade.subjects),
    attendance: calculateAttendanceScore(form.grade.attendance),
    volunteer: calculateVolunteerScore(form.grade.volunteerHours),
  };
};

export const calculateTotalScore = (form: Form) => {
  const { subject, attendance, volunteer } = calculateScores(form);
  return round(subject + attendance + volunteer);
};
