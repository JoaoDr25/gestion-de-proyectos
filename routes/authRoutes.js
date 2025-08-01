import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile
} from '../controllers/authController.js';

import protect from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:id', protect, getUserProfile);

export default router;