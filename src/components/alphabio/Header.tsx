import { useState } from "react";
import { Search, MapPin, User, ShoppingCart, Menu } from "lucide-react";
import logo from "@/assets/logo-alphabio.png";
import { AuthModal } from "./AuthModal";

export function Header() {
  const [authOpen, setAuthOpen] = useState(false);
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
          <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <MapPin className="h-4 w-4" /> Enviar para 00000-000
          </button>
        </div>

        <div className="flex-1 md:hidden" />

        <button aria-label="Buscar" className="p-2 text-foreground/70 hover:text-foreground">
          <Search className="h-5 w-5" />
        </button>
        <button onClick={() => setAuthOpen(true)} aria-label="Conta" className="p-2 text-foreground/70 hover:text-foreground transition">
          <User className="h-5 w-5" />
        </button>
        <button aria-label="Carrinho" className="relative p-2 text-foreground/70 hover:text-foreground">
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-success text-success-foreground text-[10px] font-semibold flex items-center justify-center">2</span>
        </button>
      </div>

      {/* mobile location strip */}
      <div className="md:hidden border-t border-border bg-surface px-4 py-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 text-success" />
        Enviar para <span className="font-medium text-foreground">00000-000</span>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
