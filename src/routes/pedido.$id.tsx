import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Clock, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/pedido/$id")({
  component: OrderStatusPage,
  head: () => ({
    meta: [
      { title: "Status do pedido — AlphaBio Farma" },
      { name: "robots", content: "noindex" },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-6">
      <p className="text-muted-foreground">Pedido não encontrado.</p>
    </div>
  ),
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-6">
      <p className="text-muted-foreground">Erro ao carregar pedido.</p>
    </div>
  ),
});

type OrderRow = {
  id: string;
  status: string;
  total: number;
  items: Array<{ name: string; qty: number; lineTotal: number }>;
  asaas_invoice_url: string | null;
};

function OrderStatusPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        setError("Faça login para ver este pedido.");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("orders")
        .select("id, status, total, items, asaas_invoice_url")
        .eq("id", id)
        .maybeSingle();
      if (!active) return;
      if (error) setError(error.message);
      else if (!data) setError("Pedido não encontrado.");
      else setOrder(data as OrderRow);
      setLoading(false);
    }
    load();
    const interval = setInterval(load, 8000); // poll while waiting for webhook
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-muted-foreground">{error ?? "Pedido não encontrado."}</p>
        <Link to="/" className="text-primary text-sm font-semibold inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Voltar para a loja
        </Link>
      </div>
    );
  }

  const visual = (() => {
    switch (order.status) {
      case "paid":
        return {
          icon: <CheckCircle2 className="h-12 w-12 text-success" />,
          title: "Pagamento confirmado",
          desc: "Recebemos seu pagamento. Em breve enviaremos atualizações sobre o envio.",
        };
      case "overdue":
      case "cancelled":
      case "refunded":
        return {
          icon: <XCircle className="h-12 w-12 text-destructive" />,
          title:
            order.status === "refunded"
              ? "Pagamento estornado"
              : order.status === "overdue"
              ? "Pagamento vencido"
              : "Pedido cancelado",
          desc: "Se acha que isso é um engano, fale com a gente.",
        };
      default:
        return {
          icon: <Clock className="h-12 w-12 text-warning animate-pulse" />,
          title: "Aguardando pagamento",
          desc: "Assim que recebermos a confirmação do Asaas, este status será atualizado automaticamente.",
        };
    }
  })();

  return (
    <div className="min-h-screen bg-background p-6 flex items-start justify-center">
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 mt-10 space-y-5">
        <div className="flex flex-col items-center text-center gap-3">
          {visual.icon}
          <h1 className="text-xl font-bold text-foreground">{visual.title}</h1>
          <p className="text-sm text-muted-foreground">{visual.desc}</p>
        </div>

        <div className="border-t border-border pt-4 space-y-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
            Pedido #{order.id.slice(0, 8)}
          </p>
          <ul className="text-sm text-foreground space-y-1">
            {order.items?.map((i, idx) => (
              <li key={idx} className="flex justify-between gap-2">
                <span>
                  {i.qty}x {i.name}
                </span>
                <span className="text-muted-foreground">
                  R$ {Number(i.lineTotal).toFixed(2).replace(".", ",")}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between pt-2 border-t border-border text-sm font-semibold">
            <span>Total</span>
            <span className="text-success">
              R$ {Number(order.total).toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>

        {order.status === "pending" && order.asaas_invoice_url && (
          <a
            href={order.asaas_invoice_url}
            className="block w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 flex items-center justify-center"
          >
            Abrir página de pagamento
          </a>
        )}

        <div className="flex items-center justify-between text-sm">
          <Link to="/" className="text-primary font-semibold inline-flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Continuar comprando
          </Link>
          <button
            onClick={() => router.invalidate()}
            className="text-muted-foreground hover:text-foreground"
          >
            Atualizar
          </button>
        </div>
      </div>
    </div>
  );
}
