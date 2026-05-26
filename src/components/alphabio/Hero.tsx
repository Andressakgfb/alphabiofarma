import heroImg from "@/assets/hero-lab.jpg";
import { ShieldCheck, Truck, CreditCard, BadgePercent } from "lucide-react";

const benefits = [
  { icon: ShieldCheck, label: "Compra Segura" },
  { icon: Truck, label: "Frete Rápido" },
  { icon: CreditCard, label: "Parcelamento" },
  { icon: BadgePercent, label: "Melhores Preços" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt=""
          width={1536}
          height={1024}
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-8 pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 text-success px-2.5 py-1 text-[11px] font-medium">
            <ShieldCheck className="h-3 w-3" /> Farmácia certificada ANVISA
          </span>
          <span className="hidden sm:inline-flex items-center rounded-full bg-primary/5 text-primary px-2.5 py-1 text-[11px] font-medium">
            +50 mil clientes
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
          Bem-vindo à <span className="text-primary">AlphaBio</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl">
          Suplementação clínica, hormônios regenerativos e biohacking — entregues com a confiança de uma farmácia.
        </p>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
