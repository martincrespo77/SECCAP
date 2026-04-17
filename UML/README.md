# UML del sistema SECCAP

## Objetivo
Esta carpeta concentra los diagramas UML necesarios para describir, defender y luego implementar el sistema SECCAP con base en la informacion disponible hoy:

- actores y stakeholders
- requisitos funcionales
- requisitos no funcionales
- casos de uso
- modelo de analisis BCE
- arquitectura candidata

## Criterio de seleccion
No se generaron diagramas de relleno. Se crearon los diagramas que realmente ayudan a entender:

1. que hace el sistema
2. quienes interactuan con el sistema
3. como fluye una consulta
4. como se organiza la logica interna
5. como se desacopla de la API institucional
6. como se despliega de forma segura

## Diagramas creados

| Archivo | Tipo UML | Motivo | Base documental principal |
|---|---|---|---|
| `01_casos_uso_general.puml` | Casos de uso | Modelar actores, casos principales y relaciones include/extend | `ANTEPROYECTO/04_stakeholders_actores.md`, `ANTEPROYECTO/08_casos_de_uso.md` |
| `02_clases_analisis_bce.puml` | Clases de analisis | Representar frontera, control, entidad e integracion | `ANTEPROYECTO/09_modelo_analisis.md` |
| `03_secuencia_login.puml` | Secuencia | Describir autenticacion, sesion y auditoria | `ANTEPROYECTO/08_casos_de_uso.md`, `DOCUMENTOS/09_requisitos.md` |
| `04_secuencia_ejecutar_consulta.puml` | Secuencia | Describir validacion, proxy, API, poda por rol y auditoria | `ANTEPROYECTO/08_casos_de_uso.md`, `DOCUMENTOS/09_requisitos.md` |
| `05_actividad_flujo_consulta.puml` | Actividad | Visualizar el flujo operativo completo de una consulta | RF y RNF de consulta, validacion y resiliencia |
| `06_componentes_arquitectura.puml` | Componentes | Mostrar frontend, backend, ACL, BD local y API externa | `ANTEPROYECTO/10_arquitectura_tecnologias.md` |
| `07_despliegue_logico.puml` | Despliegue | Mostrar nodos lógicos, enlaces y restricciones de seguridad | `ANTEPROYECTO/10_arquitectura_tecnologias.md`, RNF de seguridad y disponibilidad |
| `08_secuencia_consulta_auditoria.puml` | Secuencia | Describir consulta de logs de auditoría por Auditor/Admin | `ANTEPROYECTO/08_casos_de_uso.md` (CU-10), RF-33 |
| `09_secuencia_descarga_documento.puml` | Secuencia | Describir descarga de documento respaldatorio vía proxy | `ANTEPROYECTO/08_casos_de_uso.md` (CU-09), RF-30 |
| `10_er_bd_local.puml` | Entidad-Relación | Modelar el esquema de la BD local (usuarios, roles, permisos, sesiones, auditoría, config, caché) | `ANTEPROYECTO/09_modelo_analisis.md`, `DOCUMENTOS/09_requisitos.md` |

## Cobertura funcional y no funcional

### Requisitos funcionales cubiertos
- autenticacion y sesion
- filtros jerarquicos y dependientes
- consulta contra API institucional
- poda de resultados segun rol
- auditoria obligatoria
- visualizacion de resultados y detalle
- descarga documental
- administracion de usuarios y roles

### Requisitos no funcionales cubiertos
- autenticacion obligatoria
- RBAC y minimo privilegio
- no exponer la API al frontend
- auditoria inmutable
- desacoplamiento por adaptador
- manejo controlado de errores
- uso de HTTPS
- disponibilidad parcial ante falla de API
- observabilidad y health check

## Orden recomendado de lectura
1. `01_casos_uso_general.puml`
2. `05_actividad_flujo_consulta.puml`
3. `04_secuencia_ejecutar_consulta.puml`
4. `03_secuencia_login.puml`
5. `08_secuencia_consulta_auditoria.puml`
6. `09_secuencia_descarga_documento.puml`
7. `02_clases_analisis_bce.puml`
8. `10_er_bd_local.puml`
9. `06_componentes_arquitectura.puml`
10. `07_despliegue_logico.puml`

## Supuestos y limites actuales
- La categoria de formacion civil sigue pendiente de relevamiento. No se invento detalle funcional donde no existe dato confirmado.
- El contrato real de la API institucional todavia no esta validado contra Swagger o respuesta productiva.
- Node.js 22 + Express 5 es la arquitectura candidata prioritaria. El UML se apoyó en la arquitectura desacoplada, no en un framework rígido.
- El frontend no consume la API institucional de forma directa bajo ningun escenario modelado.

## Diagramas recomendados para una iteracion posterior
- estado de sesion o cuenta bloqueada
- diagrama de paquetes por backend/frontend real cuando exista codigo

## Formato elegido
Se uso PlantUML porque:

- es texto versionable
- se puede revisar en Git sin binarios
- permite evolucionar los diagramas junto con el analisis

