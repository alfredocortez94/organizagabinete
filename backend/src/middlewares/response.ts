import { Request, Response, NextFunction } from 'express';

export function defaultResponseMiddleware(req: Request, res: Response, next: NextFunction) {
  // Se a resposta já foi enviada, não faz nada
  if (res.headersSent) return next();
  // Resposta padrão para rotas não encontradas
  res.status(404).json({
    success: false,
    data: {},
    message: 'Rota não encontrada',
    timestamp: new Date().toISOString(),
  });
}
