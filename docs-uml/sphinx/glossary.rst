Glosario
=========

.. glossary::

   ACL
      Anti-Corruption Layer. Patrón de diseño que aísla al dominio interno del contrato de un sistema externo.
      En SECCAP, el ``AdaptadorAPIPersonal`` implementa este patrón para proteger al sistema de cambios en la API institucional.

   API Institucional
      API REST de solo lectura provista por el Área de Personal. 
      Es la fuente de verdad para formaciones, capacitaciones y aptitudes del personal.

   audit_log
      Tabla PostgreSQL de registro inmutable de auditoría. 
      Solo admite operaciones INSERT. No existe UPDATE ni DELETE sobre esta tabla.

   JWT
      JSON Web Token. Estándar de tokens de autenticación firmados. 
      SECCAP usa HS256 (HMAC-SHA256) con expiración configurable.

   RBAC
      Role-Based Access Control. Control de acceso basado en roles.
      En SECCAP: roles admin, consultor y auditor con permisos configurables por módulo.

   Proxy
      En el contexto de SECCAP, el backend actúa como proxy entre el frontend y la API institucional.
      Valida, transforma, poda y audita cada solicitud antes de reenviarla y después de recibirla.

   Poda de campos
      Proceso de eliminar de la respuesta los campos a los que el rol del usuario no tiene acceso.
      Implementado en el Módulo Consulta después de recibir la respuesta de la API institucional.

   SPA
      Single Page Application. El frontend de SECCAP es una SPA React que se comunica con el backend via API REST.

   BCE
      Boundary-Control-Entity. Patrón de análisis OO que organiza las clases en límites (UI), 
      controladores (lógica) y entidades (datos).

   Prisma
      ORM (Object-Relational Mapper) para Node.js / TypeScript utilizado para acceder a PostgreSQL.
      SECCAP usa Prisma 7 con ``@prisma/adapter-pg``.

   TTL
      Time to Live. Tiempo de vida de una entrada de caché.
      En SECCAP, los catálogos de la API institucional se cachean en ``cache_catalogo`` con un TTL configurable.

   Manifiesto
      En el contexto del módulo ``docs-uml``, el archivo ``manifest.json`` que describe 
      nodos, capas, relaciones y diagramas del sistema para la vista interactiva.

   PlantUML
      Herramienta de generación de diagramas UML desde texto (archivos ``.puml``). 
      Requiere Java para renderizar a SVG/PNG.

   Furo
      Tema moderno para Sphinx que soporta dark mode y es altamente configurable.
