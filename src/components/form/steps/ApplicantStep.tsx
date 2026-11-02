'use client';

import Input from '@/components/common/Input';
import { useFormSection } from '@/hooks/useFormSection';
import type { FieldErrors } from '@/schemas/form';
import ProfileUploader from '../ProfileUploader';
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

const ApplicantStep = ({ errors }: { errors: FieldErrors }) => {
  const { section: applicant, update } = useFormSection('applicant');

  return (
    <StepSection>
      <StepTitle>지원자 정보</StepTitle>
      <FieldGroup>
        <FieldLabel>증명사진</FieldLabel>
        <ProfileUploader url={applicant.profileUrl} onChange={(url) => update('profileUrl', url)} />
        {errors.profileUrl && <ErrorText>{errors.profileUrl}</ErrorText>}
      </FieldGroup>
      <Input
        label="이름"
        value={applicant.name}
        onChange={(e) => update('name', e.target.value)}
        error={errors.name}
      />
      <FieldGroup>
        <FieldLabel>생년월일</FieldLabel>
        <Row>
          <Input
            placeholder="년 (YYYY)"
            inputMode="numeric"
            maxLength={4}
            value={applicant.birthYear}
            onChange={(e) => update('birthYear', e.target.value)}
            error={errors.birthYear}
          />
          <Input
            placeholder="월"
            inputMode="numeric"
            maxLength={2}
            value={applicant.birthMonth}
            onChange={(e) => update('birthMonth', e.target.value)}
            error={errors.birthMonth}
          />
          <Input
            placeholder="일"
            inputMode="numeric"
            maxLength={2}
            value={applicant.birthDay}
            onChange={(e) => update('birthDay', e.target.value)}
            error={errors.birthDay}
          />
        </Row>
      </FieldGroup>
      <FieldGroup>
        <FieldLabel>성별</FieldLabel>
        <RadioGroup>
          <RadioButton
            type="button"
            selected={applicant.gender === 'MALE'}
            onClick={() => update('gender', 'MALE')}
          >
            남자
          </RadioButton>
          <RadioButton
            type="button"
            selected={applicant.gender === 'FEMALE'}
            onClick={() => update('gender', 'FEMALE')}
          >
            여자
          </RadioButton>
        </RadioGroup>
        {errors.gender && <ErrorText>{errors.gender}</ErrorText>}
      </FieldGroup>
      <Input
        label="전화번호"
        placeholder="'-' 없이 입력해주세요"
        inputMode="numeric"
        maxLength={11}
        value={applicant.phoneNumber}
        onChange={(e) => update('phoneNumber', e.target.value)}
        error={errors.phoneNumber}
      />
    </StepSection>
  );
};

export default ApplicantStep;
