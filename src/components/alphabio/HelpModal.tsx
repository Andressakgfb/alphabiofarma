import { useState } from "react";
import { Portal } from "./Portal";
import { X, ChevronDown } from "lucide-react";

const FAQ: { q: string; a: string }[] = [
  {
    q: "Como faço para comprar?",
    a: "Escolha o produto desejado, adicione ao carrinho e finalize o pedido informando seus dados e a forma de pagamento. Após a confirmação, você receberá um e-mail com os detalhes do pedido.",
  },
  {
    q: "Quais formas de pagamento são aceitas?",
    a: "Aceitamos cartão de crédito, Pix e boleto bancário. Pagamentos via Pix e cartão têm aprovação imediata; boletos podem levar até 2 dias úteis para serem compensados.",
  },
  {
    q: "Como funciona o frete e prazo de entrega?",
    a: "O valor e o prazo do frete são calculados pelo CEP no momento da compra. Trabalhamos com PAC, SEDEX e transportadora. Após a postagem, você receberá o código de rastreio por e-mail.",
  },
  {
    q: "Posso trocar ou devolver um produto?",
    a: "Sim. Você tem até 7 dias corridos após o recebimento para solicitar troca ou devolução, conforme o Código de Defesa do Consumidor. O produto deve estar lacrado e em sua embalagem original.",
  },
  {
    q: "Os produtos precisam de receita médica?",
    a: "Alguns produtos, como hormônios e medicamentos controlados, exigem receita médica válida. A receita pode ser enviada após a finalização do pedido, conforme orientação no checkout.",
  },
  {
    q: "Como acompanho meu pedido?",
    a: 'Acesse "Rastrear pedido" no rodapé do site e faça login com a conta usada na compra. Lá você verá o status, código de rastreio e histórico de todos os seus pedidos.',
  },
  {
    q: "Meus dados estão seguros?",
    a: "Sim. Nosso site é protegido com criptografia SSL e seguimos a LGPD (Lei Geral de Proteção de Dados). Seus dados pessoais e de pagamento nunca são compartilhados com terceiros.",
  },
  {
    q: "Vocês entregam para todo o Brasil?",
    a: "Sim, realizamos entregas para todo o território nacional. Para regiões mais distantes, o prazo pode ser um pouco maior.",
  },
  {
    q: "Como cancelo um pedido?",
    a: "Se o pedido ainda não foi enviado, entre em contato pelo nosso WhatsApp para solicitar o cancelamento. Pedidos já despachados seguem o procedimento de devolução.",
  },
  {
    q: "Os produtos são originais?",
    a: "Sim. Todos os nossos produtos são originais, adquiridos diretamente de fabricantes e distribuidores autorizados, com nota fiscal e procedência garantida.",
  },
];

export function HelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-fade-in">
        <div className="relative w-full max-w-2xl mt-10 rounded-2xl bg-card shadow-2xl overflow-hidden animate-scale-in">
          <div className="bg-primary text-primary-foreground px-5 py-4 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold">Central de Ajuda</h2>
              <p className="text-xs opacity-90">Tire suas dúvidas sobre compras, entregas e pagamentos</p>
            </div>
            <button onClick={onClose} aria-label="Fechar" className="p-1 rounded-md hover:bg-white/10 transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-5 py-5 max-h-[70vh] overflow-y-auto space-y-2">
            {FAQ.map((item, i) => {
              const isOpen = openIdx === i;
              return (
                <div key={i} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-accent transition"
                  >
                    <span className="text-sm font-semibold text-foreground">{item.q}</span>
                    <ChevronDown className={`h-4 w-4 flex-shrink-0 text-muted-foreground transition ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Portal>
  );
}
