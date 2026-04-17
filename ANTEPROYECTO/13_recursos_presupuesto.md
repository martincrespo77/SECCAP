# FASE 13 — RECURSOS Y PRESUPUESTO
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Estimación de Recursos y Presupuesto Preliminar**

## 2. Objetivo
Identificar y clasificar los recursos humanos, tecnológicos, de software, hardware y servicios necesarios para ejecutar el proyecto, y construir una estimación de costos de alto nivel con sus supuestos asociados.

---

## 3. Desarrollo

### 3.1. Recursos Humanos

El proyecto se inicia formalmente en el marco de una **Práctica Profesional Supervisada (PPS)** de 5to año de Ingeniería, lo que establece el contexto académico de arranque e impone restricciones sobre la estructura del equipo.

| ID | Rol | Responsable | Dedicación Estimada | Fase(s) Principal(es) |
|----|-----|-------------|---------------------|-----------------------|
| RH-01 | Desarrollador Full-Stack / Autor PPS | Alumno (1 persona) | 15–20 hs/semana × 14 semanas | Todas (1–6) |
| RH-02 | Director de PPS / Tutor Académico | Docente designado | 2–3 hs/semana (revisión y guía) | Todas (supervisión) |
| RH-03 | Referente Institucional / Cliente | Personal de la institución | 1–2 hs/semana (validación) | 1, 4, 5, 6 |
| RH-04 | Administrador de Infraestructura | Personal TI de la institución | Puntual (accesos, staging) | 2, 6 |
| RH-05 | Usuarios de Prueba (UAT) | Consultores designados | 3–5 sesiones de 1 hora | 5 |

**Nota:** El alumno (RH-01) cumple simultáneamente los roles de analista, arquitecto, desarrollador frontend, desarrollador backend, tester y documentador. Esta concentración de responsabilidades es una restricción inherente al contexto del proyecto (REST-05).

**Esfuerzo total estimado del alumno:**

- **Esfuerzo estimado:** 14 semanas × 17.5 hs/semana (promedio) ≈ **245 horas-persona**
- Distribución según FASE 12: Planificación 15% (~37 hs), Infraestructura 15% (~37 hs), Backend 25% (~61 hs), Frontend 25% (~61 hs), QA 10% (~24 hs), Implantación 10% (~24 hs)

### 3.2. Recursos de Software

Todos los componentes de software seleccionados son **open-source o de uso gratuito**, alineado con la restricción presupuestaria del proyecto (SUP-06).

| ID | Software | Versión | Propósito | Licencia | Costo |
|----|----------|---------|-----------|----------|-------|
| RS-01 | Node.js | 22 LTS | Runtime backend | MIT | $0 |
| RS-02 | Express | 5.x | Framework HTTP backend | MIT | $0 |
| RS-03 | TypeScript | 5.x | Lenguaje (front y back) | Apache 2.0 | $0 |
| RS-04 | React | 19.x | Biblioteca UI frontend | MIT | $0 |
| RS-05 | Vite | 6.x | Build tool frontend | MIT | $0 |
| RS-06 | Tailwind CSS | 4.x | Framework CSS utilitario | MIT | $0 |
| RS-07 | PostgreSQL | 16.x | Base de datos local | PostgreSQL License | $0 |
| RS-08 | Prisma / Knex | Última estable | ORM / Query builder | MIT / Apache 2.0 | $0 |
| RS-09 | VS Code | Última estable | IDE de desarrollo | MIT | $0 |
| RS-10 | Git | Última estable | Control de versiones | GPL v2 | $0 |
| RS-11 | GitHub | N/A | Repositorio remoto + CI | Free tier | $0 |
| RS-12 | Vitest / Jest | Última estable | Framework de testing | MIT | $0 |
| RS-13 | Docker | Última estable | Contenedorización (staging) | Apache 2.0 | $0 |
| RS-14 | Postman / Insomnia | Última estable | Testing de API | Free tier | $0 |
| RS-15 | Winston / Pino | Última estable | Logging estructurado | MIT | $0 |

### 3.3. Recursos de Hardware

| ID | Recurso | Especificación Mínima | Propósito | Proveedor |
|----|---------|----------------------|-----------|-----------|
| RW-01 | Equipo de desarrollo (PC/Laptop) | CPU 4 cores, 8 GB RAM, 256 GB SSD, SO Windows/Linux/macOS | Desarrollo, testing local, documentación | Alumno (propio) |
| RW-02 | Servidor de staging / pre-producción | CPU 2 cores, 4 GB RAM, 40 GB SSD, Linux | Despliegue de pruebas, acceso a API staging | Institución (PENDIENTE: VAC-08) |
| RW-03 | Servidor de producción | CPU 2–4 cores, 4–8 GB RAM, 80 GB SSD, Linux | Despliegue final del sistema | Institución (PENDIENTE: VAC-08) |
| RW-04 | Conexión de red | Acceso a red institucional con salida a API | Comunicación con API de RRHH | Institución |

**Observación:** El hardware de desarrollo (RW-01) ya existe y no genera costo adicional. Los servidores (RW-02, RW-03) dependen de la infraestructura institucional existente y no se contempla adquisición de nuevos equipos (SUP-06). Si la institución no dispone de servidores, la alternativa es un VPS básico de bajo costo (ver alternativas en §3.6).

### 3.4. Recursos de Servicios

| ID | Servicio | Propósito | Modalidad | Costo Estimado |
|----|----------|-----------|-----------|----------------|
| SV-01 | Acceso a API institucional de RRHH | Fuente de datos de personal (Read-Only) | Interno institucional | $0 (interno) |
| SV-02 | Hosting GitHub (plan gratuito) | Repositorio, CI/CD básico (GitHub Actions) | SaaS — Free tier | $0 |
| SV-03 | Conexión a Internet | Desarrollo remoto, sincronización | ISP existente del alumno | $0 (existente) |
| SV-04 | Certificado TLS/SSL | HTTPS para staging y producción | Let's Encrypt | $0 |
| SV-05 | DNS (subdominio institucional) | Resolución de nombre para la aplicación | Institucional | $0 (interno) |

### 3.5. Estimación de Costos de Alto Nivel

Dado la política de open-source y los recursos institucionales disponibles, el costo monetario directo es **prácticamente nulo**. El principal costo es el **esfuerzo humano** del alumno.

#### 3.5.1. Tabla de Costos Directos

| Categoría | Ítem | Cantidad | Costo Unitario | Costo Total |
|-----------|------|----------|----------------|-------------|
| Recursos Humanos | Alumno (RH-01) | ~245 hs estimadas | $0 (no remunerado) | $0 |
| Recursos Humanos | Director PPS (RH-02) | ~35 hs | $0 (función docente) | $0 |
| Recursos Humanos | Referente institucional (RH-03) | ~20 hs | $0 (función laboral) | $0 |
| Software | Stack completo (RS-01..RS-15) | 15 componentes | $0 (open-source) | $0 |
| Hardware | PC del alumno (RW-01) | 1 | $0 (existente) | $0 |
| Hardware | Servidor staging (RW-02) | 1 | $0 (institucional) | $0 |
| Hardware | Servidor producción (RW-03) | 1 | $0 (institucional) | $0 |
| Servicios | GitHub, Let's Encrypt, DNS | 3 | $0 | $0 |
| **TOTAL DIRECTO** | | | | **$0** |

#### 3.5.2. Costos Contingentes (Escenario Alternativo)

Si la institución **no provee infraestructura de servidores**, se contempla:

| Ítem | Alternativa | Costo Mensual | Duración | Costo Total |
|------|-------------|---------------|----------|-------------|
| VPS básico (staging + prod) | DigitalOcean/Vultr 2 vCPU, 4 GB | ~USD 24 | 4 meses | ~USD 96 |
| Dominio propio (si no hay institucional) | Registrador genérico | ~USD 12/año | 1 año | ~USD 12 |
| **TOTAL CONTINGENTE** | | | | **~USD 108** |

**Decisión:** Se asume que la institución provee servidores (SUP-06). Los costos contingentes se activan solo si se materializa el vacío VAC-08.

#### 3.5.3. Costo de Oportunidad

Aunque el proyecto tiene costo monetario $0, el **costo de oportunidad** del alumno se estima como referencia:

- 245 horas × tarifa de referencia para desarrollador junior en Argentina (~USD 10–15/hora) ≈ **USD 2.450–3.675**
- Este valor se presenta solo como referencia para dimensionar el esfuerzo, no como costo real del proyecto.

### 3.6. Supuestos Presupuestarios

| ID | Supuesto | Impacto si Falso |
|----|----------|------------------|
| SP-01 | La PPS no es remunerada; el esfuerzo del alumno no genera costo monetario | Se debería contemplar compensación |
| SP-02 | El software open-source seleccionado se mantiene gratuito durante el proyecto | Buscar alternativas equivalentes gratuitas |
| SP-03 | La institución provee servidores para staging y producción (SUP-06, VAC-08) | Activar presupuesto contingente (~USD 108) |
| SP-04 | GitHub Free tier es suficiente para CI/CD y almacenamiento | Evaluar GitHub Pro (~USD 4/mes) o GitLab |
| SP-05 | No se requiere licenciamiento especial para consumir la API institucional | Negociar con la institución |
| SP-06 | El equipo de desarrollo del alumno cumple las especificaciones mínimas | El alumno debería actualizar su equipo (costo personal) |

---

## 4. Tablas y Matrices

### 4.1. Matriz Recurso → Fase de Uso

| Recurso | F1-Plan | F2-Infra | F3-Back | F4-Front | F5-QA | F6-Impl |
|---------|---------|----------|---------|----------|-------|---------|
| RH-01 Alumno | ● | ● | ● | ● | ● | ● |
| RH-02 Director | ● | ○ | ○ | ○ | ● | ● |
| RH-03 Referente | ● | — | — | ● | ● | ● |
| RH-04 Admin TI | — | ● | — | — | — | ● |
| RH-05 Usuarios UAT | — | — | — | — | ● | — |
| RS-01..06 Stack Front | — | ● | — | ● | ● | ● |
| RS-01..03,08 Stack Back | — | ● | ● | — | ● | ● |
| RS-07 PostgreSQL | — | ● | ● | — | ● | ● |
| RS-09..11 Herramientas | ● | ● | ● | ● | ● | ● |
| RW-01 PC Alumno | ● | ● | ● | ● | ● | ● |
| RW-02 Srv Staging | — | ● | — | — | ● | — |
| RW-03 Srv Producción | — | — | — | — | — | ● |

> ● = Uso principal | ○ = Uso secundario/revisión | — = No aplica

### 4.2. Trazabilidad Recursos → Restricciones y Vacíos

| Recurso | Restricción / Vacío Relacionado |
|---------|--------------------------------|
| RH-01 (rol múltiple) | REST-05 (requerimientos no cerrados), REST-07 (dependencia del alumno) |
| RW-02, RW-03 (servidores) | VAC-08 (entorno staging), SUP-06 (infraestructura institucional) |
| SV-01 (acceso API) | REST-01 (Read-Only), VAC-02 (contrato API), VAC-03 (mecanismo auth API) |
| RS-01..RS-08 (stack) | DEC-04 (stack frontend), DEC-05 (stack backend decidido en FASE 10) |

---

## 5. Observaciones

1. **Costo cero no significa riesgo cero:** La gratuidad del stack y la infraestructura depende de supuestos institucionales (SP-03, SP-05) que deben validarse tempranamente en FASE 2.
2. **El recurso más crítico es el tiempo del alumno** (RH-01): es el único recurso no sustituible y no escalable. Cualquier retraso en dependencias externas (acceso a API, staging) consume directamente este recurso finito.
3. **No se contempla contratación de servicios externos** ni adquisición de licencias comerciales, coherente con las restricciones del proyecto.
4. **La concentración de roles en RH-01** es el principal factor de riesgo de recursos; se mitiga con planificación realista (FASE 12) y priorización MoSCoW de los requisitos.

---

## 6. Pendientes y Elementos a Validar

| ID | Pendiente | Dependencia | Prioridad |
|----|-----------|-------------|-----------|
| PEN-F13-01 | Confirmar disponibilidad de servidores staging y producción | RH-04, VAC-08 | Alta |
| PEN-F13-02 | Validar que GitHub Free tier soporta el flujo CI/CD requerido | RH-01 | Media |
| PEN-F13-03 | Confirmar acceso a red institucional para desarrollo remoto | RH-03, RH-04 | Alta |
| PEN-F13-04 | Determinar si se requiere presupuesto contingente para VPS | PEN-F13-01 | Media |
| PEN-F13-05 | Verificar especificaciones del equipo de desarrollo del alumno | RH-01 | Baja |

---

## 7. Entregable de la Fase
- **Inventario completo de recursos** clasificados por categoría (humanos, software, hardware, servicios)
- **Estimación de costos** con escenario base ($0) y contingente (~USD 108)
- **Matriz de asignación recurso-fase** y trazabilidad con restricciones/vacíos
- **Lista de supuestos presupuestarios** (SP-01..SP-06)

---

## 8. Conexión con la Siguiente Fase
La identificación de recursos y sus dependencias alimenta directamente la **FASE 14 — Riesgos y Suposiciones**, donde se formalizarán los riesgos asociados a la disponibilidad de recursos (especialmente RW-02/RW-03 y SV-01), la concentración de roles en RH-01, y la materialización de los supuestos presupuestarios.
