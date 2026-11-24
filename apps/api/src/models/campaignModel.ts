import { db } from '../database/db.js';

export class CampaignModel {
  static getAllPublic() {
    return db.campaign.findMany({
      where: { isPublic: true },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        updatedAt: true,
        gm: { select: { displayName: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  static getOneByGm(id: string, gmId: string) {
    return db.campaign.findFirst({
      where: { id, gmId, publishedFromId: null },
      select: { id: true, title: true, imageUrl: true },
    });
  }

  static getAllByGm(gmId: string) {
    return db.campaign.findMany({
      where: { gmId, publishedFromId: null },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
        publishedVersion: { select: { isPublic: true } },
        chapters: {
          select: {
            position: true,
            title: true,
            status: true,
            games: {
              where: { startedAt: { not: null } },
              select: { startedAt: true, endedAt: true },
            },
            objectives: { select: { isCompleted: true } },
          },
          orderBy: { position: 'asc' },
        },
        quests: { select: { objectives: { select: { isCompleted: true } } } },
        _count: {
          select: { chapters: true, quests: true, characters: { where: { type: 'HERO' } } },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }
}

export type GmCampaignRow = Awaited<ReturnType<typeof CampaignModel.getAllByGm>>[number];
