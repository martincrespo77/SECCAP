# Operación SECCAP — Guía Técnica

Fase 6. Operaciones cotidianas sobre el entorno SECCAP ya implantado: inicio/parada ordenada, verificación de salud, consulta de auditoría y diagnóstico de fallas más comunes.

## 1. Inicio y parada de servicios

### Inicio en orden

```powershell
docker start seccap-pg                                    # PostgreSQL
Push-Location SECCAP/mock-api; npm run dev; Pop-Location  # 3002
Push-Location SECCAP/backend;  npm run dev; Pop-Location  # 3001
Push-Location SECCAP/frontend; npm run dev; Pop-Location  # 5173
```

### Parada en orden inverso

1. Frontend: `Ctrl+C` en su terminal.
2. Backend: `Ctrl+C`.
3. Mock-api: `Ctrl+C`.
4. PostgreSQL: `docker stop seccap-pg` (si corresponde).

## 2. Chequeo de estado

```powershell
powershell -ExecutionPolicy Bypass -File scripts/estado-operativo.ps1
```

Manual:

```powershell
Invoke-RestMethod http://localhost:3002/externa/v1/health  # mock-api
Invoke-RestMethod http://localhost:3001/health             # backend proxy
```

Resultados esperados:

- Mock-api: `status: ok`.
- Backend: `status: ok` con `checks.database: ok`. Si PostgreSQL no está disponible devuelve `503 degraded` con `checks.database: error`.

## 3. Auditoría

Todas las consultas quedan registradas en la tabla `audit_log`. Se acceden vía API con un usuario que tenga el permiso `auditoria:leer` (por defecto, rol `auditor` y `admin`).

Ejemplo:

```powershell
# Login como admin
$login = Invoke-RestMethod -Method Post -Uri http://localhost:3001/auth/login `
  -Body (@{ username = 'admin'; password = 'admin123' } | ConvertTo-Json) `
  -ContentType 'application/json'

# Consultar auditoría (página 1, 20 resultados)
Invoke-RestMethod -Uri 'http://localhost:3001/auditoria?page=1&page_size=20' `
  -Headers @{ Authorization = "Bearer $($login.token)" }
```

Filtros soportados por el endpoint `GET /auditoria` (validados en `SECCAP/backend/src/routes/auditoria.ts`): `accion`, `resultado`, `usuario`, `id_usuario`, `endpoint`, `fecha_desde`, `fecha_hasta`, más paginación (`page`, `page_size`). No se soporta filtro por código de estado HTTP (`status_code`).

La tabla `audit_log` es inmutable (solo `INSERT`). No existen endpoints de edición ni borrado.

## 4. Diagnóstico de fallas comunes

| Síntoma | Causa probable | Resolución |
|---|---|---|
| Login devuelve `401` con credenciales correctas | Sesión bloqueada por 5 intentos fallidos | Esperar 30 min o reiniciar `intentos_fallidos` y `bloqueado_hasta` en `sys_usuario` |
| Backend responde `503 degraded` | PostgreSQL caído o `DATABASE_URL` mal configurado | Verificar `docker ps`, probar conexión `psql`, revisar `.env` |
| Backend responde `502` en catálogos o consulta | Mock-api/API externa caída | Verificar `http://localhost:3002/externa/v1/health`, reiniciar mock-api |
| Backend responde `504` | Timeout upstream (>10 s) | Ver red/latencia del upstream; el timeout es fijo en el cliente HTTP del backend |
| Frontend se queda en `/login` tras login exitoso | Token inválido o BD de sesiones inaccesible | Revisar devtools, revisar tabla `sys_sesion`, confirmar `JWT_SECRET` idéntico en backend |
| Frontend muestra "La sesión venció" | Token expirado (>8 h) o revocado | Iniciar sesión nuevamente |
| Descarga de certificado devuelve `403` | Usuario sin permiso `consulta:certificado` | Asignar permiso al rol o usar rol `consultor`/`admin`; el intento queda auditado |
| Error `prisma: database is locked / deadlock` | Corrida paralela de tests de integración | Serializar corridas de backend (ya documentado en QA) |
| `JWT_SECRET` muy corto | Validación de arranque en `config.ts` | Usar secreto ≥ 16 caracteres en `SECCAP/.env` |

## 5. Logs

- **Backend**: Pino a stdout. Nivel vía `LOG_LEVEL` en `SECCAP/.env` (`info` por defecto).
- **Mock-api**: logger HTTP simple a stdout.
- **Frontend**: consola del navegador.

No hay logging centralizado ni rotación automática. Pendiente a definir con el Área de Sistemas cuando exista servidor real.

## 6. Backup

En entorno local: pendiente de plan formal. Recomendación mínima previa a cualquier cambio:

```powershell
docker exec seccap-pg pg_dump -U seccap seccap_dev > backup_seccap_dev_$(Get-Date -Format yyyyMMdd_HHmm).sql
```

El plan de backup productivo queda sujeto a la política de resguardo del Área de Sistemas.

## 7. Referencias

- Implantación: [implantacion.md](implantacion.md)
- Manual de usuario: [../docs/manual_usuario.md](../docs/manual_usuario.md)
- QA: [qa.md](qa.md)
