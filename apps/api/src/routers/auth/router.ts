import { loginSchema, registerSchema } from '@arcane-chronicles/shared';
import express from 'express';

import { login, logout, me, register } from '../../controllers/authActions.js';
import { loginLimiter } from '../../middlewares/limiters/loginLimiter.js';
import { registerLimiter } from '../../middlewares/limiters/registerLimiter.js';
import { validate } from '../../middlewares/validation/validate.js';
import { checkCookie } from '../../services/security/cookies.js';

const router = express.Router();

router.post('/register', registerLimiter, validate(registerSchema), register);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', checkCookie, me);

export default router;
