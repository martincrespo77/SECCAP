# Plan de Pruebas — SECCAP

## 1. Estrategia de Pruebas del Ciclo
El Proyecto establece que este documento (El Plan de Pruebas) y sus resultados no son estáticos, sino que cada iteración del sistema demandará las fases de **preparación, revisión, ajuste, aprobación y actualización** sobre el catálogo de Unit Testing y Testing de Integración.

## 2. Tipos de Pruebas y Trazabilidad

| ID Prueba | Tipo de Prueba | Componente Testeado | Objetivo y Resultado Esperado |
| :--- | :--- | :--- | :--- |
| **TS-01** | Test de Integración | Backend Proxy -> API Institucional | Validar la negociación del canal. Confirmar que el backend extrae correctamente un JSON  de la API institucional (o Mock API en sandbox) en menos de X ms de tiempo esperado. |
| **TS-02** | Test de Autorización y Carga | Backend Middleware (RBAC) | Disparar múltiples peticiones cruzadas usando usuarios con rol mínimo intentando forzar la entrega de atributos del rol administrador. Se espera que el backend pode la respuesta o emita Error 403 HTTP. |
| **TS-03** | Test Funcional Frontend | Componente Reactivo de UI | Cargar el componente de búsqueda. Se rellenarán los "Autocomplete" de capacidades y aptitudes garantizando que el estado de React se despache (`dispatch`) de forma correcta al proxy. |
| **TS-04** | User Acceptance Testing (UAT) | End-to-End del proyecto completo | Un usuario final del área de personal (stakeholder) opera el sistema desde un perfil asignado y valida que los datos consultados responden a sus necesidades de consulta de capacidades y aptitudes del personal. |
| **TS-05** | Test de Auditoría y Trazabilidad | Módulo de Logs (BD Local) | Ejecutar una secuencia de consultas con distintos usuarios y verificar que cada una quede registrada en la tabla `audit_logs` con: user_id, timestamp, endpoint, filtros aplicados y status_code. Verificar que no existan consultas sin registro. Corresponde al criterio de aceptación #3 del alcance. |

## 3. Ambiente de Testing (Sandbox)
Todas las pruebas **TS-01 y TS-02** deberán ejecutarse idealmente apuntando al endpoint de desarrollo / sandbox de la API institucional (o mediante Mock API si el entorno de pruebas no está disponible) y la base de datos local en versión de `Testing` para no afectar la auditoría productiva.

## 4. Criterios de Suspensión y Retoma
Ante la falla de **TS-01** (Conexión), toda prueba subsecuente de Frontend queda suspendida. Se levanta un Request hacia Infraestructura o hacia el desarrollador mapeador y se retoma una vez restaurada la negociación al origen (Handshake de la API).
