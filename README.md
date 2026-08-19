# Laboratorio de Rendimiento: JavaScript Event Loop

Aplicación interactiva en Next.js para explicar el funcionamiento del **Event Loop**, la diferencia entre **tasks** y **microtasks**, el impacto del bloqueo del hilo principal y la métrica **INP** (*Interaction to Next Paint*).

El caso de uso principal es un autocompletado que simula una consulta a servidor. La interfaz está en español; el código, servicios, funciones y comentarios están en inglés.

## Funcionalidades

- Autocompletado con sugerencias dinámicas.
- Simulación de una API mediante `setTimeout`, representada como una **task**.
- Validación inmediata mediante `Promise.resolve().then()`, representada como una **microtask**.
- Visualización en tiempo real de `Task Queue` y `Microtask Queue`.
- Demostración de prioridad: el callback de `Promise` se ejecuta antes que el de `setTimeout`.
- Registro visual y en la consola de ejecuciones `MICROTASK`, `TASK` y `SYSTEM`.
- Medición de INP normal al escribir en el autocompletado.
- Medición de INP bloqueado tras una operación síncrona pesada de 3.5 segundos.
- Indicador del estado del hilo principal: `Idle`, `Busy` y `Blocked`.
- Comparación entre cálculo bloqueante en el hilo principal y cálculo en un `Web Worker`.

## Tecnologías

- Next.js 16
- React 19
- TypeScript
- CSS nativo

No se usan librerías externas de interfaz.

## Estructura del proyecto

```text
src/
	app/
		globals.css                 # Global styles and responsive layout
		layout.tsx                  # Root layout and metadata
		page.tsx                    # Main page
	components/
		Autocomplete.tsx            # Search input and suggestions UI
		EventLoopDemo.tsx           # React container and interaction orchestration
		MetricsPanel.tsx            # INP and main-thread status UI
		QueueVisualizer.tsx         # Task and microtask queue UI
		RuntimeLog.tsx              # Execution timeline UI
	services/
		AutocompleteService.ts      # Autocomplete query logic
		EventLoopService.ts         # Queue state and execution log management
		MetricsService.ts           # Interaction timing helpers
	utils/
		blockMainThread.ts          # Synchronous blocking calculation
		fakeApi.ts                  # setTimeout-based server simulation
	workers/
		heavyCalculation.worker.ts  # Non-blocking calculation worker
```

## Ejecutar localmente

### Requisitos

- Node.js 20 o superior
- npm 10 o superior

### Instalación

```bash
git clone https://github.com/Jesusdavid2004/metricas_rendimi.git
cd metricas_rendimi
npm install
npm run dev
```

Abre `http://localhost:3000` en el navegador.

## Guion para la demostración

1. Escribe `web` o `java` en el autocompletado.
2. Observa que aparece la validación de la **microtask** y que la consulta queda en `Task Queue` durante la espera simulada del servidor.
3. Espera la respuesta y observa las sugerencias junto con el valor de `INP normal`.
4. Pulsa **Ejecutar demostración de prioridad**. El registro muestra que `Promise` se ejecuta antes que `setTimeout`.
5. Pulsa **Bloquear hilo principal**. El estado cambia a `Blocked`, la interfaz deja de responder durante 3.5 segundos y `INP bloqueado` evidencia el impacto.
6. Pulsa **Ejecutar en Web Worker**. El cálculo se realiza sin congelar el input ni el pintado de la interfaz.

## Validación

```bash
npm run lint
npm run build
```

El proyecto usa Webpack en sus scripts para funcionar correctamente en entornos Windows donde el binding nativo de SWC no esté disponible.

## Despliegue

El proyecto está listo para desplegarse en [Vercel](https://vercel.com/new). Importa el repositorio de GitHub, conserva los valores detectados por Next.js y realiza el despliegue.
