'use client';

import styled from '@emotion/styled';
import Link from 'next/link';
import Button from '@/components/common/Button';
import PageLayout from '@/components/common/PageLayout';
import { useFormStatusQuery } from '@/services/form/queries';
import { useScheduleQuery } from '@/services/schedule/queries';
import { useUserQuery } from '@/services/user/queries';
import color from '@/styles/color';
import font from '@/styles/font';
import type { Phase } from '@/types/schedule';
import { formatScheduleDate, getPhase } from '@/utils/schedule';
import { token } from '@/utils/token';

const PHASE_MESSAGE: Record<Phase, string> = {
  BEFORE_APPLICATION: '원서 접수 기간이 아닙니다.',
  APPLICATION: '지금은 원서 접수 기간입니다.',
  AFTER_APPLICATION: '원서 접수가 마감되었습니다.',
  FIRST_ANNOUNCED: '1차 합격자가 발표되었습니다.',
  FINAL_ANNOUNCED: '최종 합격자가 발표되었습니다.',
};

const MainPage = () => {
  const { data: schedule } = useScheduleQuery();
  const { data: status } = useFormStatusQuery();
  const { data: user } = useUserQuery();
  const isLoggedIn = token.exists();

  if (!schedule) return null;

  const phase = getPhase(schedule);

  const renderAction = () => {
    if (!isLoggedIn) {
      return (
        <Link href="/login">
          <Button>로그인하고 시작하기</Button>
        </Link>
      );
    }
    if (phase === 'FIRST_ANNOUNCED' || phase === 'FINAL_ANNOUNCED') {
      return (
        <Link href="/result">
          <Button>결과 확인하기</Button>
        </Link>
      );
    }
    if (status === 'SUBMITTED') {
      return <Badge>원서 제출 완료</Badge>;
    }
    if (phase === 'APPLICATION') {
      return (
        <Link href="/form">
          <Button>{status === 'DRAFT' ? '이어서 작성하기' : '원서 작성하기'}</Button>
        </Link>
      );
    }
    return null;
  };

  return (
    <PageLayout>
      <Hero>
        <Eyebrow>2028학년도 신입생 입학전형</Eyebrow>
        <HeroTitle>부산소프트웨어마이스터고등학교</HeroTitle>
        <HeroText>
          {user ? `${user.name}님, ` : ''}
          {PHASE_MESSAGE[phase]}
        </HeroText>
        {renderAction()}
      </Hero>
      <section>
        <SectionTitle>전형 일정</SectionTitle>
        <ScheduleList>
          <ScheduleItem>
            <span>원서 접수</span>
            <strong>
              {formatScheduleDate(schedule.applicationStart)} ~{' '}
              {formatScheduleDate(schedule.applicationEnd)}
            </strong>
          </ScheduleItem>
          <ScheduleItem>
            <span>1차 합격자 발표</span>
            <strong>{formatScheduleDate(schedule.firstAnnouncement)}</strong>
          </ScheduleItem>
          <ScheduleItem>
            <span>최종 합격자 발표</span>
            <strong>{formatScheduleDate(schedule.finalAnnouncement)}</strong>
          </ScheduleItem>
        </ScheduleList>
      </section>
    </PageLayout>
  );
};

export default MainPage;

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 48px 40px;
  border-radius: 20px;
  color: ${color.white};
  background-color: ${color.bamdoliro};

  @media (max-width: 640px) {
    padding: 32px 24px;
  }
`;

const Eyebrow = styled.p`
  ${font.context};
  color: ${color.gray400};
`;

const HeroTitle = styled.h1`
  ${font.H2};
`;

const HeroText = styled.p`
  ${font.p1};
  margin-bottom: 12px;
  color: ${color.gray300};
`;

const Badge = styled.span`
  ${font.btn2};
  padding: 12px 20px;
  border-radius: 6px;
  color: ${color.green};
  background-color: ${color.lightGreen};
`;

const SectionTitle = styled.h2`
  ${font.H4};
  margin-bottom: 16px;
`;

const ScheduleList = styled.ul`
  list-style: none;
`;

const ScheduleItem = styled.li`
  ${font.p2};
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid ${color.gray200};

  span {
    color: ${color.gray600};
  }

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 4px;
  }
`;
