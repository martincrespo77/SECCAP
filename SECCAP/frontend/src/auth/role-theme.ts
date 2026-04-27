/*
 * Tema visual por rol (Fase post-4: diferenciación visual).
 *
 * Centraliza la resolución del rol visual efectivo a partir de `user.roles`
 * y devuelve un objeto con etiquetas y clases Tailwind listas para consumir
 * en la UI (shell, home, consulta).
 *
 * Reglas:
 *  - Precedencia: admin > auditor > consultor
 *  - Si el usuario no tiene ninguno de esos roles, cae a 'consultor' como
 *    tema neutro (el sistema por contrato autentica siempre con al menos un
 *    rol reconocido, pero evitamos romper la UI si llegara algo inesperado).
 *  - Las clases se definen literalmente para que el scanner de Tailwind las
 *    detecte en el bundle.
 *
 * Estética:
 *  - consultor → azul institucional (línea visual actual).
 *  - auditor   → ámbar sobrio (ocre/dorado apagado).
 *  - admin     → granate/borgoña oscuro.
 */

export type RoleKind = 'admin' | 'auditor' | 'consultor';

export interface RoleTheme {
  /** Rol visual efectivo resuelto por precedencia. */
  role: RoleKind;
  /** Etiqueta humana corta del rol. */
  label: string;
  /** Descripción breve orientada al usuario. */
  description: string;
  /** Código de color textual para data-attribute en tests. */
  testId: string;

  /* ── Acentos de texto / bordes / fondos suaves ─────────────────── */
  eyebrowText: string;          // "SECCAP" pequeño arriba del título
  accentText: string;           // color principal para acento de texto
  accentTextMuted: string;      // variante más tenue
  accentBorder: string;         // border color para tarjetas de acento
  accentBgSoft: string;         // fondo suave para bloques de acento

  /* ── Shell lateral ─────────────────────────────────────────────── */
  sidebarCardBg: string;        // bloque "Acceso autenticado"
  sidebarCardIcon: string;      // color del icono ShieldCheck
  sidebarCardSubtitle: string;  // "Consulta de formación activa"

  /* ── Nav item activo ───────────────────────────────────────────── */
  navActive: string;            // clase completa para NavLink activo
  navInactive: string;          // clase completa para NavLink inactivo

  /* ── Badge de rol visible ──────────────────────────────────────── */
  badge: string;                // clase completa para la píldora de rol

  /* ── Botón principal (ej. "Buscar") ────────────────────────────── */
  primaryButton: string;        // clase completa

  /* ── Píldora de dato (ej. tipoFormacion en tabla) ──────────────── */
  dataPill: string;
}

function pickRole(roles: readonly string[] | undefined | null): RoleKind {
  if (!roles || roles.length === 0) return 'consultor';
  if (roles.includes('admin')) return 'admin';
  if (roles.includes('auditor')) return 'auditor';
  if (roles.includes('consultor')) return 'consultor';
  return 'consultor';
}

const THEMES: Record<RoleKind, RoleTheme> = {
  consultor: {
    role: 'consultor',
    label: 'Consultor',
    description: 'Operador habilitado para consultar y ver detalle',
    testId: 'role-theme-consultor',

    eyebrowText: 'text-blue-800',
    accentText: 'text-blue-800',
    accentTextMuted: 'text-blue-700',
    accentBorder: 'border-blue-200',
    accentBgSoft: 'bg-blue-50',

    sidebarCardBg: 'bg-slate-950',
    sidebarCardIcon: 'text-cyan-300',
    sidebarCardSubtitle: 'text-slate-300',

    navActive:
      'bg-blue-900 text-white shadow-[0_16px_40px_-28px_rgba(30,64,175,0.9)]',
    navInactive: 'text-slate-700 hover:bg-slate-100',

    badge:
      'inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-800',

    primaryButton:
      'inline-flex items-center gap-2 rounded-full bg-blue-900 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-12px_rgba(30,64,175,0.8)] transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40',

    dataPill:
      'inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 capitalize',
  },

  auditor: {
    role: 'auditor',
    label: 'Auditor',
    description: 'Acceso de auditoría, sin DNI ni legajo visibles',
    testId: 'role-theme-auditor',

    eyebrowText: 'text-amber-800',
    accentText: 'text-amber-800',
    accentTextMuted: 'text-amber-700',
    accentBorder: 'border-amber-200',
    accentBgSoft: 'bg-amber-50',

    sidebarCardBg: 'bg-amber-950',
    sidebarCardIcon: 'text-amber-300',
    sidebarCardSubtitle: 'text-amber-200/80',

    navActive:
      'bg-amber-800 text-white shadow-[0_16px_40px_-28px_rgba(146,64,14,0.9)]',
    navInactive: 'text-slate-700 hover:bg-amber-50',

    badge:
      'inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-800',

    primaryButton:
      'inline-flex items-center gap-2 rounded-full bg-amber-800 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-12px_rgba(146,64,14,0.8)] transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-40',

    dataPill:
      'inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 capitalize',
  },

  admin: {
    role: 'admin',
    label: 'Administrador',
    description: 'Acceso administrativo con permisos ampliados',
    testId: 'role-theme-admin',

    eyebrowText: 'text-rose-900',
    accentText: 'text-rose-900',
    accentTextMuted: 'text-rose-800',
    accentBorder: 'border-rose-200',
    accentBgSoft: 'bg-rose-50',

    sidebarCardBg: 'bg-rose-950',
    sidebarCardIcon: 'text-rose-300',
    sidebarCardSubtitle: 'text-rose-200/80',

    navActive:
      'bg-rose-900 text-white shadow-[0_16px_40px_-28px_rgba(136,19,55,0.9)]',
    navInactive: 'text-slate-700 hover:bg-rose-50',

    badge:
      'inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-900',

    primaryButton:
      'inline-flex items-center gap-2 rounded-full bg-rose-900 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-12px_rgba(136,19,55,0.8)] transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-40',

    dataPill:
      'inline-block rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-900 capitalize',
  },
};

/**
 * Resuelve el tema visual efectivo a partir de la lista de roles del usuario.
 * Precedencia: admin > auditor > consultor.
 */
export function resolveRoleTheme(roles: readonly string[] | undefined | null): RoleTheme {
  return THEMES[pickRole(roles)];
}
