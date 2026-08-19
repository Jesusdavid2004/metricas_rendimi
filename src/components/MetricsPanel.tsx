import { ThreadStatus } from "@/services/MetricsService";

type MetricsPanelProps = {
  normalInp: number | null;
  blockedInp: number | null;
  threadStatus: ThreadStatus;
};

function formatMetric(value: number | null) {
  return value === null ? "--" : `${value.toFixed(1)} ms`;
}

export default function MetricsPanel({ normalInp, blockedInp, threadStatus }: MetricsPanelProps) {
  return (
    <section className="metrics-panel" aria-label="Performance metrics">
      <div className="metrics-heading">
        <div><p className="panel-kicker">Métricas de rendimiento</p><h2>Respuesta de interacción</h2></div>
        <span className={`thread-status ${threadStatus.toLowerCase()}`}><i />Hilo principal: {threadStatus}</span>
      </div>
      <div className="metric-grid">
        <div className="metric-card"><span>INP normal</span><strong>{formatMetric(normalInp)}</strong><p>Medido después de pintar el input del autocompletado.</p></div>
        <div className="metric-card blocked-metric"><span>INP bloqueado</span><strong>{formatMetric(blockedInp)}</strong><p>Medido después de una task síncrona de 3.5 segundos.</p></div>
      </div>
    </section>
  );
}