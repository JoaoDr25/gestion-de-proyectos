import express from 'express';
import {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  addComment,
  addSubTask,
  changeTaskStatus,
  getSubTasks,
  deleteSubTask,
  updateSubTask,
  filterTasks,
  getTasksDueSoon
} from '../controllers/taskController.js';

const router = express.Router();


router.post('/:projectId', createTask);               
router.get('/project/:projectId', getTasksByProject);    
router.get('/:id', getTaskById);                      
router.put('/:id', updateTask);                       
router.delete('/:id', deleteTask);                    


router.post('/:id/comment', addComment);              


router.post('/:id/subtask', addSubTask);                                  
router.get('/:id/subtasks', getSubTasks);                                 
router.put('/:parentTaskId/subtask/:subTaskId', updateSubTask);           
router.delete('/:id/subtask', deleteSubTask);                             


router.put('/:id/status', changeTaskStatus);          
router.get('/filter/tasks', filterTasks);             
router.get('/due/soon', getTasksDueSoon);             

export default router;

