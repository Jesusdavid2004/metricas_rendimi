export type QueueType = "microtask" | "task";

export type QueueItem = {
  id: number;
  label: string;
  type: QueueType;
};

export type RuntimeLog = {
  id: number;
  message: string;
  type: "MICROTASK" | "TASK" | "SYSTEM";
};

export type EventLoopSnapshot = {
  microtaskQueue: QueueItem[];
  taskQueue: QueueItem[];
  logs: RuntimeLog[];
};

export class EventLoopService {
  private itemId = 0;
  private logId = 0;
  private microtaskQueue: QueueItem[] = [];
  private taskQueue: QueueItem[] = [];
  private logs: RuntimeLog[] = [];
  private listeners = new Set<(snapshot: EventLoopSnapshot) => void>();

  subscribe(listener: (snapshot: EventLoopSnapshot) => void) {
    this.listeners.add(listener);
    listener(this.getSnapshot());

    return () => {
      this.listeners.delete(listener);
    };
  }

  enqueue(type: QueueType, label: string) {
    const item: QueueItem = { id: ++this.itemId, label, type };

    if (type === "microtask") {
      this.microtaskQueue = [...this.microtaskQueue, item];
    } else {
      this.taskQueue = [...this.taskQueue, item];
    }

    this.notify();
    return item;
  }

  complete(item: QueueItem) {
    if (item.type === "microtask") {
      this.microtaskQueue = this.microtaskQueue.filter(({ id }) => id !== item.id);
    } else {
      this.taskQueue = this.taskQueue.filter(({ id }) => id !== item.id);
    }

    this.notify();
  }

  recordExecution(type: RuntimeLog["type"], message: string) {
    const log = { id: ++this.logId, type, message };
    console.log(`[${type}] ${message}`);
    this.logs = [log, ...this.logs].slice(0, 8);
    this.notify();
  }

  getSnapshot(): EventLoopSnapshot {
    return {
      microtaskQueue: this.microtaskQueue,
      taskQueue: this.taskQueue,
      logs: this.logs,
    };
  }

  private notify() {
    const snapshot = this.getSnapshot();
    this.listeners.forEach((listener) => listener(snapshot));
  }
}