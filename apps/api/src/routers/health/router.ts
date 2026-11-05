import express from 'express';

import { read } from '../../controllers/healthActions.js';

const router = express.Router();

router.get('/', read);

export default router;
