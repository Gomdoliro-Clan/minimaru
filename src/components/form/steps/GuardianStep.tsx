'use client';

import { useOverlay } from '@toss/use-overlay';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useFormSection } from '@/hooks/useFormSection';
import type { FieldErrors } from '@/schemas/form';
import AddressModal from '../AddressModal';
import { FieldGroup, FieldLabel, Row, StepSection, StepTitle } from '../styles';

const GuardianStep = ({ errors }: { errors: FieldErrors }) => {
  const { section: guardian, update } = useFormSection('guardian');
  const overlay = useOverlay();

  const openAddressModal = () => {
    overlay.open(({ isOpen, close }) => (
      <AddressModal
        isOpen={isOpen}
        onClose={close}
        onComplete={(zoneCode, address) => {
          update('zoneCode', zoneCode);
          update('address', address);
        }}
      />
    ));
  };

  return (
    <StepSection>
      <StepTitle>보호자 정보</StepTitle>
      <Row>
        <Input
          label="이름"
          value={guardian.name}
          onChange={(e) => update('name', e.target.value)}
          error={errors.name}
        />
        <Input
          label="지원자와의 관계"
          placeholder="예: 부, 모"
          value={guardian.relation}
          onChange={(e) => update('relation', e.target.value)}
          error={errors.relation}
        />
      </Row>
      <Input
        label="전화번호"
        placeholder="'-' 없이 입력해주세요"
        inputMode="numeric"
        maxLength={11}
        value={guardian.phoneNumber}
        onChange={(e) => update('phoneNumber', e.target.value)}
        error={errors.phoneNumber}
      />
      <FieldGroup>
        <FieldLabel>주소</FieldLabel>
        <Row>
          <Input
            placeholder="우편번호"
            value={guardian.zoneCode}
            readOnly
            width="160px"
            error={errors.zoneCode}
          />
          <Button variant="secondary" onClick={openAddressModal}>
            주소 검색
          </Button>
        </Row>
        <Input placeholder="주소" value={guardian.address} readOnly error={errors.address} />
        <Input
          placeholder="상세주소"
          value={guardian.detailAddress}
          onChange={(e) => update('detailAddress', e.target.value)}
          error={errors.detailAddress}
        />
      </FieldGroup>
    </StepSection>
  );
};

export default GuardianStep;
