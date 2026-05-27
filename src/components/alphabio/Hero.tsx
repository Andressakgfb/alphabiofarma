import { ShieldCheck, Truck, CreditCard, BadgePercent, Sparkles } from "lucide-react";
import bannerHero from "@/assets/banner-hero.jpg";

const benefits = [
  { icon: ShieldCheck, label: "Compra 100% segura", sub: "Pagamento criptografado" },
  { icon: Truck, label: "Frete rápido", sub: "Entrega segura" },
  { icon: CreditCard, label: "Parcele em 10x", sub: "Sem juros" },
  { icon: BadgePercent, label: "Melhores preços", sub: "Aproveite os descontos" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 pt-4 sm:pt-6">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-[var(--shadow-card)]">
          <img
            src={bannerHero}
            alt="Bem-vindo à AlphaBio — produtos selecionados com entrega rápida e pagamento 100% seguro"
            className="w-full h-auto block"
            loading="eager"
            fetchPriority="high"
            width={1920}
            height={640}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur px-3 py-1 text-[11px] sm:text-xs font-medium text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Loja oficial · Compra segura
            </span>
            <h1 className="mt-3 sm:mt-4 font-bold leading-[0.95] tracking-tight">
              <span className="block text-3xl sm:text-5xl md:text-6xl text-foreground/80">Bem-vindo à</span>
              <span className="block text-4xl sm:text-6xl md:text-7xl text-primary">AlphaBio</span>
            </h1>
            <p className="mt-3 sm:mt-4 max-w-2xl text-xs sm:text-sm md:text-base text-foreground/80">
              Produtos selecionados com entrega rápida e pagamento 100% seguro.
            </p>
          </div>
        </div>
      </div>

      {/* benefits strip */}
      <div className="relative mx-auto max-w-7xl px-4 py-6">
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
