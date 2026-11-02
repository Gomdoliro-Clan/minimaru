'use client';

import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import Input from '@/components/common/Input';
import { ACHIEVEMENT_LEVELS, SEMESTERS, SUBJECTS } from '@/constants/form';
import type { FieldErrors } from '@/schemas/form';
import { formAtom } from '@/stores';
import color from '@/styles/color';
import font from '@/styles/font';
import type { AchievementLevel, Attendance, Semester, Subject } from '@/types/form';
import GradePreview from '../GradePreview';
import {
  Description,
  FieldGroup,
  FieldLabel,
  Row,
  Select,
  StepSection,
  StepTitle,
} from '../styles';

const ATTENDANCE_FIELDS: { key: keyof Attendance; label: string }[] = [
  { key: 'absenceCount', label: '결석' },
  { key: 'latenessCount', label: '지각' },
  { key: 'earlyLeaveCount', label: '조퇴' },
  { key: 'classAbsenceCount', label: '결과' },
];

const GradeStep = ({ errors }: { errors: FieldErrors }) => {
  const [form, setForm] = useAtom(formAtom);
  const { grade } = form;
  const isGed = form.education.graduationType === 'QUALIFICATION_EXAMINATION';

  const updateLevel = (semester: Semester, subject: Subject, level: AchievementLevel) =>
    setForm((prev) => ({
      ...prev,
      grade: {
        ...prev.grade,
        subjects: {
          ...prev.grade.subjects,
          [semester]: { ...prev.grade.subjects[semester], [subject]: level },
        },
      },
    }));

  const updateGedScore = (subject: Subject, value: string) =>
    setForm((prev) => ({
      ...prev,
      grade: { ...prev.grade, gedScores: { ...prev.grade.gedScores, [subject]: value } },
    }));

  const updateAttendance = (key: keyof Attendance, value: string) =>
    setForm((prev) => ({
      ...prev,
      grade: { ...prev.grade, attendance: { ...prev.grade.attendance, [key]: value } },
    }));

  const updateVolunteerHours = (value: string) =>
    setForm((prev) => ({ ...prev, grade: { ...prev.grade, volunteerHours: value } }));

  if (isGed) {
    return (
      <StepSection>
        <StepTitle>검정고시 성적</StepTitle>
        <Description>
          과목별 점수(0~100)를 입력해주세요. 출결과 봉사는 만점으로 처리됩니다.
        </Description>
        <Row>
          {SUBJECTS.map((subject) => (
            <Input
              key={subject}
              label={subject}
              type="number"
              value={grade.gedScores[subject]}
              onChange={(e) => updateGedScore(subject, e.target.value)}
              error={errors[`gedScores.${subject}`]}
            />
          ))}
        </Row>
        <GradePreview form={form} />
      </StepSection>
    );
  }

  return (
    <StepSection>
      <StepTitle>성적 입력</StepTitle>
      <Description>
        학기별 과목 성취도를 선택해주세요. 이수하지 않은 과목이나 자유학기는 &apos;-&apos;로 두세요.
      </Description>
      <Table>
        <thead>
          <tr>
            <th>과목</th>
            {SEMESTERS.map((semester) => (
              <th key={semester}>{semester}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SUBJECTS.map((subject) => (
            <tr key={subject}>
              <td>{subject}</td>
              {SEMESTERS.map((semester) => (
                <td key={semester}>
                  <Select
                    aria-label={`${semester} ${subject}`}
                    value={grade.subjects[semester][subject]}
                    onChange={(e) =>
                      updateLevel(semester, subject, e.target.value as AchievementLevel)
                    }
                  >
                    {ACHIEVEMENT_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </Select>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <FieldGroup>
        <FieldLabel>출결 (3학년 1학기까지 합계)</FieldLabel>
        <Row>
          {ATTENDANCE_FIELDS.map(({ key, label }) => (
            <Input
              key={key}
              label={label}
              type="number"
              min={0}
              value={grade.attendance[key]}
              onChange={(e) => updateAttendance(key, e.target.value)}
              error={errors[`attendance.${key}`]}
            />
          ))}
        </Row>
      </FieldGroup>
      <Input
        label="봉사활동 시간"
        type="number"
        min={0}
        value={grade.volunteerHours}
        onChange={(e) => updateVolunteerHours(e.target.value)}
        error={errors.volunteerHours}
        width="200px"
      />
      <GradePreview form={form} />
    </StepSection>
  );
};

export default GradeStep;

const Table = styled.table`
  ${font.p3};
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 8px;
    border-bottom: 1px solid ${color.gray200};
    text-align: center;
  }

  th {
    color: ${color.gray600};
    font-weight: 500;
  }

  select {
    width: 100%;
  }
`;
