import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'node:crypto';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? '' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seed: iniciando carga de datos base...');

  // --- Permisos ---
  const permisos = [
    { codigo: 'consulta:leer', modulo: 'consulta', descripcion: 'Ejecutar consultas de formación' },
    { codigo: 'consulta:detalle', modulo: 'consulta', descripcion: 'Ver detalle completo de un registro' },
    { codigo: 'consulta:certificado', modulo: 'consulta', descripcion: 'Descargar certificados adjuntos' },
    { codigo: 'catalogos:leer', modulo: 'catalogos', descripcion: 'Consultar catálogos de filtros' },
    { codigo: 'auditoria:leer', modulo: 'auditoria', descripcion: 'Consultar registros de auditoría' },
    { codigo: 'admin:usuarios', modulo: 'admin', descripcion: 'Gestionar usuarios del sistema' },
    { codigo: 'admin:roles', modulo: 'admin', descripcion: 'Gestionar roles y permisos' },
    { codigo: 'admin:config', modulo: 'admin', descripcion: 'Gestionar configuración del sistema' },
    { codigo: 'health:leer', modulo: 'sistema', descripcion: 'Consultar estado del sistema' },
  ];

  for (const p of permisos) {
    await prisma.sysPermiso.upsert({
      where: { codigo: p.codigo },
      update: {},
      create: p,
    });
  }
  console.log(`  ${permisos.length} permisos cargados.`);

  // --- Roles ---
  const rolesData = [
    {
      nombre: 'admin',
      descripcion: 'Administrador del sistema — acceso completo',
      permisos: permisos.map((p) => p.codigo),
    },
    {
      nombre: 'consultor',
      descripcion: 'Consultor de formación — consultas y catálogos',
      permisos: ['consulta:leer', 'consulta:detalle', 'consulta:certificado', 'catalogos:leer'],
    },
    {
      nombre: 'auditor',
      descripcion: 'Auditor — lectura de auditoría y consultas',
      permisos: ['consulta:leer', 'catalogos:leer', 'auditoria:leer'],
    },
  ];

  for (const r of rolesData) {
    const rol = await prisma.sysRol.upsert({
      where: { nombre: r.nombre },
      update: {},
      create: { nombre: r.nombre, descripcion: r.descripcion },
    });

    // Vincular permisos
    for (const codigoPermiso of r.permisos) {
      const permiso = await prisma.sysPermiso.findUnique({ where: { codigo: codigoPermiso } });
      if (permiso) {
        await prisma.sysRolPermiso.upsert({
          where: { idRol_idPermiso: { idRol: rol.id, idPermiso: permiso.id } },
          update: {},
          create: { idRol: rol.id, idPermiso: permiso.id },
        });
      }
    }
  }
  console.log(`  ${rolesData.length} roles cargados con permisos.`);

  // --- Usuario admin de desarrollo ---
  const passwordHash = hash('sha256', 'admin123');
  const adminUser = await prisma.sysUsuario.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash,
      nombreCompleto: 'Administrador SECCAP',
      email: 'admin@seccap.local',
    },
  });

  const adminRol = await prisma.sysRol.findUnique({ where: { nombre: 'admin' } });
  if (adminRol) {
    await prisma.sysUsuarioRol.upsert({
      where: { idUsuario_idRol: { idUsuario: adminUser.id, idRol: adminRol.id } },
      update: {},
      create: { idUsuario: adminUser.id, idRol: adminRol.id },
    });
  }
  console.log('  Usuario admin de desarrollo creado.');

  // --- Usuario consultor de desarrollo ---
  const consultorUser = await prisma.sysUsuario.upsert({
    where: { username: 'consultor' },
    update: {},
    create: {
      username: 'consultor',
      passwordHash: hash('sha256', 'consultor123'),
      nombreCompleto: 'Consultor de Prueba',
      email: 'consultor@seccap.local',
    },
  });

  const consultorRol = await prisma.sysRol.findUnique({ where: { nombre: 'consultor' } });
  if (consultorRol) {
    await prisma.sysUsuarioRol.upsert({
      where: { idUsuario_idRol: { idUsuario: consultorUser.id, idRol: consultorRol.id } },
      update: {},
      create: { idUsuario: consultorUser.id, idRol: consultorRol.id },
    });
  }
  console.log('  Usuario consultor de desarrollo creado.');

  // --- Usuario auditor de desarrollo ---
  const auditorUser = await prisma.sysUsuario.upsert({
    where: { username: 'auditor' },
    update: {},
    create: {
      username: 'auditor',
      passwordHash: hash('sha256', 'auditor123'),
      nombreCompleto: 'Auditor de Prueba',
      email: 'auditor@seccap.local',
    },
  });

  const auditorRol = await prisma.sysRol.findUnique({ where: { nombre: 'auditor' } });
  if (auditorRol) {
    await prisma.sysUsuarioRol.upsert({
      where: { idUsuario_idRol: { idUsuario: auditorUser.id, idRol: auditorRol.id } },
      update: {},
      create: { idUsuario: auditorUser.id, idRol: auditorRol.id },
    });
  }
  console.log('  Usuario auditor de desarrollo creado.');

  // --- Configuraciones iniciales ---
  const configs = [
    { clave: 'session.timeout_minutes', valor: '480', tipo: 'int', descripcion: 'Timeout de sesión en minutos', modificableRuntime: true },
    { clave: 'session.max_intentos_fallidos', valor: '5', tipo: 'int', descripcion: 'Intentos fallidos antes de bloquear cuenta', modificableRuntime: true },
    { clave: 'session.bloqueo_minutos', valor: '30', tipo: 'int', descripcion: 'Duración del bloqueo de cuenta en minutos', modificableRuntime: true },
    { clave: 'cache.ttl_catalogos_segundos', valor: '3600', tipo: 'int', descripcion: 'TTL de caché de catálogos en segundos', modificableRuntime: true },
    { clave: 'api.timeout_ms', valor: '10000', tipo: 'int', descripcion: 'Timeout de llamadas a la API externa en ms', modificableRuntime: true },
    { clave: 'api.base_url', valor: 'http://localhost:3002', tipo: 'string', descripcion: 'URL base de la API del Área de Personal', modificableRuntime: false },
  ];

  for (const c of configs) {
    await prisma.sysConfiguracion.upsert({
      where: { clave: c.clave },
      update: {},
      create: c,
    });
  }
  console.log(`  ${configs.length} configuraciones cargadas.`);

  console.log('Seed: finalizado.');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
