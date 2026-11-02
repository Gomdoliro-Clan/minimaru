import { isAxiosError } from 'axios';
import { maru } from '@/apis/instance';
import type { Form, FormStatus } from '@/types/form';
import type { SubmitFormRequest } from '@/utils/form';

export interface School {
  code: string;
  name: string;
  region: string;
}

export const getFormStatus = async () => {
  const { data } = await maru.get<{ status: FormStatus }>('/forms/me/status');
  return data.status;
};

export const getSubmittedAt = async () => {
  const { data } = await maru.get<{ status: FormStatus; submittedAt?: string }>('/forms/me/status');
  return data.submittedAt ?? null;
};

export const getDraft = async () => {
  try {
    const { data } = await maru.get<Form>('/forms/draft');
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
};

export const putDraft = async (form: Form) => {
  const { data } = await maru.put<{ form: Form; savedAt: string }>('/forms/draft', form);
  return data;
};

export const postForm = async (body: SubmitFormRequest) => {
  await maru.post('/forms', body);
};

export const getSchools = async (q: string) => {
  const { data } = await maru.get<School[]>('/schools', { params: { q } });
  return data;
};

export const postProfile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await maru.post<{ url: string }>('/files/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.url;
};
