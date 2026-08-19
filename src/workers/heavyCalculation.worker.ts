// This work runs in a separate thread, so the browser can keep painting and handling input.
self.onmessage = (event: MessageEvent<{ duration: number }>) => {
  const finishAt = performance.now() + event.data.duration;
  let accumulator = 0;

  while (performance.now() < finishAt) {
    accumulator = Math.sqrt(accumulator + Math.random());
  }

  self.postMessage({ completed: true });
};