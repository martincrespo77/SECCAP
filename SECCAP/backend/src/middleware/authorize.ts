import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware RBAC: exige que el usuario autenticado tenga al menos
 * uno de los permisos indicados.
 */
export function authorize(...permisosRequeridos: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const tiene = permisosRequeridos.some((p) => req.user!.permisos.includes(p));
    if (!tiene) {
      res.status(403).json({
        error: 'Permiso insuficiente',
        detalle: `Se requiere uno de: ${permisosRequeridos.join(', ')}`,
      });
      return;
    }

    next();
  };
}
