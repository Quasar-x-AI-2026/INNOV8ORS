import express from 'express';
import { getMarketSnapshot, getPriceTrend } from '../controllers/productController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/:productName/markets', protect, getMarketSnapshot);
router.get('/:productName/trend', protect, getPriceTrend);

export default router;
