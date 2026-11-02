'use client';

import styled from '@emotion/styled';
import PageLayout from '@/components/common/PageLayout';
import { useLoginGuard } from '@/hooks/useLoginGuard';
import { useResultQuery } from '@/services/result/queries';
import { useScheduleQuery } from '@/services/schedule/queries';
import color from '@/styles/color';
import font from '@/styles/font';
import type { Result } from '@/types/result';
import { getErrorMessage } from '@/utils/error';
import { getPhase } from '@/utils/schedule';

const ResultCard = ({
  title,
  result,
  error,
  isLoading,
}: {
  title: string;
  result?: Result;
  error: unknown;
  isLoading: boolean;
}) => (
  <Card passed={result?.passed}>
    <CardTitle>{title}</CardTitle>
    {isLoading && <Message>결과를 불러오는 중입니다...</Message>}
    {error ? <Message>{getErrorMessage(error)}</Message> : null}
    {result && (
      <>
        <Status passed={result.passed}>{result.passed ? '합격' : '불합격'}</Status>
        <Message>
          {result.name}님, {result.message}
        </Message>
      </>
    )}
  </Card>
);

const ResultPage = () => {
  const isLoggedIn = useLoginGuard();
  const { data: schedule } = useScheduleQuery();
  const phase = schedule ? getPhase(schedule) : null;
  const isFirstAnnounced = phase === 'FIRST_ANNOUNCED' || phase === 'FINAL_ANNOUNCED';
  const isFinalAnnounced = phase === 'FINAL_ANNOUNCED';

  const first = useResultQuery('first', isLoggedIn && isFirstAnnounced);
  const final = useResultQuery('final', isLoggedIn && isFinalAnnounced);

  if (!isLoggedIn || !schedule) return null;

  return (
    <PageLayout title="결과 확인" width="640px">
      {!isFirstAnnounced && <Empty>아직 합격자 발표 전입니다.</Empty>}
      {isFinalAnnounced && (
        <ResultCard
          title="최종 결과"
          result={final.data}
          error={final.error}
          isLoading={final.isLoading}
        />
      )}
      {isFirstAnnounced && (
        <ResultCard
          title="1차 결과"
          result={first.data}
          error={first.error}
          isLoading={first.isLoading}
        />
      )}
    </PageLayout>
  );
};

export default ResultPage;

const Card = styled.section<{ passed?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 32px;
  border-radius: 16px;
  border: 1px solid ${color.gray200};
`;

const CardTitle = styled.h2`
  ${font.H5};
  color: ${color.gray600};
`;

const Status = styled.p<{ passed: boolean }>`
  ${font.H2};
  color: ${({ passed }) => (passed ? color.maruDefault : color.gray700)};
`;

const Message = styled.p`
  ${font.p2};
  color: ${color.gray800};
`;

const Empty = styled.p`
  ${font.p1};
  padding: 40px;
  border-radius: 12px;
  color: ${color.gray600};
  background-color: ${color.gray100};
`;
