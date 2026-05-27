import { useEffect, useState } from "react";
import { Portal } from "./Portal";
import { X, Loader2, ShieldCheck } from "lucide-react";
import { cart, cartTotal, type CartItem } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { createAsaasCheckout } from "@/lib/asaas.functions";
import { toast } from "sonner";

function maskCpfCnpj(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 11) {
    return d
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

export function CheckoutModal({
  open,
  items,
  onClose,
  onRequireLogin,
}: {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onRequireLogin: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const createCheckout = useServerFn(createAsaasCheckout);

  useEffect(() => {
    if (!open) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email && !email) setEmail(data.user.email);
      const meta = data.user?.user_metadata as { full_name?: string; name?: string } | undefined;
      if (meta && !name) setName(meta.full_name || meta.name || "");
    });
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const total = cartTotal(items);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      toast.error("Faça login para finalizar a compra");
      onRequireLogin();
      return;
    }

    setSubmitting(true);
    try {
      const result = await createCheckout({
        data: {
          items: items.map((i) => ({ id: i.id, qty: i.qty })),
          customer: {
            name: name.trim(),
            email: email.trim(),
            cpfCnpj: cpfCnpj.replace(/\D/g, ""),
            phone: phone.replace(/\D/g, "") || undefined,
          },
        },
      });
      cart.clear();
      // Redirect to Asaas hosted checkout
      window.location.href = result.invoiceUrl;
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Erro ao processar pagamento";
      toast.error(msg);
      setSubmitting(false);
    }
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[110] flex items-start justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-fade-in">
        <div className="relative w-full max-w-md mt-6 sm:mt-10 rounded-2xl bg-card shadow-2xl overflow-hidden animate-scale-in">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-lg font-bold text-foreground inline-flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Finalizar compra
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="h-9 w-9 rounded-full flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-surface"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Nome completo *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={120}
                className="mt-1 w-full h-11 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Como está no documento"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                E-mail *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={180}
                className="mt-1 w-full h-11 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="voce@email.com"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                CPF ou CNPJ *
              </label>
              <input
                type="text"
                required
                inputMode="numeric"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(maskCpfCnpj(e.target.value))}
                className="mt-1 w-full h-11 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="000.000.000-00"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Telefone (opcional)
              </label>
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(maskPhone(e.target.value))}
                className="mt-1 w-full h-11 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="rounded-lg bg-surface/60 p-3 text-sm flex items-center justify-between">
              <span className="text-muted-foreground">Total do pedido</span>
              <span className="text-xl font-bold text-success">
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Você será redirecionado para a página segura do Asaas para escolher entre{" "}
              <strong>Pix</strong> ou <strong>Cartão de crédito</strong>.
            </p>

            <button
              type="submit"
              disabled={submitting || items.length === 0}
              className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Gerando pagamento...
                </>
              ) : (
                "Ir para pagamento"
              )}
            </button>
          </form>
        </div>
      </div>
    </Portal>
  );
}
