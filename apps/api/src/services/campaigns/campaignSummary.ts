import type { CampaignStatus, CampaignSummary, ChapterStatus } from '@arcane-chronicles/shared';

import type { GmCampaignRow } from '../../models/campaignModel.js';

const getStatus = (chapterStatuses: ChapterStatus[]): CampaignStatus => {
  if (chapterStatuses.length === 0 || chapterStatuses.every((status) => status === 'NEW')) {
    return 'NEW';
  }
  if (chapterStatuses.every((status) => status === 'COMPLETED')) {
    return 'COMPLETED';
  }
  return 'IN_PROGRESS';
};

const getProgress = (objectives: { isCompleted: boolean }[]) => {
  if (objectives.length === 0) {
    return 0;
  }
  const completed = objectives.filter((objective) => objective.isCompleted).length;
  return Math.round((completed / objectives.length) * 100);
};

const latest = (dates: (Date | null)[]) => {
  const times = dates.filter((date): date is Date => date !== null).map((date) => date.getTime());
  return times.length > 0 ? new Date(Math.max(...times)).toISOString() : null;
};

export function toCampaignSummary(campaign: GmCampaignRow): CampaignSummary {
  const { chapters } = campaign;
  const chapterStatuses = chapters.map((chapter) => chapter.status);
  const status = getStatus(chapterStatuses);
  const games = chapters.flatMap((chapter) => chapter.games);
  const currentChapter =
    chapters.find((chapter) => chapter.status === 'IN_PROGRESS') ??
    chapters.find((chapter) => chapter.status === 'NEW');
  const isPublished = campaign.publishedVersion?.isPublic ?? false;

  return {
    id: campaign.id,
    title: campaign.title,
    description: campaign.description,
    imageUrl: campaign.imageUrl,
    createdAt: campaign.createdAt.toISOString(),
    status,
    progress: getProgress(campaign.quests.flatMap((quest) => quest.objectives)),
    chapterStatuses,
    currentChapter:
      status === 'COMPLETED' || !currentChapter
        ? null
        : { position: currentChapter.position, title: currentChapter.title },
    counts: {
      chapters: campaign._count.chapters,
      quests: campaign._count.quests,
      sessions: games.length,
      heroes: campaign._count.characters,
    },
    lastSessionAt: latest(games.map((game) => game.startedAt)),
    completedAt: status === 'COMPLETED' ? latest(games.map((game) => game.endedAt)) : null,
    publication: {
      isPublished,
      hasUnpublishedChanges:
        isPublished && campaign.publishedAt !== null && campaign.updatedAt > campaign.publishedAt,
    },
  };
}
