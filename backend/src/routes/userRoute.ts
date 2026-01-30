import express from 'express';
import { onboardUser, getCurrentUser } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// POST /api/users/onboard - Onboard a new user
router.post('/onboard', onboardUser);

// GET /api/users/me - Get current user details
router.get('/me', getCurrentUser);

export default router;