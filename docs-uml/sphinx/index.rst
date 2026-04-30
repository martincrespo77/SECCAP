SECCAP — Documentación Técnica
================================

.. meta::
   :description: Documentación técnica del Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal (SECCAP).
   :keywords: SECCAP, arquitectura, UML, documentación, Node.js, React, PostgreSQL

**Versión:** 0.1.0 |
**Sistema:** SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

.. note::
   Esta documentación es de uso interno. No publicar en entornos públicos sin ejecutar el proceso de sanitización.

----

.. toctree::
   :maxdepth: 2
   :caption: Arquitectura

   architecture/overview
   architecture/layers
   architecture/decisions

.. toctree::
   :maxdepth: 2
   :caption: Diagramas UML

   diagrams/index
   diagrams/use_cases
   diagrams/classes
   diagrams/sequences
   diagrams/activity
   diagrams/components
   diagrams/deployment
   diagrams/er

.. toctree::
   :maxdepth: 1
   :caption: Contratos

   api/index

.. toctree::
   :maxdepth: 1
   :caption: Referencia

   glossary

----

Resumen del sistema
-------------------

SECCAP es un sistema web que permite consultar de forma segura las capacidades y aptitudes del personal, 
integrándose con la API institucional del Área de Personal mediante una capa proxy desacoplada.

.. list-table:: Stack tecnológico
   :header-rows: 1
   :widths: 20 40 40

   * - Capa
     - Tecnología
     - Responsabilidad
   * - Frontend
     - React 19 + TypeScript + Vite + Tailwind CSS 4
     - SPA con filtros jerárquicos, consulta y resultados
   * - Backend
     - Node.js 22 + Express 5 + TypeScript
     - Proxy, validación, RBAC, auditoría
   * - BD Local
     - PostgreSQL 16 + Prisma 7
     - Usuarios, roles, sesiones, auditoría, config
   * - API Ext.
     - API del Área de Personal (solo lectura)
     - Fuente institucional de formaciones y aptitudes
   * - Seguridad
     - JWT, RBAC, Helmet, mínimo privilegio
     - Autenticación, autorización, trazabilidad
