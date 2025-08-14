import express from 'express';
import { 
  getAllUsers, 
  getMyProfile, 
  getUserById, 
  searchUsers 
} from '../controllers/userController.js';
import protect from '../middlewares/authMiddlewares.js';


const router = express.Router();

router.get('/me', protect, getMyProfile);

router.get('/search', protect, searchUsers);

router.get('/', protect, getAllUsers);

router.get('/:id', protect, getUserById);

export default router;


