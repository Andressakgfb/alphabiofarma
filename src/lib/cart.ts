import { customProducts } from "./customProducts";
import { fieldOverrides } from "./productDescriptionOverrides";
import { PRODUCTS_DATA } from "./products-data";

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
  const custom = customProducts.list().find((product) => product.id === item.id);
  const base = custom ?? PRODUCTS_DATA.find((product) => product.id === item.id);
  if (!base) return item;

  const override = fieldOverrides.get(item.id);
  return {
    ...item,
    name: base.name,
    brand: base.brand,
    image: override?.image ?? base.image,
    price: typeof override?.price === "number" ? override.price : base.price,
    stock: typeof override?.stock === "number" ? override.stock : base.stock,
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
    window.addEventListener("alphabio:overrides-changed", handler);
    window.addEventListener("alphabio:custom-products-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("alphabio:overrides-changed", handler);
      window.removeEventListener("alphabio:custom-products-changed", handler);
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
