// Synchronous work keeps the main thread busy and delays input, timers, and painting.
export function blockMainThread(durationMs = 3500) {
  const finishAt = performance.now() + durationMs;
  let accumulator = 0;

  while (performance.now() < finishAt) {
    accumulator = Math.sqrt(accumulator + Math.random());
  }

  return accumulator;
}