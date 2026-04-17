---
description: "Fase 6: Implantación y Cierre. Despliegue a producción, manual de usuario, capacitación, informe de cierre, lecciones aprendidas, acta de aceptación."
agent: "documentacion"
---
# Fase 6: Implantación y Cierre

## Objetivo de esta fase
Desplegar el sistema en producción, capacitar a los usuarios, cerrar formalmente el proyecto y documentar lecciones aprendidas.

## Contexto
Revisá [11_implantacion.md](../../DOCUMENTOS/11_implantacion.md) para el plan de implantación.
Revisá [12_cierre.md](../../DOCUMENTOS/12_cierre.md) para el formato de cierre.

## Tareas de esta fase

### 1. Preparación del entorno productivo
- Migración de BD en servidor productivo (seeder de Super Admin)
- Variables `.env` productivas configuradas (tokens API reales)
- Build de frontend: `npm run build` → archivos estáticos
- Verificar que `.env` y credenciales NO están en el repositorio

### 2. Despliegue
- Colocar archivos estáticos del frontend en servidor web (Apache/Nginx)
- Iniciar servicio backend proxy
- Configurar CORS con origen productivo
- Smoke test: login → primera búsqueda real

### 3. Manual de usuario
- Crear en `docs/manual_usuario.md`
- Contenido visual centrado en la interacción web
- Secciones: login, filtros, búsqueda, detalle, exportación

### 4. Capacitación
- Taller de ~2 horas para operadores de RRHH
- Temario: ingreso seguro, módulo de filtros, exportación, auditoría (admin)
- Registrar asistencia

### 5. Cierre formal
- Completar `12_cierre.md` con:
  - Acta de aceptación firmada
  - Lista de documentos traspasados
  - Lecciones aprendidas REALES (no plantilla)
- Actualizar todos los documentos PMBOK con estado final

### 6. Conversión
- No hay conversión de sistema anterior (el sistema es nuevo)
- Solo carga de usuarios operadores según dictamine el cliente

## Entregable final de fase
- Sistema en producción funcionando
- Manual de usuario entregado
- Capacitación realizada
- Acta de aceptación firmada
- Todos los documentos PMBOK en estado final
- Repositorio con código fuente, historial Git y documentación completa
