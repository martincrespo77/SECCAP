---
description: "Fase 4: Desarrollo del Frontend Funcional. Componentes React, login, dashboard, filtros jerárquicos, tablas de resultados, detalle de ficha, vistas por rol."
agent: "frontend"
---
# Fase 4: Desarrollo del Frontend Funcional

## Objetivo de esta fase
Construir la interfaz web completa con React, implementando login, búsquedas con filtros jerárquicos, tablas de resultados y vistas adaptadas por rol.

## Contexto
Revisá [03_edt.md](../../DOCUMENTOS/03_edt.md) sección 1.4 (Desarrollo del Frontend).
Revisá [09_requisitos.md](../../DOCUMENTOS/09_requisitos.md) secciones 4 y 5 para la estructura de filtros.
Revisá [Contexto.md](../../Contexto.md) para el detalle completo de filtros jerárquicos.

## Pantallas a desarrollar

### 1. Login y recupero (EDT 1.4.2)
- Formulario de autenticación (usuario/contraseña)
- Manejo de errores de login (credenciales inválidas, servidor caído)
- Redirección post-login al dashboard

### 2. Layout base (EDT 1.4.1)
- Header con usuario logueado y logout
- Sidebar de navegación
- Rutas protegidas (redirect a login si no hay sesión)
- Componente de loading global

### 3. Dashboard (EDT 1.4.1)
- Vista principal post-login
- Resumen o accesos directos según rol

### 4. Pantalla de búsqueda multiparámetro (EDT 1.4.3)
Esta es la pantalla más importante del sistema.

**Filtros jerárquicos (en orden):**
1. Tipo de formación: Ámbito civil / Ámbito militar / Idioma
2. Categoría: depende del tipo (11 categorías militares, tipos de acreditación idioma)
3. Subcategoría/Aptitud: catálogo dependiente de la categoría
4. Filtros transversales: vigencia, documentación, persona, unidad, fechas

**Comportamiento:**
- Al seleccionar Tipo → se habilita el bloque correspondiente
- Al seleccionar Categoría → se cargan dinámicamente las subcategorías desde el backend
- Los dropdowns se alimentan de endpoints `/formacion/catalogos/*`
- Debe haber un botón "Buscar" que ejecute la consulta
- Estados: cargando, sin resultados, error de conexión

**Resultados:**
- Tabla paginada y ordenable
- Posibilidad de exportar a pantalla/PDF básico
- Click en fila → navega al detalle

### 5. Pantalla de detalle (EDT 1.4.4)
- Ficha completa de capacidades/aptitudes de una persona
- Campos visibles según rol del usuario
- Botón de descarga de certificado si existe

### 6. Panel admin (solo rol Admin)
- CRUD de usuarios locales del sistema
- Vista de logs de auditoría

## Reglas de implementación
- TypeScript estricto (interfaces para cada respuesta de API)
- Estados: loading, error, empty, success
- Fallbacks amigables (nunca stack traces)
- Axios con interceptors para manejo global de auth y errores
- Todas las llamadas al backend proxy, nunca a la API institucional directamente

## Entregable final de fase
- Frontend funcional conectado al backend proxy
- Todas las pantallas operativas
- Filtros jerárquicos funcionando con datos reales o mock
