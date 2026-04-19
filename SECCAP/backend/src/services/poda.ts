/**
 * Poda: elimina campos sensibles del DTO de formación
 * según los permisos del usuario autenticado.
 *
 * Regla (RF-03):
 *  - consulta:leer     → campos básicos (sin DNI ni legajo)
 *  - consulta:detalle  → agrega DNI, legajo (datos personales sensibles)
 *
 * La poda se aplica DESPUÉS del mapeo, nunca antes.
 */

import type { FormacionDTO } from './mapper.js';

/** Campos que requieren permiso consulta:detalle */
const CAMPOS_SENSIBLES: (keyof FormacionDTO)[] = ['dni', 'legajo'];

/**
 * Aplica poda a un registro mapeado según los permisos del usuario.
 * Retorna una copia nueva sin mutar el original.
 */
export function podarFormacion(
  dto: FormacionDTO,
  permisos: string[],
): FormacionDTO {
  if (permisos.includes('consulta:detalle')) {
    return dto; // Sin poda — acceso completo al detalle
  }

  const podado = { ...dto };
  for (const campo of CAMPOS_SENSIBLES) {
    delete (podado as Record<string, unknown>)[campo];
  }
  return podado;
}

/**
 * Aplica poda a un array de registros.
 */
export function podarFormaciones(
  dtos: FormacionDTO[],
  permisos: string[],
): FormacionDTO[] {
  if (permisos.includes('consulta:detalle')) {
    return dtos; // Sin poda
  }
  return dtos.map((d) => podarFormacion(d, permisos));
}
