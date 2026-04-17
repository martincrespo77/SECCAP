# Plan de Gestión de Costos — SECCAP

## 1. Estimación Base (Línea Base de Costos)

El proyecto se ejecuta con recursos institucionales y tecnología open-source, por lo que el concepto de “Presupuesto Financiero” se traduce principalmente en carga horaria y costos de infraestructura. El presupuesto se estima con el siguiente criterio de desglose:

**1. Horas Hombre (HH) / Esfuerzo de Desarrollo**
- Análisis y Diseño (Documentación PMBOK): 30 hs.
- Setup e Infraestructura: 20 hs.
- Desarrollo Backend (Capa Proxy y DB Local): 60 hs.
- Desarrollo Frontend (UI React y Lógica): 70 hs.
- Pruebas y QA: 30 hs.
- Implantación, Cierre y Formación a usuarios: 25 hs.
- **Total estimado: ~245 hs.** (~17 hs/semana durante 14 semanas)

**2. Costos de Infraestructura y Herramientas**
- **Hardware Institucional / Servidor local:** Proveído por el cliente o institución (Costo cero amortizado).
- **Licencias de Software:** 
    - Se utilizará tecnología open-source en su totalidad (React 19, Node.js 22 + Express 5, PostgreSQL 16 — costo $0). 
    - Editores y entornos (VSCode, Git — costo $0).
- **Infraestructura Cloud / Hosting:** En caso de que se necesite subir el frontend a un servicio o requerir una máquina virtual intermedia.
- **Costos de Conectividad:** Redes, accesos a VPN institucionales si existieran.

## 2. Control Estratégico de Costos
Al trabajar con una estructura de Software basada en integraciones (Proxy contra API), el principal "costo" o riesgo de sobrecosto reside en la re-implementación.
- **Estrategia Iterativa:** El costo por hora invertida se cuida al validar rápidamente cada iterador con el cliente y evitar desarrollos ciegos que después deban retroceder de la Fase 4 directo a la Fase 2.
- **Herramientas a Emplear:** GitHub, Vite y librerías pre-confeccionadas de Tailwind se utilizan para abaratar el volumen de horas hombre en maquetado web sin sentido, dedicando el presupuesto en tiempo a la correcta manipulación e interacción de los datos.

## 3. Registro de Autorización
Cualquier modificación fundamental en la infraestructura (como la adquisición de un componente o necesidad de hardware no previsto) deberá ser tratada con el comité de patrocinantes del cliente.
