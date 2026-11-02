'use client';

import styled from '@emotion/styled';
import { useOverlay } from '@toss/use-overlay';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '@/components/common/Button';
import PageLayout from '@/components/common/PageLayout';
import FormController from '@/components/form/FormController';
import ProgressBar from '@/components/form/ProgressBar';
import ApplicantStep from '@/components/form/steps/ApplicantStep';
import ConfirmStep from '@/components/form/steps/ConfirmStep';
import DocumentStep from '@/components/form/steps/DocumentStep';
import EducationStep from '@/components/form/steps/EducationStep';
import GradeStep from '@/components/form/steps/GradeStep';
import GuardianStep from '@/components/form/steps/GuardianStep';
import TypeStep from '@/components/form/steps/TypeStep';
import SubmitConfirmModal from '@/components/form/SubmitConfirmModal';
import { FORM_STEPS } from '@/constants/form';
import { useLoginGuard } from '@/hooks/useLoginGuard';
import type { FieldErrors } from '@/schemas/form';
import { validateStep } from '@/schemas/form';
import { useSaveDraftMutation, useSubmitFormMutation } from '@/services/form/mutations';
import { useDraftQuery, useFormStatusQuery } from '@/services/form/queries';
import { useScheduleQuery } from '@/services/schedule/queries';
import { useUserQuery } from '@/services/user/queries';
import { formAtom, formStepAtom, isFormHydratedAtom, lastSavedAtAtom } from '@/stores';
import color from '@/styles/color';
import font from '@/styles/font';
import { getPhase } from '@/utils/schedule';

const FormPage = () => {
  const isLoggedIn = useLoginGuard();
  const router = useRouter();
  const overlay = useOverlay();

  const [form, setForm] = useAtom(formAtom);
  const [step, setStep] = useAtom(formStepAtom);
  const [isHydrated, setIsHydrated] = useAtom(isFormHydratedAtom);
  const lastSavedAt = useAtomValue(lastSavedAtAtom);
  const setLastSavedAt = useSetAtom(lastSavedAtAtom);
  const [errors, setErrors] = useState<FieldErrors>({});

  const { data: schedule } = useScheduleQuery();
  const { data: status } = useFormStatusQuery();
  const { data: user } = useUserQuery();
  const { data: draft, isSuccess: isDraftLoaded } = useDraftQuery();
  const { mutate: saveDraft } = useSaveDraftMutation();
  const { mutate: submitForm } = useSubmitFormMutation();

  useEffect(() => {
    if (status === 'SUBMITTED') router.replace('/form/complete');
  }, [status, router]);

  useEffect(() => {
    if (isHydrated || !isDraftLoaded || !user) return;

    if (draft) {
      setForm(draft);
      setLastSavedAt(null);
    } else {
      setForm((prev) => ({
        ...prev,
        applicant: { ...prev.applicant, name: user.name, phoneNumber: user.phoneNumber },
      }));
    }
    setIsHydrated(true);
  }, [isHydrated, isDraftLoaded, draft, user, setForm, setIsHydrated, setLastSavedAt]);

  useEffect(() => {
    const firstInvalid = document.querySelector<HTMLElement>('[aria-invalid="true"]');
    if (!firstInvalid) return;
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    firstInvalid.focus({ preventScroll: true });
  }, [errors]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
  }, []);

  if (!isLoggedIn || !schedule) return null;

  const phase = getPhase(schedule);
  if (phase !== 'APPLICATION') {
    return (
      <PageLayout title="원서 작성">
        <Notice>
          {phase === 'BEFORE_APPLICATION'
            ? '아직 원서 접수 기간이 아닙니다.'
            : '원서 접수가 마감되었습니다.'}
          <Link href="/">
            <Button variant="secondary">홈으로</Button>
          </Link>
        </Notice>
      </PageLayout>
    );
  }

  if (!isHydrated) return null;

  const handleNext = () => {
    const nextErrors = validateStep(step, form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setStep(step + 1);
  };

  const handlePrev = () => {
    setErrors({});
    setStep(step - 1);
  };

  const handleSubmit = () => {
    for (let index = 0; index < FORM_STEPS.length - 1; index += 1) {
      const stepErrors = validateStep(index, form);
      if (Object.keys(stepErrors).length > 0) {
        setStep(index);
        setErrors(stepErrors);
        return;
      }
    }

    overlay.open(({ isOpen, close }) => (
      <SubmitConfirmModal isOpen={isOpen} onClose={close} onConfirm={() => submitForm(form)} />
    ));
  };

  const steps = [
    <ApplicantStep key="applicant" errors={errors} />,
    <GuardianStep key="guardian" errors={errors} />,
    <EducationStep key="education" errors={errors} />,
    <TypeStep key="type" errors={errors} />,
    <GradeStep key="grade" errors={errors} />,
    <DocumentStep key="document" errors={errors} />,
    <ConfirmStep key="confirm" />,
  ];

  return (
    <PageLayout title="원서 작성">
      <ProgressBar step={step} />
      {steps[step]}
      <FormController
        step={step}
        lastSavedAt={lastSavedAt}
        onPrev={handlePrev}
        onNext={handleNext}
        onSave={() => saveDraft(form)}
        onSubmit={handleSubmit}
      />
    </PageLayout>
  );
};

export default FormPage;

const Notice = styled.div`
  ${font.p1};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  padding: 40px;
  border-radius: 12px;
  color: ${color.gray700};
  background-color: ${color.gray100};
`;
