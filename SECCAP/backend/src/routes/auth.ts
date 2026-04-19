import { Router } from 'express';
import { z } from 'zod';
import { hash } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma.js';
import { config } from '../config.js';
import { logger } from '../logger.js';
import { authenticate, type JwtPayload } from '../middleware/authenticate.js';

export const authRouter = Router();

// --- Esquemas de validación ---
const loginSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(1).max(128),
});

// --- POST /auth/login ---
authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Datos de login inválidos', detalle: parsed.error.issues });
    return;
  }

  const { username, password } = parsed.data;

  const usuario = await prisma.sysUsuario.findUnique({
    where: { username },
    include: {
      roles: {
        include: {
          rol: {
            include: {
              permisos: { include: { permiso: true } },
            },
          },
        },
      },
    },
  });

  if (!usuario) {
    logger.warn({ username }, 'Login fallido: usuario no existe');
    res.status(401).json({ error: 'Credenciales inválidas' });
    return;
  }

  // Verificar bloqueo
  if (usuario.bloqueadoHasta && usuario.bloqueadoHasta > new Date()) {
    logger.warn({ username }, 'Login fallido: cuenta bloqueada');
    res.status(403).json({
      error: 'Cuenta bloqueada temporalmente',
      detalle: `Intente nuevamente después de ${usuario.bloqueadoHasta.toISOString()}`,
    });
    return;
  }

  if (!usuario.activo) {
    logger.warn({ username }, 'Login fallido: cuenta inactiva');
    res.status(401).json({ error: 'Credenciales inválidas' });
    return;
  }

  // Verificar contraseña (SHA-256, consistente con el seed)
  const passwordHash = hash('sha256', password);
  if (passwordHash !== usuario.passwordHash) {
    // Incrementar intentos fallidos
    const intentos = usuario.intentosFallidos + 1;
    const MAX_INTENTOS = 5;
    const update: { intentosFallidos: number; bloqueadoHasta?: Date } = {
      intentosFallidos: intentos,
    };
    if (intentos >= MAX_INTENTOS) {
      const bloqueo = new Date();
      bloqueo.setMinutes(bloqueo.getMinutes() + 30);
      update.bloqueadoHasta = bloqueo;
      logger.warn({ username, intentos }, 'Cuenta bloqueada por intentos fallidos');
    }
    await prisma.sysUsuario.update({ where: { id: usuario.id }, data: update });

    logger.warn({ username, intentos }, 'Login fallido: contraseña incorrecta');
    res.status(401).json({ error: 'Credenciales inválidas' });
    return;
  }

  // Resetear intentos fallidos
  if (usuario.intentosFallidos > 0) {
    await prisma.sysUsuario.update({
      where: { id: usuario.id },
      data: { intentosFallidos: 0, bloqueadoHasta: null },
    });
  }

  // Calcular expiración del token
  const expiresInMatch = config.JWT_EXPIRES_IN.match(/^(\d+)([hmd])$/);
  let expiresInMs = 8 * 60 * 60 * 1000; // default 8h
  if (expiresInMatch) {
    const [, val, unit] = expiresInMatch;
    const n = parseInt(val, 10);
    if (unit === 'h') expiresInMs = n * 60 * 60 * 1000;
    else if (unit === 'm') expiresInMs = n * 60 * 1000;
    else if (unit === 'd') expiresInMs = n * 24 * 60 * 60 * 1000;
  }

  const expiraEn = new Date(Date.now() + expiresInMs);

  // Crear sesión
  const tokenHash = hash('sha256', `${usuario.id}-${Date.now()}-${Math.random()}`);
  const sesion = await prisma.sysSesion.create({
    data: {
      idUsuario: usuario.id,
      tokenHash,
      ipOrigen: req.ip ?? req.socket.remoteAddress ?? 'unknown',
      userAgent: (req.headers['user-agent'] ?? 'unknown').slice(0, 255),
      expiraEn,
    },
  });

  // Generar JWT
  const payload: JwtPayload = {
    sub: usuario.id,
    username: usuario.username,
    sessionId: sesion.id,
  };

  const token = jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN as string & jwt.SignOptions['expiresIn'],
  });

  // Armar respuesta con roles y permisos
  const roles = usuario.roles.map((ur) => ur.rol.nombre);
  const permisos = [
    ...new Set(
      usuario.roles.flatMap((ur) => ur.rol.permisos.map((rp) => rp.permiso.codigo)),
    ),
  ];

  logger.info({ username, sessionId: sesion.id }, 'Login exitoso');

  res.json({
    token,
    expires_at: expiraEn.toISOString(),
    user: {
      id: usuario.id,
      username: usuario.username,
      nombre_completo: usuario.nombreCompleto,
      email: usuario.email,
      roles,
      permisos,
    },
  });
});

// --- POST /auth/logout ---
authRouter.post('/logout', authenticate, async (req, res) => {
  await prisma.sysSesion.update({
    where: { id: req.user!.sessionId },
    data: { activa: false, revocadaEn: new Date() },
  });

  logger.info({ username: req.user!.username, sessionId: req.user!.sessionId }, 'Logout');

  res.json({ message: 'Sesión cerrada correctamente' });
});

// --- GET /auth/me ---
authRouter.get('/me', authenticate, (req, res) => {
  const u = req.user!;
  res.json({
    id: u.id,
    username: u.username,
    nombre_completo: u.nombreCompleto,
    roles: u.roles,
    permisos: u.permisos,
  });
});
