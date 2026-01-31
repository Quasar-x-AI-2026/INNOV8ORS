import express from 'express';
import { getMyStats } from '../controllers/statscontroller';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/me', protect, getMyStats);

export default router;
