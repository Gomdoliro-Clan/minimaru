'use client';

import styled from '@emotion/styled';
import type { ChangeEvent } from 'react';
import { useRef } from 'react';
import Button from '@/components/common/Button';
import { useUploadProfileMutation } from '@/services/form/mutations';
import color from '@/styles/color';
import font from '@/styles/font';

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

interface ProfileUploaderProps {
  url: string;
  onChange: (url: string) => void;
}

const ProfileUploader = ({ url, onChange }: ProfileUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: upload, isPending } = useUploadProfileMutation();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('jpg, png 파일만 업로드할 수 있습니다.');
      return;
    }
    if (file.size > MAX_SIZE) {
      alert('파일 크기는 2MB 이하여야 합니다.');
      return;
    }

    upload(file, { onSuccess: onChange });
  };

  return (
    <Wrapper>
      <Preview>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="증명사진 미리보기" />
        ) : (
          <Placeholder>{isPending ? '업로드 중...' : '3 × 4\n증명사진'}</Placeholder>
        )}
      </Preview>
      <Actions>
        <Guide>jpg, png / 2MB 이하 / 최근 3개월 이내 촬영한 사진</Guide>
        <Buttons>
          <Button
            variant="secondary"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
          >
            {url ? '사진 변경' : '사진 선택'}
          </Button>
          {url && (
            <Button variant="text" onClick={() => onChange('')}>
              삭제
            </Button>
          )}
        </Buttons>
      </Actions>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        hidden
        onChange={handleFileChange}
      />
    </Wrapper>
  );
};

export default ProfileUploader;

const Wrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const Preview = styled.div`
  width: 120px;
  height: 160px;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid ${color.gray300};
  background-color: ${color.gray100};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Placeholder = styled.p`
  ${font.caption};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${color.gray500};
  text-align: center;
  white-space: pre-line;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 12px;
`;

const Guide = styled.p`
  ${font.caption};
  color: ${color.gray600};
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
`;
