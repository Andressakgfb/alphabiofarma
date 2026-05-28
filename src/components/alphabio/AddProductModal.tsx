import { useEffect, useState, useSyncExternalStore } from "react";
import { X, Upload, SlidersHorizontal } from "lucide-react";
import { customProducts } from "@/lib/customProducts";
import { siteSettings } from "@/lib/siteSettings";
import { BRANDS } from "@/lib/catalog";
import { TaxonomyEditModal } from "./TaxonomyEditModal";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  initialCategory?: string;
};

export function AddProductModal({ open, onClose, initialCategory }: Props) {
  const catsRaw = useSyncExternalStore(
    siteSettings.subscribe,
    () => JSON.stringify(siteSettings.getCategories()),
    () => "[]"
  );
  const categories = JSON.parse(catsRaw) as string[];

  const typesRaw = useSyncExternalStore(
    siteSettings.subscribe,
    () => JSON.stringify(siteSettings.getProductTypes()),
    () => "[]"
  );
  const productTypes = JSON.parse(typesRaw) as string[];

  const [name, setName] = useState("");
  const [brand, setBrand] = useState(BRANDS[1] ?? "");
  const [category, setCategory] = useState(initialCategory && initialCategory !== "Todas" ? initialCategory : (categories[0] ?? ""));
  const [productType, setProductType] = useState(productTypes[0] ?? "");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [image, setImage] = useState("");
  const [tag, setTag] = useState("");
  const [editingTypes, setEditingTypes] = useState(false);

  useEffect(() => {
    if (open) {
      setName(""); setPrice(""); setOldPrice(""); setStock("10"); setImage(""); setTag("");
      setCategory(initialCategory && initialCategory !== "Todas" ? initialCategory : (categories[0] ?? ""));
      setProductType(productTypes[0] ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const onPickFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!name.trim()) return toast.error("Informe o nome do produto");
    const priceNum = Number(price);
    if (!priceNum || priceNum <= 0) return toast.error("Informe um preço válido");
    const stockNum = Number(stock) || 0;
    const oldPriceNum = oldPrice ? Number(oldPrice) : undefined;

    customProducts.add({
      name: name.trim(),
      brand: brand.trim() || "AlphaBio Lab",
      category: category || undefined,
      productType: productType || undefined,
      price: priceNum,
      oldPrice: oldPriceNum,
      stock: stockNum,
      image: image || "https://placehold.co/600x600/png?text=Produto",
      tag: tag.trim() || (stockNum === 0 ? "Esgotado" : undefined),
    });
    toast.success("Produto adicionado");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card">
          <h3 className="text-base font-bold text-foreground">Adicionar produto</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-surface flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <Field label="Nome do produto">
            <input value={name} onChange={(e) => setName(e.target.value)} className={inp} placeholder="Ex.: NAD+ 500mg" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Marca">
              <select value={brand} onChange={(e) => setBrand(e.target.value)} className={inp}>
                {BRANDS.filter((b) => b !== "Todas").map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Categoria">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inp}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Preço (R$)">
              <input type="number" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className={inp} placeholder="0,00" />
            </Field>
            <Field label="Preço antigo (opcional)">
              <input type="number" inputMode="decimal" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} className={inp} placeholder="0,00" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Estoque">
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className={inp} placeholder="0" />
            </Field>
            <Field label="Tag (opcional)">
              <input value={tag} onChange={(e) => setTag(e.target.value)} className={inp} placeholder="Ex.: Novidade, -15%" />
            </Field>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tipo de produto</span>
              <button
                type="button"
                onClick={() => setEditingTypes(true)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                <SlidersHorizontal className="h-3 w-3" /> Gerenciar tipos
              </button>
            </div>
            <select value={productType} onChange={(e) => setProductType(e.target.value)} className={inp}>
              {productTypes.length === 0 && <option value="">— sem tipos —</option>}
              {productTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <Field label="Imagem">
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-border bg-surface text-xs font-semibold cursor-pointer hover:border-primary">
                <Upload className="h-3.5 w-3.5" /> Enviar
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onPickFile(f); }} />
              </label>
              {image && <img src={image} alt="preview" className="h-10 w-10 rounded-md object-contain border border-border" />}
            </div>
            <input value={image} onChange={(e) => setImage(e.target.value)} className={`${inp} mt-2`} placeholder="ou cole uma URL" />
          </Field>
        </div>

        <div className="p-4 border-t border-border flex gap-2 sticky bottom-0 bg-card">
          <button onClick={onClose} className="flex-1 h-10 rounded-lg border border-border text-sm font-semibold hover:bg-surface">Cancelar</button>
          <button onClick={submit} className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">Adicionar</button>
        </div>
      </div>
      <TaxonomyEditModal open={editingTypes} kind="productType" onClose={() => setEditingTypes(false)} />
    </div>
  );
}

const inp = "w-full h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{label}</span>
      {children}
    </label>
  );
}
