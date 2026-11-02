import { atom } from 'jotai';
import type { Form } from '@/types/form';
import { createInitialForm } from '@/utils/form';

export const formAtom = atom<Form>(createInitialForm());

export const formStepAtom = atom(0);

export const isFormHydratedAtom = atom(false);

export const lastSavedAtAtom = atom<string | null>(null);
