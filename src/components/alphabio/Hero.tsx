import bannerImg from "@/assets/banner-alphabio.jpg";
import { ShieldCheck, Truck, CreditCard, BadgePercent } from "lucide-react";

const benefits = [
  { icon: ShieldCheck, label: "Compra Segura" },
  { icon: Truck, label: "Frete Rápido" },
  { icon: CreditCard, label: "Parcelamento" },
  { icon: BadgePercent, label: "Melhores Preços" },
];

export function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-6">
        <h1 className="sr-only">
          AlphaBio Farma — Suplementação clínica e hormônios regenerativos
        </h1>
        <div className="overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-soft)]">
          <img
            src={bannerImg}
            alt="Bem-vindo à AlphaBio — Loja oficial, compra segura"
            width={1306}
            height={978}
            fetchPriority="high"
            decoding="async"
            className="w-full h-auto block"
          />
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {benefits.map((b) => (
            <div
              key={b.label}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5 shadow-[var(--shadow-soft)]"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5 text-primary">
                <b.icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <span className="text-xs font-medium text-foreground leading-tight">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
