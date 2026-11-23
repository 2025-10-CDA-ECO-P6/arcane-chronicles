import { campaignListQuerySchema } from '@arcane-chronicles/shared';
import express from 'express';

import { browse } from '../../controllers/campaignActions.js';
import { validate } from '../../middlewares/validation/validate.js';
import { optionalAuth } from '../../services/security/cookies.js';

const router = express.Router();

router.get('/', optionalAuth, validate(campaignListQuerySchema, 'query'), browse);

export default router;
