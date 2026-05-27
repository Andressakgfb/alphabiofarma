import { useEffect, useState } from "react";
import { Search, MapPin, User, ShoppingCart, LogOut, ChevronDown } from "lucide-react";
import logo from "@/assets/logo-alphabio.png";
import { AuthModal } from "./AuthModal";
import { CepModal } from "./CepModal";
import { SearchModal } from "./SearchModal";
import { CartModal } from "./CartModal";
import { cart, cartCount } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function Header() {
  const [authOpen, setAuthOpen] = useState(false);
  const [cepOpen, setCepOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [cep, setCep] = useState<string>("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(cartCount(cart.get()));
    const unsub = cart.subscribe(() => setCount(cartCount(cart.get())));
    return unsub;
  }, []);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("alphabio_cep") : null;
    if (stored) setCep(stored);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setUserEmail(data.session?.user?.email ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Você saiu da conta");
  };

  const handleSaveCep = (newCep: string) => {
    setCep(newCep);
    try { localStorage.setItem("alphabio_cep", newCep); } catch {}
  };

  const cepLabel = cep || "00000-000";

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center gap-3">
        <button aria-label="Menu" className="md:hidden p-1.5 -ml-1 text-foreground">
          <Menu className="h-5 w-5" />
        </button>
        <a href="/" className="flex items-center" aria-label="AlphaBio Farma">
          <img src={logo} alt="AlphaBio Farma" className="h-9 w-auto" />
        </a>

        <div className="hidden md:flex flex-1 items-center gap-2 ml-4">
          <button
            onClick={() => setCepOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <MapPin className="h-4 w-4" /> Enviar para {cepLabel}
          </button>
        </div>

        <div className="flex-1 md:hidden" />

        <button
          onClick={() => setSearchOpen(true)}
          aria-label="Buscar"
          className="p-2 text-foreground/70 hover:text-foreground"
        >
          <Search className="h-5 w-5" />
        </button>

        {userEmail ? (
          <button
            onClick={handleLogout}
            aria-label="Sair"
            title={userEmail}
            className="p-2 text-foreground/70 hover:text-foreground transition"
          >
            <LogOut className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={() => setAuthOpen(true)}
            aria-label="Conta"
            className="p-2 text-foreground/70 hover:text-foreground transition"
          >
            <User className="h-5 w-5" />
          </button>
        )}

        <button
          onClick={() => setCartOpen(true)}
          aria-label="Carrinho"
          className="relative p-2 text-foreground/70 hover:text-foreground"
        >
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-success text-success-foreground text-[10px] font-semibold flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </div>

      <button
        onClick={() => setCepOpen(true)}
        className="md:hidden w-full border-t border-border bg-surface px-4 py-1.5 flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <MapPin className="h-3.5 w-3.5 text-success" />
        Enviar para <span className="font-medium text-foreground">{cepLabel}</span>
        <span className="ml-auto text-primary font-semibold">Alterar</span>
      </button>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <CepModal open={cepOpen} initialCep={cep} onClose={() => setCepOpen(false)} onSave={handleSaveCep} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
