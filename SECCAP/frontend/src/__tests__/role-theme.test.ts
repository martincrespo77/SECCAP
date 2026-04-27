import { describe, it, expect } from 'vitest';
import { resolveRoleTheme } from '../auth/role-theme.ts';

/*
 * Tests del helper de tema por rol.
 *
 * Verifican:
 *  - Resolución correcta para cada rol individual.
 *  - Precedencia admin > auditor > consultor cuando hay múltiples roles.
 *  - Fallback sobrio a 'consultor' cuando la lista está vacía o es inválida.
 *
 * No se afirman clases Tailwind exactas para no volver el test frágil:
 * se verifican el identificador de rol, la etiqueta y la existencia de
 * clases no vacías en los campos estilados.
 */

describe('resolveRoleTheme — resolución por rol', () => {
  it('consultor → tema consultor con etiqueta visible', () => {
    const theme = resolveRoleTheme(['consultor']);
    expect(theme.role).toBe('consultor');
    expect(theme.label).toMatch(/consultor/i);
    expect(theme.badge.length).toBeGreaterThan(0);
    expect(theme.primaryButton.length).toBeGreaterThan(0);
  });

  it('auditor → tema auditor con etiqueta visible', () => {
    const theme = resolveRoleTheme(['auditor']);
    expect(theme.role).toBe('auditor');
    expect(theme.label).toMatch(/auditor/i);
  });

  it('admin → tema admin con etiqueta visible', () => {
    const theme = resolveRoleTheme(['admin']);
    expect(theme.role).toBe('admin');
    expect(theme.label).toMatch(/admin/i);
  });
});

describe('resolveRoleTheme — precedencia con múltiples roles', () => {
  it('admin + auditor + consultor → gana admin', () => {
    const theme = resolveRoleTheme(['consultor', 'auditor', 'admin']);
    expect(theme.role).toBe('admin');
  });

  it('auditor + consultor → gana auditor', () => {
    const theme = resolveRoleTheme(['consultor', 'auditor']);
    expect(theme.role).toBe('auditor');
  });

  it('admin + consultor → gana admin', () => {
    const theme = resolveRoleTheme(['admin', 'consultor']);
    expect(theme.role).toBe('admin');
  });
});

describe('resolveRoleTheme — casos borde', () => {
  it('sin roles → cae a consultor como fallback sobrio', () => {
    expect(resolveRoleTheme([]).role).toBe('consultor');
    expect(resolveRoleTheme(undefined).role).toBe('consultor');
    expect(resolveRoleTheme(null).role).toBe('consultor');
  });

  it('rol desconocido → cae a consultor', () => {
    expect(resolveRoleTheme(['rol-inventado']).role).toBe('consultor');
  });

  it('los tres temas devuelven conjuntos de clases diferenciados entre sí', () => {
    const tConsultor = resolveRoleTheme(['consultor']);
    const tAuditor = resolveRoleTheme(['auditor']);
    const tAdmin = resolveRoleTheme(['admin']);
    // Los botones primarios deben ser visualmente distintos.
    expect(tConsultor.primaryButton).not.toBe(tAuditor.primaryButton);
    expect(tConsultor.primaryButton).not.toBe(tAdmin.primaryButton);
    expect(tAuditor.primaryButton).not.toBe(tAdmin.primaryButton);
    // Los badges también.
    expect(tConsultor.badge).not.toBe(tAuditor.badge);
    expect(tConsultor.badge).not.toBe(tAdmin.badge);
    expect(tAuditor.badge).not.toBe(tAdmin.badge);
  });
});
