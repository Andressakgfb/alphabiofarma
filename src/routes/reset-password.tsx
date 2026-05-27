import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: "Redefinir Senha — AlphaBio Farma" },
      { name: "description", content: "Defina uma nova senha para acessar sua conta na AlphaBio Farma." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Redefinir Senha — AlphaBio Farma" },
      { property: "og:description", content: "Crie uma nova senha para sua conta AlphaBio Farma." },
      { property: "og:url", content: "https://alphabiofarma.lovable.app/reset-password" },
    ],
    links: [
      { rel: "canonical", href: "https://alphabiofarma.lovable.app/reset-password" },
    ],
  }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Senha redefinida!");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-card rounded-2xl shadow-xl p-6 space-y-4">
        <h1 className="text-xl font-bold text-foreground">Redefinir senha</h1>
        <p className="text-sm text-muted-foreground">Digite sua nova senha abaixo.</p>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nova senha"
          className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-60"
        >
          {loading ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </div>
  );
}
