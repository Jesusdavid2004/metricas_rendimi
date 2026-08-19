import { QueueItem } from "@/services/EventLoopService";

type QueueVisualizerProps = { microtaskQueue: QueueItem[]; taskQueue: QueueItem[] };

export default function QueueVisualizer({ microtaskQueue, taskQueue }: QueueVisualizerProps) {
  return (
    <section className="queues-panel" aria-label="Colas del Event Loop">
      <div className="loop-indicator"><span />Punto de control del Event Loop</div>
      <p className="queue-explainer">Las microtasks se vacían antes de ejecutar la siguiente task.</p>
      <Queue title="Cola de microtasks" items={microtaskQueue} tone="microtask" />
      <Queue title="Cola de tasks" items={taskQueue} tone="task" />
    </section>
  );
}

function Queue({ title, items, tone }: { title: string; items: QueueItem[]; tone: "microtask" | "task" }) {
  return (
    <div className={`queue ${tone}`}>
      <div className="queue-title"><h2>{title}</h2><span>{items.length}</span></div>
      <div className="queue-items">{items.length === 0 ? <p>Vacía</p> : items.map((item) => <p key={item.id}>{item.label}</p>)}</div>
    </div>
  );
}