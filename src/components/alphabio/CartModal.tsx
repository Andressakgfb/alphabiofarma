import { useEffect, useState } from "react";
import { Portal } from "./Portal";
import { CheckoutModal } from "./CheckoutModal";
import { AuthModal } from "./AuthModal";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { cart, cartTotal, type CartItem } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function CartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setItems(cart.get());
    return cart.subscribe(() => setItems(cart.get()));
  }, [open]);

  if (!open) return null;

  const total = cartTotal(items);

  async function handleCheckout() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      toast.info("Faça login para finalizar a compra");
      setAuthOpen(true);
      return;
    }
    setCheckoutOpen(true);
  }


  return (
    <Portal>
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg mt-6 sm:mt-10 rounded-2xl bg-card shadow-2xl overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground inline-flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" /> Meu carrinho
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="h-9 w-9 rounded-full flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-surface"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="p-10 text-center">
            <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Seu carrinho está vazio.</p>
            <button
              onClick={onClose}
              className="mt-4 inline-flex items-center justify-center h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
            >
              Continuar comprando
            </button>
          </div>
        ) : (
          <>
            <ul className="max-h-[55vh] overflow-y-auto divide-y divide-border">
              {items.map((it) => (
                <li key={it.id} className="flex gap-3 p-4">
                  <div className="h-16 w-16 rounded-lg bg-surface flex items-center justify-center overflow-hidden shrink-0">
                    <img src={it.image} alt={it.name} className="h-full w-full object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{it.brand}</p>
                    <p className="text-sm font-semibold text-foreground line-clamp-2">{it.name}</p>
                    <p className="text-sm font-bold text-success mt-0.5">
                      R$ {it.price.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => cart.remove(it.id)}
                      aria-label="Remover"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="inline-flex items-center border border-border rounded-md">
                      <button
                        onClick={() => cart.setQty(it.id, it.qty - 1)}
                        className="h-7 w-7 flex items-center justify-center text-foreground/70 hover:text-foreground"
                        aria-label="Diminuir"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-semibold">{it.qty}</span>
                      <button
                        onClick={() => cart.setQty(it.id, it.qty + 1)}
                        className="h-7 w-7 flex items-center justify-center text-foreground/70 hover:text-foreground"
                        aria-label="Aumentar"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border p-4 space-y-3 bg-surface/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="text-xl font-bold text-success">
                  R$ {total.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <button
                onClick={() => {
                  toast.success("Pedido enviado para o checkout");
                  cart.clear();
                  onClose();
                }}
                className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
              >
                Finalizar compra
              </button>
              <button
                onClick={onClose}
                className="w-full h-10 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-surface"
              >
                Continuar comprando
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    </Portal>
  );
}
