import type {
  ActionType,
  Alignment,
  Attitude,
  ChapterStatus,
  CharacterType,
  CreatureStatus,
  ItemType,
  Prisma,
  QuestStatus,
  QuestType,
} from '@prisma/client';
import { demoImage } from './images.js';
import type { ReferenceData } from './reference.js';

export type Db = Prisma.TransactionClient;

export interface Lookup {
  ref: ReferenceData;
  abilities: Map<string, string>;
  effects: Map<string, string>;
  items: Map<string, string>;
}

export function pick(name: string, ...maps: Map<string, string>[]): string {
  for (const map of maps) {
    const id = map.get(name);
    if (id) {
      return id;
    }
  }
  throw new Error(`Donnée introuvable : ${name}`);
}

export const itemId = (l: Lookup, name: string) => pick(name, l.items, l.ref.items);
export const effectId = (l: Lookup, name: string) => pick(name, l.effects, l.ref.effects);
export const abilityId = (l: Lookup, name: string) => pick(name, l.abilities, l.ref.abilities);

export interface EffectSpec {
  name: string;
  diceCount?: number;
  diceSides?: number;
  bonus?: number;
  damageType?: string;
  repeatCount?: number;
  description?: string;
}

export interface AbilitySpec {
  name: string;
  description: string;
  actionType: ActionType;
  effect: string;
}

export interface ItemSpec {
  name: string;
  type: ItemType;
  price: number;
  description: string;
  armorValue?: number;
  effects?: string[];
  image?: string;
}

export interface LibrarySpec {
  effects?: EffectSpec[];
  abilities?: AbilitySpec[];
  items?: ItemSpec[];
}

export async function createLibrary(db: Db, l: Lookup, ownerId: string, library: LibrarySpec) {
  for (const spec of library.effects ?? []) {
    const effect = await db.effect.create({
      data: {
        ownerId,
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

  for (const spec of library.abilities ?? []) {
    const ability = await db.ability.create({
      data: {
        ownerId,
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

  for (const spec of library.items ?? []) {
    const item = await db.item.create({
      data: {
        ownerId,
        isPublic: true,
        name: spec.name,
        description: spec.description,
        imageUrl: demoImage(spec.image),
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
}

export interface Stats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Stack {
  item: string;
  quantity: number;
}

export interface CharacterSpec {
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
  image?: string;
}

export async function createCharacter(db: Db, l: Lookup, campaignId: string, spec: CharacterSpec) {
  const raceId = spec.race ? pick(spec.race, l.ref.races) : null;
  const classId = spec.class ? pick(spec.class, l.ref.classes) : null;
  const backgroundId = spec.background ? pick(spec.background, l.ref.backgrounds) : null;

  const character = await db.character.create({
    data: {
      campaignId,
      type: spec.type,
      name: spec.name,
      imageUrl: demoImage(spec.image),
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

export interface CreatureSpec {
  key: string;
  count?: number;
  isRevealed?: boolean;
  status?: CreatureStatus;
  loot?: Stack[];
}

export interface GroupSpec {
  name: string;
  creatures: CreatureSpec[];
}

export interface ChestSpec {
  key?: string;
  name: string;
  isLocked: boolean;
  isRevealed: boolean;
  content: Stack[];
}

export interface TrapSpec {
  key?: string;
  name: string;
  description: string;
  effects: string[];
}

export interface RiddleSpec {
  key?: string;
  title: string;
  statement: string;
  solution: string;
}

export interface SceneSpec {
  key: string;
  title: string;
  narration: string[];
  image?: string;
  isPlayed?: boolean;
  groups?: GroupSpec[];
  chests?: ChestSpec[];
  traps?: TrapSpec[];
  riddles?: RiddleSpec[];
}

export interface ChapterSpec {
  position: number;
  title: string;
  status: ChapterStatus;
  narration: string[];
  image?: string;
  gmNotes?: string[];
  sessions?: string[];
  currentScene?: string;
  scenes: SceneSpec[];
}

export interface TargetSpec {
  character?: string;
  scene?: string;
  riddle?: string;
  chest?: string;
  item?: string;
  trap?: string;
}

export interface ObjectiveSpec {
  label: string;
  narration?: string;
  chapter?: number;
  target?: TargetSpec;
  isCompleted?: boolean;
}

export interface QuestSpec {
  title: string;
  description: string;
  type: QuestType;
  status: QuestStatus;
  isRevealed: boolean;
  chapter?: number;
  scene?: string;
  relatedCharacter?: string;
  rewardXp: number;
  rewardGold?: number;
  rewardText?: string;
  rewardItems?: Stack[];
  objectives: ObjectiveSpec[];
}

export interface CampaignSpec {
  code: string;
  title: string;
  description: string;
  image?: string;
  createdAt: string;
  library?: LibrarySpec;
  characters: CharacterSpec[];
  chapters: ChapterSpec[];
  quests: QuestSpec[];
}

interface PlayedChapter {
  id: string;
  status: ChapterStatus;
  lastSessionEnd: Date | null;
}

export interface CampaignContext {
  campaignId: string;
  code: string;
  sessionCount: number;
  characterSpecs: Map<string, CharacterSpec>;
  characters: Map<string, string>;
  scenes: Map<string, string>;
  chests: Map<string, string>;
  riddles: Map<string, string>;
  traps: Map<string, string>;
  chapters: Map<number, PlayedChapter>;
}

export const newContext = (campaignId: string, code: string): CampaignContext => ({
  campaignId,
  code,
  sessionCount: 0,
  characterSpecs: new Map(),
  characters: new Map(),
  scenes: new Map(),
  chests: new Map(),
  riddles: new Map(),
  traps: new Map(),
  chapters: new Map(),
});

const sessionStart = (date: string) => new Date(`${date}T18:30:00.000Z`);
const sessionEnd = (date: string) => new Date(`${date}T22:00:00.000Z`);

export async function addCharacters(
  db: Db,
  l: Lookup,
  ctx: CampaignContext,
  specs: CharacterSpec[],
) {
  for (const spec of specs) {
    ctx.characterSpecs.set(spec.key, spec);
    ctx.characters.set(spec.key, await createCharacter(db, l, ctx.campaignId, spec));
  }
}

export async function addSessions(
  db: Db,
  ctx: CampaignContext,
  chapter: { id: string; position: number; status: ChapterStatus },
  dates: string[],
) {
  for (const date of dates) {
    ctx.sessionCount += 1;
    await db.game.create({
      data: {
        chapterId: chapter.id,
        code: `${ctx.code}-${String(ctx.sessionCount).padStart(3, '0')}`,
        status: 'ENDED',
        startedAt: sessionStart(date),
        endedAt: sessionEnd(date),
      },
    });
  }
  const last = dates.at(-1);
  ctx.chapters.set(chapter.position, {
    id: chapter.id,
    status: chapter.status,
    lastSessionEnd: last ? sessionEnd(last) : null,
  });
}

async function addScene(
  db: Db,
  l: Lookup,
  ctx: CampaignContext,
  chapterId: string,
  position: number,
  spec: SceneSpec,
  playedAt: Date | null,
) {
  const scene = await db.scene.create({
    data: {
      chapterId,
      title: spec.title,
      position,
      narration: spec.narration.join('\n\n'),
      imageUrl: demoImage(spec.image),
      mapUrl: demoImage('carte'),
      playedAt,
    },
  });
  ctx.scenes.set(spec.key, scene.id);

  for (const [index, group] of (spec.groups ?? []).entries()) {
    const groupId = (
      await db.sceneGroup.create({
        data: { sceneId: scene.id, name: group.name, position: index + 1 },
      })
    ).id;

    for (const creature of group.creatures) {
      const sheet = ctx.characterSpecs.get(creature.key);
      if (!sheet) {
        throw new Error(`Fiche introuvable : ${creature.key}`);
      }
      const characterId = pick(creature.key, ctx.characters);
      const isRevealed = creature.isRevealed ?? true;

      if (sheet.isUnique) {
        await db.sceneCreature.create({
          data: { sceneId: scene.id, groupId, characterId, isRevealed },
        });
        continue;
      }

      for (let n = 1; n <= (creature.count ?? 1); n++) {
        const sceneCreature = await db.sceneCreature.create({
          data: {
            sceneId: scene.id,
            groupId,
            characterId,
            displayName: `${sheet.name} ${n}`,
            currentHp: sheet.maxHp,
            attitude: sheet.attitude ?? null,
            status: creature.status ?? 'ACTIVE',
            isRevealed,
          },
        });
        if (creature.loot && n === 1) {
          await db.sceneCreatureItem.createMany({
            data: creature.loot.map((stack) => ({
              sceneCreatureId: sceneCreature.id,
              itemId: itemId(l, stack.item),
              quantity: stack.quantity,
            })),
          });
        }
      }
    }
  }

  for (const chestSpec of spec.chests ?? []) {
    const chest = await db.chest.create({
      data: {
        sceneId: scene.id,
        name: chestSpec.name,
        isLocked: chestSpec.isLocked,
        isRevealed: chestSpec.isRevealed,
        chestItems: {
          create: chestSpec.content.map((stack) => ({
            itemId: itemId(l, stack.item),
            quantity: stack.quantity,
          })),
        },
      },
    });
    if (chestSpec.key) {
      ctx.chests.set(chestSpec.key, chest.id);
    }
  }

  for (const trapSpec of spec.traps ?? []) {
    const trap = await db.trap.create({
      data: {
        sceneId: scene.id,
        name: trapSpec.name,
        description: trapSpec.description,
        isTriggered: playedAt !== null,
        isRevealed: playedAt !== null,
        trapEffects: { create: trapSpec.effects.map((name) => ({ effectId: effectId(l, name) })) },
      },
    });
    if (trapSpec.key) {
      ctx.traps.set(trapSpec.key, trap.id);
    }
  }

  for (const riddleSpec of spec.riddles ?? []) {
    const riddle = await db.riddle.create({
      data: {
        sceneId: scene.id,
        title: riddleSpec.title,
        statement: riddleSpec.statement,
        solution: riddleSpec.solution,
        isRevealed: playedAt !== null,
      },
    });
    if (riddleSpec.key) {
      ctx.riddles.set(riddleSpec.key, riddle.id);
    }
  }

  return scene.id;
}

export async function addChapters(
  db: Db,
  l: Lookup,
  ctx: CampaignContext,
  chapters: ChapterSpec[],
) {
  for (const spec of chapters) {
    const chapter = await db.chapter.create({
      data: {
        campaignId: ctx.campaignId,
        title: spec.title,
        position: spec.position,
        status: spec.status,
        imageUrl: demoImage(spec.image),
        mapUrl: demoImage('carte'),
        narration: spec.narration.join('\n\n'),
        gmNotes: { create: (spec.gmNotes ?? []).map((content) => ({ content })) },
      },
    });

    const firstSession = spec.sessions?.[0];
    const playedAt = firstSession ? sessionStart(firstSession) : null;
    for (const [index, scene] of spec.scenes.entries()) {
      const isPlayed = scene.isPlayed ?? spec.status === 'COMPLETED';
      await addScene(db, l, ctx, chapter.id, index + 1, scene, isPlayed ? playedAt : null);
    }

    if (spec.currentScene) {
      await db.chapter.update({
        where: { id: chapter.id },
        data: { currentSceneId: pick(spec.currentScene, ctx.scenes) },
      });
    }

    await addSessions(
      db,
      ctx,
      { id: chapter.id, position: spec.position, status: spec.status },
      spec.sessions ?? [],
    );
  }
}

const toTarget = (l: Lookup, ctx: CampaignContext, target: TargetSpec = {}) => ({
  targetCharacterId: target.character ? pick(target.character, ctx.characters) : null,
  targetSceneId: target.scene ? pick(target.scene, ctx.scenes) : null,
  targetRiddleId: target.riddle ? pick(target.riddle, ctx.riddles) : null,
  targetChestId: target.chest ? pick(target.chest, ctx.chests) : null,
  targetItemId: target.item ? itemId(l, target.item) : null,
  targetTrapId: target.trap ? pick(target.trap, ctx.traps) : null,
});

const chapterOf = (ctx: CampaignContext, position: number) => {
  const chapter = ctx.chapters.get(position);
  if (!chapter) {
    throw new Error(`Chapitre introuvable : ${position}`);
  }
  return chapter;
};

export function toObjectives(
  l: Lookup,
  ctx: CampaignContext,
  objectives: ObjectiveSpec[],
  questChapter?: number,
  firstPosition = 1,
) {
  return objectives.map((spec, index) => {
    const chapter = chapterOf(ctx, spec.chapter ?? questChapter ?? 0);
    const isCompleted = spec.isCompleted ?? chapter.status === 'COMPLETED';
    return {
      chapterId: spec.chapter ? chapter.id : null,
      position: firstPosition + index,
      label: spec.label,
      narration: spec.narration ?? null,
      ...toTarget(l, ctx, spec.target),
      isCompleted,
      completedAt: isCompleted ? chapter.lastSessionEnd : null,
    };
  });
}

export async function addQuests(
  db: Db,
  l: Lookup,
  ctx: CampaignContext,
  quests: QuestSpec[],
  firstPosition = 1,
) {
  for (const [index, spec] of quests.entries()) {
    await db.quest.create({
      data: {
        campaignId: ctx.campaignId,
        chapterId: spec.chapter ? chapterOf(ctx, spec.chapter).id : null,
        sceneId: spec.scene ? pick(spec.scene, ctx.scenes) : null,
        relatedCharacterId: spec.relatedCharacter
          ? pick(spec.relatedCharacter, ctx.characters)
          : null,
        title: spec.title,
        description: spec.description,
        type: spec.type,
        status: spec.status,
        isRevealed: spec.isRevealed,
        position: firstPosition + index,
        rewardXp: spec.rewardXp,
        rewardGold: spec.rewardGold ?? 0,
        rewardText: spec.rewardText ?? null,
        questRewardItems: {
          create: (spec.rewardItems ?? []).map((stack) => ({
            itemId: itemId(l, stack.item),
            quantity: stack.quantity,
          })),
        },
        objectives: { create: toObjectives(l, ctx, spec.objectives, spec.chapter) },
      },
    });
  }
}

export async function createCampaign(db: Db, l: Lookup, gmId: string, spec: CampaignSpec) {
  await createLibrary(db, l, gmId, spec.library ?? {});

  const campaign = await db.campaign.create({
    data: {
      gmId,
      title: spec.title,
      description: spec.description,
      imageUrl: spec.image ? demoImage(spec.image) : null,
      createdAt: new Date(spec.createdAt),
    },
  });

  const ctx = newContext(campaign.id, spec.code);
  await addCharacters(db, l, ctx, spec.characters);
  await addChapters(db, l, ctx, spec.chapters);
  await addQuests(db, l, ctx, spec.quests);
  return ctx;
}
