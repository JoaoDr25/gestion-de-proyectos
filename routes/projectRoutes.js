import express from 'express';
import protect from '../middlewares/authMiddlewares.js'
import { 
    createProject,
    getUserProjects,
    getProjectById,
    updateProject,
    deleteProject, 
    addMember
} from '../controllers/projectController.js'

const router = express.Router();

router.post('/', protect, createProject);

router.get('/', protect, getUserProjects);

router.get('/:id', protect, getProjectById);

router.put('/:id', protect, updateProject);

router.delete('/:id', protect, deleteProject);

router.patch('/:id/add_member', protect, addMember);

export default router;

