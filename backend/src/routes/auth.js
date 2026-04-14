import express from 'express';
import { register, login, logout, getCurrentUser, updateProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, updateProfile);
router.post('/logout', authenticate, logout);

export default router;
