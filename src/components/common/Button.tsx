'use client';

import styled from '@emotion/styled';
import type { ButtonHTMLAttributes } from 'react';
import color from '@/styles/color';
import font from '@/styles/font';

type Variant = 'primary' | 'secondary' | 'text';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  width?: string;
}

const Button = ({ variant = 'primary', width, type = 'button', ...props }: ButtonProps) => (
  <StyledButton type={type} variant={variant} width={width} {...props} />
);

export default Button;

const StyledButton = styled.button<{ variant: Variant; width?: string }>`
  ${font.btn2};
  width: ${({ width }) => width ?? 'auto'};
  height: 48px;
  padding: 0 20px;
  border-radius: 6px;
  white-space: nowrap;
  color: ${({ variant }) => (variant === 'primary' ? color.white : color.gray800)};
  background-color: ${({ variant }) =>
    variant === 'primary'
      ? color.maruDefault
      : variant === 'secondary'
        ? color.gray100
        : 'transparent'};
  border: ${({ variant }) => (variant === 'secondary' ? `1px solid ${color.gray300}` : 'none')};

  &:hover {
    background-color: ${({ variant }) =>
      variant === 'primary'
        ? color.maruHoverd
        : variant === 'secondary'
          ? color.gray200
          : color.gray100};
  }

  &:disabled {
    cursor: not-allowed;
    color: ${color.gray500};
    background-color: ${color.gray200};
  }
`;
