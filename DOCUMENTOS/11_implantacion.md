# Plan de Implantación y Capacitación — SECCAP

> Estado actualizado al cierre de Fase 5 (QA aprobado 101/101 backend, 28/28 frontend). La implantación institucional real queda sujeta a la validación humana y autorización del Área de Sistemas — ver sección 6 (pendientes institucionales).

## 1. Estrategia de implantación

SECCAP es un sistema desacoplado con tres componentes bajo `SECCAP/`: frontend (React/Vite), backend proxy (Node/Express/Prisma) y mock-api (solo desarrollo). No reemplaza a ningún sistema previo y opera **Read-Only** sobre los datos institucionales.

El proceso de implantación se organiza en tres etapas:

### 1.1 Preparación del entorno

- Provisión de PostgreSQL 16 y creación de la BD local (usuarios, roles, permisos, sesiones, auditoría, configuración y caché — sin datos de personal).
- Aplicación de migraciones Prisma (`npm run db:migrate:deploy`) y seed idempotente (`npm run db:seed`).
- Configuración de variables de entorno según `SECCAP/.env.example`. `JWT_SECRET` debe tener al menos 16 caracteres (validado en el arranque del backend).
- Definición de la URL real del backend (`VITE_BACKEND_URL`) antes del build del frontend.

### 1.2 Despliegue de artefactos

- Frontend: `npm run build` produce `SECCAP/frontend/dist/`. Se publica como contenido estático en el servidor web que defina el Área de Sistemas (Apache/Nginx).
- Backend: se despliega el servicio Node y se verifica puerto (`3001` por defecto).
- Mock-api: **no se despliega en producción**. Se reemplaza por la API institucional real cuando esté disponible.

### 1.3 Smoke test institucional

- `GET /health` del backend debe responder `status: ok` con `checks.database: ok`.
- Login operativo con un usuario inicial provisto por el administrador.
- Ejecución de al menos una consulta de cada tipo (militar, idioma, civil) contra la API real.
- Verificación de que la auditoría registra cada consulta.

El procedimiento detallado y los comandos están en [`SECCAP/docs-tecnicos/implantacion.md`](../SECCAP/docs-tecnicos/implantacion.md).

## 2. Plan de conversión

El sistema **no convierte datos históricos**: los datos del personal siguen residiendo en la base institucional y se consultan vía API. La única carga inicial es la de usuarios operadores del sistema (altas manuales por el administrador) y de configuraciones locales (cargadas por el seed).

## 3. Plan de capacitación

Taller único de 2 horas dirigido a operadores del Área de Personal.

- Material de apoyo: [`SECCAP/docs/manual_usuario.md`](../SECCAP/docs/manual_usuario.md).
- Guión, agenda y criterios de competencia mínima: [`SECCAP/docs-tecnicos/capacitacion_operadores.md`](../SECCAP/docs-tecnicos/capacitacion_operadores.md).

Temario resumido:

1. Ingreso y manejo de sesión.
2. Consulta con filtros jerárquicos (tipo → categoría → aptitud; tipo → idioma → institución).
3. Interpretación de resultados y paginación.
4. Detalle de formación y descarga de certificados.
5. Diferencias por rol (consultor / auditor / admin).
6. Errores frecuentes y escalamiento.

## 4. Entregables documentales

Al cierre del proyecto se entregan los siguientes artefactos:

| Artefacto | Ubicación |
|---|---|
| Código fuente completo | Repositorio Git (rama principal) |
| Manual de usuario | [`SECCAP/docs/manual_usuario.md`](../SECCAP/docs/manual_usuario.md) |
| Guía técnica general | [`SECCAP/README.md`](../SECCAP/README.md) |
| Guía de implantación | [`SECCAP/docs-tecnicos/implantacion.md`](../SECCAP/docs-tecnicos/implantacion.md) |
| Guía de operación y diagnóstico | [`SECCAP/docs-tecnicos/operacion.md`](../SECCAP/docs-tecnicos/operacion.md) |
| Guía de capacitación | [`SECCAP/docs-tecnicos/capacitacion_operadores.md`](../SECCAP/docs-tecnicos/capacitacion_operadores.md) |
| Guía de QA | [`SECCAP/docs-tecnicos/qa.md`](../SECCAP/docs-tecnicos/qa.md) |
| Documentación PMBOK completa | `DOCUMENTOS/` |
| UML (casos de uso, clases, secuencia, componentes, despliegue, ER) | `UML/` |

## 5. Criterios de aceptación técnica del pase

Antes del pase a producción institucional debe cumplirse:

- [x] `scripts/qa-local.ps1` en verde (lint, type-check, tests y build de backend y frontend).
- [x] Tests de integración backend en verde contra PostgreSQL real (101/101).
- [x] Tests de frontend en verde (28/28).
- [x] Prisma validate en verde.
- [ ] `JWT_SECRET` productivo provisto por el Área de Sistemas.
- [ ] `VITE_BACKEND_URL` apuntando al host real.
- [ ] Contrato de integración con la API institucional firmado y el `MOCK_API_URL` reemplazado por el host real.
- [ ] Usuarios productivos iniciales creados y `admin/admin123` de desarrollo eliminado.
- [ ] Hash de password migrado de SHA-256 a bcrypt/argon2.
- [ ] Plan de backup acordado con el Área de Sistemas.

Los primeros cuatro ítems quedaron verificados en Fase 5.3. Los restantes son pendientes institucionales (sección 6).

## 6. Pendientes institucionales y validaciones humanas

El proyecto entrega un sistema funcional y probado en un entorno local. El pase a producción real requiere decisiones que no son responsabilidad del equipo de desarrollo:

- Patrocinador y director del proyecto formalmente designados (ver `01_acta_constitucion.md`).
- Servidor institucional de publicación (frontend y backend).
- Dominio, certificados TLS y reglas de firewall.
- Credenciales y contrato de integración con la API institucional del Área de Personal.
- Política de backup y monitoreo definida por el Área de Sistemas.
- Aprobación de seguridad de la información (incluye migración de hash de password).
- Acta de aceptación firmada por el cliente (ver `12_cierre.md`).

## 7. Referencias

- [`SECCAP/docs-tecnicos/implantacion.md`](../SECCAP/docs-tecnicos/implantacion.md) — procedimiento técnico paso a paso.
- [`SECCAP/docs-tecnicos/operacion.md`](../SECCAP/docs-tecnicos/operacion.md) — operación y diagnóstico.
- [`SECCAP/docs-tecnicos/qa.md`](../SECCAP/docs-tecnicos/qa.md) — QA y pruebas.
- `DOCUMENTOS/10_pruebas.md` — plan de pruebas formal.
- `DOCUMENTOS/12_cierre.md` — cierre y lecciones aprendidas.
