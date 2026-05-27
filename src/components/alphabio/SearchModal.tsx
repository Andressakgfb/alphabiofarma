import { useEffect, useRef, useState } from "react";
import { Portal } from "./Portal";
import { X, Search } from "lucide-react";
import { catalog } from "@/lib/catalog";

const suggestions = [
  "Tirzepatida",
  "Retatrutida",
  "NAD+",
  "GHK-Cu",
  "PT-141",
  "Tesamorelin",
  "GLOW",
];

export function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => ref.current?.focus(), 50);
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    catalog.set({ query: term });
    setTimeout(() => {
      const el = document.getElementById("catalogo");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    onClose();
  };

  return (
    <Portal>
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl mt-10 rounded-2xl bg-card shadow-2xl overflow-hidden animate-scale-in">
        <div className="px-5 py-4 flex items-center justify-between border-b border-border">
          <h2 className="text-base font-bold text-foreground">Buscar produtos</h2>
          <button onClick={onClose} aria-label="Fechar" className="p-1 rounded-md hover:bg-accent transition">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <form className="px-5 py-5 space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              ref={ref}
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Produto, marca ou princípio ativo..."
              className="w-full h-12 rounded-xl border border-border bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Sugestões</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQ(s)}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary hover:text-primary transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition shadow-sm"
          >
            Buscar →
          </button>
        </form>
      </div>
    </div>
    </Portal>
  );
}
