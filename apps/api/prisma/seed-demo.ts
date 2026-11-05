import { argon2id, hash } from 'argon2';
import { db } from '../src/database/db.js';
import { seedDemo } from './seeds/demo.js';
import { seedReference } from './seeds/reference.js';

async function main() {
  const password = process.env.DEMO_GM_PASSWORD;
  if (!password) {
    throw new Error('DEMO_GM_PASSWORD manquant dans apps/api/.env.');
  }
  const passwordHash = await hash(password, { type: argon2id });

  await db.$transaction(
    async (tx) => {
      const ref = await seedReference(tx);
      await seedDemo(tx, ref, passwordHash);
    },
    { timeout: 120_000 },
  );

  console.log('Campagne de démonstration « L’archipel du néant » chargée.');
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
