import { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { siteSettings } from "@/lib/siteSettings";
import { toast } from "sonner";

export function TaxonomyEditModal({
  open,
  kind,
  onClose,
}: {
  open: boolean;
  kind: "category" | "brand";
  onClose: () => void;
}) {
  const [items, setItems] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!open) return;
    setItems(kind === "category" ? siteSettings.getCategories() : siteSettings.getBrands());
    setDraft("");
  }, [open, kind]);

  if (!open) return null;

  const title = kind === "category" ? "Editar categorias" : "Editar marcas";
  const placeholder = kind === "category" ? "Nova categoria" : "Nova marca";

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    if (items.some((i) => i.toLowerCase() === v.toLowerCase())) {
      toast.error("Já existe");
      return;
    }
    setItems([...items, v]);
    setDraft("");
  };

  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const update = (i: number, v: string) =>
    setItems(items.map((it, idx) => (idx === i ? v : it)));

  const save = () => {
    const cleaned = items.map((s) => s.trim()).filter(Boolean);
    if (kind === "category") siteSettings.setCategories(cleaned);
    else siteSettings.setBrands(cleaned);
    toast.success("Salvo");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {items.map((it, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={it}
                onChange={(e) => update(i, e.target.value)}
                className="flex-1 h-9 rounded-md border border-border bg-surface px-2 text-sm"
              />
              <button
                onClick={() => remove(i)}
                className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border text-destructive hover:bg-destructive/10"
                aria-label="Remover"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">Nenhum item.</p>
          )}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder={placeholder}
              className="flex-1 h-9 rounded-md border border-border bg-surface px-2 text-sm"
            />
            <button
              onClick={add}
              className="h-9 px-3 inline-flex items-center gap-1 rounded-md bg-success text-success-foreground text-xs font-semibold"
            >
              <Plus className="h-4 w-4" /> Adicionar
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t border-border">
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-md border border-border text-sm font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={save}
            className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
