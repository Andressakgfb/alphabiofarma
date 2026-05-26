import { Heart, Eye, Star, ShoppingCart } from "lucide-react";
import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";

type Product = {
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
};

const products: Product[] = [
  { id: "1", name: "Ômega 3 Ultra 1000mg — 120 cápsulas", brand: "AlphaBio Lab", image: p1, rating: 4.9, reviews: 312, oldPrice: 179.9, price: 139.9, installment: { count: 6, value: 23.32 }, tag: "-22%" },
  { id: "2", name: "Magnésio Dimalato 500mg — 90 cáps", brand: "PureLine", image: p2, rating: 4.8, reviews: 187, price: 89.9, installment: { count: 3, value: 29.97 } },
  { id: "3", name: "Testosterona Bioidêntica — Manipulado", brand: "AlphaBio Clinic", image: p3, rating: 5.0, reviews: 64, oldPrice: 459, price: 389, installment: { count: 10, value: 38.9 }, tag: "Receita" },
  { id: "4", name: "Whey Isolado Premium 900g — Neutro", brand: "Pureform", image: p4, rating: 4.7, reviews: 521, price: 229.9, installment: { count: 6, value: 38.32 } },
];

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

function ProductCard({ p }: { p: Product }) {
  return (
    <article className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-0.5">
      <div className="relative aspect-square bg-surface overflow-hidden">
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {p.tag && (
          <span className="absolute top-2.5 left-2.5 rounded-md bg-success px-2 py-0.5 text-[10px] font-bold text-success-foreground">
            {p.tag}
          </span>
        )}

        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
          <button aria-label="Favoritar" className="h-8 w-8 rounded-full bg-card/95 backdrop-blur flex items-center justify-center text-foreground/70 hover:text-destructive transition shadow-sm">
            <Heart className="h-4 w-4" />
          </button>
          <button aria-label="Visualização rápida" className="h-8 w-8 rounded-full bg-card/95 backdrop-blur flex items-center justify-center text-foreground/70 hover:text-primary transition shadow-sm opacity-0 group-hover:opacity-100">
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col p-3 gap-1.5 flex-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{p.brand}</span>
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 min-h-[2.5rem]">
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

        <button className="mt-2 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition">
          <ShoppingCart className="h-3.5 w-3.5" /> Adicionar
        </button>
      </div>
    </article>
  );
}

export function ProductGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-foreground">Mais procurados</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Selecionados pela nossa equipe clínica</p>
        </div>
        <a href="#" className="text-xs font-semibold text-success hover:underline whitespace-nowrap">Ver todos →</a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
