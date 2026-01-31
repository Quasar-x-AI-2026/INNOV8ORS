import express from 'express';
import { getAlerts, getTrends } from '../controllers/trendController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// Get price alerts
router.get('/alerts', protect, getAlerts);

// Get product price trends
router.get('/product', protect, getTrends);

export default router;
