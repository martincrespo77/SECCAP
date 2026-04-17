# Estructura de Desglose del Trabajo (EDT / WBS) — SECCAP

La EDT se descompone en base a entregables físicos, funcionales o técnicos, adoptando el ciclo de vida del desarrollo propuesto.

## Esquema Visual de Entregables

```text
1. SECCAP — Consulta Segura de Capacidades y Aptitudes del Personal
├── 1.1 Gestión del Proyecto (Documentación PMBOK)
│   ├── 1.1.1 Planes Subsidiarios y Acta Inicial
│   ├── 1.1.2 Requisitos y Análisis (Iterativos)
│   └── 1.1.3 Cierre y Aceptación Final
├── 1.2 Arquitectura e Infraestructura Base
│   ├── 1.2.1 Repositorios y Control de Versiones Setups
│   ├── 1.2.2 Setup Base de Datos Local Mínima
│   ├── 1.2.3 CI/CD, Migraciones de Esquema y Versionado Semántico
│   └── 1.2.4 Conexión de prueba (Handshake) con API Externa
├── 1.3 Desarrollo del Backend (Capa de Integración / Proxy)
│   ├── 1.3.1 Módulo de Autenticación, JWT/Sesiones y Cookies seguras
│   ├── 1.3.2 Controlador Proxy y Validadores de Filtros
│   ├── 1.3.3 Transformador y Selector de Respuestas de API a DTO.
│   └── 1.3.4 Módulo de Auditoría y Control de Riesgos/Errores (Logs)
├── 1.4 Desarrollo del Frontend (Cliente Web Moderno)
│   ├── 1.4.1 Maquetación de Layout, Ruteo y Componentes Base
│   ├── 1.4.2 Vistas de Login y Recupero
│   ├── 1.4.3 Pantalla Dinámica de Búsqueda Multiparámetro
│   └── 1.4.4 Pantalla de Detalle Autorizado por Rol
├── 1.5 Calidad y Pruebas
│   ├── 1.5.1 Pruebas de Carga e Inyección al Backend Proxy
│   ├── 1.5.2 Pruebas de Autorización y Principio de Menor Privilegio (RBAC)
│   └── 1.5.3 Pruebas de Aceptación de Usuario (UAT)
└── 1.6 Despliegue, Implantación y Formación
    ├── 1.6.1 Pase a Entorno Productivo
    ├── 1.6.2 Redacción del Manual de Usuario
    └── 1.6.3 Sesión de Capacitación y Transferencia Técnica
```

## Diccionario de la EDT (Muestra Simplificada)

| ID EDT | Entregable / Paquete de Trabajo | Descripción del Paquete de Trabajo | Criterio de Aceptación |
| :--- | :--- | :--- | :--- |
| **1.2.2** | Setup BD Local Mínima | Creación de base de datos relacional (PostgreSQL 16) para autenticación, roles, sesiones, auditoría y configuraciones del sistema. | Scripts de migración inicial probados que despliegan la BD de RBAC, auditoría y configuraciones exclusivamente. |
| **1.3.2** | Controlador Proxy | Capa en backend para recibir solicitudes del frontend y consultar de forma segura los datos a la API institucional, utilizando credenciales de servidor a servidor (o tokens delegados). | Todas las solicitudes a la API institucional pasan obligadamente por este proxy; el frontend no accede a la API por diseño y política de CORS. |
| **1.4.3** | Pantalla de Búsquedas | UI React donde el operador selecciona filtros basados en capacidades y aptitudes y hace un `submit`. | Renderiza tabla visual Reactiva. Controla estados de Carga/Load usando Axios. |
| **1.5.2** | Pruebas de Autorización | Escenarios donde interactúan cuentas con permisos distintos buscando validar fallos en RBAC. | Rol inferior consultando datos protegidos deberá recibir `403 Forbidden` o el objeto con menos campos (filtrado automático). |
