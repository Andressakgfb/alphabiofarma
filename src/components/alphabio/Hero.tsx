import { ShieldCheck, Truck, CreditCard, Flame } from "lucide-react";
import bannerHero from "@/assets/banner-hero.png";

const benefits = [
  { icon: ShieldCheck, label: "Compra 100% segura", sub: "Pagamento criptografado" },
  { icon: Truck, label: "Frete rápido", sub: "Entrega segura" },
  { icon: CreditCard, label: "Parcele em 10x", sub: "Sem juros" },
  { icon: Flame, label: "Melhores preços", sub: "Aproveite os descontos" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 pt-4 sm:pt-6">
        <img
          src={bannerHero}
          alt="Bem-vindo à AlphaBio — produtos selecionados com entrega rápida e pagamento 100% seguro"
          className="w-full h-auto block rounded-2xl shadow-[var(--shadow-card)]"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* benefits strip */}
      <div className="relative mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {benefits.map((b) => (
            <div
              key={b.label}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-3 shadow-[var(--shadow-soft)]"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
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
