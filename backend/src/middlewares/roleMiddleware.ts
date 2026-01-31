import { Request, Response, NextFunction } from 'express';
import { User } from '../models/userModel';

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

export const checkRole = (allowedRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      // Fetch user from database
      const user = await User.findOne({ clerkId: req.userId });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Check if user role is allowed
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions.',
        });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      console.error('Role check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking user permissions',
      });
    }
  };
};

export const isAdmin = checkRole(['admin']);
export const isVerifier = checkRole(['admin', 'verifier']);
export const isUser = checkRole(['user', 'admin', 'verifier']);