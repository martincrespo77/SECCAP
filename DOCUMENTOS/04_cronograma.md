# Plan de Gestión del Cronograma — SECCAP

## 1. Enfoque de Planificación de Tiempos
Al ser un proyecto iterativo, el cronograma se organiza por **fases y componentes funcionales** (sprints o incrementos modulares técnicos). En lugar de planificar el día exacto en que se terminará cada línea de código (tipo Cascada), se define el bloque y el objetivo del ciclo, gestionando las dependencias duras.

## 2. Dependencias Duras Identificadas
1. No se pueden codificar las capas de validación del proxy **si no se cuenta con los JSON de respuesta de la API institucional en modo desarrollo**.
2. Las pruebas UAT no pueden realizarse si la base de datos institucional no provee registros con datos de prueba o anónimos para validar las consultas.

## 3. Línea Base y Fases (Draft)

Las fechas son referenciales para indicar porcentajes o semanas de vida útil del proyecto.

> **Nota:** El inicio formal de la ejecución se produce en el marco de una Práctica Profesional Supervisada (PPS), que constituye el hito de arranque académico e institucional.

| Fase / Incremento | Duración Estimada | Entregable Principal Asociado |
| :--- | :--- | :--- |
| **Fase 1: Preparación Estructural** | Semanas 1 a 2 | Repositorio formalizado, Documentación de alcance, UI de referencias en React + Tailwind preparada, Esqueleto del Backend. |
| **Fase 2: Conexión y Mapping API** | Semanas 3 a 5 | Backend se comunica orgánicamente con API Externa, obtiene datos crudos y consolida en DTO (Data Transfer Objects). |
| **Fase 3: Persistencia y Autenticación** | Semanas 6 a 7 | Desarrollo del Módulo de Login, Persistencia DB de Auditoría local y estructura de Roles. |
| **Fase 4: Frontend Funcional** | Semanas 8 a 10 | Búsquedas por filtros, validaciones de formularios y representación en tablas / módulos reactivos en pantalla. |
| **Fase 5: Afinación y Seguridad (QA)** | Semanas 11 a 12 | Tests de seguridad en el proxy y refinación de auditoría (logs transaccionales). |
| **Fase 6: Implantación y Cierre** | Semanas 13 a 14 | Despliegue en producción, documentación final (Manuales), presentación formal de cierre. |

## 4. Control del Cronograma
Al ser requerimientos no cerrados, al final de la Fase 2 o Fase 3 el cliente evaluará los datos obtenidos. Si surge que ciertos campos "no sirven como estaban pensados", se ajustarán en la siguiente Fase reduciendo o alterando las funcionalidades de UI, asimilando el cambio dentro de los límites de un incremento ágil.
