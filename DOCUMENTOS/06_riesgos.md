# Plan de Gestión de Riesgos — SECCAP

## 1. Identificación y Mitigación de Riesgos

La identificación temprana en este proyecto radica en la dependencia a factores externos y la volatilidad natural de un desarrollo iterativo. A continuación, la matriz clave de riesgos:

| ID Riesgo | Descripción del Evento | Probabili. (1-5) | Impacto (1-5) | Valor de Exposición | Acción de Mitigación / Contingencia |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **R-01** | **Cambio en endpoint de la API institucional** de personal (la estructura de datos JSON devuelta cambia sin aviso). | 3 | 5 | 15 (Alto) | Establecer versionado de consumo local (ej. consumir V1 fija). Usar el patrón DTO/Adapters en el proxy; si la respuesta cambia, solo el adapter se altera sin recodificar el frontend. |
| **R-02** | La API no admite consultas masivas (timeouts ante solicitudes complejas de aptitudes múltiples). | 4 | 4 | 16 (Alto) | Implementar caché temporal en el proxy para catálogos comunes. Reducir el payload solicitado implementando paginación a nivel de backend proxy. |
| **R-03** | **Políticas de seguridad institucional obstructivas:** la red bloquea el acceso del sistema de desarrollo al servidor y los endpoints. | 2 | 5 | 10 (Medio) | Gestionar los permisos VPN/DNS/Certificados en paralelo temprano. Utilizar Mock API como plan B hasta que infraestructura resuelva el acceso, para no frenar el desarrollo del frontend. |
| **R-04** | Cambios drásticos de requisitos por parte del stakeholder al no tener el alcance cerrado al inicio. | 3 | 3 | 9 (Medio) | Enfocar al máximo el ciclo iterativo. Validar y solicitar feedback cada 2–3 semanas desde un MVP. Fijar límites claros: el sistema solo consulta, no modifica datos de origen. |

## 2. Roles de Responsabilidad
*   **Analista Técnico (Desarrollador Mapeador):** Responsable de monitorear R-01 y R-02.
*   **Director del Proyecto / Gestor:** Monitorear el estado del R-03 para traccionar a responsables institucionales.

## 3. Revisión y Actualización
Este documento y la matriz serán revisados al cierre de cada fase del proyecto, registrando si los eventos de riesgo se materializaron y si los planes de contingencia resultaron efectivos.

> **Nota:** La matriz completa de riesgos del proyecto (R-01 a R-11) se encuentra en el anteproyecto. Este documento PMBOK resume los cuatro riesgos de mayor relevancia técnica.
