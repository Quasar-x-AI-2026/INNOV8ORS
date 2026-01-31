import express from 'express';
import {
  getFlaggedReports,
  inspectReport,
  markReportValid,
  deleteReport,
  getMarketHealth,
  getUserActivity,
} from '../controllers/adminController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware';

const router = express.Router();


router.get(
  '/flagged-reports',
  authMiddleware,
  adminAuthMiddleware,
  getFlaggedReports
);


router.get(
  '/reports/:id',
  authMiddleware,
  adminAuthMiddleware,
  inspectReport
);


router.patch(
  '/reports/:id/mark-valid',
  authMiddleware,
  adminAuthMiddleware,
  markReportValid
);


router.delete(
  '/reports/:id',
  authMiddleware,
  adminAuthMiddleware,
  deleteReport
);


router.get(
  '/markets',
  authMiddleware,
  adminAuthMiddleware,
  getMarketHealth
);


router.get(
  '/users',
  authMiddleware,
  adminAuthMiddleware,
  getUserActivity
);

export default router;