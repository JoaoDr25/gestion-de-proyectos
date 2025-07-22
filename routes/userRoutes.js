import express from 'express';
import router from express();
import userController from '../controllers/authController.js';

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('profile:id', userController.getProfile);

export default router;