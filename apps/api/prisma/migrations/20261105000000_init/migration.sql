-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "chapter_status" AS ENUM ('NEW', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "character_type" AS ENUM ('HERO', 'NPC', 'MONSTER');

-- CreateEnum
CREATE TYPE "alignment" AS ENUM ('LAWFUL_GOOD', 'NEUTRAL_GOOD', 'CHAOTIC_GOOD', 'LAWFUL_NEUTRAL', 'TRUE_NEUTRAL', 'CHAOTIC_NEUTRAL', 'LAWFUL_EVIL', 'NEUTRAL_EVIL', 'CHAOTIC_EVIL');

-- CreateEnum
CREATE TYPE "attitude" AS ENUM ('FRIENDLY', 'NEUTRAL', 'HOSTILE');

-- CreateEnum
CREATE TYPE "creature_status" AS ENUM ('ACTIVE', 'WAITING');

-- CreateEnum
CREATE TYPE "ability_score" AS ENUM ('STRENGTH', 'DEXTERITY', 'CONSTITUTION', 'INTELLIGENCE', 'WISDOM', 'CHARISMA');

-- CreateEnum
CREATE TYPE "ability_source" AS ENUM ('CLASS', 'RACE', 'BACKGROUND', 'LEARNED', 'ITEM');

-- CreateEnum
CREATE TYPE "action_type" AS ENUM ('ACTION', 'BONUS_ACTION', 'REACTION', 'PASSIVE');

-- CreateEnum
CREATE TYPE "item_type" AS ENUM ('WEAPON', 'ARMOR', 'CONSUMABLE', 'TOOL', 'ARTIFACT', 'MISC');

-- CreateEnum
CREATE TYPE "quest_type" AS ENUM ('MAIN', 'SIDE');

-- CreateEnum
CREATE TYPE "quest_status" AS ENUM ('INACTIVE', 'ACTIVE', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "game_status" AS ENUM ('LOBBY', 'IN_PROGRESS', 'ENDED');

-- CreateEnum
CREATE TYPE "participant_status" AS ENUM ('CONNECTED', 'READY', 'DISCONNECTED');

-- CreateEnum
CREATE TYPE "combat_status" AS ENUM ('IN_PROGRESS', 'ENDED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "display_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" UUID NOT NULL,
    "gm_id" UUID NOT NULL,
    "source_campaign_id" UUID,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapters" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "narration" TEXT,
    "image_url" TEXT,
    "map_url" TEXT,
    "status" "chapter_status" NOT NULL DEFAULT 'NEW',
    "current_scene_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenes" (
    "id" UUID NOT NULL,
    "chapter_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "narration" TEXT,
    "image_url" TEXT,
    "map_url" TEXT,
    "played_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gm_notes" (
    "id" UUID NOT NULL,
    "chapter_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gm_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "races" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,

    CONSTRAINT "races_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "hit_die" TEXT NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "race_abilities" (
    "race_id" UUID NOT NULL,
    "ability_id" UUID NOT NULL,

    CONSTRAINT "race_abilities_pkey" PRIMARY KEY ("race_id","ability_id")
);

-- CreateTable
CREATE TABLE "class_abilities" (
    "class_id" UUID NOT NULL,
    "ability_id" UUID NOT NULL,
    "required_level" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "class_abilities_pkey" PRIMARY KEY ("class_id","ability_id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "ability" "ability_score" NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "race_skills" (
    "race_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,

    CONSTRAINT "race_skills_pkey" PRIMARY KEY ("race_id","skill_id")
);

-- CreateTable
CREATE TABLE "class_skills" (
    "class_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,

    CONSTRAINT "class_skills_pkey" PRIMARY KEY ("class_id","skill_id")
);

-- CreateTable
CREATE TABLE "backgrounds" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,

    CONSTRAINT "backgrounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "background_abilities" (
    "background_id" UUID NOT NULL,
    "ability_id" UUID NOT NULL,

    CONSTRAINT "background_abilities_pkey" PRIMARY KEY ("background_id","ability_id")
);

-- CreateTable
CREATE TABLE "background_skills" (
    "background_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,

    CONSTRAINT "background_skills_pkey" PRIMARY KEY ("background_id","skill_id")
);

-- CreateTable
CREATE TABLE "characters" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "source_id" UUID,
    "type" "character_type" NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "race_id" UUID,
    "class_id" UUID,
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "is_unique" BOOLEAN NOT NULL DEFAULT false,
    "alignment" "alignment",
    "background_id" UUID,
    "occupation" TEXT,
    "strength" INTEGER NOT NULL DEFAULT 10,
    "dexterity" INTEGER NOT NULL DEFAULT 10,
    "constitution" INTEGER NOT NULL DEFAULT 10,
    "intelligence" INTEGER NOT NULL DEFAULT 10,
    "wisdom" INTEGER NOT NULL DEFAULT 10,
    "charisma" INTEGER NOT NULL DEFAULT 10,
    "worn_armor_id" UUID,
    "max_hp" INTEGER NOT NULL,
    "current_hp" INTEGER NOT NULL,
    "attitude" "attitude",
    "status" "creature_status" NOT NULL DEFAULT 'ACTIVE',
    "gold" INTEGER NOT NULL DEFAULT 0,
    "is_boss" BOOLEAN NOT NULL DEFAULT false,
    "biography" TEXT,
    "personality" TEXT,
    "personal_quest" TEXT,
    "secrets" TEXT,
    "gm_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "abilities" (
    "id" UUID NOT NULL,
    "owner_id" UUID,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "source" "ability_source" NOT NULL,
    "action_type" "action_type" NOT NULL,
    "is_spell" BOOLEAN NOT NULL DEFAULT false,
    "spell_level" INTEGER,
    "max_uses" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "abilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_abilities" (
    "id" UUID NOT NULL,
    "character_id" UUID NOT NULL,
    "ability_id" UUID NOT NULL,
    "uses_remaining" INTEGER,

    CONSTRAINT "character_abilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "effects" (
    "id" UUID NOT NULL,
    "owner_id" UUID,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "dice_count" INTEGER,
    "dice_sides" INTEGER,
    "bonus" INTEGER,
    "damage_type" TEXT,
    "repeat_count" INTEGER,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "effects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ability_effects" (
    "ability_id" UUID NOT NULL,
    "effect_id" UUID NOT NULL,

    CONSTRAINT "ability_effects_pkey" PRIMARY KEY ("ability_id","effect_id")
);

-- CreateTable
CREATE TABLE "item_effects" (
    "item_id" UUID NOT NULL,
    "effect_id" UUID NOT NULL,

    CONSTRAINT "item_effects_pkey" PRIMARY KEY ("item_id","effect_id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" UUID NOT NULL,
    "owner_id" UUID,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "source_id" UUID,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "type" "item_type" NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "armor_value" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_items" (
    "id" UUID NOT NULL,
    "character_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "for_sale" BOOLEAN NOT NULL DEFAULT false,
    "unit_price" INTEGER,

    CONSTRAINT "character_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scene_groups" (
    "id" UUID NOT NULL,
    "scene_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "scene_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scene_creatures" (
    "id" UUID NOT NULL,
    "scene_id" UUID NOT NULL,
    "character_id" UUID NOT NULL,
    "group_id" UUID,
    "display_name" TEXT,
    "current_hp" INTEGER,
    "attitude" "attitude",
    "status" "creature_status",
    "is_revealed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scene_creatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scene_creature_items" (
    "id" UUID NOT NULL,
    "scene_creature_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "for_sale" BOOLEAN NOT NULL DEFAULT false,
    "unit_price" INTEGER,

    CONSTRAINT "scene_creature_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quests" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "chapter_id" UUID,
    "scene_id" UUID,
    "related_character_id" UUID,
    "source_id" UUID,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "quest_type" NOT NULL,
    "status" "quest_status" NOT NULL DEFAULT 'INACTIVE',
    "is_revealed" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL,
    "reward_xp" INTEGER NOT NULL DEFAULT 0,
    "reward_gold" INTEGER NOT NULL DEFAULT 0,
    "reward_text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "objectives" (
    "id" UUID NOT NULL,
    "quest_id" UUID NOT NULL,
    "chapter_id" UUID,
    "label" TEXT NOT NULL,
    "narration" TEXT,
    "position" INTEGER NOT NULL,
    "target_character_id" UUID,
    "target_riddle_id" UUID,
    "target_chest_id" UUID,
    "target_item_id" UUID,
    "target_trap_id" UUID,
    "target_scene_id" UUID,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "objectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quest_reward_items" (
    "id" UUID NOT NULL,
    "quest_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "quest_reward_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" UUID NOT NULL,
    "chapter_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "status" "game_status" NOT NULL DEFAULT 'LOBBY',
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "nickname" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "character_id" UUID,
    "status" "participant_status" NOT NULL DEFAULT 'CONNECTED',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combats" (
    "id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "scene_id" UUID NOT NULL,
    "status" "combat_status" NOT NULL DEFAULT 'IN_PROGRESS',
    "active_combatant_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "combats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combatants" (
    "id" UUID NOT NULL,
    "combat_id" UUID NOT NULL,
    "character_id" UUID,
    "scene_creature_id" UUID,
    "initiative" INTEGER,

    CONSTRAINT "combatants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chests" (
    "id" UUID NOT NULL,
    "scene_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "is_locked" BOOLEAN NOT NULL DEFAULT false,
    "is_revealed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chest_items" (
    "id" UUID NOT NULL,
    "chest_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "chest_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riddles" (
    "id" UUID NOT NULL,
    "scene_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "statement" TEXT,
    "solution" TEXT,
    "is_revealed" BOOLEAN NOT NULL DEFAULT false,
    "is_solved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "riddles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traps" (
    "id" UUID NOT NULL,
    "scene_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_revealed" BOOLEAN NOT NULL DEFAULT false,
    "is_triggered" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "traps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trap_effects" (
    "trap_id" UUID NOT NULL,
    "effect_id" UUID NOT NULL,

    CONSTRAINT "trap_effects_pkey" PRIMARY KEY ("trap_id","effect_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "chapters_campaign_id_position_key" ON "chapters"("campaign_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "scenes_chapter_id_position_key" ON "scenes"("chapter_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "races_name_key" ON "races"("name");

-- CreateIndex
CREATE UNIQUE INDEX "classes_name_key" ON "classes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- CreateIndex
CREATE UNIQUE INDEX "backgrounds_name_key" ON "backgrounds"("name");

-- CreateIndex
CREATE UNIQUE INDEX "character_abilities_character_id_ability_id_key" ON "character_abilities"("character_id", "ability_id");

-- CreateIndex
CREATE UNIQUE INDEX "character_items_character_id_item_id_for_sale_key" ON "character_items"("character_id", "item_id", "for_sale");

-- CreateIndex
CREATE UNIQUE INDEX "games_code_key" ON "games"("code");

-- CreateIndex
CREATE UNIQUE INDEX "participants_token_hash_key" ON "participants"("token_hash");

-- CreateIndex
CREATE UNIQUE INDEX "participants_game_id_nickname_key" ON "participants"("game_id", "nickname");

-- CreateIndex
CREATE UNIQUE INDEX "participants_game_id_character_id_key" ON "participants"("game_id", "character_id");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_gm_id_fkey" FOREIGN KEY ("gm_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_source_campaign_id_fkey" FOREIGN KEY ("source_campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_current_scene_id_fkey" FOREIGN KEY ("current_scene_id") REFERENCES "scenes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenes" ADD CONSTRAINT "scenes_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gm_notes" ADD CONSTRAINT "gm_notes_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_abilities" ADD CONSTRAINT "race_abilities_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "races"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_abilities" ADD CONSTRAINT "race_abilities_ability_id_fkey" FOREIGN KEY ("ability_id") REFERENCES "abilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_abilities" ADD CONSTRAINT "class_abilities_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_abilities" ADD CONSTRAINT "class_abilities_ability_id_fkey" FOREIGN KEY ("ability_id") REFERENCES "abilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_skills" ADD CONSTRAINT "race_skills_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "races"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_skills" ADD CONSTRAINT "race_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_skills" ADD CONSTRAINT "class_skills_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_skills" ADD CONSTRAINT "class_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "background_abilities" ADD CONSTRAINT "background_abilities_background_id_fkey" FOREIGN KEY ("background_id") REFERENCES "backgrounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "background_abilities" ADD CONSTRAINT "background_abilities_ability_id_fkey" FOREIGN KEY ("ability_id") REFERENCES "abilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "background_skills" ADD CONSTRAINT "background_skills_background_id_fkey" FOREIGN KEY ("background_id") REFERENCES "backgrounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "background_skills" ADD CONSTRAINT "background_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "characters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "races"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_background_id_fkey" FOREIGN KEY ("background_id") REFERENCES "backgrounds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_worn_armor_id_fkey" FOREIGN KEY ("worn_armor_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abilities" ADD CONSTRAINT "abilities_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_abilities" ADD CONSTRAINT "character_abilities_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_abilities" ADD CONSTRAINT "character_abilities_ability_id_fkey" FOREIGN KEY ("ability_id") REFERENCES "abilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "effects" ADD CONSTRAINT "effects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ability_effects" ADD CONSTRAINT "ability_effects_ability_id_fkey" FOREIGN KEY ("ability_id") REFERENCES "abilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ability_effects" ADD CONSTRAINT "ability_effects_effect_id_fkey" FOREIGN KEY ("effect_id") REFERENCES "effects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_effects" ADD CONSTRAINT "item_effects_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_effects" ADD CONSTRAINT "item_effects_effect_id_fkey" FOREIGN KEY ("effect_id") REFERENCES "effects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_items" ADD CONSTRAINT "character_items_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_items" ADD CONSTRAINT "character_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scene_groups" ADD CONSTRAINT "scene_groups_scene_id_fkey" FOREIGN KEY ("scene_id") REFERENCES "scenes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scene_creatures" ADD CONSTRAINT "scene_creatures_scene_id_fkey" FOREIGN KEY ("scene_id") REFERENCES "scenes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scene_creatures" ADD CONSTRAINT "scene_creatures_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scene_creatures" ADD CONSTRAINT "scene_creatures_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "scene_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scene_creature_items" ADD CONSTRAINT "scene_creature_items_scene_creature_id_fkey" FOREIGN KEY ("scene_creature_id") REFERENCES "scene_creatures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scene_creature_items" ADD CONSTRAINT "scene_creature_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quests" ADD CONSTRAINT "quests_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quests" ADD CONSTRAINT "quests_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quests" ADD CONSTRAINT "quests_scene_id_fkey" FOREIGN KEY ("scene_id") REFERENCES "scenes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quests" ADD CONSTRAINT "quests_related_character_id_fkey" FOREIGN KEY ("related_character_id") REFERENCES "characters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quests" ADD CONSTRAINT "quests_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "quests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objectives" ADD CONSTRAINT "objectives_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "quests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objectives" ADD CONSTRAINT "objectives_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objectives" ADD CONSTRAINT "objectives_target_character_id_fkey" FOREIGN KEY ("target_character_id") REFERENCES "characters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objectives" ADD CONSTRAINT "objectives_target_riddle_id_fkey" FOREIGN KEY ("target_riddle_id") REFERENCES "riddles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objectives" ADD CONSTRAINT "objectives_target_chest_id_fkey" FOREIGN KEY ("target_chest_id") REFERENCES "chests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objectives" ADD CONSTRAINT "objectives_target_item_id_fkey" FOREIGN KEY ("target_item_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objectives" ADD CONSTRAINT "objectives_target_trap_id_fkey" FOREIGN KEY ("target_trap_id") REFERENCES "traps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objectives" ADD CONSTRAINT "objectives_target_scene_id_fkey" FOREIGN KEY ("target_scene_id") REFERENCES "scenes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quest_reward_items" ADD CONSTRAINT "quest_reward_items_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "quests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quest_reward_items" ADD CONSTRAINT "quest_reward_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combats" ADD CONSTRAINT "combats_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combats" ADD CONSTRAINT "combats_scene_id_fkey" FOREIGN KEY ("scene_id") REFERENCES "scenes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combats" ADD CONSTRAINT "combats_active_combatant_id_fkey" FOREIGN KEY ("active_combatant_id") REFERENCES "combatants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combatants" ADD CONSTRAINT "combatants_combat_id_fkey" FOREIGN KEY ("combat_id") REFERENCES "combats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combatants" ADD CONSTRAINT "combatants_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combatants" ADD CONSTRAINT "combatants_scene_creature_id_fkey" FOREIGN KEY ("scene_creature_id") REFERENCES "scene_creatures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chests" ADD CONSTRAINT "chests_scene_id_fkey" FOREIGN KEY ("scene_id") REFERENCES "scenes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chest_items" ADD CONSTRAINT "chest_items_chest_id_fkey" FOREIGN KEY ("chest_id") REFERENCES "chests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chest_items" ADD CONSTRAINT "chest_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riddles" ADD CONSTRAINT "riddles_scene_id_fkey" FOREIGN KEY ("scene_id") REFERENCES "scenes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traps" ADD CONSTRAINT "traps_scene_id_fkey" FOREIGN KEY ("scene_id") REFERENCES "scenes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trap_effects" ADD CONSTRAINT "trap_effects_trap_id_fkey" FOREIGN KEY ("trap_id") REFERENCES "traps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trap_effects" ADD CONSTRAINT "trap_effects_effect_id_fkey" FOREIGN KEY ("effect_id") REFERENCES "effects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddCheckConstraint
ALTER TABLE "quests" ADD CONSTRAINT "quests_main_has_no_chapter_check" CHECK (("type" = 'MAIN') = ("chapter_id" IS NULL));

-- CreatePartialUniqueIndex
CREATE UNIQUE INDEX "quests_one_main_per_campaign_key" ON "quests"("campaign_id") WHERE "type" = 'MAIN';

-- AddCheckConstraint
ALTER TABLE "objectives" ADD CONSTRAINT "objectives_at_most_one_target_check" CHECK (num_nonnulls("target_character_id", "target_riddle_id", "target_chest_id", "target_item_id", "target_trap_id", "target_scene_id") <= 1);

-- AddCheckConstraint
ALTER TABLE "combatants" ADD CONSTRAINT "combatants_exactly_one_source_check" CHECK (num_nonnulls("character_id", "scene_creature_id") = 1);
