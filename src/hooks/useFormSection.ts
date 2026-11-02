import { useAtom } from 'jotai';
import { formAtom } from '@/stores';
import type { Form } from '@/types/form';

export const useFormSection = <K extends keyof Form>(key: K) => {
  const [form, setForm] = useAtom(formAtom);

  const update = <F extends keyof Form[K]>(field: F, value: Form[K][F]) =>
    setForm((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));

  return { section: form[key], update, form };
};
