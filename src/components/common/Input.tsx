'use client';

import styled from '@emotion/styled';
import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import color from '@/styles/color';
import font from '@/styles/font';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  width?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, width, ...props }, ref) => (
  <Wrapper width={width}>
    {label && <Label>{label}</Label>}
    <StyledInput ref={ref} hasError={Boolean(error)} aria-invalid={Boolean(error)} {...props} />
    {error && <ErrorMessage>{error}</ErrorMessage>}
  </Wrapper>
));

Input.displayName = 'Input';

export default Input;

export const Wrapper = styled.div<{ width?: string }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: ${({ width }) => width ?? '100%'};
`;

export const Label = styled.label`
  ${font.context};
  color: ${color.gray700};
`;

export const StyledInput = styled.input<{ hasError?: boolean }>`
  ${font.p2};
  height: 48px;
  padding: 0 16px;
  border-radius: 6px;
  border: 1px solid ${({ hasError }) => (hasError ? color.red : color.gray400)};
  outline: none;

  &:focus {
    border-color: ${({ hasError }) => (hasError ? color.red : color.maruDefault)};
    box-shadow: 0 0 0 3px ${({ hasError }) => (hasError ? color.lightRed : color.maruLightBlue)};
  }

  &:disabled {
    background-color: ${color.gray100};
    color: ${color.gray600};
  }
`;

export const ErrorMessage = styled.p`
  ${font.caption};
  color: ${color.red};
`;
