// Local custom products added by admin (persisted in localStorage).
import type { ProductData } from "./products-data";

const KEY = "alphabio:customProducts:v1";

export type CustomProduct = ProductData & { category?: string };

function readAll(): CustomProduct[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(list: CustomProduct[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("alphabio:custom-products-changed"));
}

export const customProducts = {
  list(): CustomProduct[] {
    return readAll();
  },
  add(p: Omit<CustomProduct, "id"> & { id?: string }) {
    const list = readAll();
    const id = p.id || `custom-${Date.now().toString(36)}`;
    list.unshift({ ...p, id });
    writeAll(list);
    return id;
  },
  remove(id: string) {
    writeAll(readAll().filter((p) => p.id !== id));
  },
  subscribe(cb: () => void) {
    if (typeof window === "undefined") return () => {};
    const handler = () => cb();
    window.addEventListener("alphabio:custom-products-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("alphabio:custom-products-changed", handler);
      window.removeEventListener("storage", handler);
    };
  },
};
