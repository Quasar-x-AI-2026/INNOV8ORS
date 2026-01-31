import { Response } from 'express';
import { Report } from '../models/reportModel';
import { validateReportInput, sanitizeInput, validatePagination } from '../utils/validators';
import { AuthRequest } from '../middlewares/authMiddleware';
import { checkPriceWithML } from '../services/mlService';


const MONTH_MAP: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};


export const createReport = async (req: AuthRequest, res: Response) => {
  try {
    const { productName, price, unit, marketName, month } = req.body;

   
    const validation = validateReportInput({
      productName,
      price,
      unit,
      marketName,
      month,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    const monthNumber = MONTH_MAP[month];
    if (!monthNumber) {
      return res.status(400).json({
        success: false,
        message: 'Invalid month',
      });
    }

   
    const mlResult = await checkPriceWithML({
      month: monthNumber,
      commodity_name: productName,
      market_name: marketName,
      actual_price: Number(price),
    });

    const report = await Report.create({
      userId: req.clerkUserId,
      productName: sanitizeInput(productName),
      price: Number(price),
      unit: unit.toLowerCase(),
      marketName: sanitizeInput(marketName),
      month,

      verificationMethod: 'ml',
      status: 'pending',

      mlAnalysis: {
        mandiBenchmark: mlResult.mandi_benchmark,
        expectedPrice: mlResult.expected_price,
        deviation: mlResult.deviation,
        anomaly: mlResult.is_anomaly,
        reason: mlResult.reason,
      },
    });

    
    res.status(201).json({
      success: true,
      data: {
        _id: report._id,
        predictedPrice: mlResult.expected_price,
      },
    });
  } catch (error: any) {
    console.error('Create report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create report',
    });
  }
};


export const getMyReports = async (req: AuthRequest, res: Response) => {
  try {
    const { page, limit } = validatePagination(
      req.query.page as string,
      req.query.limit as string
    );

    const skip = (page - 1) * limit;

    const reports = await Report.find({ userId: req.clerkUserId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Report.countDocuments({ userId: req.clerkUserId });

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get my reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
    });
  }
};


export const getRecentReports = async (req: AuthRequest, res: Response) => {
  try {
    const reports = await Report.find({ userId: req.clerkUserId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error: any) {
    console.error('Get recent reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent reports',
    });
  }
};


export const deleteReport = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const report = await Report.findOne({ _id: id, userId: req.clerkUserId });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found or unauthorized',
      });
    }

    await Report.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting report',
    });
  }
};

export const getAllReports = async (req: AuthRequest, res: Response) => {
  try {
    const { page, limit } = validatePagination(
      req.query.page as string,
      req.query.limit as string
    );
    const status = req.query.status as string;

    const skip = (page - 1) * limit;
    const filter: any = {};

    if (status && ['pending', 'verified', 'flagged'].includes(status)) {
      filter.status = status;
    }

    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Report.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get all reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
    });
  }
};


export const verifyReport = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['verified', 'flagged'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const report = await Report.findByIdAndUpdate(
      id,
      {
        status,
        verifiedBy: req.clerkUserId,
        verifiedAt: new Date(),
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error: any) {
    console.error('Verify report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying report',
    });
  }
};
