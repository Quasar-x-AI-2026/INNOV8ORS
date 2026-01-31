import { Request, Response } from 'express';
import { getPriceAlerts, getProductTrends } from '../utils/analytics';
import { AuthRequest } from '../middlewares/authMiddleware';


export const getAlerts = async (req: AuthRequest, res: Response) => {
  try {
    const alerts = await getPriceAlerts();

    res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error: any) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching price alerts',
    });
  }
};


export const getTrends = async (req: Request, res: Response) => {
  try {
    const { product, area } = req.query;

    if (!product) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required',
      });
    }

    const trends = await getProductTrends(
      product as string,
      area as string | undefined
    );

    res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error: any) {
    console.error('Get trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product trends',
    });
  }
};