Flujo de Actividad
==================

El diagrama de actividad describe el flujo operativo completo de una consulta de formaciones, 
desde la selección del tipo de formación hasta la visualización de resultados.

Flujo principal
---------------

1. El usuario selecciona el tipo de formación (militar, idioma, civil).
2. El sistema carga los catálogos dependientes desde la API o desde caché.
3. El usuario aplica filtros jerárquicos.
4. El sistema valida los filtros en el backend (Zod).
5. El backend consulta a la API institucional mediante el adaptador ACL.
6. El sistema poda los campos de la respuesta según el rol del usuario.
7. El sistema registra la auditoría (INSERT inmutable).
8. El frontend muestra los resultados paginados.

Flujos alternativos
--------------------

- **API no disponible:** El sistema retorna error controlado con información de indisponibilidad parcial.
- **Sin resultados:** El sistema muestra mensaje informativo sin error.
- **JWT expirado:** El middleware Auth devuelve 401 y el frontend redirige a login.
- **Sin permiso:** El middleware RBAC devuelve 403.

Diagrama
--------

.. uml:: ../../diagrams/plantuml/05_actividad_flujo_consulta.puml
   :caption: Flujo de actividad — Consulta de formaciones
