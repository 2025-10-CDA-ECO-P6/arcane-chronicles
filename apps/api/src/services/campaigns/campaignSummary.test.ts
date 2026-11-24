import { describe, expect, it } from 'vitest';

import type { GmCampaignRow } from '../../models/campaignModel.js';
import { toCampaignSummary } from './campaignSummary.js';

type Chapter = GmCampaignRow['chapters'][number];

const objectives = (completed: number, total: number) =>
  Array.from({ length: total }, (_, index) => ({ isCompleted: index < completed }));

const chapter = (
  position: number,
  status: Chapter['status'],
  games: Chapter['games'] = [],
  chapterObjectives: Chapter['objectives'] = [],
) => ({
  position,
  title: `Chapitre ${position}`,
  status,
  games,
  objectives: chapterObjectives,
});

const game = (startedAt: string, endedAt: string | null = null) => ({
  startedAt: new Date(startedAt),
  endedAt: endedAt ? new Date(endedAt) : null,
});

const row = (overrides: Partial<GmCampaignRow> = {}): GmCampaignRow => ({
  id: 'campaign-1',
  title: 'L’archipel du néant',
  description: 'Une quête au cœur des îles flottantes.',
  imageUrl: null,
  createdAt: new Date('2026-04-08T10:00:00Z'),
  updatedAt: new Date('2026-04-10T10:00:00Z'),
  publishedAt: null,
  publishedVersion: null,
  chapters: [],
  quests: [],
  _count: { chapters: 0, quests: 0, characters: 0 },
  ...overrides,
});

describe('toCampaignSummary', () => {
  it('is NEW without chapters or while no chapter has been played', () => {
    expect(toCampaignSummary(row()).status).toBe('NEW');

    const summary = toCampaignSummary(row({ chapters: [chapter(1, 'NEW'), chapter(2, 'NEW')] }));
    expect(summary.status).toBe('NEW');
    expect(summary.currentChapter).toEqual({ position: 1, title: 'Chapitre 1', progress: 0 });
    expect(summary.lastSessionAt).toBeNull();
  });

  it('is IN_PROGRESS once a chapter has been played, on the chapter being played', () => {
    const summary = toCampaignSummary(
      row({
        chapters: [
          chapter(1, 'COMPLETED', [game('2026-05-01T18:00:00Z', '2026-05-01T22:00:00Z')]),
          chapter(2, 'IN_PROGRESS', [game('2026-05-08T18:00:00Z')], objectives(1, 4)),
          chapter(3, 'NEW'),
        ],
      }),
    );

    expect(summary.status).toBe('IN_PROGRESS');
    expect(summary.chapterStatuses).toEqual(['COMPLETED', 'IN_PROGRESS', 'NEW']);
    expect(summary.currentChapter).toEqual({ position: 2, title: 'Chapitre 2', progress: 25 });
    expect(summary.counts.sessions).toBe(2);
    expect(summary.lastSessionAt).toBe('2026-05-08T18:00:00.000Z');
    expect(summary.completedAt).toBeNull();
  });

  it('is COMPLETED when every chapter is, ended at the end of the last session', () => {
    const summary = toCampaignSummary(
      row({
        chapters: [
          chapter(1, 'COMPLETED', [game('2026-05-01T18:00:00Z', '2026-05-01T22:00:00Z')]),
          chapter(2, 'COMPLETED', [game('2026-08-10T18:00:00Z', '2026-08-10T23:00:00Z')]),
        ],
      }),
    );

    expect(summary.status).toBe('COMPLETED');
    expect(summary.currentChapter).toBeNull();
    expect(summary.completedAt).toBe('2026-08-10T23:00:00.000Z');
  });

  it('measures the progress with the completed objectives of every quest', () => {
    expect(toCampaignSummary(row()).progress).toBe(0);
    expect(
      toCampaignSummary(
        row({ quests: [{ objectives: objectives(1, 6) }, { objectives: objectives(0, 3) }] }),
      ).progress,
    ).toBe(11);
  });

  it('gives the chapter, quest and hero counts', () => {
    const summary = toCampaignSummary(row({ _count: { chapters: 8, quests: 12, characters: 3 } }));

    expect(summary.counts).toEqual({ chapters: 8, quests: 12, sessions: 0, heroes: 3 });
  });

  it('flags changes made after the last publication', () => {
    const published = { isPublic: true };
    const publishedAt = new Date('2026-04-09T10:00:00Z');

    expect(toCampaignSummary(row()).publication).toEqual({
      isPublished: false,
      hasUnpublishedChanges: false,
    });
    expect(
      toCampaignSummary(row({ publishedVersion: published, publishedAt })).publication,
    ).toEqual({ isPublished: true, hasUnpublishedChanges: true });
    expect(
      toCampaignSummary(
        row({ publishedVersion: published, publishedAt: new Date('2026-04-11T10:00:00Z') }),
      ).publication,
    ).toEqual({ isPublished: true, hasUnpublishedChanges: false });
  });
});
