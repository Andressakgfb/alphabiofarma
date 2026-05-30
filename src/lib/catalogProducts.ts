import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/components/alphabio/ProductGrid";

export type CatalogProductRecord = {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  old_price?: number | null;
  stock: number;
  tag?: string | null;
  is_custom?: boolean;
  category?: string | null;
  product_type?: string | null;
};

const EVENT = "alphabio:catalog-products-changed";
const listeners = new Set<() => void>();
let rows: CatalogProductRecord[] = [];
let loading: Promise<void> | null = null;

function emit() {
  listeners.forEach((cb) => cb());
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}

function inferTaxonomy(name: string): { category?: string; productType?: string } {
  const n = name.toLowerCase();
  if (n.includes("retatru") || n.startsWith("reta") || n.includes("retagen")) {
    return { category: "Retatrutida", productType: "Emagrecimento/ Metabólicos" };
  }
  if (n.includes("tirze") || n.includes("tirz") || n.includes("mounjaro")) {
    return { category: "Tirzepatida / Mounjaro", productType: "Emagrecimento/ Metabólicos" };
  }
  if (n.includes("ghk") || n.includes("tesa")) {
    return { category: "Hormônio Crescimento Regenerativo", productType: "Hormônio Crescimento Regenerativos" };
  }
  if (n.includes("nad") || n.includes("glow") || n.includes("pt-141") || n.includes("pt141")) {
    return { category: "Suplementação e Performance", productType: "Bem-estar e Saúde Integrativa" };
  }
  return { category: "Suplementação e Performance", productType: "Peptídeo de Performance" };
}

function toProduct(row: CatalogProductRecord): Product {
  const price = Number(row.price);
  const stock = Number(row.stock);
  const count = price >= 1500 ? 10 : 6;
  const tax = inferTaxonomy(row.name);
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    image: row.image,
    price,
    oldPrice: row.old_price == null ? undefined : Number(row.old_price),
    stock,
    tag: row.tag ?? undefined,
    category: row.category ?? tax.category,
    productType: row.product_type ?? tax.productType,
    isCustom: !!row.is_custom,
    rating: row.is_custom ? 5 : 4.8,
    reviews: row.is_custom ? 0 : Math.max(24, Math.round(stock * 3.2)),
    installment: { count, value: +(price / count).toFixed(2) },
  };
}

async function load() {
  const { data, error } = await supabase
    .from("catalog_products")
    .select("id, name, brand, image, price, old_price, stock, tag, is_custom, category, product_type")
    .order("is_custom", { ascending: false })
    .order("name", { ascending: true });

  if (error) throw error;
  rows = (data ?? []) as CatalogProductRecord[];
  emit();
}

function ensureLoaded() {
  if (typeof window === "undefined" || loading) return;
  loading = load().catch(console.error).finally(() => {
    loading = null;
  });
}

export const catalogProducts = {
  eventName: EVENT,
  getAllProducts(): Product[] {
    ensureLoaded();
    return rows.map(toProduct);
  },
  getById(id: string): Product | undefined {
    ensureLoaded();
    const row = rows.find((item) => item.id === id);
    return row ? toProduct(row) : undefined;
  },
  subscribe(cb: () => void) {
    ensureLoaded();
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  async refresh() {
    await load();
  },
  async upsert(row: CatalogProductRecord) {
    const { error } = await supabase.from("catalog_products").upsert(row);
    if (error) throw error;
    await load();
  },
  async remove(id: string) {
    const { error } = await supabase.from("catalog_products").delete().eq("id", id);
    if (error) throw error;
    rows = rows.filter((item) => item.id !== id);
    emit();
  },
};