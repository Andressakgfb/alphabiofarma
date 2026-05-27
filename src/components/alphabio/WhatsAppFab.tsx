import { MessageCircle } from "lucide-react";

export function WhatsAppFab() {
  const phone = "5511999999999"; // placeholder — atualize quando tiver o número oficial
  const msg = encodeURIComponent("Olá! Vim pelo site AlphaBio Farma e gostaria de mais informações.");
  return (
    <a
      href={`https://wa.me/${phone}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chame no WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 h-12 px-4 rounded-full bg-success text-success-foreground shadow-xl hover:scale-105 active:scale-95 transition-transform"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="text-sm font-semibold hidden sm:inline">Chame no WhatsApp</span>
    </a>
  );
}
