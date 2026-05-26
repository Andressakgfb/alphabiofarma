import { SlidersHorizontal } from "lucide-react";

const categories = [
  "Suplementação e Performance",
  "Hormônio Crescimento Regenerativo",
  "RETRATUTIDA",
  "TIRZEPATIDA / MOUNJARO",
];

const brands = ["Oxygen kW", "LANDERLAN", "INDUFAR", "Lipoless", "TIRZEC", "SYNEDICA", "ZPHC"];

export function Filters() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-2">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
            <SlidersHorizontal className="h-4 w-4 text-success" /> Filtrar resultados
          </h3>
          <button className="text-[11px] font-semibold text-muted-foreground hover:text-foreground">Limpar</button>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Categoria</p>
            <ul className="space-y-1.5">
              {categories.map((c) => (
                <li key={c.name}>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground hover:text-success">
                    <input type="radio" name="cat" className="accent-success h-3.5 w-3.5" />
                    <span className="flex-1">{c.name}</span>
                    <span className="text-[11px] text-muted-foreground">{c.count}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Marca</p>
            <ul className="space-y-1.5">
              {brands.map((b) => (
                <li key={b}>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground hover:text-success">
                    <input type="checkbox" className="accent-success h-3.5 w-3.5" />
                    {b}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Faixa de preço</p>
            <div className="flex items-center justify-between text-xs text-foreground">
              <span>R$ 20</span>
              <span className="font-semibold text-success">R$ 250</span>
              <span>R$ 800</span>
            </div>
            <input type="range" min={20} max={800} defaultValue={250} className="w-full mt-2 accent-success" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <input placeholder="Min" className="h-8 rounded-md border border-border bg-surface px-2 text-xs" />
              <input placeholder="Max" className="h-8 rounded-md border border-border bg-surface px-2 text-xs" />
            </div>
            <button className="mt-3 w-full h-9 rounded-lg bg-success text-success-foreground text-xs font-semibold hover:opacity-90 transition">
              Aplicar filtros
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
