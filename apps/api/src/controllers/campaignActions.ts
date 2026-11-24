import type {
  CampaignDetail,
  CampaignIdParams,
  CampaignListQuery,
} from '@arcane-chronicles/shared';
import type { NextFunction, Request, Response } from 'express';

import { CampaignModel } from '../models/campaignModel.js';
import { toCampaignSummary } from '../services/campaigns/campaignSummary.js';

export const browse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { scope } = req.query as CampaignListQuery;

    if (scope === 'public') {
      res.json(await CampaignModel.getAllPublic());
      return;
    }

    if (!req.auth) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }
    const campaigns = await CampaignModel.getAllByGm(req.auth.id);
    res.json(campaigns.map(toCampaignSummary));
  } catch (err) {
    next(err);
  }
};

export const read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as CampaignIdParams;
    const campaign: CampaignDetail | null = await CampaignModel.getOneByGm(id, req.auth!.id);

    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }
    res.json(campaign);
  } catch (err) {
    next(err);
  }
};
