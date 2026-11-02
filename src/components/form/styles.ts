import styled from '@emotion/styled';
import color from '@/styles/color';
import font from '@/styles/font';

export const StepSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const StepTitle = styled.h2`
  ${font.H4};
`;

export const Description = styled.p`
  ${font.p3};
  color: ${color.gray600};
`;

export const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FieldLabel = styled.span`
  ${font.context};
  color: ${color.gray700};
`;

export const RadioGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const RadioButton = styled.button<{ selected: boolean }>`
  ${font.btn2};
  height: 48px;
  padding: 0 20px;
  border-radius: 6px;
  border: 1px solid ${({ selected }) => (selected ? color.maruDefault : color.gray400)};
  color: ${({ selected }) => (selected ? color.maruDefault : color.gray700)};
  background-color: ${({ selected }) => (selected ? color.maruLightBlue : color.white)};
`;

export const ErrorText = styled.p`
  ${font.caption};
  color: ${color.red};
`;

export const Select = styled.select`
  ${font.p3};
  height: 40px;
  padding: 0 8px;
  border-radius: 6px;
  border: 1px solid ${color.gray400};
  background-color: ${color.white};
`;
