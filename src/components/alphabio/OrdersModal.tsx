import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Portal } from "./Portal";
import { X, Loader2, Package, ExternalLink, CheckCircle2, Clock, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type OrderRow = {
  id: string;
  status: string;
  total: number;
  items: Array<{ name: string; qty: number; lineTotal: number }>;
  created_at: string;
  asaas_invoice_url: string | null;
};

function statusVisual(status: string) {
  switch (status) {
    case "paid":
      return { icon: <CheckCircle2 className="h-4 w-4 text-success" />, label: "Pago", color: "text-success" };
    case "overdue":
      return { icon: <XCircle className="h-4 w-4 text-destructive" />, label: "Vencido", color: "text-destructive" };
    case "cancelled":
      return { icon: <XCircle className="h-4 w-4 text-destructive" />, label: "Cancelado", color: "text-destructive" };
    case "refunded":
      return { icon: <XCircle className="h-4 w-4 text-destructive" />, label: "Estornado", color: "text-destructive" };
    default:
      return { icon: <Clock className="h-4 w-4 text-warning" />, label: "Aguardando pagamento", color: "text-warning" };
  }
}

export function OrdersModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, status, total, items, created_at, asaas_invoice_url")
        .order("created_at", { ascending: false });
      if (!active) return;
      if (error) setOrders([]);
      else setOrders((data ?? []) as OrderRow[]);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [open]);

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-fade-in">
        <div className="relative w-full max-w-2xl mt-10 rounded-2xl bg-card shadow-2xl overflow-hidden animate-scale-in">
          <div className="bg-primary text-primary-foreground px-5 py-4 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold inline-flex items-center gap-2"><Package className="h-5 w-5" /> Meus Pedidos</h2>
              <p className="text-xs opacity-90">Acompanhe o status e o rastreamento</p>
            </div>
            <button onClick={onClose} aria-label="Fechar" className="p-1 rounded-md hover:bg-white/10 transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-5 py-5 max-h-[70vh] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : !orders || orders.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Package className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Você ainda não tem pedidos.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {orders.map((o) => {
                  const v = statusVisual(o.status);
                  return (
                    <li key={o.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                            Pedido #{o.id.slice(0, 8)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(o.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${v.color}`}>
                          {v.icon} {v.label}
                        </span>
                      </div>
                      <ul className="text-sm text-foreground space-y-0.5 mb-2">
                        {o.items?.slice(0, 3).map((i, idx) => (
                          <li key={idx} className="text-muted-foreground truncate">
                            {i.qty}x {i.name}
                          </li>
                        ))}
                        {o.items && o.items.length > 3 && (
                          <li className="text-xs text-muted-foreground">+ {o.items.length - 3} item(s)</li>
                        )}
                      </ul>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-sm font-semibold text-success">
                          R$ {Number(o.total).toFixed(2).replace(".", ",")}
                        </span>
                        <Link
                          to="/pedido/$id"
                          params={{ id: o.id }}
                          onClick={onClose}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          Ver detalhes e rastreio <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
