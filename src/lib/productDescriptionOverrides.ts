// Overrides locais (localStorage) para descrições de produto.
// Permite edição inline sem precisar mudar o código-fonte.
import type { ProductDescription } from "./productDescriptions";

const KEY = "alphabio:productDescriptionOverrides:v1";

type Store = Record<string, ProductDescription>;

function read(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as Store;
  } catch {
    return {};
  }
}

function write(store: Store) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(store));
  window.dispatchEvent(new Event("alphabio:descriptions-changed"));
}

export const descriptionOverrides = {
  get(id: string): ProductDescription | undefined {
    return read()[id];
  },
  set(id: string, desc: ProductDescription) {
    const store = read();
    store[id] = desc;
    write(store);
  },
  remove(id: string) {
    const store = read();
    delete store[id];
    write(store);
  },
  subscribe(cb: () => void) {
    if (typeof window === "undefined") return () => {};
    const handler = () => cb();
    window.addEventListener("alphabio:descriptions-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("alphabio:descriptions-changed", handler);
      window.removeEventListener("storage", handler);
    };
  },
};
