'use client';

import { useFormSection } from '@/hooks/useFormSection';
import type { FieldErrors } from '@/schemas/form';
import type { SpecialType } from '@/types/form';
import {
  Description,
  ErrorText,
  FieldGroup,
  FieldLabel,
  RadioButton,
  RadioGroup,
  StepSection,
  StepTitle,
} from '../styles';

const SPECIAL_TYPES: { value: SpecialType; label: string }[] = [
  { value: 'MEISTER_TALENT', label: '마이스터인재전형' },
  { value: 'SOCIAL_INTEGRATION', label: '사회통합전형' },
];

const TypeStep = ({ errors }: { errors: FieldErrors }) => {
  const { section: type, update } = useFormSection('type');

  return (
    <StepSection>
      <StepTitle>전형 선택</StepTitle>
      <Description>지원할 전형을 선택해주세요. 제출 후에는 변경할 수 없습니다.</Description>
      <FieldGroup>
        <FieldLabel>전형</FieldLabel>
        <RadioGroup>
          <RadioButton
            type="button"
            selected={type.category === 'REGULAR'}
            onClick={() => {
              update('category', 'REGULAR');
              update('specialType', '');
            }}
          >
            일반전형
          </RadioButton>
          <RadioButton
            type="button"
            selected={type.category === 'SPECIAL'}
            onClick={() => update('category', 'SPECIAL')}
          >
            특별전형
          </RadioButton>
        </RadioGroup>
        {errors.category && <ErrorText>{errors.category}</ErrorText>}
      </FieldGroup>
      {type.category === 'SPECIAL' && (
        <FieldGroup>
          <FieldLabel>특별전형 유형</FieldLabel>
          <RadioGroup>
            {SPECIAL_TYPES.map(({ value, label }) => (
              <RadioButton
                key={value}
                type="button"
                selected={type.specialType === value}
                onClick={() => update('specialType', value)}
              >
                {label}
              </RadioButton>
            ))}
          </RadioGroup>
          {errors.specialType && <ErrorText>{errors.specialType}</ErrorText>}
        </FieldGroup>
      )}
    </StepSection>
  );
};

export default TypeStep;
