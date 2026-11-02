import { z } from 'zod';

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, '이름은 2자 이상 입력해주세요.')
      .max(20, '이름은 20자 이하로 입력해주세요.'),
    phoneNumber: z.string().regex(/^01[016789]\d{7,8}$/, '올바른 전화번호를 입력해주세요.'),
    password: z
      .string()
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,20}$/,
        '비밀번호는 영문, 숫자, 특수문자를 포함해 8~20자로 입력해주세요.',
      ),
    passwordConfirm: z.string(),
  })
  .refine((value) => value.password === value.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.',
  });
