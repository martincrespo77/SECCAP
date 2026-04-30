Clases de Análisis BCE
=======================

El diagrama de clases de análisis sigue el patrón **Boundary-Control-Entity (BCE)**, complementado con una capa de integración.

Paquetes
---------

**Boundary**
   Clases que representan la interfaz con el usuario (pantallas del frontend).
   Cada pantalla corresponde a un componente React.

**Control**
   Controladores que orquestan la lógica de negocio en el backend.
   Implementados como módulos Express con servicios internos.

**Entity**
   Objetos del dominio que se persisten en la BD local o son transitorios.
   Las entidades transitorias (``ResultadoConsulta``, ``FiltroConsulta``) no se almacenan.

**Integration**
   Componentes de integración con la API institucional.
   Implementan el patrón Adapter / Anti-Corruption Layer.

.. note::
   ``ResultadoConsulta`` y ``FiltroConsulta`` son objetos transitorios.
   Se construyen en memoria durante el ciclo de una solicitud y no se persisten en la BD local.

Diagrama
---------

.. uml:: ../../diagrams/plantuml/02_clases_analisis_bce.puml
   :caption: Clases de análisis BCE — SECCAP
