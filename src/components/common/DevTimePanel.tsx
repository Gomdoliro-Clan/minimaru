'use client';

import styled from '@emotion/styled';
import dayjs from 'dayjs';
import { useState } from 'react';
import { resetDb } from '@/mocks/db';
import color from '@/styles/color';
import font from '@/styles/font';
import { isTimeShifted, now, resetNow, setNow } from '@/utils/clock';
import { token } from '@/utils/token';

const PRESETS = [
  { label: '접수 전', value: '2027-10-01T12:00' },
  { label: '접수 중', value: '2027-10-14T12:00' },
  { label: '접수 마감 후', value: '2027-10-20T12:00' },
  { label: '1차 발표 후', value: '2027-10-25T12:00' },
  { label: '최종 발표 후', value: '2027-11-10T12:00' },
];

const DevTimePanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(() => now().format('YYYY-MM-DDTHH:mm'));

  const apply = (target: string) => {
    setNow(dayjs(target));
    window.location.reload();
  };

  const reset = () => {
    resetNow();
    window.location.reload();
  };

  const clearData = () => {
    if (!confirm('mock 서버의 모든 데이터(회원, 원서)와 로그인 정보를 삭제할까요?')) return;
    resetDb();
    token.clear();
    window.location.href = '/';
  };

  if (!isOpen) {
    return (
      <Toggle onClick={() => setIsOpen(true)}>
        🕒 {now().format('MM.DD HH:mm')}
        {isTimeShifted() && ' (조작됨)'}
      </Toggle>
    );
  }

  return (
    <Panel>
      <PanelHeader>
        <strong>개발용 패널</strong>
        <Close onClick={() => setIsOpen(false)}>닫기</Close>
      </PanelHeader>
      <Caption>현재 시각: {now().format('YYYY-MM-DD HH:mm:ss')}</Caption>
      <Presets>
        {PRESETS.map((preset) => (
          <Preset key={preset.label} onClick={() => apply(preset.value)}>
            {preset.label}
          </Preset>
        ))}
      </Presets>
      <Row>
        <input type="datetime-local" value={value} onChange={(e) => setValue(e.target.value)} />
        <Preset onClick={() => apply(value)}>적용</Preset>
      </Row>
      <Row>
        <Preset onClick={reset}>실제 시각으로</Preset>
        <Preset onClick={clearData}>데이터 초기화</Preset>
      </Row>
    </Panel>
  );
};

export default DevTimePanel;

const Toggle = styled.button`
  ${font.caption};
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 200;
  padding: 8px 12px;
  border-radius: 999px;
  color: ${color.white};
  background-color: ${color.bamdoliro};
`;

const Panel = styled.div`
  ${font.p3};
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
  padding: 16px;
  border-radius: 12px;
  color: ${color.white};
  background-color: ${color.bamdoliro};
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Close = styled.button`
  ${font.caption};
  color: ${color.gray400};
`;

const Caption = styled.p`
  ${font.caption};
  color: ${color.gray300};
`;

const Presets = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Row = styled.div`
  display: flex;
  gap: 6px;
`;

const Preset = styled.button`
  ${font.caption};
  padding: 6px 10px;
  border-radius: 6px;
  color: ${color.white};
  background-color: rgba(255, 255, 255, 0.12);

  &:hover {
    background-color: rgba(255, 255, 255, 0.22);
  }
`;
