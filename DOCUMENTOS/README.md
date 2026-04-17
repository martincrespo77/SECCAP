# Documentación del Proyecto: SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

Este repositorio contiene la documentación formal del proyecto adaptada a los estándares **PMBOK** y con enfoque particular al ciclo de vida del desarrollo de software (enfoque iterativo e incremental).

La solución se centra en la consulta segura y filtrada de capacidades y aptitudes del personal a través de una API institucional de solo lectura, empleando una arquitectura desacoplada con frontend, backend proxy y base de datos local mínima.

## Índice Estructural

La carpeta `DOCUMENTOS` incluye los siguientes archivos `.md`, que cubren las fases clave de gestión del proyecto de software:

1. [**01_acta_constitucion.md**](./01_acta_constitucion.md): Autorización formal, objetivos primarios, alcance preliminar y justificación del caso de negocio.
2. [**02_alcance.md**](./02_alcance.md): Plan de alcance, definición clara de qué entra, qué no entra en el proyecto y los criterios de aceptación.
3. [**03_edt.md**](./03_edt.md): Estructura de Desglose del Trabajo (EDT/WBS) y su correspondiente diccionario.
4. [**04_cronograma.md**](./04_cronograma.md): Línea base de tiempos adaptada a entregas iterativas y dependencias externas (API de personal).
5. [**05_costos.md**](./05_costos.md): Presupuesto de alto nivel y línea base de costos estimada para infraestructura y horas de trabajo.
6. [**06_riesgos.md**](./06_riesgos.md): Identificación exhaustiva de riesgos y matriz/registro (ej.: cambios en la API institucional).
7. [**07_calidad.md**](./07_calidad.md): Aseguramiento de accesos, respuesta del sistema, auditoría de consultas.
8. [**08_comunicaciones.md**](./08_comunicaciones.md): Plan para coordinar con el cliente ante requerimientos no cerrados e interesados clave (RRHH).
9. [**09_requisitos.md**](./09_requisitos.md): Detalle técnico de requerimientos funcionales y no funcionales, reglas de negocio y Casos de Uso del proxy.
10. [**10_pruebas.md**](./10_pruebas.md): Planificación de verificación del backend como proxy, control de acceso RBAC, UX en React y aseguramiento contra fallas de la API externa.
11. [**11_implantacion.md**](./11_implantacion.md): Plan de despliegue, conversiones de los ambientes y capacitación a los operadores.
12. [**12_cierre.md**](./12_cierre.md): Informe de cierre, actas de aceptación técnica y lecciones aprendidas formales.

---
> **Nota de Metodología:** Dado que los requerimientos iniciales no están completamente cerrados y existe una fuerte dependencia hacia una API externa, el proyecto se ejecuta bajo un **Ciclo de Vida Iterativo e Incremental**. Las tecnologías base implican un **Frontend (React/TypeScript/Vite)** y un **Backend** funcionando como *proxy de integración seguro*, junto con una base de datos local enfocada exclusivamente en autenticación, roles, auditoría y configuraciones, respetando la fuente de la verdad institucional.
