Despliegue Lógico
==================

El diagrama de despliegue muestra los nodos lógicos del sistema, los artefactos desplegados en cada uno 
y las restricciones de seguridad que rigen la comunicación entre ellos.

Nodos lógicos
-------------

.. list-table::
   :header-rows: 1
   :widths: 25 35 40

   * - Nodo
     - Artefactos
     - Restricciones
   * - **Cliente institucional**
     - Navegador web (Chrome/Firefox/Edge)
     - Solo HTTPS. Sin acceso directo a APIs internas.
   * - **Servidor Web / Reverse Proxy**
     - Frontend SPA estático + TLS/HTTPS
     - Sirve solo HTML/JS/CSS estáticos. Redirige `/api/*` al servidor de aplicación.
   * - **Servidor de aplicación**
     - Backend Proxy (Node.js 22 + Express 5) + Middlewares + Health endpoint
     - No expone puertos directamente al exterior. Solo accesible desde el servidor web.
   * - **PostgreSQL local**
     - Tablas: usuarios, roles, permisos, sesiones, auditoría, configuración, caché
     - Solo accesible desde el servidor de aplicación. Sin acceso externo.
   * - **API Institucional RRHH**
     - REST/JSON (solo lectura)
     - Solo el backend proxy tiene credenciales. No accesible desde el browser.

Restricciones de seguridad
---------------------------

.. caution::
   * El navegador **nunca** se comunica con la API institucional.
   * La BD local **nunca** se expone al exterior.
   * Todo tráfico usa HTTPS (TLS 1.2+).
   * El backend no almacena datos del personal; solo los obtiene en tiempo real.

Diagrama
---------

.. uml:: ../../diagrams/plantuml/07_despliegue_logico.puml
   :caption: Despliegue lógico — SECCAP
