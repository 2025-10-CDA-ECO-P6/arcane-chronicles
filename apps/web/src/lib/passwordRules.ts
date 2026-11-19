import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_PATTERNS,
} from '@arcane-chronicles/shared';

interface PasswordRule {
  label: string;
  isMet: (password: string) => boolean;
}

export interface PasswordRuleResult {
  label: string;
  isMet: boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
  {
    label: `Entre ${PASSWORD_MIN_LENGTH} et ${PASSWORD_MAX_LENGTH} caractères`,
    isMet: (password) =>
      password.length >= PASSWORD_MIN_LENGTH && password.length <= PASSWORD_MAX_LENGTH,
  },
  { label: 'Une majuscule', isMet: (password) => PASSWORD_PATTERNS.uppercase.test(password) },
  { label: 'Une minuscule', isMet: (password) => PASSWORD_PATTERNS.lowercase.test(password) },
  { label: 'Un chiffre', isMet: (password) => PASSWORD_PATTERNS.digit.test(password) },
  { label: 'Un caractère spécial', isMet: (password) => PASSWORD_PATTERNS.special.test(password) },
];

export const checkPasswordRules = (password: string): PasswordRuleResult[] =>
  PASSWORD_RULES.map(({ label, isMet }) => ({ label, isMet: isMet(password) }));
