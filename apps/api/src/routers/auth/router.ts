import { loginSchema } from '@arcane-chronicles/shared';
import express from 'express';

import { login, logout, me } from '../../controllers/authActions.js';
import { loginLimiter } from '../../middlewares/loginLimiter.js';
import { validate } from '../../middlewares/validate.js';
import { checkCookie } from '../../services/security/cookies.js';

const router = express.Router();

router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', checkCookie, me);

export default router;
