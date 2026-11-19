import { z } from 'zod';

export const DISPLAY_NAME_MIN_LENGTH = 2;
export const DISPLAY_NAME_MAX_LENGTH = 50;
export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;
export const PASSWORD_PATTERNS = {
  uppercase: /\p{Lu}/u,
  lowercase: /\p{Ll}/u,
  digit: /\p{N}/u,
  special: /[^\p{L}\p{N}]/u,
};

export const emailSchema = z
  .string({ error: 'Invalid email address' })
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: 'Invalid email address' }));

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string({ error: 'Password is required' }).min(1, { error: 'Password is required' }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const passwordSchema = z
  .string({ error: 'Password is required' })
  .min(PASSWORD_MIN_LENGTH, {
    error: `Password must contain at least ${PASSWORD_MIN_LENGTH} characters`,
  })
  .max(PASSWORD_MAX_LENGTH, {
    error: `Password must contain at most ${PASSWORD_MAX_LENGTH} characters`,
  })
  .regex(PASSWORD_PATTERNS.uppercase, { error: 'Password must contain an uppercase letter' })
  .regex(PASSWORD_PATTERNS.lowercase, { error: 'Password must contain a lowercase letter' })
  .regex(PASSWORD_PATTERNS.digit, { error: 'Password must contain a digit' })
  .regex(PASSWORD_PATTERNS.special, { error: 'Password must contain a special character' });

export const registerSchema = z.object({
  displayName: z
    .string({ error: 'Display name is required' })
    .trim()
    .min(DISPLAY_NAME_MIN_LENGTH, {
      error: `Display name must contain at least ${DISPLAY_NAME_MIN_LENGTH} characters`,
    })
    .max(DISPLAY_NAME_MAX_LENGTH, {
      error: `Display name must contain at most ${DISPLAY_NAME_MAX_LENGTH} characters`,
    }),
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
