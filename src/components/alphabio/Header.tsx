import { Search, MapPin, User, ShoppingCart, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center gap-3">
        <button aria-label="Menu" className="md:hidden p-1.5 -ml-1 text-foreground">
          <Menu className="h-5 w-5" />
        </button>
        <a href="/" className="flex items-center gap-1.5 font-bold tracking-tight text-foreground">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[var(--gradient-cta)] text-primary-foreground text-xs">α</span>
          <span className="text-base">AlphaBio<span className="text-success"> Farma</span></span>
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
        <button aria-label="Conta" className="hidden sm:block p-2 text-foreground/70 hover:text-foreground">
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
    </header>
  );
}
