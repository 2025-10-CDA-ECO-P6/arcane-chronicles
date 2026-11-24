import { describe, expect, it } from 'vitest';

import { formatDate, formatQuantity } from './format';

const QUESTS = { singular: 'quête', plural: 'quêtes', none: 'Aucune' };

describe('formatQuantity', () => {
  it('says none when the count is 0', () => {
    expect(formatQuantity(0, QUESTS)).toBe('Aucune quête');
  });

  it('stays singular for 1', () => {
    expect(formatQuantity(1, QUESTS)).toBe('1 quête');
  });

  it('goes plural above 1', () => {
    expect(formatQuantity(7, QUESTS)).toBe('7 quêtes');
  });
});

describe('formatDate', () => {
  it('writes the date the French way', () => {
    expect(formatDate('2026-11-23T10:00:00Z')).toBe('23/11/2026');
  });

  it('uses the Paris time zone', () => {
    expect(formatDate('2026-11-23T23:30:00Z')).toBe('24/11/2026');
  });
});
