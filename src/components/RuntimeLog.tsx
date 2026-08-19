import { RuntimeLog as RuntimeLogEntry } from "@/services/EventLoopService";

export default function RuntimeLog({ logs }: { logs: RuntimeLogEntry[] }) {
  return (
    <section className="log-panel" aria-label="Registro de ejecución">
      <div className="panel-heading">
        <div><p className="panel-kicker">Espejo de consola</p><h2>Línea de ejecución</h2></div>
        <span className="log-hint">Abre DevTools para ver los mismos mensajes en consola</span>
      </div>
      <div className="logs" aria-live="polite">
        {logs.length === 0 ? <p className="empty-state">Tus interacciones aparecerán aquí.</p> : logs.map((log) => <p key={log.id}><span className={`log-type ${log.type.toLowerCase()}`}>{log.type}</span>{log.message}</p>)}
      </div>
    </section>
  );
}