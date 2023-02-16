import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  userId?: string;
}

export default (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
  if (token) {
    try {
      const decoded: any = jwt.verify(token, 'secretkey');
      req.userId = decoded._id;
      next();
    } catch (err) {
      return res.status(403).json({
        message: 'No access2',
      });
    }
  } else {
    return res.status(403).json({
      message: 'No access',
    });
  }
};
