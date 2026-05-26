import { Search, Tag, Building2, DollarSign } from "lucide-react";

const tags = [
  { icon: Tag, label: "Categorias" },
  { icon: Building2, label: "Marcas" },
  { icon: DollarSign, label: "Preço" },
];

export function SmartSearch() {
  return (
    <section className="mx-auto max-w-7xl px-4 -mt-2">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Encontre o que você procura
        </p>

        <div className="mt-2.5 relative">
          <input
            type="text"
            placeholder="Buscar por produto, marca ou princípio ativo..."
            className="w-full h-12 rounded-xl border border-border bg-surface pl-4 pr-14 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-success focus:ring-2 focus:ring-success/20"
          />
          <button
            aria-label="Buscar"
            className="absolute right-1.5 top-1.5 inline-flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground shadow-md"
            style={{ background: "var(--gradient-cta)" }}
          >
            <Search className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:border-success hover:text-success transition"
            >
              <t.icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
