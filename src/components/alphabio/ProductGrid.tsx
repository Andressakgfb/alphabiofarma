import { useState } from "react";
import { Heart, Eye, Star, ShoppingCart } from "lucide-react";
import { ProductDetailModal } from "./ProductDetailModal";
import { cart } from "@/lib/cart";
import { toast } from "sonner";

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
  stock: number;
};

const BASE = "https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867";

const raw: Array<Omit<Product, "installment" | "rating" | "reviews"> & { rating?: number; reviews?: number }> = [
  { id: "nad500", name: "NAD+ 500mg", brand: "AlphaBio Lab", image: `${BASE}/350ab0a39_nad.png`, price: 1156, stock: 52, tag: "Longevidade" },
  { id: "tesa10", name: "Tesamorelin 10mg", brand: "AlphaBio Lab", image: `${BASE}/a557e0e90_tesamorelim.png`, price: 1190, stock: 57 },
  { id: "pt141", name: "PT-141 10mg", brand: "AlphaBio Lab", image: `${BASE}/3a12c83c5_pt-141.png`, price: 945, stock: 55 },
  { id: "nadb12", name: "NAD+ Vitamina B12 (Pen)", brand: "AlphaBio Lab", image: `${BASE}/5453b7c2e_nadcaneta.png`, price: 1816, stock: 59, tag: "Energia" },
  { id: "ghkcu100pen", name: "GHK-Cu 100mg (Pen)", brand: "AlphaBio Lab", image: `${BASE}/d8c6bf296_ghkcupen100mg.png`, price: 1420, stock: 61 },
  { id: "glow70pen", name: "GLOW 70mg Pen", brand: "AlphaBio Lab", image: `${BASE}/4435494c5_glow70caneta.png`, price: 1816, stock: 60, tag: "Pele" },
  { id: "tirz60ag", name: "Tirzegen 60mg c/ agulha", brand: "AlphaBio Clinic", image: `${BASE}/1fae475ec_tirz60comagulha.png`, price: 1750, stock: 54, tag: "Receita" },
  { id: "tirz60pen", name: "Tirzegen Pen 60mg Tirzepatida", brand: "AlphaBio Clinic", image: `${BASE}/355c5a08d_tirze60mgsagulha.png`, price: 1684, stock: 58, tag: "Receita" },
  { id: "reta40pen", name: "Retagen Pen 40mg Retatrutida", brand: "AlphaBio Clinic", image: `${BASE}/3130f8d0e_retasemagulha40mg.png`, price: 1816, stock: 53, tag: "Receita" },
  { id: "reta40ag", name: "Retagen 40mg Retatrutida c/ agulha", brand: "AlphaBio Clinic", image: `${BASE}/d7f962379_retacanetaagulha40m.png`, price: 1882, stock: 57, tag: "Receita" },
  { id: "retaxt40", name: "Retagen XT 40mg — 4 Ampolas", brand: "AlphaBio Clinic", image: `${BASE}/2c76de753_retaampola40mg.png`, price: 1288, stock: 50, tag: "Receita" },
  { id: "ghkcu50", name: "GHK-Cu 50mg", brand: "AlphaBio Lab", image: `${BASE}/9c2bf5cd4_716C0B07-BDDC-4B98-860B-62D8F0E44535.png`, price: 734, stock: 60 },
  { id: "ghkcu100", name: "GHK-Cu 100mg", brand: "AlphaBio Lab", image: `${BASE}/e69c1d26d_ghcu100.png`, price: 998, stock: 66 },
  { id: "retalio40", name: "Retagen 40mg Liofilizada", brand: "AlphaBio Clinic", image: `${BASE}/284bcea93_retaliofi.png`, price: 1420, stock: 79, tag: "Receita" },
  { id: "tirz60", name: "Tirzegen 60mg Tirzepatida", brand: "AlphaBio Clinic", image: `${BASE}/75b9cbc5a_9F5CBAB3-8DB9-496D-81BE-9A3EA6621289.png`, price: 1288, stock: 60, tag: "Receita" },
  { id: "glow70", name: "GLOW 70mg", brand: "AlphaBio Lab", image: `${BASE}/f2b197c7a_FF0E1085-E71D-4EF8-99A0-A863225EFFC7.png`, price: 1235, stock: 55 },
  { id: "ghkcu50d", name: "GHK-Cu 50mg Diluído", brand: "AlphaBio Lab", image: `${BASE}/0d268913e_ChatGPTImage20demaide202619_36_22.png`, price: 707, stock: 57 },
  { id: "ghkcu100d", name: "GHK-Cu 100mg Diluído", brand: "AlphaBio Lab", image: `${BASE}/09f3bbe23_A3E3E677-7902-4F44-A99C-2D7E01436545.png`, price: 958, stock: 61 },
  { id: "tirzlp60", name: "Tirzepatida Lipoland 60mg (4x 15mg)", brand: "Lipoland", image: `${BASE}/103537377_IMG_7880.jpg`, price: 1500, oldPrice: 1700, stock: 21, tag: "-12%" },
  { id: "tirztg60", name: "Tirzepatida T.G 60mg (4x 15mg)", brand: "T.G Pharma", image: `${BASE}/9d6cc6c39_IMG_7874.WEBP`, price: 1500, oldPrice: 1700, stock: 40, tag: "-12%" },
  { id: "kit4x5", name: "Kit 4 Canetas 5mg Tirzepatida — 20mg", brand: "AlphaBio Clinic", image: `${BASE}/eeea08808_IMG_7869.jpg`, price: 1350, oldPrice: 1650, stock: 35, tag: "-18%" },
  { id: "kit4x10", name: "Kit 4 Canetas 10mg Tirzepatida — 40mg", brand: "AlphaBio Clinic", image: `${BASE}/58d04a952_IMG_7869.jpg`, price: 1500, stock: 58 },
  { id: "reta60amp", name: "Retatrutida Ampola 60mg (5x 12mg)", brand: "AlphaBio Clinic", image: `${BASE}/568d834ac_IMG_7863.PNG`, price: 2600, oldPrice: 2800, stock: 0, tag: "Esgotado" },
  { id: "reta30pen", name: "Retatrutida Caneta 30mg", brand: "AlphaBio Clinic", image: `${BASE}/44c3c1417_IMG_7861.JPG`, price: 1950, oldPrice: 2300, stock: 0, tag: "Esgotado" },
  { id: "reta120", name: "Retatrutida Ampola 120mg (5x 24mg)", brand: "AlphaBio Clinic", image: `${BASE}/8289ebac4_IMG_7857.JPG`, price: 4200, stock: 0, tag: "Esgotado" },
  { id: "reta40amp", name: "Retatrutida Ampola 40mg (5x 8mg)", brand: "AlphaBio Clinic", image: `${BASE}/d0b74dd7a_IMG_7855.PNG`, price: 1950, oldPrice: 2100, stock: 0, tag: "Esgotado" },
  { id: "reta15amp", name: "Retatrutida Ampola 15mg", brand: "AlphaBio Clinic", image: `${BASE}/4cf0bc34b_IMG_7853.jpg`, price: 800, oldPrice: 1300, stock: 6, tag: "-38%" },
];

const products: Product[] = raw.map((p) => {
  const count = p.price >= 1500 ? 10 : 6;
  return {
    ...p,
    rating: p.rating ?? 4.8,
    reviews: p.reviews ?? Math.max(24, Math.round(p.stock * 3.2)),
    installment: { count, value: +(p.price / count).toFixed(2) },
  };
});

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

function ProductCard({ p, onOpen }: { p: Product; onOpen: (p: Product) => void }) {
  const outOfStock = p.stock === 0;
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
        </div>
      </div>

      <div className="flex flex-col p-3 gap-1.5 flex-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{p.brand}</span>
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

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-foreground">Catálogo completo</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Suplementação, hormônios e peptídeos selecionados pela nossa equipe clínica</p>
        </div>
        <a href="#" className="text-xs font-semibold text-success hover:underline whitespace-nowrap">Ver todos →</a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} onOpen={setSelected} />
        ))}
      </div>

      <ProductDetailModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
