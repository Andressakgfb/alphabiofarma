import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Order = {
  id: string;
  status: string;
  total: number;
  items: any[];
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/conta/pedidos")({
  component: PedidosPage,
});

const statusLabel: Record<string, { label: string; cls: string }> = {
  pending: { label: "Aguardando pagamento", cls: "bg-amber-100 text-amber-700" },
  paid: { label: "Pago", cls: "bg-emerald-100 text-emerald-700" },
  shipped: { label: "Enviado", cls: "bg-blue-100 text-blue-700" },
  delivered: { label: "Entregue", cls: "bg-green-100 text-green-700" },
  canceled: { label: "Cancelado", cls: "bg-red-100 text-red-700" },
};

function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, status, total, items, created_at")
        .order("created_at", { ascending: false });
      if (!error && data) setOrders(data as Order[]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-3xl px-4 h-14 flex items-center gap-3">
          <Link to="/conta" className="p-2 -ml-2 text-foreground/70 hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-semibold text-foreground">Meus pedidos</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl bg-card border border-border p-10 text-center shadow-sm">
            <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Package className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-foreground">Você ainda não tem pedidos</p>
            <p className="text-xs text-muted-foreground mt-1">Quando comprar algo, ele aparecerá aqui.</p>
            <Link
              to="/"
              className="inline-flex mt-4 h-10 px-4 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition"
            >
              Ver produtos
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {orders.map((o) => {
              const s = statusLabel[o.status] ?? { label: o.status, cls: "bg-muted text-muted-foreground" };
              return (
                <li key={o.id} className="rounded-2xl bg-card border border-border p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Pedido #{o.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">
                        R$ {Number(o.total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(o.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${s.cls}`}>{s.label}</span>
                  </div>
                  {Array.isArray(o.items) && o.items.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-3">
                      {o.items.length} {o.items.length === 1 ? "item" : "itens"}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
