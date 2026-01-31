import { Response, Request } from 'express';
import { Report } from '../models/reportModel';

export const getMarketMapData = async (req: Request, res: Response) => {
  try {
    const { product, month } = req.query;

    if (!product || !month) {
      return res.status(400).json({
        success: false,
        message: 'Product and month are required',
      });
    }

    const validProducts = ['Milk', 'Onion', 'Potato', 'Sugar', 'Tomato'];
    if (!validProducts.includes(product as string)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product. Must be one of: Milk, Onion, Potato, Sugar, Tomato',
      });
    }

    const validMonths = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    if (!validMonths.includes(month as string)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid month',
      });
    }

    const ALLOWED_MARKETS = [
      'Azadpur',
      'Daryaganj',
      'Ghazipur',
      'INA Market',
      'Keshopur',
      'Okhla',
      'Rohini'
    ];

    const reports = await Report.find({
      productName: product,
      month: month,
      marketName: { $in: ALLOWED_MARKETS },
      'mlAnalysis.expectedPrice': { $exists: true, $ne: null },
    });

    if (reports.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No data available for selected filters',
      });
    }

    const marketData: Record<string, {
      actualPrices: number[];
      predictedPrices: number[];
    }> = {};

    reports.forEach((report) => {
      if (!marketData[report.marketName]) {
        marketData[report.marketName] = {
          actualPrices: [],
          predictedPrices: [],
        };
      }

      marketData[report.marketName].actualPrices.push(report.price);
      marketData[report.marketName].predictedPrices.push(
        report.mlAnalysis!.expectedPrice
      );
    });

    const result = Object.keys(marketData).map((marketName) => {
      const { actualPrices, predictedPrices } = marketData[marketName];

      const actualAvgPrice =
        actualPrices.reduce((sum, price) => sum + price, 0) / actualPrices.length;

      const predictedAvgPrice =
        predictedPrices.reduce((sum, price) => sum + price, 0) / predictedPrices.length;

      const deviation = ((actualAvgPrice - predictedAvgPrice) / predictedAvgPrice) * 100;

      const isAnomaly = Math.abs(deviation) > 15;

      return {
        marketName,
        actualAvgPrice: Number(actualAvgPrice.toFixed(2)),
        predictedAvgPrice: Number(predictedAvgPrice.toFixed(2)),
        deviation: Number(deviation.toFixed(2)),
        isAnomaly,
      };
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Market map data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch market map data',
    });
  }
};