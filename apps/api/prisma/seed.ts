import { db } from '../src/database/db.js';
import { seedReference } from './seeds/reference.js';

async function main() {
  const ref = await db.$transaction((tx) => seedReference(tx), { timeout: 60_000 });
  console.log(
    `Données de référence : ${ref.races.size} races, ${ref.classes.size} classes, ${ref.backgrounds.size} historiques, ` +
      `${ref.skills.size} compétences, ${ref.abilities.size} capacités, ${ref.effects.size} effets, ${ref.items.size} objets.`,
  );
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
