import type {
  ActionType,
  Alignment,
  Attitude,
  CharacterType,
  CreatureStatus,
  ItemType,
  Prisma,
} from '@prisma/client';
import { PLACEHOLDER_IMAGE_URL } from './placeholder.js';
import type { ReferenceData } from './reference.js';

type Db = Prisma.TransactionClient;

export const DEMO_GM_EMAIL = 'maitre.ying@arcane-chronicles.test';

interface Lookup {
  ref: ReferenceData;
  abilities: Map<string, string>;
  effects: Map<string, string>;
  items: Map<string, string>;
}

function pick(name: string, ...maps: Map<string, string>[]): string {
  for (const map of maps) {
    const id = map.get(name);
    if (id) {
      return id;
    }
  }
  throw new Error(`Donnée introuvable : ${name}`);
}

const itemId = (l: Lookup, name: string) => pick(name, l.items, l.ref.items);
const effectId = (l: Lookup, name: string) => pick(name, l.effects, l.ref.effects);
const abilityId = (l: Lookup, name: string) => pick(name, l.abilities, l.ref.abilities);

async function clearDemo(db: Db, gmId: string) {
  const inCampaigns = { campaign: { gmId } };
  const inChapters = { chapter: inCampaigns };
  const inScenes = { scene: inChapters };

  await db.combat.updateMany({ where: { game: inChapters }, data: { activeCombatantId: null } });
  await db.combatant.deleteMany({ where: { combat: { game: inChapters } } });
  await db.combat.deleteMany({ where: { game: inChapters } });
  await db.participant.deleteMany({ where: { game: inChapters } });
  await db.game.deleteMany({ where: inChapters });

  await db.objective.deleteMany({ where: { quest: inCampaigns } });
  await db.questRewardItem.deleteMany({ where: { quest: inCampaigns } });
  await db.quest.deleteMany({ where: inCampaigns });

  await db.chestItem.deleteMany({ where: { chest: inScenes } });
  await db.chest.deleteMany({ where: inScenes });
  await db.trapEffect.deleteMany({ where: { trap: inScenes } });
  await db.trap.deleteMany({ where: inScenes });
  await db.riddle.deleteMany({ where: inScenes });

  await db.sceneCreatureItem.deleteMany({ where: { sceneCreature: inScenes } });
  await db.sceneCreature.deleteMany({ where: inScenes });
  await db.sceneGroup.deleteMany({ where: inScenes });

  await db.characterAbility.deleteMany({ where: { character: inCampaigns } });
  await db.characterItem.deleteMany({ where: { character: inCampaigns } });
  await db.character.updateMany({ where: inCampaigns, data: { sourceId: null } });
  await db.character.deleteMany({ where: inCampaigns });

  await db.chapter.updateMany({ where: inCampaigns, data: { currentSceneId: null } });
  await db.gmNote.deleteMany({ where: inChapters });
  await db.scene.deleteMany({ where: inChapters });
  await db.chapter.deleteMany({ where: inCampaigns });
  await db.campaign.updateMany({ where: { gmId }, data: { sourceCampaignId: null } });
  await db.campaign.deleteMany({ where: { gmId } });

  const ownedAbility = { ability: { ownerId: gmId } };
  const ownedEffect = { effect: { ownerId: gmId } };
  const ownedItem = { item: { ownerId: gmId } };

  await db.abilityEffect.deleteMany({ where: { OR: [ownedAbility, ownedEffect] } });
  await db.itemEffect.deleteMany({ where: { OR: [ownedItem, ownedEffect] } });
  await db.trapEffect.deleteMany({ where: ownedEffect });
  await db.raceAbility.deleteMany({ where: ownedAbility });
  await db.classAbility.deleteMany({ where: ownedAbility });
  await db.backgroundAbility.deleteMany({ where: ownedAbility });
  await db.characterAbility.deleteMany({ where: ownedAbility });
  await db.characterItem.deleteMany({ where: ownedItem });
  await db.sceneCreatureItem.deleteMany({ where: ownedItem });
  await db.chestItem.deleteMany({ where: ownedItem });
  await db.questRewardItem.deleteMany({ where: ownedItem });
  await db.objective.deleteMany({ where: { targetItem: { ownerId: gmId } } });
  await db.character.updateMany({
    where: { wornArmor: { ownerId: gmId } },
    data: { wornArmorId: null },
  });
  await db.item.updateMany({ where: { source: { ownerId: gmId } }, data: { sourceId: null } });

  await db.ability.deleteMany({ where: { ownerId: gmId } });
  await db.effect.deleteMany({ where: { ownerId: gmId } });
  await db.item.deleteMany({ where: { ownerId: gmId } });
}

interface EffectSpec {
  name: string;
  diceCount?: number;
  diceSides?: number;
  bonus?: number;
  damageType?: string;
  repeatCount?: number;
  description?: string;
}

const EFFECTS: EffectSpec[] = [
  { name: 'Lame d’azur', diceCount: 1, diceSides: 4, damageType: 'froid' },
  { name: 'Lame divine', diceCount: 2, diceSides: 6, bonus: 5, damageType: 'radiant' },
  { name: 'Regain de mana faible', diceCount: 1, diceSides: 4 },
  { name: 'Regain de mana', diceCount: 2, diceSides: 4 },
  { name: 'Regain de mana supérieur', diceCount: 4, diceSides: 4 },
  { name: 'Piques', diceCount: 1, diceSides: 6, damageType: 'perforant' },
  {
    name: 'Poison des piques',
    bonus: 1,
    damageType: 'poison',
    repeatCount: 5,
    description: 'Durée : 5 tours · 1 dégât par tour · Initiative −2',
  },
  { name: 'Griffes', diceCount: 2, diceSides: 4, damageType: 'tranchant' },
  { name: 'Souffle de brume', diceCount: 6, diceSides: 6, damageType: 'froid' },
  { name: 'Chute dans la cale', diceCount: 2, diceSides: 6, damageType: 'contondant' },
];

interface AbilitySpec {
  name: string;
  description: string;
  actionType: ActionType;
  effect: string;
}

const ABILITIES: AbilitySpec[] = [
  {
    name: 'Griffes',
    description: 'Les serres de l’arrawak lacèrent sa proie en plein vol.',
    actionType: 'ACTION',
    effect: 'Griffes',
  },
  {
    name: 'Souffle de brume',
    description: 'Le drake exhale un nuage de brume glacée qui gèle tout sur son passage.',
    actionType: 'ACTION',
    effect: 'Souffle de brume',
  },
];

interface ItemSpec {
  name: string;
  type: ItemType;
  price: number;
  description: string;
  armorValue?: number;
  effects?: string[];
}

const ITEMS: ItemSpec[] = [
  {
    name: 'Potion de mana faible',
    type: 'CONSUMABLE',
    price: 10,
    description: 'Quelques gorgées d’un liquide bleuté qui ravivent une étincelle de magie.',
    effects: ['Regain de mana faible'],
  },
  {
    name: 'Potion de mana commune',
    type: 'CONSUMABLE',
    price: 25,
    description:
      'Distillée à partir de la rosée des nuages, elle redonne des forces aux lanceurs de sorts.',
    effects: ['Regain de mana'],
  },
  {
    name: 'Potion de mana supérieure',
    type: 'CONSUMABLE',
    price: 100,
    description: 'Un élixir d’un bleu profond où dansent de minuscules éclairs.',
    effects: ['Regain de mana supérieur'],
  },
  {
    name: 'Dagues de l’azur',
    type: 'WEAPON',
    price: 120,
    description:
      'Deux dagues jumelles forgées dans un métal tombé du ciel, toujours froides au toucher.',
    effects: ['Lame d’azur'],
  },
  {
    name: 'Épée divine',
    type: 'WEAPON',
    price: 2000,
    description: 'Une lame unique dont l’éclat perce les nuages les plus sombres.',
    effects: ['Lame divine'],
  },
  {
    name: 'Armure divine',
    type: 'ARMOR',
    price: 1500,
    description:
      'Une armure d’or pâle gravée de vents et d’étoiles, transmise de capitaine en capitaine.',
    armorValue: 18,
  },
  {
    name: 'Anneau du néant',
    type: 'ARTIFACT',
    price: 800,
    description:
      'Un anneau noir sans reflet ; qui le porte entend parfois murmurer le vide sous les îles.',
  },
  {
    name: 'Anneau d’invisibilité',
    type: 'ARTIFACT',
    price: 600,
    description: 'Glissé au doigt, il efface son porteur de la vue des autres.',
  },
  {
    name: 'Cape d’invisibilité',
    type: 'ARTIFACT',
    price: 700,
    description: 'Une étoffe tissée de brume qui se confond avec l’air.',
  },
  {
    name: 'Clé de la cabine du capitaine',
    type: 'MISC',
    price: 0,
    description: 'Une lourde clé de laiton frappée de l’emblème du Vent d’Éther.',
  },
  {
    name: 'Médaillon du capitaine',
    type: 'MISC',
    price: 0,
    description:
      'Un médaillon d’acier terni, orné d’un croc stylisé, qui ne quitte jamais son porteur.',
  },
  {
    name: 'Écailles du drake',
    type: 'ARMOR',
    price: 0,
    description: 'La cuirasse naturelle du drake des brumes, plus dure que l’acier.',
    armorValue: 24,
  },
];

interface Stats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

interface Stack {
  item: string;
  quantity: number;
}

interface CharacterSpec {
  key: string;
  name: string;
  type: CharacterType;
  race?: string;
  class?: string;
  background?: string;
  occupation?: string;
  level: number;
  xp: number;
  isUnique: boolean;
  isBoss?: boolean;
  alignment?: Alignment;
  stats: Stats;
  maxHp: number;
  currentHp?: number;
  attitude?: Attitude;
  status?: CreatureStatus;
  gold?: number;
  wornArmor?: string;
  inventory?: Stack[];
  stock?: Stack[];
  extraAbilities?: string[];
  biography?: string;
  personality?: string;
  personalQuest?: string;
  secrets?: string;
  gmNotes?: string;
}

const CHARACTERS: CharacterSpec[] = [
  {
    key: 'goor',
    name: 'Goor',
    type: 'HERO',
    race: 'Orc',
    class: 'Moine',
    background: 'Soldat',
    level: 3,
    xp: 900,
    isUnique: true,
    alignment: 'TRUE_NEUTRAL',
    stats: {
      strength: 14,
      dexterity: 16,
      constitution: 14,
      intelligence: 10,
      wisdom: 15,
      charisma: 8,
    },
    maxHp: 24,
    gold: 34,
    inventory: [
      { item: 'Dagues de l’azur', quantity: 1 },
      { item: 'Médaillon du capitaine', quantity: 1 },
      { item: 'Potion de soin commune', quantity: 1 },
    ],
    biography:
      'Goor est né au sein de la tribu des Crocs de Fer où il fut élevé comme guerrier dès son plus jeune âge. Après quinze années de service dans l’armée orque, il survécut au massacre de sa compagnie et abandonna la guerre. Recueilli par un monastère isolé, il apprit à maîtriser sa colère et consacra sa vie à protéger les plus faibles.',
    personality:
      'Calme, discipliné et peu bavard. Goor déteste les généraux, protège instinctivement les plus faibles et préfère résoudre les conflits par la parole avant de recourir à la violence.',
    personalQuest:
      'Goor recherche son ancien maître, disparu depuis plusieurs années. Il espère également découvrir la vérité sur le massacre de son ancienne compagnie afin de pouvoir enfin tourner la page de son passé.',
    secrets:
      'Goor porte toujours le médaillon de son ancien capitaine, sans savoir qu’il s’agit de la clé ouvrant une ancienne forteresse militaire.',
    gmNotes:
      'Si les aventuriers gagnent sa confiance, Goor peut devenir un allié fidèle et leur enseigner des techniques de combat monastiques.',
  },
  {
    key: 'alira',
    name: 'Alira',
    type: 'HERO',
    race: 'Elfe',
    class: 'Druide',
    background: 'Sage',
    level: 3,
    xp: 900,
    isUnique: true,
    alignment: 'NEUTRAL_GOOD',
    stats: {
      strength: 8,
      dexterity: 14,
      constitution: 12,
      intelligence: 13,
      wisdom: 16,
      charisma: 10,
    },
    maxHp: 21,
    gold: 33,
    inventory: [
      { item: 'Potion de mana commune', quantity: 1 },
      { item: 'Potion de soin commune', quantity: 1 },
    ],
    biography:
      'Gardienne des bosquets suspendus de l’île d’Ilmar, Alira a passé un siècle à étudier les vents et les plantes qui poussent au bord du vide. Le jour où sa forêt a commencé à se dessécher sans raison, elle a quitté son île pour comprendre ce qui ronge l’archipel.',
    personality:
      'Patiente, curieuse et un peu distante. Alira parle plus volontiers aux oiseaux qu’aux marchands, mais ne laisse jamais une créature blessée derrière elle.',
    personalQuest:
      'Trouver l’origine du mal qui assèche les îles et rendre la vie aux bosquets d’Ilmar.',
    secrets:
      'Alira a déjà vu le sceau du Néant : il était gravé sur l’écorce morte de l’arbre le plus ancien de son bosquet.',
    gmNotes:
      'Si les héros examinent le cordage saboté, Alira reconnaît la marque du Néant : c’est le moment de révéler l’indice.',
  },
  {
    key: 'erwil',
    name: 'Erwïl, le forge-étoile',
    type: 'HERO',
    race: 'Nain',
    class: 'Guerrier',
    background: 'Soldat',
    level: 3,
    xp: 900,
    isUnique: true,
    alignment: 'LAWFUL_GOOD',
    stats: {
      strength: 16,
      dexterity: 12,
      constitution: 15,
      intelligence: 10,
      wisdom: 11,
      charisma: 9,
    },
    maxHp: 38,
    currentHp: 32,
    gold: 42,
    wornArmor: 'Cotte de mailles',
    inventory: [
      { item: 'Hache de bataille', quantity: 1 },
      { item: 'Cotte de mailles', quantity: 1 },
      { item: 'Potion de soin commune', quantity: 1 },
    ],
    biography:
      'Ancien forgeron de la garde céleste, Erwïl doit son surnom à une lame forgée dans le fer d’une étoile tombée. Lorsque sa forge a été pillée, il a repris la hache et s’est embarqué à la poursuite des voleurs.',
    personality:
      'Bourru, loyal et fier de son travail. Il juge les gens à la qualité de leur équipement.',
    personalQuest: 'Retrouver la lame d’étoile volée dans sa forge et ceux qui l’ont emportée.',
    secrets:
      'La lame volée n’est pas terminée : la tremper dans le vide pourrait lui donner un pouvoir qu’Erwïl redoute.',
    gmNotes: 'Erwïl peut évaluer la valeur des armes et des armures trouvées dans les coffres.',
  },
  {
    key: 'selene',
    name: 'Sélène',
    type: 'HERO',
    race: 'Halfelin',
    class: 'Roublard',
    background: 'Criminel',
    level: 3,
    xp: 900,
    isUnique: true,
    alignment: 'CHAOTIC_GOOD',
    stats: {
      strength: 8,
      dexterity: 16,
      constitution: 12,
      intelligence: 12,
      wisdom: 11,
      charisma: 14,
    },
    maxHp: 20,
    gold: 25,
    wornArmor: 'Armure de cuir',
    inventory: [
      { item: 'Armure de cuir', quantity: 1 },
      { item: 'Épée à une main', quantity: 1 },
      { item: 'Potion de soin faible', quantity: 1 },
    ],
    biography:
      'Élevée dans les ruelles du port de Brisevent, Sélène a appris à grimper aux mâts avant de savoir lire. Elle vole surtout ceux qui ont trop, et rend parfois ce qu’elle prend.',
    personality: 'Rieuse, insolente et incapable de résister à une serrure fermée.',
    personalQuest: 'Rembourser la dette de sa famille auprès d’une guilde de contrebandiers.',
    secrets: 'Elle a déjà travaillé pour les pirates du Néant, sans savoir pour qui elle volait.',
  },
  {
    key: 'brann',
    name: 'Brann',
    type: 'HERO',
    race: 'Humain',
    class: 'Paladin',
    background: 'Acolyte',
    level: 3,
    xp: 900,
    isUnique: true,
    alignment: 'LAWFUL_GOOD',
    stats: {
      strength: 16,
      dexterity: 10,
      constitution: 14,
      intelligence: 9,
      wisdom: 12,
      charisma: 15,
    },
    maxHp: 28,
    gold: 20,
    wornArmor: 'Cotte de mailles',
    inventory: [
      { item: 'Cotte de mailles', quantity: 1 },
      { item: 'Épée à une main', quantity: 1 },
      { item: 'Potion de soin commune', quantity: 1 },
    ],
    biography:
      'Novice du temple de l’Aube, Brann a prêté serment de protéger les voyageurs du ciel. Ce voyage est sa première mission hors des murs du temple.',
    personality:
      'Sincère, droit et parfois naïf ; il croit qu’une bonne parole vaut mieux qu’une épée.',
    personalQuest: 'Prouver à son ordre qu’il est digne de porter les armes du temple.',
    secrets: 'Il doute de sa foi depuis qu’une prière est restée sans réponse.',
  },
  {
    key: 'atom',
    name: 'Capitaine Atom',
    type: 'NPC',
    race: 'Humain',
    class: 'Guerrier',
    occupation: 'Capitaine',
    level: 8,
    xp: 34000,
    isUnique: true,
    alignment: 'LAWFUL_NEUTRAL',
    stats: {
      strength: 16,
      dexterity: 12,
      constitution: 14,
      intelligence: 12,
      wisdom: 13,
      charisma: 16,
    },
    maxHp: 42,
    attitude: 'FRIENDLY',
    gold: 250,
    wornArmor: 'Armure divine',
    inventory: [{ item: 'Armure divine', quantity: 1 }],
    biography:
      'Capitaine du Vent d’Éther depuis vingt ans, Atom connaît chaque courant de l’archipel. Son armure, transmise de capitaine en capitaine, est la fierté de l’équipage.',
    personality:
      'Exigeant, juste et méfiant envers les inconnus, mais il respecte ceux qui tiennent parole.',
    secrets: 'Il sait que des pirates du Néant se sont glissés à bord, mais ignore qui ils sont.',
    gmNotes:
      'Donne la quête principale ; il faut gagner sa confiance avant qu’il parle des pirates.',
  },
  {
    key: 'marcel',
    name: 'Marcel',
    type: 'NPC',
    race: 'Humain',
    class: 'Roublard',
    occupation: 'Marchand',
    level: 2,
    xp: 300,
    isUnique: true,
    alignment: 'CHAOTIC_NEUTRAL',
    stats: {
      strength: 9,
      dexterity: 14,
      constitution: 11,
      intelligence: 13,
      wisdom: 12,
      charisma: 15,
    },
    maxHp: 14,
    attitude: 'FRIENDLY',
    gold: 120,
    stock: [
      { item: 'Épée à une main', quantity: 1 },
      { item: 'Casque de cuir', quantity: 1 },
      { item: 'Potion de mana commune', quantity: 2 },
      { item: 'Potion de soin commune', quantity: 3 },
      { item: 'Ration de voyage', quantity: 6 },
    ],
    biography:
      'Marchand ambulant, Marcel tient « L’échoppe de Marcel » sur le pont du Vent d’Éther.',
    personality:
      'Curieux, bavard et opportuniste ; il flaire les bonnes affaires comme d’autres flairent le vent.',
    secrets: 'Il est persuadé que le coffre du capitaine renferme un trésor inestimable.',
    gmNotes: 'Discuter avec lui déclenche la quête « Un trésor bien gardé ».',
  },
  {
    key: 'hiral',
    name: 'Hiral',
    type: 'NPC',
    race: 'Nain',
    occupation: 'Armurier',
    level: 1,
    xp: 0,
    isUnique: true,
    alignment: 'LAWFUL_NEUTRAL',
    stats: {
      strength: 15,
      dexterity: 9,
      constitution: 15,
      intelligence: 11,
      wisdom: 12,
      charisma: 10,
    },
    maxHp: 12,
    attitude: 'FRIENDLY',
    gold: 80,
    stock: [
      { item: 'Hache de bataille', quantity: 2 },
      { item: 'Épée double', quantity: 1 },
      { item: 'Cotte de mailles', quantity: 1 },
      { item: 'Armure de cuir', quantity: 2 },
    ],
    biography:
      'Armurier itinérant, Hiral répare les lames de l’équipage en échange de son passage.',
    personality: 'Taciturne et perfectionniste ; il ne vend jamais une arme qu’il n’a pas essayée.',
  },
  {
    key: 'nyssa',
    name: 'Nyssa',
    type: 'NPC',
    race: 'Elfe',
    class: 'Druide',
    occupation: 'Herboriste',
    level: 1,
    xp: 0,
    isUnique: true,
    alignment: 'NEUTRAL_GOOD',
    stats: {
      strength: 8,
      dexterity: 13,
      constitution: 11,
      intelligence: 12,
      wisdom: 15,
      charisma: 12,
    },
    maxHp: 9,
    attitude: 'FRIENDLY',
    gold: 60,
    stock: [
      { item: 'Potion de soin faible', quantity: 5 },
      { item: 'Potion de mana faible', quantity: 5 },
      { item: 'Potion de soin supérieure', quantity: 1 },
    ],
    biography:
      'Herboriste des îles reculées, Nyssa vend des remèdes cueillis au bord des cascades célestes.',
    personality: 'Douce et rêveuse, elle parle de chaque plante comme d’une amie.',
  },
  {
    key: 'vask',
    name: 'Vask, le garde infiltré',
    type: 'NPC',
    race: 'Humain',
    class: 'Roublard',
    occupation: 'Garde',
    level: 3,
    xp: 900,
    isUnique: true,
    alignment: 'NEUTRAL_EVIL',
    stats: {
      strength: 11,
      dexterity: 15,
      constitution: 12,
      intelligence: 12,
      wisdom: 10,
      charisma: 13,
    },
    maxHp: 18,
    attitude: 'HOSTILE',
    gold: 15,
    inventory: [{ item: 'Clé de la cabine du capitaine', quantity: 1 }],
    personality: 'Discret, poli et toujours là où on ne l’attend pas.',
    secrets: 'Il porte le sceau du Néant sous son uniforme et prépare le sabotage du navire.',
    gmNotes: 'Le cordage qu’il a saboté porte la marque du Néant.',
  },
  {
    key: 'guard',
    name: 'Garde du pont',
    type: 'NPC',
    race: 'Humain',
    class: 'Guerrier',
    occupation: 'Garde',
    level: 2,
    xp: 300,
    isUnique: false,
    alignment: 'LAWFUL_NEUTRAL',
    stats: {
      strength: 14,
      dexterity: 12,
      constitution: 13,
      intelligence: 10,
      wisdom: 11,
      charisma: 10,
    },
    maxHp: 18,
    attitude: 'FRIENDLY',
    personality:
      'Vigilants, ils patrouillent sans relâche et surveillent les comportements suspects.',
  },
  {
    key: 'pirate',
    name: 'Pirate du Néant',
    type: 'NPC',
    race: 'Humain',
    class: 'Roublard',
    level: 2,
    xp: 300,
    isUnique: false,
    alignment: 'CHAOTIC_EVIL',
    stats: {
      strength: 11,
      dexterity: 14,
      constitution: 12,
      intelligence: 10,
      wisdom: 10,
      charisma: 11,
    },
    maxHp: 13,
    attitude: 'HOSTILE',
    personality: 'Fidèles au Néant jusqu’à la mort, ils ne parlent que sous la menace.',
  },
  {
    key: 'arrawak',
    name: 'Arrawak',
    type: 'MONSTER',
    race: 'Arrawak',
    occupation: 'Monstre ailé',
    level: 3,
    xp: 900,
    isUnique: false,
    alignment: 'CHAOTIC_EVIL',
    stats: {
      strength: 13,
      dexterity: 15,
      constitution: 13,
      intelligence: 7,
      wisdom: 12,
      charisma: 8,
    },
    maxHp: 22,
    attitude: 'HOSTILE',
    extraAbilities: ['Griffes'],
    biography: 'Pillards ailés du ciel de l’archipel, les arrawaks attaquent les navires en meute.',
  },
  {
    key: 'drake',
    name: 'Drake des brumes',
    type: 'MONSTER',
    level: 18,
    xp: 265000,
    isUnique: true,
    isBoss: true,
    alignment: 'NEUTRAL_EVIL',
    stats: {
      strength: 26,
      dexterity: 20,
      constitution: 24,
      intelligence: 14,
      wisdom: 15,
      charisma: 17,
    },
    maxHp: 412,
    attitude: 'HOSTILE',
    status: 'WAITING',
    wornArmor: 'Écailles du drake',
    inventory: [{ item: 'Écailles du drake', quantity: 1 }],
    extraAbilities: ['Souffle de brume'],
    biography:
      'Un drake ancien, endormi dans les profondeurs du navire, dont le souffle gèle les nuages.',
    gmNotes: 'Il ne se réveille qu’au troisième coup de cloche.',
  },
];

async function createCharacter(db: Db, l: Lookup, campaignId: string, spec: CharacterSpec) {
  const raceId = spec.race ? pick(spec.race, l.ref.races) : null;
  const classId = spec.class ? pick(spec.class, l.ref.classes) : null;
  const backgroundId = spec.background ? pick(spec.background, l.ref.backgrounds) : null;

  const character = await db.character.create({
    data: {
      campaignId,
      type: spec.type,
      name: spec.name,
      imageUrl: PLACEHOLDER_IMAGE_URL,
      raceId,
      classId,
      backgroundId,
      occupation: spec.occupation ?? null,
      level: spec.level,
      xp: spec.xp,
      isUnique: spec.isUnique,
      isBoss: spec.isBoss ?? false,
      alignment: spec.alignment ?? null,
      ...spec.stats,
      maxHp: spec.maxHp,
      currentHp: spec.currentHp ?? spec.maxHp,
      attitude: spec.attitude ?? null,
      status: spec.status ?? 'ACTIVE',
      gold: spec.gold ?? 0,
      wornArmorId: spec.wornArmor ? itemId(l, spec.wornArmor) : null,
      biography: spec.biography ?? null,
      personality: spec.personality ?? null,
      personalQuest: spec.personalQuest ?? null,
      secrets: spec.secrets ?? null,
      gmNotes: spec.gmNotes ?? null,
    },
  });

  const items = [
    ...(spec.inventory ?? []).map((stack) => ({ ...stack, forSale: false })),
    ...(spec.stock ?? []).map((stack) => ({ ...stack, forSale: true })),
  ];
  if (items.length > 0) {
    await db.characterItem.createMany({
      data: items.map((stack) => ({
        characterId: character.id,
        itemId: itemId(l, stack.item),
        quantity: stack.quantity,
        forSale: stack.forSale,
      })),
    });
  }

  const inherited = await db.ability.findMany({
    where: {
      OR: [
        ...(raceId ? [{ raceAbilities: { some: { raceId } } }] : []),
        ...(classId
          ? [{ classAbilities: { some: { classId, requiredLevel: { lte: spec.level } } } }]
          : []),
        ...(backgroundId ? [{ backgroundAbilities: { some: { backgroundId } } }] : []),
        ...(spec.extraAbilities ?? []).map((name) => ({ id: abilityId(l, name) })),
      ],
    },
  });
  if (inherited.length > 0) {
    await db.characterAbility.createMany({
      data: inherited.map((ability) => ({
        characterId: character.id,
        abilityId: ability.id,
        usesRemaining: ability.maxUses,
      })),
    });
  }

  return character.id;
}

const SCENES = [
  {
    key: 'deck',
    title: 'Le pont du navire',
    narration: [
      'Le pont du Vent d’Éther est animé par une foule de voyageurs, de marins et de marchands qui vaquent à leurs occupations. Alors que le navire s’élève lentement dans les airs, les cordages se tendent et les voiles capturent les courants célestes. Tout autour, les paysages défilent : d’immenses îles flottantes couvertes de forêts, des falaises suspendues dans le vide et des cascades qui semblent tomber à l’infini à travers les nuages.',
      'Parmi l’agitation, plusieurs commerçants attirent l’attention des passagers. Un armurier expose des lames brillantes, des boucliers robustes et divers équipements destinés aux aventuriers. Non loin de là, un herboriste présente des plantes rares, des remèdes et des potions récoltés sur les îles les plus reculées de l’archipel. Un marchand général complète le marché improvisé avec toutes sortes d’objets utiles pour le voyage : provisions, outils, cartes et accessoires de navigation.',
      'Des gardes en uniforme patrouillent régulièrement sur le pont, surveillant les allées et venues des passagers et maintenant l’ordre à bord. Les discussions, les négociations et les éclats de rire se mêlent au bruit du vent qui souffle entre les mâts. L’atmosphère est vivante et chaleureuse, donnant l’impression que chaque personne à bord possède sa propre histoire et sa propre destination au-delà des nuages.',
    ],
  },
  {
    key: 'cabin',
    title: 'La cabine du capitaine',
    narration: [
      'Derrière une porte de chêne sculptée, la cabine du capitaine respire la sobriété et le luxe à la fois : cartes célestes épinglées aux murs, instruments de navigation en laiton et grande baie vitrée ouverte sur la mer de nuages.',
      'C’est ici que bat le cœur du commandement. Dans un recoin, à demi caché sous une tenture, repose un coffre cerclé de fer dont on murmure qu’il renferme un trésor légendaire.',
    ],
  },
  {
    key: 'passengers',
    title: 'Les cabines des passagers',
    narration: [
      'Un couloir étroit et grinçant dessert une enfilade de cabines aux portes numérotées. L’odeur du bois ciré se mêle à celle des épices et des parchemins.',
      'Derrière chaque porte, un passager garde ses secrets : un érudit penché sur ses cartes, une famille qui fuit une île en ruine, un voyageur qui ne sort jamais avant la nuit.',
    ],
  },
  {
    key: 'brig',
    title: 'Les geôles',
    narration: [
      'Au fond de la cale, sous la ligne de flottaison des nuages, l’équipage a aménagé quelques cellules sombres où l’on enferme les pirates capturés.',
      'L’air y est humide et froid, les planches gémissent sous chaque pas, et les prisonniers observent les visiteurs en silence.',
    ],
  },
];

const GM_NOTES = [
  'Une rumeur mène à la cabine du capitaine. Le coffre n’est pas sans défense.',
  'Le garde infiltré porte le sceau du Néant. Alira reconnaît la marque : révéler l’indice si les héros examinent le cordage. Le drake ne se réveille qu’au troisième coup de cloche.',
  'Les gardes du navire sont particulièrement vigilants. Ils patrouillent en permanence sur le pont et surveillent les comportements suspects. Toute action imprudente ou tentative d’intrusion dans des zones interdites pourrait rapidement attirer leur attention.',
  'Présence de pirates infiltrés à bord. Quête secrète disponible : le médaillon de Goor.',
];

export async function seedDemo(db: Db, ref: ReferenceData, passwordHash: string) {
  const gm = await db.user.upsert({
    where: { email: DEMO_GM_EMAIL },
    update: { displayName: 'Maître Ying', passwordHash },
    create: { email: DEMO_GM_EMAIL, displayName: 'Maître Ying', passwordHash },
  });

  await clearDemo(db, gm.id);

  const l: Lookup = { ref, abilities: new Map(), effects: new Map(), items: new Map() };

  for (const spec of EFFECTS) {
    const effect = await db.effect.create({
      data: {
        ownerId: gm.id,
        isPublic: true,
        name: spec.name,
        diceCount: spec.diceCount ?? null,
        diceSides: spec.diceSides ?? null,
        bonus: spec.bonus ?? null,
        damageType: spec.damageType ?? null,
        repeatCount: spec.repeatCount ?? null,
        description: spec.description ?? null,
      },
    });
    l.effects.set(spec.name, effect.id);
  }

  for (const spec of ABILITIES) {
    const ability = await db.ability.create({
      data: {
        ownerId: gm.id,
        isPublic: true,
        name: spec.name,
        description: spec.description,
        source: 'LEARNED',
        actionType: spec.actionType,
        abilityEffects: { create: { effectId: effectId(l, spec.effect) } },
      },
    });
    l.abilities.set(spec.name, ability.id);
  }

  for (const spec of ITEMS) {
    const item = await db.item.create({
      data: {
        ownerId: gm.id,
        isPublic: true,
        name: spec.name,
        description: spec.description,
        imageUrl: PLACEHOLDER_IMAGE_URL,
        type: spec.type,
        price: spec.price,
        armorValue: spec.armorValue ?? null,
        itemEffects: {
          create: (spec.effects ?? []).map((name) => ({ effectId: effectId(l, name) })),
        },
      },
    });
    l.items.set(spec.name, item.id);
  }

  const campaign = await db.campaign.create({
    data: {
      gmId: gm.id,
      title: 'L’archipel du néant',
      description:
        'Une quête incroyable au cœur d’un archipel d’îles flottantes, suspendues entre ciel et nuages. Chaque île cache des secrets anciens, des ruines oubliées et des créatures mystérieuses qui défient les lois de la gravité. Le vent guide les voyageurs d’un fragment de terre à l’autre, à travers des ponts naturels de brume et de lumière. Dans cet univers instable, chaque choix peut faire basculer l’équilibre du monde. Une aventure où courage, exploration et découverte s’entrelacent au-dessus du vide.',
      imageUrl: PLACEHOLDER_IMAGE_URL,
      isPublic: true,
    },
  });

  const chapter = await db.chapter.create({
    data: {
      campaignId: campaign.id,
      title: 'Une merveilleuse ascension',
      position: 1,
      status: 'NEW',
      imageUrl: PLACEHOLDER_IMAGE_URL,
      mapUrl: PLACEHOLDER_IMAGE_URL,
      narration: [
        'Les héros embarquent à bord d’un immense bateau volant, une véritable cité flottante portée par d’antiques mécanismes et d’immenses voiles battues par les vents célestes.',
        'Le pont principal grouille de vie : marchands ambulants, voyageurs venus des quatre coins du monde, marins affairés et aventuriers mystérieux se croisent dans une agitation permanente. Entre les étals d’épices rares, les cages d’animaux exotiques et les cartes anciennes vendues à prix d’or, chacun semble poursuivre un objectif différent au cœur des cieux.',
        'À mesure que le navire gagne de l’altitude, les paysages deviennent irréels. Les montagnes disparaissent sous une mer de nuages dorés, traversée par les rayons du soleil couchant. Au loin apparaissent enfin les premières îles flottantes : des morceaux de terre suspendus dans le ciel, entourés de cascades tombant dans le vide et de ruines oubliées par le temps. Pour beaucoup, ce spectacle est une merveille ; pour d’autres, le signe que le voyage vers l’inconnu ne fait que commencer.',
      ].join('\n\n'),
      gmNotes: { create: GM_NOTES.map((content) => ({ content })) },
    },
  });

  const scenes = new Map<string, string>();
  for (const [index, spec] of SCENES.entries()) {
    const scene = await db.scene.create({
      data: {
        chapterId: chapter.id,
        title: spec.title,
        position: index + 1,
        narration: spec.narration.join('\n\n'),
        imageUrl: PLACEHOLDER_IMAGE_URL,
        mapUrl: PLACEHOLDER_IMAGE_URL,
      },
    });
    scenes.set(spec.key, scene.id);
  }
  const sceneId = (key: string) => pick(key, scenes);

  const characters = new Map<string, string>();
  for (const spec of CHARACTERS) {
    characters.set(spec.key, await createCharacter(db, l, campaign.id, spec));
  }
  const characterId = (key: string) => pick(key, characters);
  const characterSpec = (key: string) => CHARACTERS.find((spec) => spec.key === key)!;

  const group = async (scene: string, name: string, position: number) =>
    (await db.sceneGroup.create({ data: { sceneId: sceneId(scene), name, position } })).id;

  const placeUnique = (scene: string, groupId: string, key: string, isRevealed: boolean) =>
    db.sceneCreature.create({
      data: { sceneId: sceneId(scene), groupId, characterId: characterId(key), isRevealed },
    });

  const placeGeneric = async (
    scene: string,
    groupId: string,
    key: string,
    count: number,
    status: CreatureStatus,
    isRevealed: boolean,
  ) => {
    const spec = characterSpec(key);
    const ids: string[] = [];
    for (let n = 1; n <= count; n++) {
      const creature = await db.sceneCreature.create({
        data: {
          sceneId: sceneId(scene),
          groupId,
          characterId: characterId(key),
          displayName: `${spec.name} ${n}`,
          currentHp: spec.maxHp,
          attitude: spec.attitude ?? null,
          status,
          isRevealed,
        },
      });
      ids.push(creature.id);
    }
    return ids;
  };

  const trade = await group('deck', 'Commerce', 1);
  for (const key of ['marcel', 'hiral', 'nyssa']) {
    await placeUnique('deck', trade, key, true);
  }
  await placeUnique('deck', await group('deck', 'Personnages de quête', 2), 'atom', true);
  const guards = await group('deck', 'Gardes', 3);
  await placeGeneric('deck', guards, 'guard', 6, 'ACTIVE', true);
  await placeUnique('deck', guards, 'vask', false);
  const arrawaks = await placeGeneric(
    'deck',
    await group('deck', 'Ennemis', 4),
    'arrawak',
    4,
    'WAITING',
    false,
  );
  for (const sceneCreatureId of arrawaks.slice(0, 2)) {
    await db.sceneCreatureItem.createMany({
      data: [
        { sceneCreatureId, itemId: itemId(l, 'Pièces d’or'), quantity: 12 },
        { sceneCreatureId, itemId: itemId(l, 'Potion de soin faible'), quantity: 1 },
      ],
    });
  }

  await placeUnique('cabin', await group('cabin', 'Personnages de quête', 1), 'atom', true);
  await placeUnique('cabin', await group('cabin', 'Ennemis', 2), 'drake', false);

  await placeGeneric('brig', await group('brig', 'Ennemis', 1), 'pirate', 2, 'ACTIVE', true);

  const chest = async (
    scene: string,
    name: string,
    isLocked: boolean,
    isRevealed: boolean,
    content: Stack[],
  ) =>
    (
      await db.chest.create({
        data: {
          sceneId: sceneId(scene),
          name,
          isLocked,
          isRevealed,
          chestItems: {
            create: content.map((stack) => ({
              itemId: itemId(l, stack.item),
              quantity: stack.quantity,
            })),
          },
        },
      })
    ).id;

  await chest('deck', 'Coffre commun', false, true, [
    { item: 'Pièces d’or', quantity: 100 },
    { item: 'Épée à une main', quantity: 1 },
    { item: 'Casque de cuir', quantity: 1 },
    { item: 'Potion de mana faible', quantity: 1 },
    { item: 'Potion de soin faible', quantity: 1 },
  ]);
  await chest('passengers', 'Coffre rare', true, false, [
    { item: 'Pièces d’or', quantity: 500 },
    { item: 'Épée double', quantity: 1 },
    { item: 'Cotte de mailles', quantity: 1 },
    { item: 'Potion de mana commune', quantity: 1 },
  ]);
  const legendaryChest = await chest('cabin', 'Coffre légendaire', true, false, [
    { item: 'Pièces d’or', quantity: 1500 },
    { item: 'Épée divine', quantity: 1 },
    { item: 'Potion de soin supérieure', quantity: 10 },
    { item: 'Potion de mana supérieure', quantity: 10 },
    { item: 'Cape d’invisibilité', quantity: 1 },
  ]);

  await db.trap.create({
    data: {
      sceneId: sceneId('cabin'),
      name: 'Piques empoisonnées',
      description:
        'Des piques enduites de poison jaillissent du sol devant le coffre légendaire qu’elles protègent.',
      trapEffects: {
        create: [
          { effectId: effectId(l, 'Piques') },
          { effectId: effectId(l, 'Poison des piques') },
        ],
      },
    },
  });
  await db.trap.create({
    data: {
      sceneId: sceneId('brig'),
      name: 'Planche vermoulue',
      description:
        'Une planche pourrie cède sous le poids d’un visiteur et le précipite au fond de la cale.',
      trapEffects: { create: [{ effectId: effectId(l, 'Chute dans la cale') }] },
    },
  });

  await db.riddle.create({
    data: {
      sceneId: sceneId('cabin'),
      title: 'Le verrou des vents',
      statement:
        'Je pousse les voiles sans qu’on me voie, je chante dans les cordages sans avoir de voix. Dis mon nom et la porte s’ouvrira.',
      solution: 'Le vent',
    },
  });
  const crumpledNote = await db.riddle.create({
    data: {
      sceneId: sceneId('passengers'),
      title: 'Le billet froissé',
      statement: 'Quand l’Éther se taira trois fois, le Néant montera à bord.',
      solution:
        'Les pirates attaqueront au troisième coup de cloche : la cloche du navire est leur signal.',
    },
  });
  await db.riddle.create({
    data: {
      sceneId: sceneId('brig'),
      title: 'La cellule muette',
      statement: 'Plus on en fait, plus on en laisse derrière soi.',
      solution: 'Des pas : un prisonnier révèle alors un passage vers la cale.',
    },
  });

  await db.quest.create({
    data: {
      campaignId: campaign.id,
      relatedCharacterId: characterId('atom'),
      title: 'L’embarquement',
      description:
        'À bord du Vent d’Éther, nos héros débutent leur voyage à travers les îles flottantes. Ils devront s’équiper, recueillir des informations sur de mystérieux pirates et prêter main-forte à l’équipage lorsque des monstres volants attaquent le navire. En gagnant la confiance du capitaine et en se faisant remarquer par leurs actions, ils espèrent se rapprocher de la vérité.',
      type: 'MAIN',
      status: 'ACTIVE',
      isRevealed: true,
      position: 1,
      rewardXp: 150,
      rewardText: 'Passage vers l’archipel',
      questRewardItems: { create: { itemId: itemId(l, 'Anneau du néant'), quantity: 1 } },
      objectives: {
        create: [
          {
            chapterId: chapter.id,
            position: 1,
            label: 'Monter à bord du navire',
            narration:
              'Le Vent d’Éther largue les amarres : les héros prennent pied sur le pont au milieu de la foule.',
            targetSceneId: sceneId('deck'),
          },
          {
            chapterId: chapter.id,
            position: 2,
            label: 'Faire le tour des marchands pour s’équiper',
            narration:
              'Marcel, Hiral et Nyssa proposent armes, armures et potions pour la traversée.',
          },
          {
            chapterId: chapter.id,
            position: 3,
            label: 'Rencontrer le capitaine Atom et gagner sa confiance',
            narration:
              'Le capitaine se méfie des inconnus ; il faudra lui prouver que les héros tiennent parole.',
            targetCharacterId: characterId('atom'),
          },
          {
            chapterId: chapter.id,
            position: 4,
            label: 'Enquêter sur les pirates',
            narration:
              'Un billet froissé, oublié dans une cabine, laisse entrevoir le plan des pirates.',
            targetRiddleId: crumpledNote.id,
          },
          {
            chapterId: chapter.id,
            position: 5,
            label: 'Trouver l’origine du sabotage',
            narration:
              'Un cordage tranché porte une marque étrange : quelqu’un à bord travaille pour le Néant.',
            targetCharacterId: characterId('vask'),
          },
          {
            chapterId: chapter.id,
            position: 6,
            label: 'Protéger le navire de l’attaque des Arrawaks et sécuriser son départ',
            narration: 'Au troisième coup de cloche, une nuée d’arrawaks fond sur le navire.',
            targetCharacterId: characterId('arrawak'),
          },
        ],
      },
    },
  });

  await db.quest.create({
    data: {
      campaignId: campaign.id,
      chapterId: chapter.id,
      sceneId: sceneId('deck'),
      relatedCharacterId: characterId('marcel'),
      title: 'Un trésor bien gardé',
      description:
        'Marcel, un marchand aussi curieux qu’opportuniste, est persuadé que le légendaire coffre caché dans la cabine du capitaine du Vent d’Éther renferme un trésor d’une valeur inestimable. Incapable d’agir lui-même sans attirer l’attention, il vous propose un marché : récupérer son contenu en toute discrétion en échange d’une généreuse récompense.',
      type: 'SIDE',
      status: 'INACTIVE',
      isRevealed: false,
      position: 2,
      rewardXp: 75,
      rewardGold: 30,
      objectives: {
        create: [
          {
            position: 1,
            label: 'Obtenir la clé de la cabine du capitaine',
            narration: 'La clé ne quitte jamais la ceinture d’un des gardes du pont.',
            targetItemId: itemId(l, 'Clé de la cabine du capitaine'),
          },
          {
            position: 2,
            label: 'Ouvrir le coffre légendaire sans alerter les gardes',
            narration:
              'Le coffre est protégé par un piège : la moindre maladresse réveillera tout le navire.',
            targetChestId: legendaryChest,
          },
          {
            position: 3,
            label: 'Rapporter le butin à Marcel',
            narration: 'Marcel attend les héros à son échoppe, les yeux brillants.',
            targetCharacterId: characterId('marcel'),
          },
        ],
      },
    },
  });

  return { gmId: gm.id, campaignId: campaign.id };
}
