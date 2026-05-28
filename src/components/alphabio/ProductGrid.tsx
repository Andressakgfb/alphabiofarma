import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Heart, Eye, Star, ShoppingCart, Trash2 } from "lucide-react";
import { ProductDetailModal } from "./ProductDetailModal";
import { cart } from "@/lib/cart";
import { catalog, type CatalogFilters } from "@/lib/catalog";
import { PRODUCTS_DATA } from "@/lib/products-data";
import { fieldOverrides } from "@/lib/productDescriptionOverrides";
import { customProducts } from "@/lib/customProducts";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { toast } from "sonner";

export type Product = {
  id: string;
  name: string;
  brand: string;
  image: string;
  rating: number;
  reviews: number;
  oldPrice?: number;
  price: number;
  installment: { count: number; value: number };
  tag?: string;
  stock: number;
  category?: string;
  isCustom?: boolean;
};

const baseProducts: Product[] = PRODUCTS_DATA.map((p) => {
  const count = p.price >= 1500 ? 10 : 6;
  return {
    ...p,
    rating: 4.8,
    reviews: Math.max(24, Math.round(p.stock * 3.2)),
    installment: { count, value: +(p.price / count).toFixed(2) },
  };
});

function applyOverride(p: Product): Product {
  const ov = fieldOverrides.get(p.id);
  if (!ov) return p;
  const price = typeof ov.price === "number" ? ov.price : p.price;
  const oldPrice =
    ov.oldPrice === null ? undefined : typeof ov.oldPrice === "number" ? ov.oldPrice : p.oldPrice;
  const image = ov.image ?? p.image;
  const stock = typeof ov.stock === "number" ? ov.stock : p.stock;
  const tag = stock === 0 ? "Esgotado" : p.tag === "Esgotado" ? undefined : p.tag;
  const count = price >= 1500 ? 10 : 6;
  return { ...p, price, oldPrice, image, stock, tag, installment: { count, value: +(price / count).toFixed(2) } };
}

// Snapshot estático (sem overrides). Mantido apenas para compatibilidade.
export const products: Product[] = baseProducts;

function buildCustom(): Product[] {
  return customProducts.list().map((p) => {
    const count = p.price >= 1500 ? 10 : 6;
    return {
      id: p.id,
      name: p.name,
      brand: p.brand,
      image: p.image,
      price: p.price,
      oldPrice: p.oldPrice,
      stock: p.stock,
      tag: p.tag,
      category: p.category,
      isCustom: true,
      rating: 5,
      reviews: 0,
      installment: { count, value: +(p.price / count).toFixed(2) },
    };
  });
}

let cachedSnapshot: Product[] = [...buildCustom(), ...baseProducts.map(applyOverride)];
function recomputeSnapshot() {
  cachedSnapshot = [...buildCustom(), ...baseProducts.map(applyOverride)];
}
function subscribeOverrides(cb: () => void) {
  const unsubA = fieldOverrides.subscribe(() => { recomputeSnapshot(); cb(); });
  const unsubB = customProducts.subscribe(() => { recomputeSnapshot(); cb(); });
  return () => { unsubA(); unsubB(); };
}
function getSnapshot() {
  return cachedSnapshot;
}
function getServerSnapshot() {
  return baseProducts;
}

export function useProducts() {
  return useSyncExternalStore(subscribeOverrides, getSnapshot, getServerSnapshot);
}


// Esconde a marca quando for "AlphaBio Lab" / "AlphaBio Clinic" (pedido do dono)
export function shouldShowBrand(brand: string) {
  return !brand.toLowerCase().startsWith("alphabio");
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${i <= Math.round(n) ? "fill-warning text-warning" : "text-border"}`}
        />
      ))}
    </div>
  );
}

export function ProductCard({ p, onOpen }: { p: Product; onOpen: (p: Product) => void }) {
  const outOfStock = p.stock === 0;
  const { isAdmin } = useIsAdmin();
  return (
    <article
      data-product-name={p.name}
      onClick={() => onOpen(p)}
      className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-[var(--shadow-card)] transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.18)] hover:border-primary/30 cursor-pointer"
    >
      <div className="relative aspect-square bg-surface overflow-hidden">
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-110"
        />

        {p.tag && (
          <span className={`absolute top-2.5 left-2.5 rounded-md px-2 py-0.5 text-[10px] font-bold ${
            p.tag === "Esgotado"
              ? "bg-muted text-muted-foreground"
              : p.tag.startsWith("-")
              ? "bg-success text-success-foreground"
              : "bg-primary text-primary-foreground"
          }`}>
            {p.tag}
          </span>
        )}

        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
          <button
            aria-label="Favoritar"
            onClick={(e) => { e.stopPropagation(); toast.success("Adicionado aos favoritos"); }}
            className="h-8 w-8 rounded-full bg-card/95 backdrop-blur flex items-center justify-center text-foreground/70 hover:text-destructive transition shadow-sm"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            aria-label="Visualização rápida"
            onClick={(e) => { e.stopPropagation(); onOpen(p); }}
            className="h-8 w-8 rounded-full bg-card/95 backdrop-blur flex items-center justify-center text-foreground/70 hover:text-primary transition shadow-sm opacity-0 group-hover:opacity-100"
          >
            <Eye className="h-4 w-4" />
          </button>
          {isAdmin && p.isCustom && (
            <button
              aria-label="Remover produto"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Remover "${p.name}"?`)) {
                  customProducts.remove(p.id);
                  toast.success("Produto removido");
                }
              }}
              className="h-8 w-8 rounded-full bg-card/95 backdrop-blur flex items-center justify-center text-destructive hover:bg-destructive hover:text-destructive-foreground transition shadow-sm"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col p-3 gap-1.5 flex-1">
        {shouldShowBrand(p.brand) && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{p.brand}</span>
        )}
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 min-h-[2.5rem] transition-colors duration-300 group-hover:text-primary">
          {p.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <Stars n={p.rating} />
          <span className="text-[11px] text-muted-foreground">({p.reviews})</span>
        </div>

        <div className="mt-1">
          {p.oldPrice && (
            <span className="text-[11px] text-muted-foreground line-through">
              R$ {p.oldPrice.toFixed(2).replace(".", ",")}
            </span>
          )}
          <div className="text-lg font-bold text-success leading-tight">
            R$ {p.price.toFixed(2).replace(".", ",")}
          </div>
          <p className="text-[11px] text-muted-foreground">
            ou {p.installment.count}x de R$ {p.installment.value.toFixed(2).replace(".", ",")}
          </p>
        </div>

        <button
          disabled={outOfStock}
          onClick={(e) => {
            e.stopPropagation();
            if (outOfStock) return;
            cart.add({ id: p.id, name: p.name, brand: p.brand, image: p.image, price: p.price });
            toast.success(`${p.name} adicionado ao carrinho`);
          }}
          className="mt-2 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
        >
          <ShoppingCart className="h-3.5 w-3.5" /> {outOfStock ? "Indisponível" : "Adicionar"}
        </button>
      </div>
    </article>
  );
}

export function ProductGrid() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [filters, setFilters] = useState<CatalogFilters>(catalog.get());
  const livePricedProducts = useProducts();

  useEffect(() => {
    const unsub = catalog.subscribe(setFilters);
    return () => { unsub(); };
  }, []);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return livePricedProducts.filter((p) => {
      if (filters.brand !== "Todas" && p.brand !== filters.brand) return false;
      if (filters.category !== "Todas" && p.category !== filters.category) return false;
      if (filters.priceMax && p.price > filters.priceMax) return false;
      if (q) {
        const hay = `${p.name} ${p.brand}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [filters, livePricedProducts]);

  // mantém o produto selecionado em sincronia com edições
  const selectedLive = selected
    ? livePricedProducts.find((p) => p.id === selected.id) ?? selected
    : null;

  return (
    <section id="catalogo" className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-foreground">Catálogo completo</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "produto encontrado" : "produtos encontrados"}
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">Nenhum produto encontrado para os filtros atuais.</p>
          <button
            onClick={() => catalog.reset()}
            className="mt-3 inline-flex h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-semibold items-center hover:bg-primary/90 transition"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} onOpen={setSelected} />
          ))}
        </div>
      )}

      <ProductDetailModal product={selectedLive} onClose={() => setSelected(null)} />
    </section>
  );
}
