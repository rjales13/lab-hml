import { describe, expect, it } from 'vitest';
import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { loginFormSchema } from './form-schema';

describe('loginFormSchema', () => {
  const validLogin = {
    email: 'user@example.com',
    password: 'StrongPass1!',
  };

  it('accepts valid login credentials and defaults account creation to false', () => {
    const result = loginFormSchema.safeParse(validLogin);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isCreateAccount).toBe(false);
    }
  });

  it('rejects a missing email and malformed email address', () => {
    expect(
      loginFormSchema.safeParse({ ...validLogin, email: '' }).success
    ).toBe(false);
    expect(
      loginFormSchema.safeParse({
        ...validLogin,
        email: 'not-an-email',
      }).success
    ).toBe(false);
  });

  it.each([
    ['short', ERROR_MESSAGES.minPasswordLength],
    ['lowercase1!', ERROR_MESSAGES.uppercase],
    ['UPPERCASE1!', ERROR_MESSAGES.lowercase],
    ['NoNumber!!', ERROR_MESSAGES.number],
    ['NoSpecial1', ERROR_MESSAGES.specialCharacter],
  ])('rejects password %s with its matching validation message', (password, message) => {
    const result = loginFormSchema.safeParse({ ...validLogin, password });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toContain(message);
    }
  });

  it('does not require name or repeat password for normal login', () => {
    expect(
      loginFormSchema.safeParse({
        ...validLogin,
        name: '',
        repeat_password: '',
      }).success
    ).toBe(true);
  });

  it('requires a name and repeated password when creating an account', () => {
    const result = loginFormSchema.safeParse({
      ...validLogin,
      isCreateAccount: true,
      name: '  ',
      repeat_password: '  ',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ['name'],
            message: ERROR_MESSAGES.required,
          }),
          expect.objectContaining({
            path: ['repeat_password'],
            message: ERROR_MESSAGES.required,
          }),
        ])
      );
    }
  });

  it('rejects account creation when passwords do not match', () => {
    const result = loginFormSchema.safeParse({
      ...validLogin,
      isCreateAccount: true,
      name: 'Example User',
      repeat_password: 'OtherPass1!',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['repeat_password'],
          message: ERROR_MESSAGES.passwordsDontMatch,
        })
      );
    }
  });

  it('accepts matching valid credentials for account creation', () => {
    expect(
      loginFormSchema.safeParse({
        ...validLogin,
        isCreateAccount: true,
        name: 'Example User',
        repeat_password: validLogin.password,
      }).success
    ).toBe(true);
  });
});
