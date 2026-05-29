import { useEffect, useState } from "react";
import { Portal } from "./Portal";
import { X, Loader2, ShieldCheck, Landmark, CreditCard, Smartphone, Wallet } from "lucide-react";
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

type BillingType = "UNDEFINED" | "PIX" | "CREDIT_CARD" | "BOLETO";

const BILLING_OPTIONS: { value: BillingType; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "UNDEFINED", label: "Escolher na hora", icon: <Wallet className="h-4 w-4" />, desc: "Você escolhe na página do Asaas" },
  { value: "PIX", label: "Pix", icon: <Smartphone className="h-4 w-4" />, desc: "Pagamento instantâneo" },
  { value: "CREDIT_CARD", label: "Cartão", icon: <CreditCard className="h-4 w-4" />, desc: "Parcele em até 12x" },
  { value: "BOLETO", label: "Boleto", icon: <Landmark className="h-4 w-4" />, desc: "Compensação em 1-2 dias" },
];

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
  const [billingType, setBillingType] = useState<BillingType>("UNDEFINED");
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

    const digits = cpfCnpj.replace(/\D/g, "");
    if (digits.length !== 11 && digits.length !== 14) {
      toast.error("Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido");
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
          billingType,
        },
      });
      cart.clear();
      // Abrir o checkout do Asaas em uma nova aba para evitar que o
      // sistema operacional (Android/iOS) intercepte o link e abra o
      // aplicativo do Asaas. Assim o cliente paga direto no navegador.
      const win = window.open(result.invoiceUrl, "_blank", "noopener,noreferrer");
      if (!win) {
        // Bloqueador de pop-up: fallback para a mesma aba
        window.location.href = result.invoiceUrl;
        return;
      }
      toast.success("Pagamento aberto em uma nova aba");
      onClose();
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

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Forma de pagamento
              </label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                {BILLING_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setBillingType(opt.value)}
                    className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-xs transition
                      ${billingType === opt.value
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border bg-surface text-foreground hover:border-primary/40"
                      }`}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                    <span className="text-[10px] text-muted-foreground font-normal leading-tight">
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-surface/60 p-3 text-sm flex items-center justify-between">
              <span className="text-muted-foreground">Total do pedido</span>
              <span className="text-xl font-bold text-success">
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {billingType === "UNDEFINED"
                ? "Você será redirecionado para a página segura do Asaas para escolher entre Pix, Cartão de crédito ou Boleto."
                : billingType === "BOLETO"
                ? "Você será redirecionado para a página segura do Asaas para gerar o boleto."
                : billingType === "CREDIT_CARD"
                ? "Você será redirecionado para a página segura do Asaas para pagar com cartão."
                : "Você será redirecionado para a página segura do Asaas para pagar com Pix."}
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
