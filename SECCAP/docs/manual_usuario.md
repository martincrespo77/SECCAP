# Manual de Usuario — SECCAP

**Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal**

Este manual está orientado a operadores finales (Área de Personal). Describe cómo ingresar al sistema, hacer consultas, ver detalle de formaciones y descargar certificados. No requiere conocimiento técnico.

---

## 1. ¿Qué hace SECCAP?

SECCAP permite consultar, de manera segura y auditada, las capacidades, aptitudes y formaciones del personal (militar, civil, idiomas).

- El sistema **no modifica** datos de personal. Solo **consulta**.
- Todas las búsquedas quedan **registradas** (auditoría).
- El acceso está controlado por **usuario, contraseña y rol**.

---

## 2. Ingreso al sistema

1. Abrir el navegador en la URL que provea el Área de Sistemas. En entorno de prueba: `http://localhost:5173`.
2. Aparece la pantalla de **Iniciar sesión**.
3. Ingresar usuario y contraseña.
4. Presionar **Ingresar**.

Si las credenciales son correctas, se abre el tablero principal.

Si no lo son, aparece el mensaje:

> Usuario o contraseña incorrectos.

Tras **5 intentos fallidos**, la cuenta se bloquea por 30 minutos. En ese caso contactar al administrador.

---

## 3. Pantalla principal

Al iniciar sesión se accede a `/app`:

- **Encabezado**: nombre del usuario logueado y botón **Cerrar sesión**.
- **Navegación lateral**: acceso a **Consulta**.
- **Contenido**: mensaje de bienvenida e información del rol del usuario.

---

## 4. Cerrar sesión

Presionar **Cerrar sesión** en el encabezado. El sistema:

1. Cierra la sesión en el servidor (revoca el token).
2. Limpia datos locales del navegador.
3. Redirige a la pantalla de **Iniciar sesión**.

La sesión tiene una **expiración fija** a partir del momento del login (por defecto 8 horas, configurable por el Área de Sistemas en `JWT_EXPIRES_IN`). Al llegar al vencimiento el servidor rechaza el token; es necesario volver a iniciar sesión. No hay renovación automática por actividad.

---

## 5. Consulta de formaciones

Ir a **Consulta** desde el menú lateral (`/app/consulta`).

### 5.1 Filtro raíz: Tipo de formación

Es **obligatorio**. Hasta que no se elige un tipo, el botón **Buscar** está deshabilitado.

Valores posibles:

- **Militar** → habilita filtros por **Categoría militar** y **Aptitud / capacitación**.
- **Idioma** → habilita filtros por **Idioma**, **Nivel** e **Institución**.
- **Civil** → **no expone filtros adicionales**; la consulta devuelve todos los registros civiles disponibles.

### 5.2 Filtros jerárquicos

Los filtros dependientes **se habilitan en cadena**:

- En **Militar**: primero se elige **Categoría militar**, luego **Aptitud / capacitación** (el catálogo de aptitudes se carga según la categoría elegida).
- En **Idioma**: primero se elige **Idioma**, luego **Institución** (el catálogo de instituciones se carga según el idioma elegido). **Nivel** es independiente y opcional.

Al cambiar un filtro padre, los hijos se **vacían automáticamente** y los resultados previos se limpian.

### 5.3 Ejecutar la consulta

Presionar **Buscar**. El sistema:

1. Valida los filtros.
2. Consulta a la API institucional (vía el proxy seguro).
3. Devuelve los resultados en una tabla paginada.

Si la consulta tarda demasiado o el sistema institucional no responde, aparece un mensaje de error controlado.

---

> **Nota:** En esta versión del producto no hay filtros adicionales por DNI, legajo, apellido, unidad, jerarquía, estado de vigencia, fecha de vencimiento ni búsqueda libre de texto. Los filtros soportados son exclusivamente los listados en 5.1 y 5.2.

## 6. Resultados y paginación

La tabla de resultados muestra las siguientes columnas:

| Columna | Descripción |
|---|---|
| Apellido y nombre | Nombre completo del personal |
| Grado | Jerarquía / grado |
| Unidad | Unidad de destino |
| Tipo | Tipo de formación (militar, idioma, civil) |
| Estado | Estado de vigencia del registro |
| Detalle | Resumen del registro (categoría + aptitud, o idioma + nivel) |
| Acciones | Botón **Ver** para abrir el panel lateral de detalle |

> **Nota:** `DNI` y `Legajo` **no aparecen en la tabla** de resultados. Se muestran en el panel lateral de detalle (sección 7), y solo cuando el rol del usuario tiene el permiso correspondiente (`consulta:detalle`). El rol `auditor` no los ve.

Debajo de la tabla:

- Indicador `Mostrando X–Y de N · Página P de T`.
- Botones **Anterior** y **Siguiente**.
- Cantidad fija de 5 registros por página.

Al cambiar los filtros y volver a buscar, la paginación vuelve a la página 1.

---

## 7. Detalle de una formación

Al presionar **Ver** se abre un panel lateral con el detalle completo:

- **Persona**: apellido y nombre, grado, unidad, y — si el rol lo permite — DNI y legajo.
- **Militar**: categoría, aptitud/capacitación, compromiso de servicios.
- **Civil**: título e institución.
- **Idioma**: idioma, nivel, institución, tipo de acreditación.
- **Estado**: vigencia, fecha de vencimiento, observaciones.

### 7.1 Descargar certificado

Si la formación tiene certificado digital disponible, aparece el botón **Descargar certificado**.

- Al presionarlo se descarga el archivo (normalmente PDF).
- Si el usuario no tiene permiso de descarga, aparece:

  > No tenés permiso para descargar este certificado.

- Si el certificado no está disponible:

  > No hay certificado disponible para este registro.

Cerrar el detalle con el botón **Cerrar** del panel.

---

## 8. Mensajes de error frecuentes

| Mensaje | Qué significa | Qué hacer |
|---|---|---|
| Usuario o contraseña incorrectos. | Credenciales no válidas | Reintentar; si se repite, contactar al administrador |
| La sesión venció o no pudo validarse. Iniciá sesión nuevamente. | Token expirado o inválido | Volver a iniciar sesión |
| Permiso insuficiente. | El rol no tiene acceso a esa acción | Solicitar permiso al administrador |
| No se pudo obtener la información. | Error temporal de integración | Reintentar en unos minutos |
| No hay resultados para los filtros aplicados. | La consulta fue exitosa pero no hay coincidencias | Relajar filtros |

---

## 9. Diferencias por rol

El rol y los permisos los asigna el administrador del sistema en la base local. Los roles previstos en esta versión del producto son:

| Rol | Puede | No puede |
|---|---|---|
| **Consultor** | Consultar formaciones, ver detalle completo (incluye DNI y legajo), descargar certificados | Consultar auditoría |
| **Auditor** | Consultar formaciones, ver detalle (sin DNI ni legajo, podados por el backend), consultar auditoría vía API | Descargar certificados |
| **Admin** | Superset de permisos (consulta + auditoría + descarga) | — |

Observaciones importantes:

- Si un campo o botón no aparece en pantalla, generalmente se debe al rol asignado (por ejemplo, DNI y legajo no aparecen para `auditor`).
- En esta versión **no existe una pantalla de administración de usuarios ni endpoints administrativos expuestos**. El alta/baja de usuarios y la asignación de roles se hace vía seed de Prisma o consulta directa a la base local por parte del Área de Sistemas. Esto está identificado como trabajo futuro en `DOCUMENTOS/12_cierre.md`.
- La consulta de auditoría existe como endpoint del backend (`GET /auditoria`) pero **no tiene pantalla propia en el frontend** en esta entrega.

---

## 10. Qué no hace el sistema

- **No modifica** datos de personal: toda la información proviene del sistema institucional.
- **No exporta** masivamente datos: las consultas se realizan una a una, con filtros.
- **No reemplaza** otros sistemas: convive con el existente y agrega una capa segura de consulta.

---

## 11. Dónde pedir ayuda

- Problemas de acceso, contraseña o permisos: administrador del sistema.
- Errores técnicos persistentes: Área de Sistemas.
- Dudas sobre capacitación: coordinador designado por el Área de Personal.
