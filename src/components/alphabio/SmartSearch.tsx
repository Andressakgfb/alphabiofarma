import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Search, Tag, Building2, DollarSign, X, Pencil, Plus } from "lucide-react";
import { catalog } from "@/lib/catalog";
import { siteSettings } from "@/lib/siteSettings";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { TaxonomyEditModal } from "./TaxonomyEditModal";
import { AddProductModal } from "./AddProductModal";

function useTaxonomy() {
  const cats = useSyncExternalStore(
    siteSettings.subscribe,
    () => JSON.stringify(siteSettings.getCategories()),
    () => "[]"
  );
  const brs = useSyncExternalStore(
    siteSettings.subscribe,
    () => JSON.stringify(siteSettings.getBrands()),
    () => "[]"
  );
  return {
    categories: ["Todas", ...(JSON.parse(cats) as string[])],
    brands: ["Todas", ...(JSON.parse(brs) as string[])],
  };
}

export function SmartSearch() {
  const [open, setOpen] = useState<null | "cat" | "brand" | "price">(null);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("Todas");
  const [brand, setBrand] = useState("Todas");
  const [priceMax, setPriceMax] = useState(5000);
  const ref = useRef<HTMLDivElement>(null);
  const { categories, brands } = useTaxonomy();
  const { isAdmin } = useIsAdmin();
  const [editing, setEditing] = useState<null | "category" | "brand">(null);
  const [addingProduct, setAddingProduct] = useState(false);

  // Live search: push to store on every change
  useEffect(() => {
    catalog.set({ query: q, category, brand, priceMax });
  }, [q, category, brand, priceMax]);

  // Sync from external (e.g. SearchModal updates)
  useEffect(() => {
    const unsub = catalog.subscribe((f) => {
      if (f.query !== q) setQ(f.query);
    });
    return () => { unsub(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close popover on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const tags = [
    { key: "cat" as const, icon: Tag, label: category === "Todas" ? "Categorias" : category },
    { key: "brand" as const, icon: Building2, label: brand === "Todas" ? "Marcas" : brand },
    { key: "price" as const, icon: DollarSign, label: priceMax >= 5000 ? "Preço" : `Até R$ ${priceMax}` },
  ];

  const hasFilters = category !== "Todas" || brand !== "Todas" || priceMax < 5000 || q.length > 0;

  return (
    <section className="mx-auto max-w-7xl px-4 -mt-2 relative" ref={ref}>
      <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Encontre o que você procura
          </p>
          {hasFilters && (
            <button
              onClick={() => { setQ(""); setCategory("Todas"); setBrand("Todas"); setPriceMax(5000); catalog.reset(); }}
              className="text-[11px] font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <X className="h-3 w-3" /> Limpar
            </button>
          )}
        </div>

        <div className="mt-2.5 relative">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por produto, marca ou princípio ativo..."
            className="w-full h-12 rounded-xl border border-border bg-surface pl-4 pr-14 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-success focus:ring-2 focus:ring-success/20"
          />
          <button
            aria-label="Buscar"
            onClick={() => {
              const el = document.getElementById("catalogo");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="absolute right-1.5 top-1.5 inline-flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground shadow-md"
            style={{ background: "var(--gradient-cta)" }}
          >
            <Search className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t.key}
              onClick={() => setOpen(open === t.key ? null : t.key)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                open === t.key
                  ? "border-success bg-success/10 text-success"
                  : "border-border bg-surface text-foreground hover:border-success hover:text-success"
              }`}
            >
              <t.icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          ))}
        </div>

        {open && (
          <div className="absolute left-4 right-4 mt-2 rounded-xl border border-border bg-card shadow-lg p-4 z-30 animate-fade-in">
            {open === "cat" && (
              <>
                <ul className="space-y-1.5">
                  {categories.map((c) => (
                    <li key={c}>
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground hover:text-success">
                        <input type="radio" name="cat" checked={category === c} onChange={() => { setCategory(c); setOpen(null); }} className="accent-success h-3.5 w-3.5" />
                        {c}
                      </label>
                    </li>
                  ))}
                </ul>
                {isAdmin && (
                  <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                    <button
                      onClick={() => { setAddingProduct(true); setOpen(null); }}
                      className="inline-flex items-center justify-center gap-1.5 h-9 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition"
                    >
                      <Plus className="h-3.5 w-3.5" /> Adicionar produto
                    </button>
                    <button
                      onClick={() => { setEditing("category"); setOpen(null); }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                    >
                      <Pencil className="h-3 w-3" /> Editar categorias
                    </button>
                  </div>
                )}
              </>
            )}
            {open === "brand" && (
              <>
                <ul className="space-y-1.5">
                  {brands.map((b) => (
                    <li key={b}>
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground hover:text-success">
                        <input type="radio" name="brand" checked={brand === b} onChange={() => { setBrand(b); setOpen(null); }} className="accent-success h-3.5 w-3.5" />
                        {b}
                      </label>
                    </li>
                  ))}
                </ul>
                {isAdmin && (
                  <button
                    onClick={() => { setEditing("brand"); setOpen(null); }}
                    className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                  >
                    <Pencil className="h-3 w-3" /> Editar marcas
                  </button>
                )}
              </>
            )}
            {open === "price" && (
              <div>
                <div className="flex items-center justify-between text-xs text-foreground mb-2">
                  <span>R$ 0</span>
                  <span className="font-semibold text-success">Até R$ {priceMax}</span>
                  <span>R$ 5000</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={5000}
                  step={50}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-success"
                />
                <button
                  onClick={() => setOpen(null)}
                  className="mt-3 w-full h-9 rounded-lg bg-success text-success-foreground text-xs font-semibold hover:opacity-90 transition"
                >
                  Aplicar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <TaxonomyEditModal
        open={editing !== null}
        kind={editing ?? "category"}
        onClose={() => setEditing(null)}
      />
      <AddProductModal
        open={addingProduct}
        onClose={() => setAddingProduct(false)}
        initialCategory={category}
      />
    </section>
  );
}
