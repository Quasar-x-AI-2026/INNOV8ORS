import { Response } from 'express';
import { Report } from '../models/reportModel';
import { User } from '../models/userModel';
import { AuthRequest } from '../middlewares/authMiddleware';


export const getFlaggedReports = async (req: AuthRequest, res: Response) => {
  try {
    console.log('Fetching flagged reports...');

    const flaggedReports = await Report.find({
      'mlAnalysis.anomaly': true,
    })
      .sort({ 'mlAnalysis.deviation': -1 }) 
      .select('productName marketName price unit month mlAnalysis createdAt userId')
      .lean();

    console.log(` Found ${flaggedReports.length} flagged reports`);

    return res.status(200).json({
      success: true,
      count: flaggedReports.length,
      data: flaggedReports,
    });
  } catch (error: any) {
    console.error(' Error fetching flagged reports:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch flagged reports',
      error: error.message,
    });
  }
};


export const inspectReport = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`Inspecting report: ${id}`);

    const report = await Report.findById(id).lean();

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    console.log(' Report found');

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error: any) {
    console.error(' Error inspecting report:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to inspect report',
      error: error.message,
    });
  }
};


export const markReportValid = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    console.log(` Marking report as valid: ${id}`);

    const report = await Report.findByIdAndUpdate(
      id,
      {
        $set: {
          'mlAnalysis.anomaly': false,
          status: 'verified',
          verifiedBy: req.clerkUserId,
          verifiedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    console.log(' Report marked as valid');

    return res.status(200).json({
      success: true,
      message: 'Report marked as valid',
      data: report,
    });
  } catch (error: any) {
    console.error('Error marking report as valid:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark report as valid',
      error: error.message,
    });
  }
};


export const deleteReport = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`Deleting report: ${id}`);

    const report = await Report.findByIdAndDelete(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    console.log(' Report deleted');

    return res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error: any) {
    console.error(' Error deleting report:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete report',
      error: error.message,
    });
  }
};


export const getMarketHealth = async (req: AuthRequest, res: Response) => {
  try {
    console.log('📊 Fetching market health overview...');

    const marketStats = await Report.aggregate([
      {
        $group: {
          _id: '$marketName',
          avgActualPrice: { $avg: '$price' },
          avgPredictedPrice: { $avg: '$mlAnalysis.expectedPrice' },
          totalReports: { $sum: 1 },
          flaggedReports: {
            $sum: {
              $cond: ['$mlAnalysis.anomaly', 1, 0],
            },
          },
        },
      },
      {
        $project: {
          market: '$_id',
          avgActualPrice: { 
            $ifNull: [{ $round: ['$avgActualPrice', 2] }, 0] 
          },
          avgPredictedPrice: { 
            $ifNull: [{ $round: ['$avgPredictedPrice', 2] }, 0] 
          },
          avgDeviation: {
            $cond: {
              if: { $eq: ['$avgPredictedPrice', 0] },
              then: 0,
              else: {
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
                  2,
                ],
              },
            },
          },
          totalReports: 1,
          flaggedReports: 1,
          _id: 0,
        },
      },
      { $sort: { flaggedReports: -1 } },
    ]);

    console.log(` Found stats for ${marketStats.length} markets`);

    return res.status(200).json({
      success: true,
      count: marketStats.length,
      data: marketStats,
    });
  } catch (error: any) {
    console.error('Error fetching market health:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch market health',
      error: error.message,
    });
  }
};


export const getUserActivity = async (req: AuthRequest, res: Response) => {
  try {
    console.log('👥 Fetching user activity overview...');

    
    const userStats = await Report.aggregate([
      {
        $group: {
          _id: '$userId',
          totalReports: { $sum: 1 },
          flaggedReports: {
            $sum: {
              $cond: ['$mlAnalysis.anomaly', 1, 0],
            },
          },
          lastActivity: { $max: '$createdAt' },
        },
      },
      {
        $project: {
          userId: '$_id',
          totalReports: 1,
          flaggedReports: 1,
          lastActivity: 1,
          flaggedPercentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ['$flaggedReports', '$totalReports'] },
                  100,
                ],
              },
              2,
            ],
          },
          _id: 0,
        },
      },
      { $sort: { flaggedReports: -1 } },
    ]);

    console.log(` Found activity for ${userStats.length} users`);

    return res.status(200).json({
      success: true,
      count: userStats.length,
      data: userStats,
    });
  } catch (error: any) {
    console.error(' Error fetching user activity:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user activity',
      error: error.message,
    });
  }
};