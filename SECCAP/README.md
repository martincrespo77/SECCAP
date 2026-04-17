# SECCAP

Esta carpeta esta reservada para la implementacion del sistema.

La documentacion de analisis, PMBOK, UML, trazabilidad y coordinacion entre IAs permanece en la raiz del repositorio.

La implementacion tecnica debe vivir dentro de esta carpeta con una estructura similar a esta:

```text
SECCAP/
├── frontend/
├── backend/
├── mock-api/
├── docs-tecnicos/
└── .env.example
```

Reglas:

- No crear `frontend/`, `backend/` o `mock-api/` en la raiz del repositorio.
- Todo el codigo ejecutable del sistema debe quedar contenido dentro de `SECCAP/`.
- La API mock del Area de Personal es parte del entorno de desarrollo y debe vivir en `SECCAP/mock-api/`.
- La documentacion funcional y de gestion sigue fuera de esta carpeta.
