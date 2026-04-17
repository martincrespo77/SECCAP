# Plan de Gestión de Comunicaciones — SECCAP

## 1. Objetivo del Plan de Comunicaciones
Regular, sistematizar y definir el qué, cuándo, cómo y entre quién fluirá la información durante el desarrollo del proyecto SECCAP; fundamental debido al escenario iterativo sin requisitos cerrados y con dependencias infraestructurales significativas.

## 2. Matrices y Canales de Comunicación

### 2.1 Con el Patrocinador / Dueño del Producto (Recursos Humanos Institucional)
*   **Qué:** Avances de fase, revisión funcional de Módulos entregados, impedimentos graves. Relevamiento de la validación de filtros de Aptitudes. 
*   **Cuándo:** Reuniones formales al cierre de cada Incremento / Fase (Ejm: Semanal, Quincenal), o excepcionalmente al existir dependencias de la matriz R-03 (caída de sistemas y bloqueos).
*   **Cómo:** Reuniones presenciales o por videollamadas con envío previo de temario (agenda). Documentos en repositorios en la nube, presentaciones visuales del MVP. 

### 2.2 Con Soporte de Infraestructura / Backend Externo
*   **Qué:** Confirmación de Estructura de Endpoints de la API base. Petición de claves API, tokens y dominios o IPs autorizadas (Origin). Notificación de bugs sistémicos en la capa servida por ellos.
*   **Cuándo:** Momentos puntuales según demanda, por inicio del proyecto o caídas de los endpoints sin previo aviso.
*   **Cómo:** Sistema de mesa de ayuda interno de la Institución (Tickets, emails formales a las áreas responsables de IT), chat corporativo (Slack, Teams, o alternativas institucionales).

### 2.3 Seguimiento Técnico y Académico
*   **Qué:** Revisión estructural de código y documentación técnica como el presente PMBOK, validación de las arquitecturas aplicadas en React / Proxy. Seguimiento del avance en el marco académico (PPS).
*   **Cuándo:** Permanente. Actualizaciones diarias/semanales.
*   **Cómo:** Control del Repositorio de Control de Versiones (Git), tableros locales o Kanban (Trello, Jira) para llevar historias de usuario e hitos de requerimientos. Herramientas técnicas documentales directas. 

## 3. Glosario Compartido
Asegurar que palabras muy repetidas en Requisitos sean homologadas:
- **Aptitud:** Habilidad o competencia específica adquirida mediante formación o experiencia, acreditada formalmente por la institución. En el contexto militar, abarca aptitudes especiales operacionales, técnicas, de ambiente geográfico, entre otras (ver catálogo en 09_requisitos.md).
- **Capacidad:** Conjunto de conocimientos, destrezas y condiciones que habilitan al personal para desempeñar funciones o roles determinados. Se diferencia de aptitud en que la capacidad es más amplia y puede englobar múltiples aptitudes.
- **Capacitación:** Proceso formal de instrucción o entrenamiento que resulta en la obtención de una aptitud o certificación específica (ej. Instructor de Tiro, Esquiador Militar).
- **Formación Profesional:** Categoría general que agrupa las acreditaciones del personal en tres ámbitos: civil, militar e idioma.
- **Proxy Local:** Hace referencia únicamente al Backend servidor local de esta aplicación que media la respuesta, NO a firewalls o servidores de la red física.
- **Auditoría Interna:** Tabla SQL en el sistema desarrollado, de índole meramente transaccional (Logs). Registra usuario, timestamp, endpoint consultado, filtros aplicados y resultado.
- **RBAC (Role-Based Access Control):** Modelo de control de acceso donde los permisos se asignan a roles, y los usuarios heredan los permisos del rol asignado. Define qué campos de la respuesta API puede visualizar cada operador.
- **DTO (Data Transfer Object):** Objeto tipado que modela la estructura de datos en tránsito entre la API institucional y el frontend, sin persistirse en la BD local.
- **Filtro Jerárquico:** Sistema de consulta donde cada nivel de filtro depende del anterior (Tipo de formación → Categoría → Subcategoría/Aptitud → Filtros transversales).
