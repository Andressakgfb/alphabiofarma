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
        <a href="/" className="flex items-center" aria-label="AlphaBio Farma">
          <img src={logo} alt="AlphaBio Farma" className="h-9 w-auto" />
        </a>

        <div className="hidden md:flex flex-1 items-center ml-4">
          <button
            onClick={() => {
              const el = document.getElementById("catalogo");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              setSearchOpen(true);
            }}
            className="group relative w-full max-w-xl h-10 rounded-full border border-border bg-surface pl-10 pr-4 text-left text-sm text-muted-foreground hover:border-success hover:text-foreground transition"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-success" />
            O que você procura hoje?
          </button>
        </div>

        <div className="flex-1 md:hidden" />

        <button
          onClick={() => setCepOpen(true)}
          className="hidden md:inline-flex items-center gap-1.5 px-2 py-1.5 text-sm font-semibold text-foreground hover:text-success transition"
          aria-label="Definir CEP"
        >
          <MapPin className="h-4 w-4 text-success" />
          {cep ? cep : "CEP"}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>


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
