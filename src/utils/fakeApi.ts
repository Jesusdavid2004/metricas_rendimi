const SERVER_DELAY_MS = 700;

// setTimeout represents a server response scheduled as a task.
export function fakeApi<T>(getResponse: () => T, delay = SERVER_DELAY_MS) {
  return new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(getResponse()), delay);
  });
}