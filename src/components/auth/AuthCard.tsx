'use client';

import styled from '@emotion/styled';
import color from '@/styles/color';
import font from '@/styles/font';

export const AuthCard = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 440px;
  margin: 64px auto;
  padding: 40px 32px;
  border: 1px solid ${color.gray200};
  border-radius: 16px;
`;

export const AuthTitle = styled.h1`
  ${font.H3};
`;

export const AuthFooter = styled.p`
  ${font.p3};
  color: ${color.gray600};
  text-align: center;

  a {
    color: ${color.maruDefault};
  }
`;

export const InlineRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

export const Hint = styled.p<{ error?: boolean }>`
  ${font.caption};
  color: ${({ error }) => (error ? color.red : color.gray600)};
`;
