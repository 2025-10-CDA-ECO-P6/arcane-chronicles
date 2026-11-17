import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const sharedAlias = {
  '@arcane-chronicles/shared': fileURLToPath(
    new URL('./packages/shared/src/index.ts', import.meta.url),
  ),
};

export default defineConfig({
  test: {
    passWithNoTests: true,
    projects: [
      {
        resolve: {
          alias: {
            ...sharedAlias,
            '@': fileURLToPath(new URL('./apps/web/src', import.meta.url)),
          },
        },
        test: {
          name: 'node',
          include: ['{apps,packages}/*/src/**/*.test.ts'],
          environment: 'node',
          env: { LOG_LEVEL: 'silent' },
        },
      },
      {
        plugins: [react()],
        resolve: {
          alias: {
            ...sharedAlias,
            '@': fileURLToPath(new URL('./apps/web/src', import.meta.url)),
          },
        },
        test: {
          name: 'web',
          include: ['apps/web/src/**/*.test.tsx'],
          environment: 'jsdom',
          setupFiles: ['./apps/web/vitest.setup.ts'],
          css: { modules: { classNameStrategy: 'non-scoped' } },
        },
      },
    ],
  },
});
