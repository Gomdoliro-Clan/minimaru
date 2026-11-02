'use client';

import Link from 'next/link';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { AuthCard, AuthFooter, AuthTitle, Hint, InlineRow } from '@/components/auth/AuthCard';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { signUpSchema } from '@/schemas/user';
import {
  useRequestVerificationMutation,
  useSignUpMutation,
  useVerifyMutation,
} from '@/services/auth/mutations';

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

const SignUpPage = () => {
  const [values, setValues] = useState({
    name: '',
    phoneNumber: '',
    code: '',
    password: '',
    passwordConfirm: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [remaining, setRemaining] = useState(0);

  const { mutate: requestVerification, isPending: isRequesting } = useRequestVerificationMutation();
  const { mutate: verify } = useVerifyMutation();
  const { mutate: signUp, isPending: isSigningUp } = useSignUpMutation();

  const handleChange = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((prev) => ({ ...prev, [key]: e.target.value }));

  const startTimer = () => {
    setRemaining(180);
    setInterval(() => {
      setRemaining((prev) => Math.max(prev - 1, 0));
    }, 1000);
  };

  const handleRequestCode = () => {
    const result = signUpSchema.innerType().shape.phoneNumber.safeParse(values.phoneNumber);
    if (!result.success) {
      setErrors((prev) => ({ ...prev, phoneNumber: result.error.issues[0].message }));
      return;
    }
    setErrors((prev) => ({ ...prev, phoneNumber: '' }));
    requestVerification(values.phoneNumber, {
      onSuccess: () => {
        setIsCodeSent(true);
        setIsVerified(false);
        startTimer();
      },
    });
  };

  const handleVerify = () => {
    if (remaining === 0) {
      alert('인증번호가 만료되었습니다. 다시 요청해주세요.');
      return;
    }
    verify(
      { phoneNumber: values.phoneNumber, code: values.code },
      { onSuccess: () => setIsVerified(true) },
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = signUpSchema.safeParse(values);
    if (!result.success) {
      setErrors(
        Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message])),
      );
      return;
    }
    if (!isVerified) {
      alert('전화번호 인증을 완료해주세요.');
      return;
    }
    setErrors({});
    signUp({ name: values.name, phoneNumber: values.phoneNumber, password: values.password });
  };

  return (
    <AuthCard onSubmit={handleSubmit}>
      <AuthTitle>회원가입</AuthTitle>
      <Input label="이름" value={values.name} onChange={handleChange('name')} error={errors.name} />
      <InlineRow>
        <Input
          label="전화번호"
          placeholder="'-' 없이 입력해주세요"
          inputMode="numeric"
          maxLength={11}
          value={values.phoneNumber}
          onChange={handleChange('phoneNumber')}
          disabled={isVerified}
        />
        <Button
          variant="secondary"
          onClick={handleRequestCode}
          disabled={isRequesting || isVerified}
        >
          {isCodeSent ? '재요청' : '인증 요청'}
        </Button>
      </InlineRow>
      {errors.phoneNumber && <Hint error>{errors.phoneNumber}</Hint>}
      {isCodeSent && (
        <>
          <InlineRow>
            <Input
              label="인증번호"
              inputMode="numeric"
              maxLength={6}
              value={values.code}
              onChange={handleChange('code')}
              disabled={isVerified}
            />
            <Button variant="secondary" onClick={handleVerify} disabled={isVerified}>
              확인
            </Button>
          </InlineRow>
          <Hint error={!isVerified && remaining === 0}>
            {isVerified ? '인증이 완료되었습니다.' : `남은 시간 ${formatTime(remaining)}`}
          </Hint>
        </>
      )}
      <Input
        label="비밀번호"
        type="password"
        value={values.password}
        onChange={handleChange('password')}
        error={errors.password}
      />
      <Input
        label="비밀번호 확인"
        type="password"
        value={values.passwordConfirm}
        onChange={handleChange('passwordConfirm')}
        error={errors.passwordConfirm}
      />
      <Button type="submit" disabled={isSigningUp}>
        가입하기
      </Button>
      <AuthFooter>
        이미 회원이신가요? <Link href="/login">로그인</Link>
      </AuthFooter>
    </AuthCard>
  );
};

export default SignUpPage;
