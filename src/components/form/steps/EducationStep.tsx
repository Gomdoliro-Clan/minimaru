'use client';

import { useOverlay } from '@toss/use-overlay';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useFormSection } from '@/hooks/useFormSection';
import type { FieldErrors } from '@/schemas/form';
import type { GraduationType } from '@/types/form';
import SchoolSearchModal from '../SchoolSearchModal';
import {
  ErrorText,
  FieldGroup,
  FieldLabel,
  RadioButton,
  RadioGroup,
  Row,
  StepSection,
  StepTitle,
} from '../styles';

const GRADUATION_TYPES: { value: GraduationType; label: string }[] = [
  { value: 'EXPECTED', label: '졸업 예정' },
  { value: 'GRADUATED', label: '졸업' },
  { value: 'QUALIFICATION_EXAMINATION', label: '검정고시' },
];

const EducationStep = ({ errors }: { errors: FieldErrors }) => {
  const { section: education, update } = useFormSection('education');
  const overlay = useOverlay();
  const isGed = education.graduationType === 'QUALIFICATION_EXAMINATION';

  const openSchoolModal = () => {
    overlay.open(({ isOpen, close }) => (
      <SchoolSearchModal
        isOpen={isOpen}
        onClose={close}
        onSelect={(school) => {
          update('schoolName', school.name);
          update('schoolCode', school.code);
        }}
      />
    ));
  };

  return (
    <StepSection>
      <StepTitle>출신학교</StepTitle>
      <FieldGroup>
        <FieldLabel>졸업 구분</FieldLabel>
        <RadioGroup>
          {GRADUATION_TYPES.map(({ value, label }) => (
            <RadioButton
              key={value}
              type="button"
              selected={education.graduationType === value}
              onClick={() => update('graduationType', value)}
            >
              {label}
            </RadioButton>
          ))}
        </RadioGroup>
        {errors.graduationType && <ErrorText>{errors.graduationType}</ErrorText>}
      </FieldGroup>
      {!isGed && (
        <FieldGroup>
          <FieldLabel>출신 중학교</FieldLabel>
          <Row>
            <Input
              placeholder="학교를 검색해주세요"
              value={education.schoolName}
              readOnly
              error={errors.schoolName}
            />
            <Button variant="secondary" onClick={openSchoolModal}>
              학교 검색
            </Button>
          </Row>
        </FieldGroup>
      )}
      <Input
        label={isGed ? '합격 연도' : '졸업(예정) 연도'}
        placeholder="YYYY"
        inputMode="numeric"
        maxLength={4}
        value={education.graduationYear}
        onChange={(e) => update('graduationYear', e.target.value)}
        error={errors.graduationYear}
        width="200px"
      />
    </StepSection>
  );
};

export default EducationStep;
