import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

// Tests unitaires et d'intégration (plan-tests.md) : un fichier `*.test.ts`
// à côté du code testé, dans apps/api, apps/web ou packages/shared.
// Les tests end-to-end (Playwright) sont dans e2e/ et ne passent pas par ici.
export default defineConfig({
  resolve: {
    alias: {
      // Les tests lisent directement les sources de `shared`,
      // sans avoir besoin de le compiler avant.
      '@arcane-chronicles/shared': fileURLToPath(
        new URL('./packages/shared/src/index.ts', import.meta.url),
      ),
    },
  },
  test: {
    include: ['{apps,packages}/*/src/**/*.test.{ts,tsx}'],
    environment: 'node',
    passWithNoTests: true,
  },
});
