'use client';

import styled from '@emotion/styled';
import { MAX_ATTENDANCE_SCORE, MAX_SUBJECT_SCORE, MAX_VOLUNTEER_SCORE } from '@/constants/form';
import color from '@/styles/color';
import font from '@/styles/font';
import type { Form } from '@/types/form';
import { calculateScores, calculateTotalScore } from '@/utils/grade';

const GradePreview = ({ form }: { form: Form }) => {
  const { subject, attendance, volunteer } = calculateScores(form);

  return (
    <Wrapper>
      <Item>
        <span>교과</span>
        <strong>
          {subject} / {MAX_SUBJECT_SCORE}
        </strong>
      </Item>
      <Item>
        <span>출결</span>
        <strong>
          {attendance} / {MAX_ATTENDANCE_SCORE}
        </strong>
      </Item>
      <Item>
        <span>봉사</span>
        <strong>
          {volunteer} / {MAX_VOLUNTEER_SCORE}
        </strong>
      </Item>
      <Total>
        <span>환산 총점</span>
        <strong>{calculateTotalScore(form)} / 150</strong>
      </Total>
    </Wrapper>
  );
};

export default GradePreview;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 16px;
  border-radius: 12px;
  background-color: ${color.gray100};

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Item = styled.div`
  ${font.p3};
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: ${color.gray600};

  strong {
    ${font.H5};
    color: ${color.gray900};
  }
`;

const Total = styled(Item)`
  strong {
    color: ${color.maruDefault};
  }
`;
