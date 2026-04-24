# Capacitación de Operadores — SECCAP

Fase 6. Material operativo para el taller de capacitación inicial de los operadores del Área de Personal que usarán SECCAP.

## 1. Objetivo

Que los operadores puedan realizar de forma autónoma las consultas permitidas por su rol, interpretar los resultados, descargar certificados cuando corresponda y reconocer los límites y mensajes de error del sistema.

## 2. Audiencia

- Operadores designados del Área de Personal.
- Perfil **Consultor** y **Auditor** (un grupo por cada rol, o un único grupo con material diferenciado).
- Administradores del sistema (sesión aparte, más corta, centrada en auditoría y operación). El alta/baja de usuarios se hace hoy vía seed o consulta directa a la base local; no hay UI administrativa en esta versión.

Requisitos previos de los asistentes: manejo básico de navegador web. No se requieren conocimientos técnicos.

## 3. Duración y formato

- **Duración total: 2 h**.
- Formato: taller presencial o remoto, con acceso en vivo al sistema en un entorno de prueba (mock-api + backend + frontend en una máquina del instructor o un servidor de staging).
- Material de apoyo: [manual_usuario.md](../docs/manual_usuario.md).

## 4. Agenda

| Bloque | Tema | Duración |
|---|---|---|
| 1 | Introducción al sistema y alcance real (qué hace y qué no) | 10 min |
| 2 | Ingreso al sistema, manejo de sesión, cierre de sesión, bloqueos | 15 min |
| 3 | Pantalla de consulta: filtro raíz y filtros jerárquicos | 25 min |
| 4 | Resultados: paginación, interpretación de columnas | 15 min |
| 5 | Detalle de formación y descarga de certificado | 15 min |
| 6 | Diferencias por rol (consultor vs auditor) | 10 min |
| 7 | Errores frecuentes y cómo reaccionar | 10 min |
| 8 | Práctica guiada con casos reales | 15 min |
| 9 | Preguntas y cierre | 5 min |

## 5. Checklist de demostración en vivo

El instructor debe reproducir al menos los siguientes flujos durante el taller:

- [ ] Ingreso correcto con credenciales válidas.
- [ ] Ingreso fallido (muestra mensaje controlado, no revela detalles internos).
- [ ] Restauración de sesión: recargar la página estando logueado y seguir logueado.
- [ ] Cierre de sesión manual y redirección a `/login`.
- [ ] Expiración forzada (token manualmente inválido) → mensaje `La sesión venció…`.
- [ ] Consulta **militar** con filtro jerárquico Categoría → Aptitud.
- [ ] Consulta **idioma** con filtro jerárquico Idioma → Institución.
- [ ] Consulta **civil** (sin filtros adicionales; devuelve todos los registros civiles disponibles).
- [ ] Paginación: navegar Anterior/Siguiente.
- [ ] Cambio de filtro raíz → limpieza automática de resultados.
- [ ] Apertura de detalle vía acción "Ver".
- [ ] Diferencia visual consultor vs auditor: con y sin DNI/legajo.
- [ ] Descarga exitosa de certificado.
- [ ] Intento de descarga sin permiso → mensaje controlado.
- [ ] Error de integración (mock-api caído) → mensaje controlado, sin exponer stack.

## 6. Criterios de competencia mínima

Al finalizar el taller, cada operador debe ser capaz de:

1. Iniciar y cerrar sesión correctamente.
2. Ejecutar al menos una consulta por cada tipo de formación (militar, idioma, civil).
3. Aplicar correctamente un filtro jerárquico hasta el segundo nivel.
4. Navegar entre páginas de resultados.
5. Abrir el detalle de una formación.
6. Descargar un certificado (si su rol lo permite) o identificar el mensaje de permiso denegado.
7. Reconocer los mensajes de error más comunes y saber a quién escalar.

Estos criterios se verifican con una práctica guiada corta sobre casos pre-preparados en el dataset de prueba.

## 7. Recursos necesarios

- Un servidor/equipo con el entorno completo levantado (ver [implantacion.md](implantacion.md)).
- Al menos 1 usuario de cada rol (`consultor`, `auditor`, `admin`) con credenciales conocidas por el instructor.
- Copia impresa o digital del manual de usuario.
- Proyector o pantalla compartida.

## 8. Registro de asistencia

Plantilla mínima que el coordinador debe firmar al cierre del taller (no inventar firmas ni datos institucionales; dejar en blanco hasta que el taller real ocurra):

| Nombre y apellido | Legajo | Área | Rol asignado | Firma |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

**Instructor:** ________________________  **Fecha:** ____ / ____ / ______

**Coordinador del Área de Personal:** ________________________

## 9. Pendientes del material

- Incorporar capturas de pantalla cuando exista el entorno institucional final.
- Ajustar catálogo civil cuando se releve formalmente (VAC-01).
- Ampliar bloque de administración si se agrega en el futuro un módulo de alta/baja de usuarios con UI dedicada (hoy fuera de alcance).

## 10. Referencias

- Manual de usuario: [../docs/manual_usuario.md](../docs/manual_usuario.md)
- Implantación: [implantacion.md](implantacion.md)
- Operación y diagnóstico: [operacion.md](operacion.md)
