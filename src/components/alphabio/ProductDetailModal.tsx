import { useEffect, useState } from "react";
import { X, ShoppingCart, ShieldCheck, Truck, Star, Check, Pencil, Save, RotateCcw, ImageIcon, DollarSign } from "lucide-react";
import { Portal } from "./Portal";
import { cart } from "@/lib/cart";
import { productDescriptions, type ProductDescription } from "@/lib/productDescriptions";
import { descriptionOverrides, fieldOverrides } from "@/lib/productDescriptionOverrides";
import { shouldShowBrand } from "./ProductGrid";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { toast } from "sonner";

export type ProductDetail = {
  id: string;
  name: string;
  brand: string;
  image: string;
  rating: number;
  reviews: number;
  oldPrice?: number;
  price: number;
  installment: { count: number; value: number };
  tag?: string;
  stock: number;
};

function getDescription(id: string): ProductDescription | undefined {
  return descriptionOverrides.get(id) ?? productDescriptions[id];
}

export function ProductDetailModal({
  product,
  onClose,
}: {
  product: ProductDetail | null;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editingFields, setEditingFields] = useState(false);
  const [priceDraft, setPriceDraft] = useState("");
  const [oldPriceDraft, setOldPriceDraft] = useState("");
  const [imageDraft, setImageDraft] = useState("");
  const [desc, setDesc] = useState<ProductDescription | undefined>(undefined);
  const [draft, setDraft] = useState<ProductDescription>({ intro: "" });
  const [, force] = useState(0);
  const { isAdmin } = useIsAdmin();

  useEffect(() => {
    if (!product) return;
    setEditing(false);
    setEditingFields(false);
    setDesc(getDescription(product.id));
    setPriceDraft(String(product.price));
    setOldPriceDraft(product.oldPrice ? String(product.oldPrice) : "");
    setImageDraft(product.image);
  }, [product]);

  useEffect(() => {
    const unsub = descriptionOverrides.subscribe(() => force((n) => n + 1));
    return () => unsub();
  }, []);

  if (!product) return null;
  const outOfStock = product.stock === 0;
  const hasOverride = !!descriptionOverrides.get(product.id);
  const current = desc ?? {
    intro: `${product.name} da linha ${product.brand}. Produto de alta pureza, voltado para pesquisa, performance e bem-estar.`,
  };

  const startEdit = () => {
    setDraft({
      intro: current.intro ?? "",
      sectionTitle: current.sectionTitle ?? "",
      bullets: current.bullets ? [...current.bullets] : [],
      extra: current.extra ?? "",
    });
    setEditing(true);
  };

  const save = () => {
    const cleaned: ProductDescription = {
      intro: draft.intro.trim(),
      sectionTitle: draft.sectionTitle?.trim() || undefined,
      bullets: (draft.bullets ?? []).map((b) => b.trim()).filter(Boolean),
      extra: draft.extra?.trim() || undefined,
    };
    if (!cleaned.intro) {
      toast.error("A introdução não pode ficar vazia");
      return;
    }
    descriptionOverrides.set(product.id, cleaned);
    setDesc(cleaned);
    setEditing(false);
    toast.success("Descrição atualizada");
  };

  const reset = () => {
    descriptionOverrides.remove(product.id);
    setDesc(productDescriptions[product.id]);
    setEditing(false);
    toast.success("Descrição restaurada para o padrão");
  };

  return (
    <Portal>
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl mt-6 sm:mt-10 rounded-2xl bg-card shadow-2xl overflow-hidden animate-scale-in">
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-card/95 backdrop-blur flex items-center justify-center text-foreground/70 hover:text-foreground shadow-sm border border-border"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2">
          <div className="relative bg-surface flex items-center justify-center p-6 min-h-[260px]">
            {product.tag && (
              <span className={`absolute top-3 left-3 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                product.tag === "Esgotado"
                  ? "bg-muted text-muted-foreground"
                  : product.tag.startsWith("-")
                  ? "bg-success text-success-foreground"
                  : "bg-primary text-primary-foreground"
              }`}>
                {product.tag}
              </span>
            )}
            <img src={product.image} alt={product.name} className="max-h-72 w-auto object-contain" />
          </div>

          <div className="p-5 sm:p-6 flex flex-col gap-3">
            {shouldShowBrand(product.brand) && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{product.brand}</span>
            )}
            <h2 className="text-xl font-bold text-foreground leading-snug">{product.name}</h2>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i <= Math.round(product.rating) ? "fill-warning text-warning" : "text-border"}`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {product.rating.toFixed(1)} ({product.reviews} avaliações)
              </span>
            </div>

            {!editing ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {current.intro}
                  </p>
                </div>

                {current.bullets && current.bullets.length > 0 && (
                  <div className="rounded-xl border border-border bg-surface p-3">
                    {current.sectionTitle && (
                      <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                        {current.sectionTitle}
                      </p>
                    )}
                    <ul className="space-y-1.5">
                      {current.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Check className="h-3.5 w-3.5 text-success mt-0.5 flex-shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    {current.extra && (
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        {current.extra}
                      </p>
                    )}
                  </div>
                )}

                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={startEdit}
                      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-card text-xs font-medium text-foreground hover:bg-surface transition"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Editar descrição
                    </button>
                    {hasOverride && (
                      <button
                        onClick={reset}
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-card text-xs font-medium text-muted-foreground hover:text-foreground transition"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Restaurar padrão
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col gap-2 rounded-xl border border-primary/40 bg-surface p-3">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Introdução</label>
                <textarea
                  value={draft.intro}
                  onChange={(e) => setDraft({ ...draft, intro: e.target.value })}
                  rows={4}
                  className="w-full rounded-md border border-border bg-card p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />

                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-1">Título da seção (opcional)</label>
                <input
                  value={draft.sectionTitle ?? ""}
                  onChange={(e) => setDraft({ ...draft, sectionTitle: e.target.value })}
                  className="w-full rounded-md border border-border bg-card p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />

                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-1">Tópicos (um por linha)</label>
                <textarea
                  value={(draft.bullets ?? []).join("\n")}
                  onChange={(e) => setDraft({ ...draft, bullets: e.target.value.split("\n") })}
                  rows={5}
                  className="w-full rounded-md border border-border bg-card p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />

                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-1">Texto adicional (opcional)</label>
                <textarea
                  value={draft.extra ?? ""}
                  onChange={(e) => setDraft({ ...draft, extra: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border border-border bg-card p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />

                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={save}
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition"
                  >
                    <Save className="h-3.5 w-3.5" /> Salvar
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border bg-card text-xs font-medium text-foreground hover:bg-surface transition"
                  >
                    Cancelar
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  As alterações ficam salvas neste navegador.
                </p>
              </div>
            )}

            <div className="rounded-xl border border-border bg-surface p-3">
              {product.oldPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  R$ {product.oldPrice.toFixed(2).replace(".", ",")}
                </span>
              )}
              <div className="text-2xl font-bold text-success leading-tight">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </div>
              <p className="text-xs text-muted-foreground">
                ou {product.installment.count}x de R$ {product.installment.value.toFixed(2).replace(".", ",")} sem juros
              </p>

              {isAdmin && (!editingFields ? (
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => setEditingFields(true)}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-card text-xs font-medium text-foreground hover:bg-surface transition"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Editar preço e imagem
                  </button>
                  {!!fieldOverrides.get(product.id) && (
                    <button
                      onClick={() => {
                        fieldOverrides.remove(product.id);
                        toast.success("Preço e imagem restaurados");
                      }}
                      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-card text-xs font-medium text-muted-foreground hover:text-foreground transition"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Restaurar
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-3 flex flex-col gap-2 rounded-lg border border-primary/40 bg-card p-3">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> Preço (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={priceDraft}
                    onChange={(e) => setPriceDraft(e.target.value)}
                    className="w-full rounded-md border border-border bg-surface p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />

                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-1">
                    Preço antigo (opcional, para mostrar riscado)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={oldPriceDraft}
                    onChange={(e) => setOldPriceDraft(e.target.value)}
                    placeholder="Deixe em branco para não exibir"
                    className="w-full rounded-md border border-border bg-surface p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />

                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-1 inline-flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" /> URL da imagem
                  </label>
                  <input
                    type="url"
                    value={imageDraft}
                    onChange={(e) => setImageDraft(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-md border border-border bg-surface p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  {imageDraft && (
                    <div className="h-24 w-24 rounded-md border border-border bg-surface flex items-center justify-center overflow-hidden self-start">
                      <img src={imageDraft} alt="Pré-visualização" className="h-full w-full object-contain p-1" />
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => {
                        const priceNum = parseFloat(priceDraft);
                        if (!isFinite(priceNum) || priceNum < 0) {
                          toast.error("Informe um preço válido");
                          return;
                        }
                        const oldNum = oldPriceDraft.trim() === "" ? null : parseFloat(oldPriceDraft);
                        if (oldNum !== null && (!isFinite(oldNum) || oldNum < 0)) {
                          toast.error("Preço antigo inválido");
                          return;
                        }
                        if (!imageDraft.trim()) {
                          toast.error("Informe a URL da imagem");
                          return;
                        }
                        fieldOverrides.set(product.id, {
                          price: priceNum,
                          oldPrice: oldNum,
                          image: imageDraft.trim(),
                        });
                        setEditingFields(false);
                        toast.success("Preço e imagem atualizados");
                      }}
                      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition"
                    >
                      <Save className="h-3.5 w-3.5" /> Salvar
                    </button>
                    <button
                      onClick={() => setEditingFields(false)}
                      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border bg-card text-xs font-medium text-foreground hover:bg-surface transition"
                    >
                      Cancelar
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    As alterações ficam salvas neste navegador.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Compra segura</span>
              <span className="inline-flex items-center gap-1"><Truck className="h-3.5 w-3.5 text-primary" /> Envio rápido</span>
            </div>

            <button
              disabled={outOfStock}
              onClick={() => {
                cart.add({ id: product.id, name: product.name, brand: product.brand, image: product.image, price: product.price });
                toast.success(`${product.name} adicionado ao carrinho`);
                onClose();
              }}
              className="mt-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-4 w-4" /> {outOfStock ? "Indisponível" : "Adicionar ao carrinho"}
            </button>
          </div>
        </div>
      </div>
    </div>
    </Portal>
  );
}
