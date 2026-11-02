'use client';

import styled from '@emotion/styled';
import dayjs from 'dayjs';
import Button from '@/components/common/Button';
import { FORM_STEPS } from '@/constants/form';
import color from '@/styles/color';
import font from '@/styles/font';

interface FormControllerProps {
  step: number;
  lastSavedAt: string | null;
  onPrev: () => void;
  onNext: () => void;
  onSave: () => void;
  onSubmit: () => void;
}

const FormController = ({
  step,
  lastSavedAt,
  onPrev,
  onNext,
  onSave,
  onSubmit,
}: FormControllerProps) => {
  const isLastStep = step === FORM_STEPS.length - 1;

  return (
    <Bar>
      <SavedAt>
        {lastSavedAt
          ? `마지막 저장 ${dayjs(lastSavedAt).format('HH:mm:ss')}`
          : '저장된 내용이 없습니다'}
      </SavedAt>
      <Buttons>
        <Button variant="secondary" onClick={onSave}>
          임시저장
        </Button>
        {step > 0 && (
          <Button variant="secondary" onClick={onPrev}>
            이전
          </Button>
        )}
        {isLastStep ? (
          <Button onClick={onSubmit}>제출하기</Button>
        ) : (
          <Button onClick={onNext}>다음</Button>
        )}
      </Buttons>
    </Bar>
  );
};

export default FormController;

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid ${color.gray200};

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SavedAt = styled.span`
  ${font.caption};
  color: ${color.gray600};
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
`;
