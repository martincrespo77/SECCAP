# DESIGN.md

## Proposito

Este archivo define la direccion visual y de implementacion frontend para Stitch.
Si el workspace contiene varios frentes, el objetivo principal es **SECCAP/frontend**.
No redisenar el resto del repositorio. No tocar `docs-uml/`. No inventar backend nuevo.

## Producto objetivo

SECCAP es una SPA institucional para consulta segura de capacidades y aptitudes del personal.
La interfaz debe transmitir:

- sobriedad
- claridad operativa
- confianza institucional
- lectura rapida de filtros, resultados y detalle

No debe verse como dashboard generico, startup flashy ni template marketing.

## Stack real que debe respetarse

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router DOM 7
- Axios
- Lucide React

No migrar a Next.js, Remix, MUI, Chakra, Bootstrap ni librerias de estado global innecesarias.
No introducir Redux, Zustand ni React Query salvo pedido explicito.

## Convenciones React del proyecto

Mantener estas reglas al generar o refinar UI:

- Solo componentes funcionales con hooks.
- Mantener la aplicacion como SPA.
- Respetar el router actual: `/login`, `/app`, `/app/consulta`.
- Mantener el `AuthContext` como fuente de verdad de sesion.
- Mantener la capa API separada en `src/api/`.
- Mantener tipos en `src/types/`.
- Mantener layout comun en `src/layout/`.
- Mantener paginas en `src/pages/`.
- Mantener componentes reutilizables en `src/components/`.
- Si se agregan helpers visuales, deben ser reutilizables y aislados.
- No duplicar logica de roles en muchos componentes; centralizarla.

Si hace falta cambiar UI, hacerlo sin romper:

- `AuthContext`
- `role-theme.ts`
- `AppShell`
- `ConsultaPage`
- tests existentes de frontend

## Arquitectura visual

La interfaz debe sentirse como una herramienta operativa profesional.

Estructura visual base:

- header institucional claro
- shell autenticado con sidebar compacta
- contenido principal con tarjetas sobrias
- formularios con buena jerarquia
- tabla de resultados clara en desktop
- cards o layout adaptado en mobile
- detalle en drawer lateral o panel claro, no modal recargado

La navegacion debe ser directa. No agregar pasos innecesarios.

## Lenguaje visual

### Paleta

Base:

- fondo blanco o blanco roto
- grises `slate` / piedra
- texto oscuro casi negro
- bordes suaves

Acento institucional principal:

- azul oscuro / navy

Temas por rol ya existentes y a respetar:

- `consultor`: azul institucional
- `auditor`: ambar sobrio / ocre apagado
- `admin`: granate / rose oscuro

No usar:

- colores neon
- degradados llamativos
- morado como color dominante
- glassmorphism excesivo
- sombras pesadas sin criterio

### Tipografia

Debe ser limpia, contemporanea y muy legible.

Prioridades:

- headings claros
- labels de formularios legibles
- tablas con excelente contraste
- textos secundarios discretos, nunca lavados en exceso

## Componentes y patrones de UI

### Formularios y filtros

Los filtros son una parte central del producto.
Deben verse serios, operativos y faciles de escanear.

Usar:

- labels siempre visibles
- agrupacion logica por dominio
- placeholders realistas
- mensajes de error claros
- estados disabled consistentes
- loading visible pero sobrio

Evitar:

- selects confusos
- labels dentro del campo como unica pista
- formularios recargados

### Resultados

Los resultados son el otro foco principal.

En desktop:

- tabla clara, espaciada y profesional
- columnas relevantes
- acciones a la derecha
- estados y tipos con pills discretas

En mobile:

- cards bien jerarquizadas
- sin perder informacion clave

### Detalle

El detalle debe priorizar lectura rapida.

Usar:

- bloques separados por seccion
- titulos cortos
- metadata ordenada
- accion de cierre clara

Evitar:

- modales pequeños saturados
- paneles con demasiadas columnas

## Dominio y placeholders

No usar lorem ipsum.
No usar nombres falsos genericos tipo "Item 1", "John Doe", "Example".

El contenido de ejemplo debe sonar a SECCAP y al dominio real:

- formacion militar
- formacion civil
- idiomas
- categorias militares
- aptitudes
- instituciones
- estados de vigencia
- certificados
- unidades, grados, apellido y nombre

Los textos visibles deben parecer parte de un sistema institucional real.

## Tono de la UX

La UX debe comunicar:

- control
- orden
- trazabilidad
- profesionalismo

No debe comunicar:

- entretenimiento
- marketing
- red social
- panel ejecutivo ornamental

## Responsive

Obligatorio:

- desktop primero, pero bien resuelto en mobile
- sin scroll horizontal accidental
- filtros reacomodados con criterio
- tablas adaptadas o reemplazadas por cards en mobile si hace falta

## Accesibilidad

Mantener como minimo:

- contraste suficiente
- botones claramente identificables
- labels asociados a inputs
- focus visible
- no depender solo del color para estado o rol

## Restricciones funcionales

No inventar funcionalidades no implementadas.

En particular:

- no inventar una UI de auditoria separada si no fue pedida
- no inventar una UI administrativa completa si no fue pedida
- no inventar pasos de flujo que el backend no soporta

Si se trabaja visualmente con roles:

- respetar precedencia `admin > auditor > consultor`
- no convertir la aplicacion en tres apps distintas
- aplicar variacion visual sobria, no teatral

## Que mejorar si Stitch propone cambios

Stitch puede proponer mejoras en:

- jerarquia visual
- espaciado
- composicion de filtros
- claridad de resultados
- estado vacio
- loading
- feedback de errores
- consistencia entre home, shell y consulta

Pero no debe romper:

- arquitectura SPA
- rutas existentes
- convenciones React del proyecto
- estructura de carpetas
- tono institucional

## Resultado esperado

El resultado debe parecer una aplicacion real del ambito institucional:

- moderna pero sobria
- limpia pero no vacia
- profesional pero no fria
- mantenible en React
- consistente con el frontend ya existente

Si Stitch tiene que elegir entre "mas vistoso" y "mas claro", elegir **mas claro**.
