type EventType = 'TASK_CAPTURED' | 'TASK_COMPLETED' | 'LOW_ENERGY_ENABLED' | 'LOW_ENERGY_DISABLED';

type EventHandler = (event: any) => void;

const listeners: Record<EventType, EventHandler[]> = {
  TASK_CAPTURED: [],
  TASK_COMPLETED: [],
  LOW_ENERGY_ENABLED: [],
  LOW_ENERGY_DISABLED: [],
};

export function emit(event: { type: EventType; payload?: any }) {
  const handlers = listeners[event.type];
  handlers.forEach((handler) => handler(event));
}

export function subscribe(eventType: EventType, handler: EventHandler) {
  listeners[eventType].push(handler);
}
