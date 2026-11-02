'use client';

import styled from '@emotion/styled';
import type { ReactNode } from 'react';
import color from '@/styles/color';
import font from '@/styles/font';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  width?: string;
}

const Modal = ({ isOpen, title, onClose, children, width = '480px' }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <Backdrop onClick={onClose}>
      <Content width={width} onClick={(e) => e.stopPropagation()}>
        <Title>{title}</Title>
        {children}
      </Content>
    </Backdrop>
  );
};

export default Modal;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.45);
`;

const Content = styled.div<{ width: string }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: ${({ width }) => width};
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  padding: 32px;
  border-radius: 16px;
  background-color: ${color.white};
`;

const Title = styled.h2`
  ${font.H4};
`;
