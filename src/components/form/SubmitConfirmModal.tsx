'use client';

import styled from '@emotion/styled';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import color from '@/styles/color';
import font from '@/styles/font';

interface SubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SubmitConfirmModal = ({ isOpen, onClose, onConfirm }: SubmitConfirmModalProps) => (
  <Modal isOpen={isOpen} title="원서를 제출할까요?" onClose={onClose}>
    <Text>제출한 원서는 수정하거나 취소할 수 없습니다.</Text>
    <Buttons>
      <Button variant="secondary" onClick={onClose}>
        취소
      </Button>
      <Button
        onClick={() => {
          onConfirm();
          onClose();
        }}
      >
        제출하기
      </Button>
    </Buttons>
  </Modal>
);

export default SubmitConfirmModal;

const Text = styled.p`
  ${font.p2};
  color: ${color.gray700};
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;
