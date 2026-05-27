import { useState, useEffect } from "react";
import { Portal } from "./Portal";
import { X, Save } from "lucide-react";
import { siteSettings, type SocialLinks } from "@/lib/siteSettings";
import { toast } from "sonner";

const FIELDS: { key: keyof SocialLinks; label: string; placeholder: string }[] = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/seuperfil" },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/suapagina" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@seucanal" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@seuperfil" },
  { key: "twitter", label: "Twitter / X", placeholder: "https://x.com/seuperfil" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/5511999999999" },
];

export function SocialEditModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [values, setValues] = useState<SocialLinks>({});

  useEffect(() => {
    if (open) setValues(siteSettings.getSocial());
  }, [open]);

  if (!open) return null;

  const handleSave = () => {
    siteSettings.setSocial(values);
    toast.success("Redes sociais atualizadas");
    onClose();
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-fade-in">
        <div className="relative w-full max-w-md mt-10 rounded-2xl bg-card shadow-2xl overflow-hidden animate-scale-in">
          <div className="bg-primary text-primary-foreground px-5 py-4 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold">Editar redes sociais</h2>
              <p className="text-xs opacity-90">Apenas administradores</p>
            </div>
            <button onClick={onClose} aria-label="Fechar" className="p-1 rounded-md hover:bg-white/10 transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-5 py-5 space-y-3 max-h-[70vh] overflow-y-auto">
            {FIELDS.map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-foreground mb-1.5">{f.label}</label>
                <input
                  type="url"
                  value={values[f.key] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
            ))}
            <p className="text-xs text-muted-foreground">Deixe em branco para ocultar o ícone do rodapé.</p>
          </div>

          <div className="px-5 py-4 border-t border-border flex justify-end gap-2">
            <button onClick={onClose} className="h-10 px-4 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-accent transition">
              Cancelar
            </button>
            <button onClick={handleSave} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-1.5 hover:bg-primary/90 transition">
              <Save className="h-4 w-4" /> Salvar
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
