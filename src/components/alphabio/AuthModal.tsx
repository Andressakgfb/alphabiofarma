import { useState } from "react";
import { X, LogIn, UserPlus, Eye, EyeOff, Shield, Users } from "lucide-react";

export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [showPass, setShowPass] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-md mt-10 rounded-2xl bg-card shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-5 py-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold">Sua conta</h2>
            <p className="text-xs opacity-90">Acompanhe pedidos em AlphaBio</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-1 rounded-md hover:bg-white/10 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 pt-4">
          <div className="grid grid-cols-2 gap-2 border-b border-border">
            <button
              onClick={() => setTab("login")}
              className={`pb-3 inline-flex items-center justify-center gap-1.5 text-sm font-semibold transition ${
                tab === "login"
                  ? "text-primary border-b-2 border-primary -mb-px"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LogIn className="h-4 w-4" /> Entrar
            </button>
            <button
              onClick={() => setTab("signup")}
              className={`pb-3 inline-flex items-center justify-center gap-1.5 text-sm font-semibold transition ${
                tab === "signup"
                  ? "text-primary border-b-2 border-primary -mb-px"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserPlus className="h-4 w-4" /> Criar conta
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          className="px-5 py-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
          {tab === "signup" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nome completo</label>
              <input
                type="text"
                required
                placeholder="Seu nome"
                className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">E-mail</label>
            <input
              type="email"
              required
              placeholder="voce@email.com"
              className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-foreground">Senha</label>
              {tab === "login" && (
                <button type="button" className="text-xs font-medium text-primary hover:underline">
                  Esqueci minha senha
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                placeholder="Sua senha"
                className="w-full h-11 rounded-lg border border-border bg-background px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                aria-label="Mostrar senha"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-primary/90 transition shadow-sm"
          >
            {tab === "login" ? "Entrar" : "Criar conta"} →
          </button>

          <div className="flex items-center justify-center gap-5 pt-2">
            <button type="button" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition">
              <Shield className="h-3.5 w-3.5" /> Sou administrador
            </button>
            <button type="button" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition">
              <Users className="h-3.5 w-3.5" /> Sou afiliado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
