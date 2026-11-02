'use client';

import Link from 'next/link';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { AuthCard, AuthFooter, AuthTitle, Hint } from '@/components/auth/AuthCard';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useLoginMutation } from '@/services/auth/mutations';

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { mutate: login, isPending } = useLoginMutation((message) => {
    setErrorMessage(message);
    setPhoneNumber('');
    setPassword('');
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    login({ phoneNumber, password });
  };

  return (
    <AuthCard onSubmit={handleSubmit}>
      <AuthTitle>로그인</AuthTitle>
      <Input
        label="전화번호"
        placeholder="'-' 없이 입력해주세요"
        inputMode="numeric"
        maxLength={11}
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <Input
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력해주세요"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errorMessage && <Hint error>{errorMessage}</Hint>}
      <Button type="submit" disabled={isPending}>
        로그인
      </Button>
      <AuthFooter>
        아직 회원이 아니신가요? <Link href="/signup">회원가입</Link>
      </AuthFooter>
    </AuthCard>
  );
};

export default LoginPage;
