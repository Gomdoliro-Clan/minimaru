'use client';

import styled from '@emotion/styled';
import type { ReactNode } from 'react';
import font from '@/styles/font';

interface PageLayoutProps {
  title?: string;
  children: ReactNode;
  width?: string;
}

const PageLayout = ({ title, children, width = '960px' }: PageLayoutProps) => (
  <Main width={width}>
    {title && <Title>{title}</Title>}
    {children}
  </Main>
);

export default PageLayout;

const Main = styled.main<{ width: string }>`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  max-width: ${({ width }) => width};
  margin: 0 auto;
  padding: 48px 16px 120px;
`;

const Title = styled.h1`
  ${font.H2};
`;
