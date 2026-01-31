import { Response, NextFunction } from 'express';
import { User } from '../models/userModel';
import { AuthRequest } from './authMiddleware';


export const adminAuthMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
  
    console.log("Route:", req.method, req.path);

    // Check if user is authenticated (from authMiddleware)
    if (!req.clerkUserId) {
      console.log(" No clerkUserId found");
     
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    console.log("User ID:", req.clerkUserId);

   
    const user = await User.findOne({ clerkUserId: req.clerkUserId });

    if (!user) {
      
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    console.log("User role:", user.role);

 
    if (user.role !== 'admin') {
      
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    
    req.userRole = user.role;

   
    
    next();
  } catch (error: any) {
    console.error('ADMIN AUTH MIDDLEWARE ERROR');
    console.error('Error:', error);
    

    return res.status(500).json({
      success: false,
      message: 'Error checking admin permissions',
      error: error.message,
    });
  }
};