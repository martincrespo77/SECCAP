/**
 * Servicio de auditoría: registra cada consulta (exitosa o fallida)
 * en la tabla audit_log de la BD local (RF-05).
 *
 * La tabla es INMUTABLE: solo INSERT, nunca UPDATE ni DELETE.
 */

import { prisma } from '../prisma.js';
import { logger } from '../logger.js';
import type { Prisma } from '../generated/prisma/client.js';
import type { Request } from 'express';

export interface AuditEntry {
  idUsuario: number;
  accion: string;
  endpoint: string;
  metodoHttp: string;
  filtrosAplicados: Record<string, unknown> | null;
  statusCode: number;
  resultado: string;        // 'exito' | 'error_cliente' | 'error_upstream' | 'error_interno'
  cantidadRegistros: number;
  ipOrigen: string;
  userAgent: string;
  duracionMs?: number;
}

/**
 * Extrae IP de origen de la petición (respeta X-Forwarded-For si existe).
 */
function extraerIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress ?? 'unknown';
}

/**
 * Extrae User-Agent de la petición.
 */
function extraerUserAgent(req: Request): string {
  return (req.headers['user-agent'] ?? 'unknown').slice(0, 255);
}

/**
 * Registra una entrada de auditoría. No lanza excepciones —
 * si falla la escritura, logea el error pero no rompe el flujo.
 */
export async function registrarAuditoria(entry: AuditEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        idUsuario: entry.idUsuario,
        accion: entry.accion,
        endpoint: entry.endpoint,
        metodoHttp: entry.metodoHttp,
        filtrosAplicados: (entry.filtrosAplicados ?? undefined) as Prisma.InputJsonValue | undefined,
        statusCode: entry.statusCode,
        resultado: entry.resultado,
        cantidadRegistros: entry.cantidadRegistros,
        ipOrigen: entry.ipOrigen,
        userAgent: entry.userAgent,
        duracionMs: entry.duracionMs,
      },
    });
  } catch (err) {
    logger.error({ err, entry }, 'Error al registrar auditoría — la consulta no se bloquea');
  }
}

/**
 * Helper: construye los campos comunes de auditoría desde un Request.
 */
export function auditFromReq(req: Request): Pick<AuditEntry, 'ipOrigen' | 'userAgent'> {
  return {
    ipOrigen: extraerIp(req),
    userAgent: extraerUserAgent(req),
  };
}
