import { ShieldCheck, Truck, CreditCard, BadgePercent, Sparkles } from "lucide-react";

const benefits = [
  { icon: ShieldCheck, label: "Compra 100% segura", sub: "Pagamento criptografado" },
  { icon: Truck, label: "Frete rápido", sub: "Entrega segura" },
  { icon: CreditCard, label: "Parcele em 10x", sub: "Sem juros" },
  { icon: BadgePercent, label: "Melhores preços", sub: "Aproveite os descontos" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* soft gradient + molecule background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary))_0,transparent_40%),radial-gradient(circle_at_80%_60%,hsl(var(--primary))_0,transparent_45%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-10 pb-12 sm:pt-16 sm:pb-20 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1 text-xs font-medium text-primary shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          Loja oficial · Compra segura
        </span>

        <h1 className="mt-5 text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05]">
          Bem-vindo à
          <span className="block text-primary mt-1">AlphaBio</span>
        </h1>

        <p className="mt-5 max-w-xl mx-auto text-sm sm:text-base text-muted-foreground">
          Produtos selecionados com entrega rápida e pagamento 100% seguro.
        </p>
      </div>

      {/* benefits strip */}
      <div className="relative mx-auto max-w-7xl px-4 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {benefits.map((b) => (
            <div
              key={b.label}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-3 shadow-[var(--shadow-soft)]"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <b.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-foreground leading-tight truncate">{b.label}</p>
                <p className="text-[11px] text-muted-foreground leading-tight truncate">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
