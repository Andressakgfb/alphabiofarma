import { Instagram, Facebook, Youtube, Lock, CreditCard, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-12">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-success text-success-foreground text-xs">α</span>
            <span>AlphaBio Farma</span>
          </div>
          <p className="mt-3 text-xs text-primary-foreground/70 leading-relaxed">
            Farmácia especializada em suplementação clínica, hormônios regenerativos e protocolos de longevidade.
          </p>
          <p className="mt-3 text-[11px] text-primary-foreground/60">CNPJ: 00.000.000/0001-00</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Atendimento</h4>
          <ul className="space-y-2 text-xs text-primary-foreground/80">
            <li><a href="#" className="hover:text-success">Central de ajuda</a></li>
            <li><a href="#" className="hover:text-success">Trocas e devoluções</a></li>
            <li><a href="#" className="hover:text-success">Rastrear pedido</a></li>
            <li><a href="#" className="hover:text-success">Fale com um farmacêutico</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Institucional</h4>
          <ul className="space-y-2 text-xs text-primary-foreground/80">
            <li><a href="#" className="hover:text-success">Sobre nós</a></li>
            <li><a href="#" className="hover:text-success">Política de privacidade</a></li>
            <li><a href="#" className="hover:text-success">Termos de uso</a></li>
            <li><a href="#" className="hover:text-success">Responsável técnico</a></li>
          </ul>
          <div className="flex gap-2.5 mt-4">
            <a aria-label="Instagram" href="#" className="h-8 w-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-success transition"><Instagram className="h-4 w-4" /></a>
            <a aria-label="Facebook" href="#" className="h-8 w-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-success transition"><Facebook className="h-4 w-4" /></a>
            <a aria-label="YouTube" href="#" className="h-8 w-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-success transition"><Youtube className="h-4 w-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Pagamento & Segurança</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {["VISA", "MASTER", "PIX", "BOLETO", "AMEX"].map((m) => (
              <span key={m} className="rounded-md bg-primary-foreground/10 px-2 py-1 text-[10px] font-bold tracking-wider">{m}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-primary-foreground/80">
            <Lock className="h-4 w-4 text-success" /> Compra 100% segura — SSL
          </div>
          <div className="flex items-center gap-2 text-xs text-primary-foreground/80 mt-1.5">
            <ShieldCheck className="h-4 w-4 text-success" /> Certificado ANVISA
          </div>
          <div className="flex items-center gap-2 text-xs text-primary-foreground/80 mt-1.5">
            <CreditCard className="h-4 w-4 text-success" /> Parcele em até 12x
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-[11px] text-primary-foreground/60 text-center">
          © {new Date().getFullYear()} AlphaBio Farma. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
