export type Semester = '2-1' | '2-2' | '3-1';
export type Subject = '국어' | '영어' | '수학' | '사회' | '과학';
export type AchievementLevel = 'A' | 'B' | 'C' | 'D' | 'E' | '-';

export type Gender = 'MALE' | 'FEMALE' | '';
export type GraduationType = 'EXPECTED' | 'GRADUATED' | 'QUALIFICATION_EXAMINATION' | '';
export type FormCategory = 'REGULAR' | 'SPECIAL' | '';
export type SpecialType = 'MEISTER_TALENT' | 'SOCIAL_INTEGRATION' | '';

export interface Applicant {
  name: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  gender: Gender;
  phoneNumber: string;
  profileUrl: string;
}

export interface Guardian {
  name: string;
  relation: string;
  phoneNumber: string;
  zoneCode: string;
  address: string;
  detailAddress: string;
}

export interface Education {
  graduationType: GraduationType;
  schoolName: string;
  schoolCode: string;
  graduationYear: string;
}

export interface FormType {
  category: FormCategory;
  specialType: SpecialType;
}

export interface Attendance {
  absenceCount: string;
  latenessCount: string;
  earlyLeaveCount: string;
  classAbsenceCount: string;
}

export interface Grade {
  subjects: Record<Semester, Record<Subject, AchievementLevel>>;
  gedScores: Record<Subject, string>;
  attendance: Attendance;
  volunteerHours: string;
}

export interface FormDocument {
  coverLetter: string;
  studyPlan: string;
}

export interface Form {
  applicant: Applicant;
  guardian: Guardian;
  education: Education;
  type: FormType;
  grade: Grade;
  document: FormDocument;
}

export type FormStatus = 'NOT_STARTED' | 'DRAFT' | 'SUBMITTED';
