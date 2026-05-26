import { Instagram, Facebook, Youtube, ShieldCheck, CreditCard, Truck } from "lucide-react";
import logo from "@/assets/logo-alphabio.png";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border text-foreground mt-12">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <img src={logo} alt="AlphaBio Farma" className="h-12 w-auto mb-6" />
          <p className="text-sm text-foreground/90 font-medium">31.878.514 MURILLO AUGUSTO INACIO LEMOS</p>
          <p className="text-sm text-muted-foreground mt-1">CNPJ: 31.878.514/0001-78</p>
        </div>

        <div>
          <h4 className="text-base font-bold mb-4">Atendimento</h4>
          <ul className="space-y-2 text-sm text-muted-foreground mb-6">
            <li><a href="#" className="hover:text-primary">Central de ajuda</a></li>
            <li><a href="#" className="hover:text-primary">Rastrear pedido</a></li>
            <li><a href="#" className="hover:text-primary">Fale com um farmacêutico</a></li>
          </ul>

          <h4 className="text-base font-bold mb-3">Siga-nos</h4>
          <div className="flex gap-2.5">
            <a aria-label="Instagram" href="#" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"><Instagram className="h-4 w-4" /></a>
            <a aria-label="Facebook" href="#" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"><Facebook className="h-4 w-4" /></a>
            <a aria-label="YouTube" href="#" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"><Youtube className="h-4 w-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-base font-bold mb-4">Pagamento e segurança</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5"><ShieldCheck className="h-5 w-5 text-primary" /> Site protegido com SSL</li>
            <li className="flex items-center gap-2.5"><CreditCard className="h-5 w-5 text-primary" /> Cartão, Pix e boleto</li>
            <li className="flex items-center gap-2.5"><Truck className="h-5 w-5 text-primary" /> PAC</li>
            <li className="flex items-center gap-2.5"><Truck className="h-5 w-5 text-primary" /> SEDEX</li>
            <li className="flex items-center gap-2.5"><Truck className="h-5 w-5 text-primary" /> Transportadora</li>
          </ul>
          <div className="border-t border-border mt-6 pt-4 space-y-2 text-sm text-muted-foreground">
            <a href="#" className="block hover:text-primary">Política de Privacidade</a>
            <a href="#" className="block hover:text-primary">Termos de Uso</a>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} AlphaBio. Todos os direitos reservados.</p>
          <a href="#" className="text-sm text-muted-foreground/80 underline hover:text-primary">LGPD e Responsabilidades</a>
        </div>
      </div>
    </footer>
  );
}
