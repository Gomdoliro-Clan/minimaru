'use client';

import styled from '@emotion/styled';
import dayjs from 'dayjs';
import Link from 'next/link';
import Button from '@/components/common/Button';
import PageLayout from '@/components/common/PageLayout';
import { useSubmittedAtQuery } from '@/services/form/queries';
import color from '@/styles/color';
import font from '@/styles/font';

const FormCompletePage = () => {
  const { data: submittedAt } = useSubmittedAtQuery();

  return (
    <PageLayout width="560px">
      <Card>
        <Check>✓</Check>
        <Title>원서 제출이 완료되었습니다</Title>
        {submittedAt && (
          <SubmittedAt>
            제출 일시 {dayjs(submittedAt).format('YYYY년 M월 D일 (dd) A h시 mm분')}
          </SubmittedAt>
        )}
        <Text>1차 합격자 발표일에 결과 확인 페이지에서 결과를 확인할 수 있습니다.</Text>
        <Link href="/">
          <Button>홈으로</Button>
        </Link>
      </Card>
    </PageLayout>
  );
};

export default FormCompletePage;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px 24px;
  text-align: center;
`;

const Check = styled.div`
  ${font.H2};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  color: ${color.white};
  background-color: ${color.maruDefault};
`;

const Title = styled.h1`
  ${font.H3};
`;

const SubmittedAt = styled.p`
  ${font.p2};
  padding: 8px 16px;
  border-radius: 999px;
  color: ${color.gray800};
  background-color: ${color.gray100};
`;

const Text = styled.p`
  ${font.p2};
  color: ${color.gray600};
`;
