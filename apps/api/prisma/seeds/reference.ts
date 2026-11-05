import type { AbilityScore, ActionType, ItemType, Prisma } from '@prisma/client';

type Db = Prisma.TransactionClient;

export interface ReferenceData {
  races: Map<string, string>;
  classes: Map<string, string>;
  backgrounds: Map<string, string>;
  skills: Map<string, string>;
  abilities: Map<string, string>;
  effects: Map<string, string>;
  items: Map<string, string>;
}

const RACES = ['Humain', 'Elfe', 'Nain', 'Orc', 'Halfelin', 'Arrawak'];

const CLASSES: Record<string, string> = {
  Barbare: 'D12',
  Barde: 'D8',
  Clerc: 'D8',
  Druide: 'D8',
  Guerrier: 'D10',
  Magicien: 'D6',
  Moine: 'D8',
  Paladin: 'D10',
  Rôdeur: 'D10',
  Roublard: 'D8',
};

const SKILLS: Record<string, AbilityScore> = {
  Acrobaties: 'DEXTERITY',
  Discrétion: 'DEXTERITY',
  Escamotage: 'DEXTERITY',
  Arcanes: 'INTELLIGENCE',
  Histoire: 'INTELLIGENCE',
  Investigation: 'INTELLIGENCE',
  Nature: 'INTELLIGENCE',
  Religion: 'INTELLIGENCE',
  Athlétisme: 'STRENGTH',
  Dressage: 'WISDOM',
  Intuition: 'WISDOM',
  Médecine: 'WISDOM',
  Perception: 'WISDOM',
  Survie: 'WISDOM',
  Intimidation: 'CHARISMA',
  Persuasion: 'CHARISMA',
  Représentation: 'CHARISMA',
  Tromperie: 'CHARISMA',
};

const BACKGROUND_SKILLS: Record<string, string[]> = {
  Soldat: ['Athlétisme', 'Intimidation'],
  Acolyte: ['Intuition', 'Religion'],
  Criminel: ['Discrétion', 'Escamotage'],
  Sage: ['Arcanes', 'Histoire'],
};

const RACE_SKILLS: Record<string, string[]> = {
  Elfe: ['Perception'],
  Orc: ['Intimidation'],
};

const CLASS_SKILLS: Record<string, string[]> = {
  Barbare: ['Athlétisme', 'Survie'],
  Barde: ['Représentation', 'Persuasion'],
  Clerc: ['Religion', 'Médecine'],
  Druide: ['Nature', 'Dressage'],
  Guerrier: ['Athlétisme', 'Intimidation'],
  Magicien: ['Arcanes', 'Investigation'],
  Moine: ['Acrobaties', 'Intuition'],
  Paladin: ['Religion', 'Persuasion'],
  Rôdeur: ['Survie', 'Perception'],
  Roublard: ['Discrétion', 'Escamotage'],
};

interface AbilitySpec {
  name: string;
  description: string;
  actionType: ActionType;
  maxUses?: number;
  spellLevel?: number;
  race?: string;
  class?: { name: string; level: number };
  background?: string;
}

const ABILITIES: AbilitySpec[] = [
  {
    name: 'Endurance implacable',
    description:
      'Quand les points de vie tombent à 0 sans que le personnage soit tué sur le coup, il reste à 1 point de vie.',
    actionType: 'PASSIVE',
    maxUses: 1,
    race: 'Orc',
  },
  {
    name: 'Sens aiguisés',
    description: 'L’ouïe et la vue des elfes repèrent ce qui échappe aux autres.',
    actionType: 'PASSIVE',
    race: 'Elfe',
  },
  {
    name: 'Transe',
    description: 'Quatre heures de méditation remplacent une nuit de sommeil.',
    actionType: 'PASSIVE',
    race: 'Elfe',
  },
  {
    name: 'Résilience naine',
    description: 'Le corps des nains résiste au poison mieux que celui des autres peuples.',
    actionType: 'PASSIVE',
    race: 'Nain',
  },
  {
    name: 'Chanceux',
    description:
      'Sur un 1 naturel au dé, le halfelin peut relancer le dé et garder le nouveau résultat.',
    actionType: 'PASSIVE',
    race: 'Halfelin',
  },
  {
    name: 'Vol plané',
    description:
      'Ailes déployées, l’arrawak se laisse porter par les courants et ne subit aucun dégât de chute.',
    actionType: 'PASSIVE',
    race: 'Arrawak',
  },
  {
    name: 'Second souffle',
    description:
      'Le guerrier puise dans ses réserves pour regagner des points de vie en plein combat.',
    actionType: 'BONUS_ACTION',
    maxUses: 1,
    class: { name: 'Guerrier', level: 1 },
  },
  {
    name: 'Arts martiaux',
    description: 'Le moine frappe à mains nues avec la précision d’une arme.',
    actionType: 'ACTION',
    class: { name: 'Moine', level: 1 },
  },
  {
    name: 'Ki',
    description:
      'L’énergie intérieure du moine alimente des techniques comme la déferlante de coups ou la défense patiente.',
    actionType: 'BONUS_ACTION',
    maxUses: 2,
    class: { name: 'Moine', level: 2 },
  },
  {
    name: 'Gourdin magique',
    description: 'Un bâton ou un gourdin s’imprègne de la force de la nature.',
    actionType: 'ACTION',
    spellLevel: 0,
    class: { name: 'Druide', level: 1 },
  },
  {
    name: 'Forme sauvage',
    description: 'Le druide prend l’apparence d’un animal qu’il a déjà vu.',
    actionType: 'ACTION',
    maxUses: 2,
    class: { name: 'Druide', level: 2 },
  },
  {
    name: 'Attaque sournoise',
    description:
      'Une fois par tour, le roublard inflige des dégâts supplémentaires à une cible prise au dépourvu.',
    actionType: 'PASSIVE',
    class: { name: 'Roublard', level: 1 },
  },
  {
    name: 'Imposition des mains',
    description:
      'Le paladin soigne une créature qu’il touche grâce à une réserve de puissance divine.',
    actionType: 'ACTION',
    maxUses: 1,
    class: { name: 'Paladin', level: 1 },
  },
  {
    name: 'Grade militaire',
    description: 'Les soldats reconnaissent l’autorité du personnage et lui accordent leur aide.',
    actionType: 'PASSIVE',
    background: 'Soldat',
  },
];

interface EffectSpec {
  name: string;
  diceCount?: number;
  diceSides?: number;
  bonus?: number;
  damageType?: string;
}

const EFFECTS: EffectSpec[] = [
  { name: 'Lame', diceCount: 1, diceSides: 8, damageType: 'tranchant' },
  { name: 'Coup de hache', diceCount: 1, diceSides: 8, damageType: 'tranchant' },
  { name: 'Double lame', diceCount: 2, diceSides: 6, damageType: 'tranchant' },
  { name: 'Soin faible', diceCount: 1, diceSides: 4, bonus: 1 },
  { name: 'Soin', diceCount: 2, diceSides: 4, bonus: 2 },
  { name: 'Soin supérieur', diceCount: 4, diceSides: 4, bonus: 4 },
  { name: 'Second souffle', diceCount: 1, diceSides: 10, bonus: 3 },
  { name: 'Frappe martiale', diceCount: 1, diceSides: 6, damageType: 'contondant' },
  { name: 'Gourdin magique', diceCount: 1, diceSides: 8, damageType: 'contondant' },
];

const ABILITY_EFFECTS: Record<string, string> = {
  'Second souffle': 'Second souffle',
  'Arts martiaux': 'Frappe martiale',
  'Gourdin magique': 'Gourdin magique',
};

interface ItemSpec {
  name: string;
  type: ItemType;
  price: number;
  description: string;
  armorValue?: number;
  effect?: string;
}

const ITEMS: ItemSpec[] = [
  {
    name: 'Épée à une main',
    type: 'WEAPON',
    price: 15,
    description: 'Une lame droite et équilibrée, l’arme favorite des voyageurs de l’archipel.',
    effect: 'Lame',
  },
  {
    name: 'Hache de bataille',
    type: 'WEAPON',
    price: 10,
    description:
      'Un fer lourd monté sur un manche de frêne, aussi utile au combat qu’à fendre les cordages.',
    effect: 'Coup de hache',
  },
  {
    name: 'Épée double',
    type: 'WEAPON',
    price: 40,
    description:
      'Deux lames reliées par une poignée centrale, redoutables entre des mains entraînées.',
    effect: 'Double lame',
  },
  {
    name: 'Casque de cuir',
    type: 'ARMOR',
    price: 5,
    description: 'Un casque de cuir bouilli qui protège surtout du vent glacé des hauteurs.',
  },
  {
    name: 'Cotte de mailles',
    type: 'ARMOR',
    price: 75,
    description: 'Des milliers d’anneaux d’acier entrelacés, lourds mais rassurants.',
    armorValue: 16,
  },
  {
    name: 'Armure de cuir',
    type: 'ARMOR',
    price: 10,
    description: 'Une armure souple qui laisse toute liberté de mouvement sur les ponts glissants.',
    armorValue: 11,
  },
  {
    name: 'Potion de soin faible',
    type: 'CONSUMABLE',
    price: 25,
    description: 'Un liquide rosé au goût de miel qui referme les petites blessures.',
    effect: 'Soin faible',
  },
  {
    name: 'Potion de soin commune',
    type: 'CONSUMABLE',
    price: 50,
    description: 'La potion rouge que tout aventurier garde à sa ceinture.',
    effect: 'Soin',
  },
  {
    name: 'Potion de soin supérieure',
    type: 'CONSUMABLE',
    price: 150,
    description:
      'Un élixir pourpre et scintillant, capable de ramener un héros du bord du gouffre.',
    effect: 'Soin supérieur',
  },
  {
    name: 'Ration de voyage',
    type: 'CONSUMABLE',
    price: 1,
    description:
      'Pain séché, fromage et fruits confits : de quoi tenir une journée entre deux îles.',
  },
  {
    name: 'Pièces d’or',
    type: 'MISC',
    price: 1,
    description: 'La monnaie qui a cours dans tout l’archipel.',
  },
];

async function findOrCreateAbility(db: Db, data: Prisma.AbilityUncheckedCreateInput) {
  const existing = await db.ability.findFirst({ where: { name: data.name, ownerId: null } });
  return existing
    ? db.ability.update({ where: { id: existing.id }, data })
    : db.ability.create({ data });
}

async function findOrCreateEffect(db: Db, data: Prisma.EffectUncheckedCreateInput) {
  const existing = await db.effect.findFirst({ where: { name: data.name, ownerId: null } });
  return existing
    ? db.effect.update({ where: { id: existing.id }, data })
    : db.effect.create({ data });
}

async function findOrCreateItem(db: Db, data: Prisma.ItemUncheckedCreateInput) {
  const existing = await db.item.findFirst({ where: { name: data.name, ownerId: null } });
  return existing ? db.item.update({ where: { id: existing.id }, data }) : db.item.create({ data });
}

function idOf(map: Map<string, string>, name: string): string {
  const id = map.get(name);
  if (!id) {
    throw new Error(`Donnée de référence introuvable : ${name}`);
  }
  return id;
}

export async function seedReference(db: Db): Promise<ReferenceData> {
  const ref: ReferenceData = {
    races: new Map(),
    classes: new Map(),
    backgrounds: new Map(),
    skills: new Map(),
    abilities: new Map(),
    effects: new Map(),
    items: new Map(),
  };

  for (const name of RACES) {
    const race = await db.race.upsert({ where: { name }, update: {}, create: { name } });
    ref.races.set(name, race.id);
  }

  for (const [name, hitDie] of Object.entries(CLASSES)) {
    const created = await db.class.upsert({
      where: { name },
      update: { hitDie },
      create: { name, hitDie },
    });
    ref.classes.set(name, created.id);
  }

  for (const name of Object.keys(BACKGROUND_SKILLS)) {
    const background = await db.background.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    ref.backgrounds.set(name, background.id);
  }

  for (const [name, ability] of Object.entries(SKILLS)) {
    const skill = await db.skill.upsert({
      where: { name },
      update: { ability },
      create: { name, ability },
    });
    ref.skills.set(name, skill.id);
  }

  await db.raceSkill.createMany({
    data: Object.entries(RACE_SKILLS).flatMap(([race, skills]) =>
      skills.map((skill) => ({ raceId: idOf(ref.races, race), skillId: idOf(ref.skills, skill) })),
    ),
    skipDuplicates: true,
  });

  await db.classSkill.createMany({
    data: Object.entries(CLASS_SKILLS).flatMap(([className, skills]) =>
      skills.map((skill) => ({
        classId: idOf(ref.classes, className),
        skillId: idOf(ref.skills, skill),
      })),
    ),
    skipDuplicates: true,
  });

  await db.backgroundSkill.createMany({
    data: Object.entries(BACKGROUND_SKILLS).flatMap(([background, skills]) =>
      skills.map((skill) => ({
        backgroundId: idOf(ref.backgrounds, background),
        skillId: idOf(ref.skills, skill),
      })),
    ),
    skipDuplicates: true,
  });

  for (const spec of EFFECTS) {
    const effect = await findOrCreateEffect(db, {
      name: spec.name,
      diceCount: spec.diceCount ?? null,
      diceSides: spec.diceSides ?? null,
      bonus: spec.bonus ?? null,
      damageType: spec.damageType ?? null,
      isPublic: true,
    });
    ref.effects.set(spec.name, effect.id);
  }

  for (const spec of ABILITIES) {
    const source = spec.race ? 'RACE' : spec.class ? 'CLASS' : 'BACKGROUND';
    const ability = await findOrCreateAbility(db, {
      name: spec.name,
      description: spec.description,
      source,
      actionType: spec.actionType,
      isSpell: spec.spellLevel !== undefined,
      spellLevel: spec.spellLevel ?? null,
      maxUses: spec.maxUses ?? null,
      isPublic: true,
    });
    ref.abilities.set(spec.name, ability.id);

    if (spec.race) {
      await db.raceAbility.createMany({
        data: [{ raceId: idOf(ref.races, spec.race), abilityId: ability.id }],
        skipDuplicates: true,
      });
    }

    if (spec.class) {
      const classId = idOf(ref.classes, spec.class.name);
      await db.classAbility.upsert({
        where: { classId_abilityId: { classId, abilityId: ability.id } },
        update: { requiredLevel: spec.class.level },
        create: { classId, abilityId: ability.id, requiredLevel: spec.class.level },
      });
    }

    if (spec.background) {
      await db.backgroundAbility.createMany({
        data: [{ backgroundId: idOf(ref.backgrounds, spec.background), abilityId: ability.id }],
        skipDuplicates: true,
      });
    }
  }

  await db.abilityEffect.createMany({
    data: Object.entries(ABILITY_EFFECTS).map(([ability, effect]) => ({
      abilityId: idOf(ref.abilities, ability),
      effectId: idOf(ref.effects, effect),
    })),
    skipDuplicates: true,
  });

  for (const spec of ITEMS) {
    const item = await findOrCreateItem(db, {
      name: spec.name,
      type: spec.type,
      price: spec.price,
      description: spec.description,
      armorValue: spec.armorValue ?? null,
      isPublic: true,
    });
    ref.items.set(spec.name, item.id);

    if (spec.effect) {
      await db.itemEffect.createMany({
        data: [{ itemId: item.id, effectId: idOf(ref.effects, spec.effect) }],
        skipDuplicates: true,
      });
    }
  }

  return ref;
}
