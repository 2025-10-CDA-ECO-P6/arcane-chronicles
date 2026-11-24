import { campaignIdParamsSchema, campaignListQuerySchema } from '@arcane-chronicles/shared';
import express from 'express';

import { browse, read } from '../../controllers/campaignActions.js';
import { validate } from '../../middlewares/validation/validate.js';
import { checkCookie, optionalAuth } from '../../services/security/cookies.js';

const router = express.Router();

router.get('/', optionalAuth, validate(campaignListQuerySchema, 'query'), browse);
router.get('/:id', checkCookie, validate(campaignIdParamsSchema, 'params'), read);

export default router;
