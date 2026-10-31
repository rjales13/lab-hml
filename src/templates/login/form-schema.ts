import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { z } from 'zod';

export const loginFormSchema = z
  .object({
    isCreateAccount: z.boolean().default(false),
    name: z.string().optional(),
    email: z
      .string()
      .min(1, {
        message: ERROR_MESSAGES.required,
      })
      .email(ERROR_MESSAGES.invalidEmail),
    password: z
      .string()
      .min(8, { message: ERROR_MESSAGES.minPasswordLength })
      .regex(/[A-Z]/, { message: ERROR_MESSAGES.uppercase })
      .regex(/[a-z]/, { message: ERROR_MESSAGES.lowercase })
      .regex(/[0-9]/, { message: ERROR_MESSAGES.number })
      .regex(/[^A-Za-z0-9]/, {
        message: ERROR_MESSAGES.specialCharacter,
      }),
    repeat_password: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isCreateAccount) {
      return;
    }

    if (!data.name?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['name'],
        message: ERROR_MESSAGES.required,
      });
    }

    if (!data.repeat_password?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['repeat_password'],
        message: ERROR_MESSAGES.required,
      });
      return;
    }

    if (data.password !== data.repeat_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['repeat_password'],
        message: ERROR_MESSAGES.passwordsDontMatch,
      });
    }
  });

export type tLoginFormData = z.infer<typeof loginFormSchema>;
