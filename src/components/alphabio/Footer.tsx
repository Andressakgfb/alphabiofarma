import { useEffect, useState } from "react";
import { Instagram, Facebook, Youtube, ShieldCheck, CreditCard, Truck, HelpCircle, PackageSearch, Pencil, Music2, Twitter, MessageCircle } from "lucide-react";
import logo from "@/assets/logo-alphabio.png";
import { HelpModal } from "./HelpModal";
import { OrdersModal } from "./OrdersModal";
import { AuthModal } from "./AuthModal";
import { SocialEditModal } from "./SocialEditModal";
import { siteSettings, type SocialLinks } from "@/lib/siteSettings";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { toast } from "sonner";

export function Footer() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [socialEditOpen, setSocialEditOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [social, setSocial] = useState<SocialLinks>(() => siteSettings.getSocial());
  const { isAdmin } = useIsAdmin();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsLogged(!!data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const logged = !!session;
      setIsLogged(logged);
      // Open orders right after login if user came from "Rastrear pedido"
      if (logged && sessionStorage.getItem("alphabio:openOrdersAfterLogin") === "1") {
        sessionStorage.removeItem("alphabio:openOrdersAfterLogin");
        setOrdersOpen(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    return siteSettings.subscribe(() => setSocial(siteSettings.getSocial()));
  }, []);

  const handleTrack = () => {
    if (!isLogged) {
      sessionStorage.setItem("alphabio:openOrdersAfterLogin", "1");
      toast.info("Entre na sua conta para ver seus pedidos");
      setAuthOpen(true);
      return;
    }
    setOrdersOpen(true);
  };

  const socials: { key: keyof SocialLinks; Icon: typeof Instagram; label: string }[] = [
    { key: "instagram", Icon: Instagram, label: "Instagram" },
    { key: "facebook", Icon: Facebook, label: "Facebook" },
    { key: "youtube", Icon: Youtube, label: "YouTube" },
    { key: "tiktok", Icon: Music2, label: "TikTok" },
    { key: "twitter", Icon: Twitter, label: "Twitter" },
    { key: "whatsapp", Icon: MessageCircle, label: "WhatsApp" },
  ];
  const visibleSocials = socials.filter((s) => (social[s.key] ?? "").trim().length > 0);

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
            <li>
              <button onClick={() => setHelpOpen(true)} className="inline-flex items-center gap-1.5 hover:text-primary transition">
                <HelpCircle className="h-4 w-4" /> Central de ajuda
              </button>
            </li>
            <li>
              <button onClick={handleTrack} className="inline-flex items-center gap-1.5 hover:text-primary transition">
                <PackageSearch className="h-4 w-4" /> Rastrear pedido
              </button>
            </li>
          </ul>

          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-base font-bold">Siga-nos</h4>
            {isAdmin && (
              <button
                onClick={() => setSocialEditOpen(true)}
                aria-label="Editar redes sociais"
                title="Editar redes sociais"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Pencil className="h-3 w-3" /> editar
              </button>
            )}
          </div>
          {visibleSocials.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              {isAdmin ? "Nenhuma rede social configurada. Clique em editar." : "Em breve."}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {visibleSocials.map(({ key, Icon, label }) => (
                <a
                  key={key}
                  aria-label={label}
                  href={social[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-base font-bold mb-4">Pagamento e segurança</h4>
          <ul className="space-y-3 text-sm text-foreground/80">
            {[
              { Icon: ShieldCheck, label: "Site protegido com SSL" },
              { Icon: CreditCard, label: "Cartão, Pix e boleto" },
              { Icon: Truck, label: "PAC" },
              { Icon: Truck, label: "SEDEX" },
              { Icon: Truck, label: "Transportadora" },
            ].map(({ Icon, label }, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" strokeWidth={2.2} />
                </span>
                {label}
              </li>
            ))}
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
          <a href="#" className="text-sm text-muted-foreground underline hover:text-primary">LGPD e Responsabilidades</a>
        </div>
      </div>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <OrdersModal open={ordersOpen} onClose={() => setOrdersOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <SocialEditModal open={socialEditOpen} onClose={() => setSocialEditOpen(false)} />
    </footer>
  );
}
