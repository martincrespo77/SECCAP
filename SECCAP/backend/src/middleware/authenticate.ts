import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma.js';
import { config } from '../config.js';

export interface JwtPayload {
  sub: number;
  username: string;
  sessionId: number;
}

export interface AuthUser {
  id: number;
  username: string;
  nombreCompleto: string;
  sessionId: number;
  roles: string[];
  permisos: string[];
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token de autenticación requerido' });
    return;
  }

  const token = header.slice(7);

  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, config.JWT_SECRET) as unknown as JwtPayload;
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
    return;
  }

  // Verificar que la sesión esté activa y no expirada
  const sesion = await prisma.sysSesion.findFirst({
    where: { id: payload.sessionId, activa: true },
  });

  if (!sesion || sesion.expiraEn < new Date()) {
    res.status(401).json({ error: 'Sesión expirada o revocada' });
    return;
  }

  // Cargar usuario con roles y permisos
  const usuario = await prisma.sysUsuario.findUnique({
    where: { id: payload.sub },
    include: {
      roles: {
        include: {
          rol: {
            include: {
              permisos: {
                include: { permiso: true },
              },
            },
          },
        },
      },
    },
  });

  if (!usuario || !usuario.activo) {
    res.status(401).json({ error: 'Usuario no encontrado o inactivo' });
    return;
  }

  const roles = usuario.roles.map((ur) => ur.rol.nombre);
  const permisos = [
    ...new Set(
      usuario.roles.flatMap((ur) => ur.rol.permisos.map((rp) => rp.permiso.codigo)),
    ),
  ];

  req.user = {
    id: usuario.id,
    username: usuario.username,
    nombreCompleto: usuario.nombreCompleto,
    sessionId: payload.sessionId,
    roles,
    permisos,
  };

  next();
}
