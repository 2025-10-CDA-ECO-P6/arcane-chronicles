import { z } from 'zod';

export const CAMPAIGN_SCOPES = ['public', 'mine'] as const;

export const campaignListQuerySchema = z.object({
  scope: z
    .enum(CAMPAIGN_SCOPES, { error: `Scope must be ${CAMPAIGN_SCOPES.join(' or ')}` })
    .default('public'),
});

export type CampaignScope = (typeof CAMPAIGN_SCOPES)[number];
export type CampaignListQuery = z.infer<typeof campaignListQuerySchema>;

export const CHAPTER_STATUSES = ['NEW', 'IN_PROGRESS', 'COMPLETED'] as const;
export const CAMPAIGN_STATUSES = ['NEW', 'IN_PROGRESS', 'COMPLETED'] as const;

export type ChapterStatus = (typeof CHAPTER_STATUSES)[number];
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export interface CampaignSummary {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  status: CampaignStatus;
  progress: number;
  chapterStatuses: ChapterStatus[];
  currentChapter: { position: number; title: string } | null;
  counts: { chapters: number; quests: number; sessions: number; heroes: number };
  lastSessionAt: string | null;
  completedAt: string | null;
  publication: { isPublished: boolean; hasUnpublishedChanges: boolean };
}
