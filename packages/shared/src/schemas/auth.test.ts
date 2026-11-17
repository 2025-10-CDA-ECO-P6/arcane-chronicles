import { describe, expect, it } from 'vitest';

import { passwordSchema, registerSchema } from './auth';

const validRegistration = {
  displayName: 'Maître Ying',
  email: 'ying@arcane-chronicles.test',
  password: 'Archipel-du-n3ant',
};

const passwordMessages = (password: string) => {
  const result = passwordSchema.safeParse(password);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
};

describe('passwordSchema', () => {
  it('accepts a password that follows every rule', () => {
    expect(passwordMessages('Archipel-du-n3ant')).toEqual([]);
  });

  it('gives one message per broken rule', () => {
    expect(passwordMessages('short')).toEqual([
      'Password must contain at least 12 characters',
      'Password must contain an uppercase letter',
      'Password must contain a digit',
      'Password must contain a special character',
    ]);
  });

  it('rejects a password longer than 128 characters', () => {
    expect(passwordMessages(`Aa1-${'x'.repeat(125)}`)).toEqual([
      'Password must contain at most 128 characters',
    ]);
  });

  it('counts accented letters as letters, not as special characters', () => {
    expect(passwordMessages('Élémentaire123')).toEqual([
      'Password must contain a special character',
    ]);
  });
});

describe('registerSchema', () => {
  it('accepts a valid registration and trims the display name', () => {
    const result = registerSchema.safeParse({ ...validRegistration, displayName: '  Ying  ' });

    expect(result.success).toBe(true);
    expect(result.data?.displayName).toBe('Ying');
  });

  it('rejects a display name that is too short once trimmed', () => {
    const result = registerSchema.safeParse({ ...validRegistration, displayName: ' Y ' });

    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(['displayName']);
  });

  it('rejects an invalid email', () => {
    const result = registerSchema.safeParse({ ...validRegistration, email: 'ying' });

    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(['email']);
  });

  it('reports every missing field', () => {
    const result = registerSchema.safeParse({});

    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual([
      'displayName',
      'email',
      'password',
    ]);
  });
});
