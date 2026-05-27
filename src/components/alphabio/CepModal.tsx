import { useState } from "react";
import { Portal } from "./Portal";
import { X, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function CepModal({
  open,
  initialCep,
  onClose,
  onSave,
}: {
  open: boolean;
  initialCep: string;
  onClose: () => void;
  onSave: (cep: string, info?: { city: string; uf: string }) => void;
}) {
  const [cep, setCep] = useState(initialCep);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const formatCep = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 8);
    return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      toast.error("Digite um CEP válido com 8 dígitos");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data?.erro) {
        toast.error("CEP não encontrado");
        return;
      }
      onSave(formatCep(digits), { city: data.localidade, uf: data.uf });
      toast.success(`Entrega para ${data.localidade}/${data.uf}`);
      onClose();
    } catch {
      onSave(formatCep(digits));
      toast.success("CEP salvo");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-md mt-10 rounded-2xl bg-card shadow-2xl overflow-hidden animate-scale-in">
        <div className="bg-primary text-primary-foreground px-5 py-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <div>
              <h2 className="text-lg font-bold">Onde entregar?</h2>
              <p className="text-xs opacity-90">Informe seu CEP para calcular frete e prazo</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="p-1 rounded-md hover:bg-white/10 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="px-5 py-5 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">CEP</label>
            <input
              type="text"
              inputMode="numeric"
              autoFocus
              value={cep}
              onChange={(e) => setCep(formatCep(e.target.value))}
              placeholder="00000-000"
              className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
            <a
              href="https://buscacepinter.correios.com.br/app/endereco/index.php"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
            >
              Não sei meu CEP
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-primary/90 transition shadow-sm disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Calcular entrega →"}
          </button>
        </form>
      </div>
    </div>
    </Portal>
  );
}
