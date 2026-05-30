import { catalogProducts } from "./catalogProducts";

export type CartItem = {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  stock?: number;
  qty: number;
};

const KEY = "alphabio_cart";
const EVENT = "alphabio_cart_change";

function rawRead(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function resolveCartItem(item: CartItem): CartItem {
  const base = catalogProducts.getById(item.id);
  if (!base) return item;
  return {
    ...item,
    name: base.name,
    brand: base.brand,
    image: base.image,
    price: base.price,
    stock: base.stock,
  };
}

function read(): CartItem[] {
  return rawRead().map(resolveCartItem);
}

function write(items: CartItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(EVENT));
  } catch {}
}

export const cart = {
  get: read,
  add(item: Omit<CartItem, "qty">, qty = 1) {
    const items = rawRead();
    const existing = items.find((i) => i.id === item.id);
    if (existing) Object.assign(existing, { ...item, qty: existing.qty + qty });
    else items.push({ ...item, qty });
    write(items);
  },
  remove(id: string) {
    write(read().filter((i) => i.id !== id));
  },
  setQty(id: string, qty: number) {
    const items = read()
      .map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
      .filter((i) => i.qty > 0);
    write(items);
  },
  clear() {
    write([]);
  },
  subscribe(cb: () => void) {
    const handler = () => cb();
    window.addEventListener(EVENT, handler);
    window.addEventListener(catalogProducts.eventName, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener(catalogProducts.eventName, handler);
      window.removeEventListener("storage", handler);
    };
  },
};

export function cartCount(items: CartItem[]) {
  return items.reduce((n, i) => n + i.qty, 0);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((s, i) => s + i.qty * i.price, 0);
}
