import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  XCircle,
  ArrowLeft,
  Loader2,
  Receipt,
  CreditCard,
  Smartphone,
  Landmark,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
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
  asaas_payment_id: string | null;
  payment_method: string | null;
  customer: { name?: string; email?: string } | null;
  created_at: string;
};

function paymentMethodIcon(method: string | null) {
  const m = (method || "").toLowerCase();
  if (m.includes("pix")) return <Smartphone className="h-4 w-4" />;
  if (m.includes("credit")) return <CreditCard className="h-4 w-4" />;
  if (m.includes("boleto")) return <Landmark className="h-4 w-4" />;
  return <Receipt className="h-4 w-4" />;
}

function paymentMethodLabel(method: string | null) {
  const m = (method || "").toLowerCase();
  if (m.includes("pix")) return "Pix";
  if (m.includes("credit")) return "Cartão de crédito";
  if (m.includes("boleto")) return "Boleto bancário";
  if (m.includes("undefined")) return "A definir";
  return method || "—";
}

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
        .select(
          "id, status, total, items, asaas_invoice_url, asaas_payment_id, payment_method, customer, created_at"
        )
        .eq("id", id)
        .maybeSingle();
      if (!active) return;
      if (error) {
        console.error("Failed to load order:", error);
        setError("Erro ao carregar pedido.");
      } else if (!data) setError("Pedido não encontrado.");
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
          bg: "bg-success/10",
          border: "border-success/30",
          icon: <CheckCircle2 className="h-14 w-14 text-success" />,
          title: "Pagamento confirmado",
          desc: "Recebemos seu pagamento. Em breve enviaremos atualizações sobre o envio.",
          badge: "text-success bg-success/10",
        };
      case "overdue":
        return {
          bg: "bg-warning/10",
          border: "border-warning/30",
          icon: <AlertTriangle className="h-14 w-14 text-warning" />,
          title: "Pagamento vencido",
          desc: "O prazo para pagamento expirou. Se quiser, pode gerar uma nova cobrança.",
          badge: "text-warning bg-warning/10",
        };
      case "refunded":
        return {
          bg: "bg-destructive/10",
          border: "border-destructive/30",
          icon: <RefreshCw className="h-14 w-14 text-destructive" />,
          title: "Pagamento estornado",
          desc: "O valor foi devolvido. Pode levar até 5 dias úteis para aparecer na sua conta.",
          badge: "text-destructive bg-destructive/10",
        };
      case "cancelled":
        return {
          bg: "bg-destructive/10",
          border: "border-destructive/30",
          icon: <XCircle className="h-14 w-14 text-destructive" />,
          title: "Pedido cancelado",
          desc: "Este pedido foi cancelado. Se acha que isso é um engano, fale com a gente.",
          badge: "text-destructive bg-destructive/10",
        };
      default:
        return {
          bg: "bg-primary/5",
          border: "border-primary/20",
          icon: <Clock className="h-14 w-14 text-primary animate-pulse" />,
          title: "Aguardando pagamento",
          desc: "Assim que recebermos a confirmação do Asaas, este status será atualizado automaticamente.",
          badge: "text-primary bg-primary/10",
        };
    }
  })();

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      paid: "Pago",
      pending: "Pendente",
      overdue: "Vencido",
      refunded: "Estornado",
      cancelled: "Cancelado",
    };
    return map[s] || s;
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 flex items-start justify-center">
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border mt-6 sm:mt-10 overflow-hidden shadow-lg">
        {/* Header status */}
        <div className={`p-6 text-center space-y-3 ${visual.bg} ${visual.border} border-b`}>
          <div className="flex justify-center">{visual.icon}</div>
          <h1 className="text-xl font-bold text-foreground">{visual.title}</h1>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">{visual.desc}</p>
        </div>

        <div className="p-6 space-y-5">
          {/* Order meta */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
              Pedido #{order.id.slice(0, 8)}
            </p>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${visual.badge}`}>
              {statusLabel(order.status)}
            </span>
          </div>

          {/* Items */}
          <div className="border-t border-border pt-4 space-y-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
              Itens
            </p>
            <ul className="text-sm text-foreground space-y-2">
              {order.items?.map((i, idx) => (
                <li key={idx} className="flex justify-between gap-2">
                  <span>
                    {i.qty}x {i.name}
                  </span>
                  <span className="text-muted-foreground whitespace-nowrap">
                    R$ {Number(i.lineTotal).toFixed(2).replace(".", ",")}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between pt-3 border-t border-border text-sm font-semibold">
              <span>Total</span>
              <span className="text-success">
                R$ {Number(order.total).toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>

          {/* Payment details */}
          <div className="rounded-lg bg-surface/60 p-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Forma de pagamento</span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                {paymentMethodIcon(order.payment_method)}
                {paymentMethodLabel(order.payment_method)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Data do pedido</span>
              <span className="font-medium">
                {new Date(order.created_at).toLocaleDateString("pt-BR")}
              </span>
            </div>
            {order.customer?.email && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">E-mail</span>
                <span className="font-medium">{order.customer.email}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          {order.status === "pending" && order.asaas_invoice_url && (
            <a
              href={order.asaas_invoice_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-4 w-4" /> Abrir página de pagamento
            </a>
          )}

          {order.status === "overdue" && order.asaas_invoice_url && (
            <a
              href={order.asaas_invoice_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-11 rounded-lg bg-warning text-warning-foreground text-sm font-semibold hover:bg-warning/90 flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-4 w-4" /> Tentar pagar novamente
            </a>
          )}

          <div className="flex items-center justify-between text-sm pt-2">
            <Link to="/" className="text-primary font-semibold inline-flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Continuar comprando
            </Link>
            <button
              onClick={() => router.invalidate()}
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Atualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
