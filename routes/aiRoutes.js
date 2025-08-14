import express from 'express';
import { generateTasks } from '../controllers/AI/generateTasks.js';
import { estimateTime } from '../controllers/AI/estimateTime.js';
import { analyzeProjectProgress } from '../controllers/AI/analyzeProgress.js';
import { summarizeProjectController } from '../controllers/AI/summarizeProject.js';
import { recommendImprovementsController } from '../controllers/AI/recommendImprovements.js';

import protect from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/generate-tasks', protect, generateTasks);

router.post('/estimate-time', protect, estimateTime);

router.post('/analyze-progress', protect, analyzeProjectProgress);

router.post('/summarize-project', protect, summarizeProjectController);

router.post('/recommend-improvements', protect, recommendImprovementsController);

export default router;

