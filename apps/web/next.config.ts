import path from 'node:path';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../..'),
  images: {
    qualities: [75, 90],
  },
  redirects: async () => [
    { source: '/dashboard', destination: '/dashboard/campaigns', permanent: false },
  ],
};

export default nextConfig;
