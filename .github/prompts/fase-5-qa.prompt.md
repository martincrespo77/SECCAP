---
description: "Fase 5: Calidad y Seguridad (QA). Tests de integración, pruebas RBAC, seguridad OWASP, UAT, pentest básico, validación de auditoría."
agent: "qa"
---
# Fase 5: Calidad y Seguridad (QA)

## Objetivo de esta fase
Ejecutar el plan de pruebas completo, verificar seguridad y preparar el sistema para producción.

## Contexto
Revisá [10_pruebas.md](../../DOCUMENTOS/10_pruebas.md) para el plan de pruebas definido.
Revisá [07_calidad.md](../../DOCUMENTOS/07_calidad.md) para criterios de calidad.
Revisá [06_riesgos.md](../../DOCUMENTOS/06_riesgos.md) para riesgos a validar.

## Pruebas a ejecutar

### TS-01: Test de integración Backend ↔ API
- Verificar que el proxy se conecta correctamente a la API institucional
- Medir tiempo de respuesta (TTFB del proxy < 500ms sobre el tiempo base)
- Validar que DTOs mapean correctamente los campos
- Probar con endpoint sandbox/desarrollo

### TS-02: Test de autorización RBAC
- Login con rol Admin → debe ver todos los campos
- Login con rol Lector → debe recibir respuesta podada (sin campos sensibles)
- Request sin token → debe recibir 401
- Request con token de rol bajo a endpoint admin → debe recibir 403
- Intentar manipular JWT para escalar privilegios

### TS-03: Test funcional Frontend
- Verificar que los filtros jerárquicos cargan correctamente
- Seleccionar Tipo → verificar que Categoría se actualiza
- Ejecutar búsqueda → verificar tabla de resultados
- Navegar a detalle → verificar datos mostrados
- Probar estados: loading, error, vacío

### TS-04: UAT (User Acceptance Testing)
- Un usuario simula búsquedas reales de personal por aptitud
- Verificar que los resultados son correctos y útiles
- Validar exportación de datos
- Recoger observaciones del stakeholder

### Seguridad OWASP
- **Inyección SQL**: probar inputs maliciosos en filtros
- **XSS**: probar scripts en campos de texto
- **CORS**: verificar que solo orígenes autorizados pueden consultar
- **Exposición de datos**: verificar que el frontend no tiene credenciales
- **Auditoría**: verificar que cada consulta queda registrada con todos los metadatos

## Criterios de suspensión
- Si TS-01 falla → toda prueba de frontend queda suspendida
- Si TS-02 falla en caso crítico → no se pasa a UAT

## Entregable final de fase
- Reporte completo de cada prueba (PASS/FAIL/BLOQUEADO)
- Lista de vulnerabilidades encontradas con severidad
- Actualizar `10_pruebas.md` con resultados reales
- Actualizar `06_riesgos.md` si se materializó algún riesgo
