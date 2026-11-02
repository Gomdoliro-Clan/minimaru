import { useQuery } from '@tanstack/react-query';
import { token } from '@/utils/token';
import { getDraft, getFormStatus, getSchools, getSubmittedAt } from './api';

export const useFormStatusQuery = () =>
  useQuery({
    queryKey: ['formStatus'],
    queryFn: getFormStatus,
    enabled: token.exists(),
  });

export const useSubmittedAtQuery = () =>
  useQuery({
    queryKey: ['formStatus', 'submittedAt'],
    queryFn: getSubmittedAt,
    enabled: token.exists(),
  });

export const useDraftQuery = () =>
  useQuery({
    queryKey: ['form', 'draft'],
    queryFn: getDraft,
    enabled: token.exists(),
  });

export const useSchoolsQuery = (keyword: string) =>
  useQuery({
    queryKey: ['schools', keyword],
    queryFn: () => getSchools(keyword),
    enabled: keyword.length > 0,
  });
