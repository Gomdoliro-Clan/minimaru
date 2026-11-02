/** @jsxImportSource react */
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Header from '@/components/common/Header';
import DevTimePanel from '@/components/common/DevTimePanel';
import Providers from './Providers';

export const metadata: Metadata = {
  title: '미니 마루',
  description: '부산소프트웨어마이스터고등학교 입학전형 시스템 (과제용)',
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="ko">
    <body>
      <Providers>
        <Header />
        {children}
        <DevTimePanel />
      </Providers>
    </body>
  </html>
);

export default RootLayout;
