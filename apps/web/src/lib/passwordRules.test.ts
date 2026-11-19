import { describe, expect, it } from 'vitest';

import { checkPasswordRules } from './passwordRules';

const metRules = (password: string) =>
  checkPasswordRules(password)
    .filter((rule) => rule.isMet)
    .map((rule) => rule.label);

describe('checkPasswordRules', () => {
  it('lists every rule with whether the password meets it', () => {
    expect(checkPasswordRules('archipel1')).toEqual([
      { label: 'Entre 12 et 128 caractères', isMet: false },
      { label: 'Une majuscule', isMet: false },
      { label: 'Une minuscule', isMet: true },
      { label: 'Un chiffre', isMet: true },
      { label: 'Un caractère spécial', isMet: false },
    ]);
  });

  it('meets every rule with a valid password', () => {
    expect(metRules('Archipel-du-n3ant')).toHaveLength(5);
  });

  it('counts accented letters as letters, not as special characters', () => {
    expect(metRules('Élémentaire123')).not.toContain('Un caractère spécial');
  });
});
