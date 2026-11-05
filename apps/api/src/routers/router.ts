import express from 'express';

import healthRouter from './health/router.js';

const router = express.Router();

// Une route par ressource REST (architecture.md §3) : à brancher ici au fil
// du développement (auth, campagnes, chapitres, scènes, personnages,
// bibliothèque, parties...).

router.use('/health', healthRouter);

export default router;
