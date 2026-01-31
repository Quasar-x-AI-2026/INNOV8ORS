import express from 'express';
import {
  createReport,
  getMyReports,
  getRecentReports,
  deleteReport,
  getAllReports,
  verifyReport,
} from '../controllers/reportController';
import { protect } from '../middlewares/authMiddleware';
import { isVerifier } from '../middlewares/roleMiddleware';

const router = express.Router();

// User routes (protected)
router.post('/create', protect, createReport);
router.get('/my-reports', protect, getMyReports);
router.get('/recent', protect, getRecentReports);
router.delete('/:id', protect, deleteReport);


router.get('/all', protect, isVerifier, getAllReports);
router.patch('/verify/:id', protect, isVerifier, verifyReport);

export default router;