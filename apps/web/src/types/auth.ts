import type { LoginInput, RegisterInput } from '@arcane-chronicles/shared';

export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
}

export interface RegisterValues extends RegisterInput {
  passwordConfirmation: string;
}

export type AuthField = keyof LoginInput | keyof RegisterValues;

export type AuthFieldErrors = Partial<Record<AuthField, string>>;
