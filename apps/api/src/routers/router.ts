import express from 'express';

import healthRouter from './health/router.js';
import authRouter from './auth/router.js';
import campaignsRouter from './campaigns/router.js';

const router = express.Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/campaigns', campaignsRouter);

export default router;
