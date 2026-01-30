import { Request, Response } from 'express';
import { User } from '../models/userModel';

const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE;

export const onboardUser = async (req: Request, res: Response) => {
  try {
    const { role, adminCode } = req.body;
    const clerkUserId = req.clerkUserId;

    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const existingUser = await User.findOne({ clerkUserId });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already onboarded',
      });
    }

    // Validate role
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    // Verify admin code if role is admin
    if (role === 'admin') {
      if (adminCode !== ADMIN_SECRET_CODE) {
        return res.status(403).json({
          success: false,
          message: 'Invalid admin code',
        });
      }
    }

    // Create user
    const user = await User.create({
      clerkUserId,
      role,
      onboardingComplete: true,
    });

    return res.status(201).json({
      success: true,
      message: 'Onboarding successful',
      data: { role: user.role },
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const clerkUserId = req.clerkUserId;

    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        needsOnboarding: true,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        role: user.role,
        onboardingComplete: user.onboardingComplete,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};