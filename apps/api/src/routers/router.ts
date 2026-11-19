import express from 'express';

import healthRouter from './health/router.js';
import authRouter from './auth/router.js';

const router = express.Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);

export default router;
