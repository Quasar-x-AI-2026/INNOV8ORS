import express from 'express';
import { onboardUser, getCurrentUser } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();


router.use(authMiddleware);


router.post('/onboard', onboardUser);


router.get('/me', getCurrentUser);

export default router;