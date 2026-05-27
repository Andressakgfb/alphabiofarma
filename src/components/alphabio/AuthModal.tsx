import { useState } from "react";
import { Portal } from "./Portal";
import { X, LogIn, UserPlus, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!open) return null;

  const reset = () => {
    setName(""); setEmail(""); setPassword(""); setShowPass(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        reset();
        onClose();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Cadastro criado! Verifique seu e-mail para confirmar.");
        reset();
        onClose();
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("Não foi possível entrar com o Google");
        setLoading(false);
        return;
      }
      if (result.redirected) return;
      toast.success("Conectado com Google!");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email) {
      toast.error("Digite seu e-mail para recuperar a senha");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Enviamos um link para redefinir sua senha.");
  };

  return (
    <Portal>
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-md mt-10 rounded-2xl bg-card shadow-2xl overflow-hidden animate-scale-in">
        <div className="bg-primary text-primary-foreground px-5 py-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold">Sua conta</h2>
            <p className="text-xs opacity-90">Acompanhe pedidos em AlphaBio</p>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="p-1 rounded-md hover:bg-white/10 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 pt-4">
          <div className="grid grid-cols-2 gap-2 border-b border-border">
            <button
              onClick={() => setTab("login")}
              className={`pb-3 inline-flex items-center justify-center gap-1.5 text-sm font-semibold transition ${
                tab === "login" ? "text-primary border-b-2 border-primary -mb-px" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LogIn className="h-4 w-4" /> Entrar
            </button>
            <button
              onClick={() => setTab("signup")}
              className={`pb-3 inline-flex items-center justify-center gap-1.5 text-sm font-semibold transition ${
                tab === "signup" ? "text-primary border-b-2 border-primary -mb-px" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserPlus className="h-4 w-4" /> Criar conta
            </button>
          </div>
        </div>

        <form className="px-5 py-5 space-y-4" onSubmit={handleSubmit}>
          {tab === "signup" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nome completo</label>
              <input
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">E-mail</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-foreground">Senha</label>
              {tab === "login" && (
                <button type="button" onClick={handleForgot} className="text-xs font-medium text-primary hover:underline">
                  Esqueci minha senha
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"} required minLength={6}
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="w-full h-11 rounded-lg border border-border bg-background px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
              <button
                type="button" onClick={() => setShowPass((s) => !s)} aria-label="Mostrar senha"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-primary/90 transition shadow-sm disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (tab === "login" ? "Entrar →" : "Criar conta →")}
          </button>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="bg-card px-2 text-xs text-muted-foreground">ou</span></div>
          </div>

          <button
            type="button" onClick={handleGoogle} disabled={loading}
            className="w-full h-11 rounded-lg border border-border bg-background text-sm font-medium inline-flex items-center justify-center gap-2 hover:bg-accent transition disabled:opacity-60"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continuar com Google
          </button>
        </form>
      </div>
    </div>
    </Portal>
  );
}
