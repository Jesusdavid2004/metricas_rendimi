"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Autocomplete from "@/components/Autocomplete";
import MetricsPanel from "@/components/MetricsPanel";
import QueueVisualizer from "@/components/QueueVisualizer";
import RuntimeLog from "@/components/RuntimeLog";
import { AutocompleteService } from "@/services/AutocompleteService";
import { EventLoopService, EventLoopSnapshot } from "@/services/EventLoopService";
import { MetricsService, ThreadStatus } from "@/services/MetricsService";
import { blockMainThread } from "@/utils/blockMainThread";

const initialSnapshot: EventLoopSnapshot = { microtaskQueue: [], taskQueue: [], logs: [] };

export default function EventLoopDemo() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [inp, setInp] = useState<number | null>(null);
  const [normalInp, setNormalInp] = useState<number | null>(null);
  const [blockedInp, setBlockedInp] = useState<number | null>(null);
  const [threadStatus, setThreadStatus] = useState<ThreadStatus>("Idle");
  const [workerStatus, setWorkerStatus] = useState("Inactivo");
  const [snapshot, setSnapshot] = useState<EventLoopSnapshot>(initialSnapshot);
  const [eventLoop] = useState(() => new EventLoopService());
  const [autocomplete] = useState(() => new AutocompleteService());
  const [metrics] = useState(() => new MetricsService());
  const worker = useRef<Worker | null>(null);
  const requestId = useRef(0);

  useEffect(() => eventLoop.subscribe(setSnapshot), [eventLoop]);

  useEffect(() => {
    worker.current = new Worker(new URL("../workers/heavyCalculation.worker.ts", import.meta.url));
    worker.current.onmessage = () => {
      setWorkerStatus("Finalizado sin bloquear la interfaz");
      eventLoop.recordExecution("SYSTEM", "El cálculo del Web Worker finalizó");
    };

    return () => worker.current?.terminate();
  }, [eventLoop]);

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    const nextQuery = event.target.value;
    const interactionStart = metrics.startInteraction();
    const activeRequest = ++requestId.current;
    const validation = eventLoop.enqueue("microtask", `Validar "${nextQuery || "vacío"}"`);
    const fetch = eventLoop.enqueue("task", `Buscar sugerencias para "${nextQuery || "vacío"}"`);

    setQuery(nextQuery);
    setIsLoading(true);
    setThreadStatus("Busy");

    // Promise callbacks are microtasks, so they run before the scheduled server task.
    Promise.resolve().then(async () => {
      setIsValid(nextQuery.trim().length === 0 || nextQuery.trim().length >= 2);
      eventLoop.complete(validation);
      eventLoop.recordExecution("MICROTASK", "MICROTASK ejecutada: validación del input actualizada");
      const measuredInp = await metrics.measureNextPaint(interactionStart);
      setInp(measuredInp);
      setNormalInp(measuredInp);
    });

    // AutocompleteService uses setTimeout, representing a task from the server.
    autocomplete.getSuggestions(nextQuery).then((results) => {
      eventLoop.complete(fetch);
      if (activeRequest !== requestId.current) {
        eventLoop.recordExecution("TASK", "TASK ejecutada: respuesta antigua del servidor ignorada");
        return;
      }

      setSuggestions(results);
      setIsLoading(false);
      setThreadStatus("Idle");
      eventLoop.recordExecution("TASK", `TASK ejecutada: el servidor devolvió ${results.length} sugerencias`);
    });
  }

  function selectSuggestion(suggestion: string) {
    setQuery(suggestion);
    setSuggestions([]);
    eventLoop.recordExecution("SYSTEM", `Sugerencia seleccionada: ${suggestion}`);
  }

  function handleMainThreadBlock() {
    const interactionStart = metrics.startInteraction();
    const blockingTask = eventLoop.enqueue("task", "Cálculo síncrono pesado (3.5 segundos)");
    setThreadStatus("Blocked");
    eventLoop.recordExecution("SYSTEM", "Demostración programada: la interfaz se congelará después de este pintado");

    requestAnimationFrame(() => {
      window.setTimeout(async () => {
        eventLoop.recordExecution("TASK", "TASK ejecutada: el hilo principal está bloqueado");
        blockMainThread();
        eventLoop.complete(blockingTask);
        const measuredInp = await metrics.measureNextPaint(interactionStart);
        setBlockedInp(measuredInp);
        setThreadStatus("Idle");
        eventLoop.recordExecution("TASK", "TASK ejecutada: el hilo principal responde de nuevo");
      }, 0);
    });
  }

  function runInWorker() {
    setWorkerStatus("Trabajando en un Web Worker...");
    eventLoop.recordExecution("SYSTEM", "El cálculo del Web Worker inició");
    worker.current?.postMessage({ duration: 3500 });
  }

  function runPriorityDemo() {
    const promiseJob = eventLoop.enqueue("microtask", "Callback de Promise.resolve().then()");
    const timeoutJob = eventLoop.enqueue("task", "setTimeout(callback, 0)");
    setThreadStatus("Busy");
    eventLoop.recordExecution("SYSTEM", "Demostración de prioridad: Promise debe ejecutarse antes de setTimeout");

    Promise.resolve().then(() => {
      eventLoop.complete(promiseJob);
      eventLoop.recordExecution("MICROTASK", "MICROTASK ejecutada: el callback de Promise se ejecutó primero");
    });

    window.setTimeout(() => {
      eventLoop.complete(timeoutJob);
      setThreadStatus("Idle");
      eventLoop.recordExecution("TASK", "TASK ejecutada: el callback de setTimeout se ejecutó después de la microtask");
    }, 0);
  }

  return (
    <div className="lab-shell">
      <header className="page-header">
        <p className="eyebrow">Laboratorio interactivo de JavaScript</p>
        <h1>Laboratorio del Event Loop</h1>
        <p className="header-copy">El autocompletado hace visible la planificación del navegador, la presión del hilo principal y la latencia de interacción.</p>
      </header>
      <section className="workspace">
        <Autocomplete query={query} suggestions={suggestions} isValid={isValid} isLoading={isLoading} inp={inp} onQueryChange={handleQueryChange} onSuggestionSelect={selectSuggestion} />
        <QueueVisualizer microtaskQueue={snapshot.microtaskQueue} taskQueue={snapshot.taskQueue} />
      </section>
      <MetricsPanel normalInp={normalInp} blockedInp={blockedInp} threadStatus={threadStatus} />
      <section className="controls-section">
        <div>
          <p className="panel-kicker">Presión sobre el hilo principal</p>
          <h2>Compara las rutas de ejecución</h2>
          <p>Una task bloquea el input y el pintado. El worker mantiene libre el hilo principal.</p>
        </div>
        <div className="action-row">
          <button className="priority-button" onClick={runPriorityDemo}>Ejecutar demostración de prioridad</button>
          <button className="danger-button" onClick={handleMainThreadBlock}>Bloquear hilo principal</button>
          <button className="worker-button" onClick={runInWorker}>Ejecutar en Web Worker</button>
        </div>
        <p className="worker-status" aria-live="polite">Estado del worker: {workerStatus}</p>
      </section>
      <RuntimeLog logs={snapshot.logs} />
    </div>
  );
}