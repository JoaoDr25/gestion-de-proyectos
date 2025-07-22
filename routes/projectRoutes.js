import express from 'express';
import router from express ();
import projectController from '../controllers.js'

router.post('/', projectController.createProject);

router.get('/', projectController.getAllProjects);

router.get('/:id', projectController.getProjectById);

router.put('/:id', projectController.updateProject);

router.delete('/:id', projectController.deleteProject);

router.get('/:id/add_member', projectController.addMember);

export default router;

