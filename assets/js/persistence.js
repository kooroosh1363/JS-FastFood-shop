import { createOrderState, normalizeOrderState } from "./order-store.js";

const KEY = "biteflow:order:v1";

export function loadOrder(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(KEY);
    return raw ? normalizeOrderState(JSON.parse(raw)) : createOrderState();
  } catch {
    return createOrderState();
  }
}

export function saveOrder(state, storage = globalThis.localStorage) {
  try {
    storage?.setItem(KEY, JSON.stringify({
      version: 1,
      ...normalizeOrderState(state)
    }));
    return true;
  } catch {
    return false;
  }
}
