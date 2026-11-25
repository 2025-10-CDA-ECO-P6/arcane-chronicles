import { describe, expect, it } from 'vitest';

import { matchesSearch, normalizeText } from './search';

describe('normalizeText', () => {
  it('ignores case, accents, apostrophe style and surrounding spaces', () => {
    expect(normalizeText('  L’Île ÉTRANGE ')).toBe("l'ile etrange");
  });
});

describe('matchesSearch', () => {
  it('finds the query in any of the texts', () => {
    expect(matchesSearch(['L’archipel du néant', 'Une croisière'], 'neant')).toBe(true);
    expect(matchesSearch(['L’archipel du néant', 'Une croisière'], 'CROISIERE')).toBe(true);
  });

  it('accepts a straight apostrophe for a typographic one', () => {
    expect(matchesSearch(['L’archipel du néant'], "l'archipel")).toBe(true);
  });

  it('rejects a query found in none of the texts', () => {
    expect(matchesSearch(['L’archipel du néant'], 'dragon')).toBe(false);
  });
});
