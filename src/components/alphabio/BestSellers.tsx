import { useState } from "react";
import { Flame } from "lucide-react";
import { ProductCard, useProducts, type Product } from "./ProductGrid";
import { ProductDetailModal } from "./ProductDetailModal";

const FEATURED_IDS = [
  "nad500",
  "nadb12",
  "ghkcu100pen",
  "glow70pen",
  "ghkcu50",
  "ghkcu100",
  "glow70",
  "ghkcu50d",
];

export function BestSellers() {
  const [selected, setSelected] = useState<Product | null>(null);
  const all = useProducts();
  const featured = FEATURED_IDS
    .map((id) => all.find((p) => p.id === id))
    .filter(Boolean) as Product[];
  const selectedLive = selected ? all.find((p) => p.id === selected.id) ?? selected : null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 pb-2">
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-warning">
            <Flame className="h-5 w-5" />
            <h2 className="text-lg sm:text-2xl font-bold text-foreground">Mais vendidos</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Os queridinhos da loja</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {featured.map((p) => (
          <ProductCard key={p.id} p={p} onOpen={setSelected} />
        ))}
      </div>

      <ProductDetailModal product={selectedLive} onClose={() => setSelected(null)} />
    </section>
  );
}
