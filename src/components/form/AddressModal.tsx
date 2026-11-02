'use client';

import DaumPostcodeEmbed from 'react-daum-postcode';
import type { Address } from 'react-daum-postcode';
import Modal from '@/components/common/Modal';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (zoneCode: string, address: string) => void;
}

const AddressModal = ({ isOpen, onClose, onComplete }: AddressModalProps) => (
  <Modal isOpen={isOpen} title="주소 검색" onClose={onClose} width="560px">
    <DaumPostcodeEmbed
      style={{ height: 460 }}
      onComplete={(data: Address) => {
        onComplete(data.zonecode, data.roadAddress || data.address);
        onClose();
      }}
    />
  </Modal>
);

export default AddressModal;
