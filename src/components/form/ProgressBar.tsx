'use client';

import styled from '@emotion/styled';
import { FORM_STEPS } from '@/constants/form';
import color from '@/styles/color';
import font from '@/styles/font';

const ProgressBar = ({ step }: { step: number }) => (
  <List>
    {FORM_STEPS.map((label, index) => (
      <Item key={label} status={index < step ? 'done' : index === step ? 'current' : 'todo'}>
        <Number active={index <= step}>{index + 1}</Number>
        <span>{label}</span>
      </Item>
    ))}
  </List>
);

export default ProgressBar;

const List = styled.ol`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
`;

const Item = styled.li<{ status: 'done' | 'current' | 'todo' }>`
  ${font.caption};
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px 6px 6px;
  border-radius: 999px;
  color: ${({ status }) => (status === 'todo' ? color.gray500 : color.maruDefault)};
  background-color: ${({ status }) => (status === 'current' ? color.maruLightBlue : color.gray100)};
  font-weight: ${({ status }) => (status === 'current' ? 700 : 400)};
`;

const Number = styled.span<{ active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: ${color.white};
  background-color: ${({ active }) => (active ? color.maruDefault : color.gray400)};
`;
