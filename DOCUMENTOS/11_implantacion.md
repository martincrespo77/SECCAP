# Plan de Implantación y Capacitación — SECCAP

## 1. Estrategia de Implantación (Pase a Producción)

Considerando la estructura de tecnología moderna desacoplada (Frontend por un lado, Proxy Backend de integración por otro), el despliegue requiere sincronización:

**Fase 1: Preparación del Entorno**
*   Despliegue de la Base de Datos Local de Auditoría y Usuarios mediante sistema de Migraciones (Migrations). Creación del Rol primario "Super Admin" mediante seeder.
*   Configuración de variables de entorno (archivos `.env`) en el servidor proxy, que alojarán el token/clave de acceso institucional hacia la API de personal y la cadena de conexión de la base de datos productiva (PostgreSQL).

**Fase 2: Despliegue de los Artefactos**
*   Build y compilado del Frontend en ReactJS mediante la herramienta Vite (`npm run build`). Colocación de archivos estáticos en el servidor web correspondiente que los servirá (Apache/Nginx o CDN).
*   Encendido del servicio Proxy Backend tras validar puertos.

**Fase 3: Handshake Funcional en "Cero"**
*   Operación rápida ("Smoke Test") del logueo en vivo de un usuario, buscando traer la primera aptitud oficial en ambiente real.

## 2. Plan de Conversión
Dado que este sistema **no reemplaza a un sistema anterior, y los datos del personal siguen residiendo en la base de datos institucional**, no existe una conversión de tablas históricas. La conversión se limitará a la carga inicial de los usuarios operadores que dictamine el cliente.

> **Nota:** El despliegue productivo queda sujeto a la validación institucional y a la autorización formal del área de sistemas correspondiente.

## 3. Plan de Capacitación

La introducción del sistema demandará un breve ciclo de formación para los miembros designados del área de personal:
*   **A quiénes:** Operadores de Recursos Humanos designados para las consultas.
*   **Temario (Taller 2hs):**
    *   Formas de ingreso y seguridad de la sesión.
    *   Cómo utilizar el Módulo de Filtros Compuestos (La diferencia entre capacidad, aptitud, conocimiento, según las lógicas de negocio).
    *   Exportación de vistas impresas desde las tablas interactivas.
    *   Revisión de Casos de Auditoría (Para administradores del sistema).

## 4. Manuales y Entregables Auxiliares
La capacitación contará con el soporte oficial del "Manual de Usuario y Operador", compuesto visualmente y centrado en la interacción web con el Frontend del Proyecto.
