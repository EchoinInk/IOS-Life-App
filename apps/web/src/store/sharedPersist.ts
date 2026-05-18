/**
 * Shared persistence adapter so per-feature Zustand stores can each persist
 * independently while sharing a single localStorage key. This preserves
 * existing user data that previously lived under "app-storage".
 *
 * Each feature store registers under a namespace (e.g. "tasks", "budget")
 * and reads/writes only its own slice of the shared blob.
 */
import type { PersistStorage, StorageValue } from "zustand/middleware";

const SHARED_KEY = "app-storage";
const LEGACY_VERSION = 1;

type SharedBlob = {
  version: number;
  state: Record<string, unknown>;
};

const readBlob = (): SharedBlob => {
  if (typeof window === "undefined") return { version: LEGACY_VERSION, state: {} };
  try {
    const raw = window.localStorage.getItem(SHARED_KEY);
    if (!raw) return { version: LEGACY_VERSION, state: {} };
    const parsed = JSON.parse(raw);
    // Legacy zustand-persist envelope: { state: {...}, version: n }
    if (parsed && typeof parsed === "object" && "state" in parsed) {
      return {
        version: typeof parsed.version === "number" ? parsed.version : LEGACY_VERSION,
        state: (parsed.state ?? {}) as Record<string, unknown>,
      };
    }
    return { version: LEGACY_VERSION, state: {} };
  } catch {
    return { version: LEGACY_VERSION, state: {} };
  }
};

const writeBlob = (blob: SharedBlob) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SHARED_KEY, JSON.stringify(blob));
  } catch {
    /* ignore quota errors */
  }
};

/**
 * Create a namespaced PersistStorage. Each feature picks the keys it owns.
 * Reads return only those keys; writes merge them back into the shared blob.
 */
export const createNamespacedStorage = <T extends object>(keys: ReadonlyArray<keyof T>): PersistStorage<T> => ({
  getItem: (_name): StorageValue<T> | null => {
    const blob = readBlob();
    const slice: Partial<T> = {};
    let hasAny = false;
    for (const key of keys) {
      const k = key as string;
      if (k in blob.state) {
        (slice as Record<string, unknown>)[k] = blob.state[k];
        hasAny = true;
      }
    }
    if (!hasAny) return null;
    return { state: slice as T, version: blob.version };
  },
  setItem: (_name, value) => {
    const blob = readBlob();
    const next = { ...blob.state };
    for (const key of keys) {
      const k = key as string;
      next[k] = (value.state as Record<string, unknown>)[k];
    }
    writeBlob({ version: value.version ?? blob.version, state: next });
  },
  removeItem: (_name) => {
    const blob = readBlob();
    const next = { ...blob.state };
    for (const key of keys) {
      delete next[key as string];
    }
    writeBlob({ version: blob.version, state: next });
  },
});

export const STORE_VERSION = LEGACY_VERSION;
