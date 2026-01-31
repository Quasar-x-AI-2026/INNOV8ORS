import { Request, Response } from 'express';
import { Report } from '../models/reportModel';

export const getMarketSnapshot = async (req: Request, res: Response) => {
  try {
    const productName = req.params.productName as string;

    const validProducts = ['Milk', 'Onion', 'Potato', 'Sugar', 'Tomato'];
    if (!validProducts.includes(productName)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product name',
      });
    }

    const marketData = await Report.aggregate([
      {
        $match: {
          productName: productName,
          'mlAnalysis.expectedPrice': { $exists: true },
        },
      },
      {
        $group: {
          _id: '$marketName',
          avgActualPrice: { $avg: '$price' },
          avgPredictedPrice: { $avg: '$mlAnalysis.expectedPrice' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          marketName: '$_id',
          avgActualPrice: { $round: ['$avgActualPrice', 2] },
          avgPredictedPrice: { $round: ['$avgPredictedPrice', 2] },
          deviation: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ['$avgActualPrice', '$avgPredictedPrice'] },
                      '$avgPredictedPrice',
                    ],
                  },
                  100,
                ],
              },
              1,
            ],
          },
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { marketName: 1 },
      },
    ]);

    if (marketData.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'Not enough data',
      });
    }

    res.status(200).json({
      success: true,
      data: marketData,
    });
  } catch (error: any) {
    console.error('Error in getMarketSnapshot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch market snapshot',
      error: error.message,
    });
  }
};

export const getPriceTrend = async (req: Request, res: Response) => {
  try {
    const productName = req.params.productName as string;

    const validProducts = ['Milk', 'Onion', 'Potato', 'Sugar', 'Tomato'];
    if (!validProducts.includes(productName)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product name',
      });
    }

    const trendData = await Report.aggregate([
      {
        $match: {
          productName: productName,
          'mlAnalysis.expectedPrice': { $exists: true },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          avgActualPrice: { $avg: '$price' },
          avgPredictedPrice: { $avg: '$mlAnalysis.expectedPrice' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day',
            },
          },
          avgActualPrice: { $round: ['$avgActualPrice', 2] },
          avgPredictedPrice: { $round: ['$avgPredictedPrice', 2] },
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    if (trendData.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'Not enough data',
      });
    }

    res.status(200).json({
      success: true,
      data: trendData,
    });
  } catch (error: any) {
    console.error('Error in getPriceTrend:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch price trend',
      error: error.message,
    });
  }
};