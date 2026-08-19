export type ThreadStatus = "Idle" | "Busy" | "Blocked";

export class MetricsService {
  startInteraction() {
    return performance.now();
  }

  measureNextPaint(interactionStart: number) {
    return new Promise<number>((resolve) => {
      requestAnimationFrame(() => resolve(performance.now() - interactionStart));
    });
  }
}