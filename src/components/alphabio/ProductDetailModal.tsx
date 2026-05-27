import { X, ShoppingCart, ShieldCheck, Truck, Star } from "lucide-react";
import { cart } from "@/lib/cart";
import { toast } from "sonner";

export type ProductDetail = {
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

export function ProductDetailModal({
  product,
  onClose,
}: {
  product: ProductDetail | null;
  onClose: () => void;
}) {
  if (!product) return null;
  const outOfStock = product.stock === 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl mt-6 sm:mt-10 rounded-2xl bg-card shadow-2xl overflow-hidden animate-scale-in">
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-card/95 backdrop-blur flex items-center justify-center text-foreground/70 hover:text-foreground shadow-sm border border-border"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2">
          <div className="relative bg-surface flex items-center justify-center p-6 min-h-[260px]">
            {product.tag && (
              <span className={`absolute top-3 left-3 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                product.tag === "Esgotado"
                  ? "bg-muted text-muted-foreground"
                  : product.tag.startsWith("-")
                  ? "bg-success text-success-foreground"
                  : "bg-primary text-primary-foreground"
              }`}>
                {product.tag}
              </span>
            )}
            <img src={product.image} alt={product.name} className="max-h-72 w-auto object-contain" />
          </div>

          <div className="p-5 sm:p-6 flex flex-col gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{product.brand}</span>
            <h2 className="text-xl font-bold text-foreground leading-snug">{product.name}</h2>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i <= Math.round(product.rating) ? "fill-warning text-warning" : "text-border"}`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {product.rating.toFixed(1)} ({product.reviews} avaliações)
              </span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.name} da linha {product.brand}. Produto de alta pureza, voltado para
              pesquisa, performance e bem-estar. Armazenamento refrigerado, lote rastreável e
              certificado de análise disponível mediante solicitação.
            </p>

            <div className="rounded-xl border border-border bg-surface p-3">
              {product.oldPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  R$ {product.oldPrice.toFixed(2).replace(".", ",")}
                </span>
              )}
              <div className="text-2xl font-bold text-success leading-tight">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </div>
              <p className="text-xs text-muted-foreground">
                ou {product.installment.count}x de R$ {product.installment.value.toFixed(2).replace(".", ",")} sem juros
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Compra segura</span>
              <span className="inline-flex items-center gap-1"><Truck className="h-3.5 w-3.5 text-primary" /> Envio rápido</span>
            </div>

            <button
              disabled={outOfStock}
              onClick={() => {
                cart.add({ id: product.id, name: product.name, brand: product.brand, image: product.image, price: product.price });
                toast.success(`${product.name} adicionado ao carrinho`);
                onClose();
              }}
              className="mt-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-4 w-4" /> {outOfStock ? "Indisponível" : "Adicionar ao carrinho"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
