// Overrides locais (localStorage) para campos editáveis do produto.
// Inclui descrição, preço e imagem.
import type { ProductDescription } from "./productDescriptions";

const DESC_KEY = "alphabio:productDescriptionOverrides:v1";
const FIELDS_KEY = "alphabio:productFieldOverrides:v1";

type DescStore = Record<string, ProductDescription>;
export type FieldOverride = { price?: number; oldPrice?: number | null; image?: string; stock?: number };
type FieldStore = Record<string, FieldOverride>;

function readJson<T>(key: string): T {
  if (typeof window === "undefined") return {} as T;
  try {
    return JSON.parse(localStorage.getItem(key) || "{}") as T;
  } catch {
    return {} as T;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("alphabio:overrides-changed"));
}

export const descriptionOverrides = {
  get(id: string): ProductDescription | undefined {
    return readJson<DescStore>(DESC_KEY)[id];
  },
  set(id: string, desc: ProductDescription) {
    const store = readJson<DescStore>(DESC_KEY);
    store[id] = desc;
    writeJson(DESC_KEY, store);
  },
  remove(id: string) {
    const store = readJson<DescStore>(DESC_KEY);
    delete store[id];
    writeJson(DESC_KEY, store);
  },
  subscribe,
};

export const fieldOverrides = {
  get(id: string): FieldOverride | undefined {
    return readJson<FieldStore>(FIELDS_KEY)[id];
  },
  set(id: string, patch: FieldOverride) {
    const store = readJson<FieldStore>(FIELDS_KEY);
    store[id] = { ...store[id], ...patch };
    writeJson(FIELDS_KEY, store);
  },
  remove(id: string) {
    const store = readJson<FieldStore>(FIELDS_KEY);
    delete store[id];
    writeJson(FIELDS_KEY, store);
  },
  subscribe,
};

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener("alphabio:overrides-changed", handler);
  // legacy event name still supported
  window.addEventListener("alphabio:descriptions-changed", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("alphabio:overrides-changed", handler);
    window.removeEventListener("alphabio:descriptions-changed", handler);
    window.removeEventListener("storage", handler);
  };
}
