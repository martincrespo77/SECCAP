Casos de Uso
=============

El diagrama de casos de uso describe los actores, sus relaciones de herencia y los 15 casos de uso principales del sistema SECCAP.

Actores
-------

.. list-table::
   :header-rows: 1
   :widths: 20 80

   * - Actor
     - Descripción
   * - **Usuario del sistema**
     - Actor base. Todo usuario autenticado hereda este rol.
   * - **Consultor**
     - Puede consultar formaciones, ver detalle y descargar documentos.
   * - **Administrador**
     - Hereda las funciones del Consultor y además gestiona usuarios, roles y configuraciones.
   * - **Auditor**
     - Solo puede consultar los logs de auditoría.
   * - **API Institucional RRHH**
     - Actor externo. Responde a consultas del backend proxy.
   * - **Módulo de Auditoría Local**
     - Actor interno. Registra toda acción en ``audit_log``.

Casos de uso principales
-------------------------

Los 15 casos de uso del sistema son:

* CU-01: Iniciar sesión
* CU-02: Cerrar sesión
* CU-03: Seleccionar tipo de formación
* CU-04: Cargar catálogos dependientes
* CU-05: Aplicar filtros de consulta
* CU-06: Ejecutar consulta (``<<include>>`` Registrar auditoría)
* CU-07: Ver resultados
* CU-08: Ver detalle de registro (``<<extend>>`` Descargar documento)
* CU-09: Descargar documento respaldatorio (``<<include>>`` Registrar auditoría)
* CU-10: Consultar logs de auditoría
* CU-11: Gestionar usuarios (``<<include>>`` Registrar auditoría)
* CU-12: Gestionar roles y permisos (``<<include>>`` Registrar auditoría)
* CU-13: Verificar estado del sistema
* CU-14: Registrar auditoría
* CU-15: Gestionar error de integración

Diagrama
---------

.. uml:: ../../diagrams/plantuml/01_casos_uso_general.puml
   :caption: Casos de uso general — SECCAP
