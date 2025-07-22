import express from 'express';
import router from express();
import taskController from '../controllers/authController.js';

router.post('/', taskController.createTask);

router.get('/project/:projectId', taskController.getTaskByProject);

router.get('/:id', taskController.getTaskById);

router.put('/:id', taskController.updateTask);

router.delete('/:id', taskController.deleteTask);

router.post('/:id/comment', taskController.addComment);

export default router;
