import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Package, LogOut, User as UserIcon, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/conta")({
  component: ContaPage,
});

function ContaPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();
      setFullName(profile?.full_name ?? "");
      setLoading(false);
    })();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: fullName, email: user.email })
      .eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Perfil salvo!");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Você saiu da conta");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-3xl px-4 h-14 flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 text-foreground/70 hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-semibold text-foreground">Minha conta</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
        <section className="rounded-2xl bg-card border border-border p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{fullName || "Sem nome"}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nome completo</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                placeholder="Seu nome"
                className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">E-mail</label>
              <input
                value={email}
                disabled
                className="w-full h-11 rounded-lg border border-border bg-muted px-3 text-sm text-muted-foreground"
              />
            </div>
            <button
              type="submit"
              disabled={saving || loading}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-60"
            >
              <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>
        </section>

        <Link
          to="/conta/pedidos"
          className="flex items-center justify-between rounded-2xl bg-card border border-border p-5 shadow-sm hover:border-primary/30 hover:shadow-md transition group"
        >
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Meus pedidos</p>
              <p className="text-xs text-muted-foreground">Veja o histórico e o status</p>
            </div>
          </div>
          <span className="text-muted-foreground group-hover:text-primary transition">→</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-accent transition"
        >
          <LogOut className="h-4 w-4" /> Sair da conta
        </button>
      </main>
    </div>
  );
}
