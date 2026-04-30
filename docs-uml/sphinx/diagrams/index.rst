Diagramas UML
==============

Esta sección centraliza todos los diagramas UML del sistema SECCAP.
Los diagramas se generan desde archivos fuente PlantUML (``.puml``) ubicados en ``diagrams/plantuml/``.

.. note::
   Para regenerar los diagramas, ejecutar desde la raíz de ``docs-uml/``::

      python scripts/render_plantuml.py

.. toctree::
   :maxdepth: 1

   use_cases
   classes
   sequences
   activity
   components
   deployment
   er

Orden de lectura recomendado
-----------------------------

.. list-table::
   :header-rows: 1
   :widths: 10 30 60

   * - N°
     - Diagrama
     - Qué muestra
   * - 1
     - :doc:`use_cases`
     - Actores y 15 casos de uso con include/extend
   * - 2
     - :doc:`activity`
     - Flujo operativo completo de una consulta
   * - 3
     - :doc:`sequences`
     - Flujo detallado de consulta, login, auditoría y descarga
   * - 4
     - :doc:`classes`
     - Modelo de análisis BCE (Boundary-Control-Entity)
   * - 5
     - :doc:`er`
     - Esquema de la BD local (9 tablas)
   * - 6
     - :doc:`components`
     - Componentes de la arquitectura y sus conexiones
   * - 7
     - :doc:`deployment`
     - Nodos lógicos de despliegue y restricciones de seguridad
