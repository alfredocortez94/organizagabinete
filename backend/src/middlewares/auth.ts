import { Request, Response, NextFunction } from 'express';

// Extensão do tipo Request para incluir o campo 'user'
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: string;
    };
  }
}

import jwt from 'jsonwebtoken';

export function authMiddleware(roles: string[] = []) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).json({ success: false, data: {}, message: 'Token não informado', timestamp: new Date().toISOString() });
    }
    const [, token] = auth.split(' ');
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'changeme') as any;
      if (roles.length > 0 && !roles.includes(payload.role)) {
        return res.status(403).json({ success: false, data: {}, message: 'Acesso negado', timestamp: new Date().toISOString() });
      }
      (req as any).user = payload;
      next();
    } catch (err) {
      return res.status(401).json({ success: false, data: {}, message: 'Token inválido', timestamp: new Date().toISOString() });
    }
  };
}
