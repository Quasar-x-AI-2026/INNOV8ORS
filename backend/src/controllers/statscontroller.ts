import { Response } from 'express';
import { calculateUserStats } from '../utils/analytics';
import { AuthRequest } from '../middlewares/roleMiddleware';


export const getMyStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const stats = await calculateUserStats(req.userId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
    });
  }
};