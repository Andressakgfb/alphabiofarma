Substituir o ícone `ShieldCheck` (Lucide) da seção "Compra 100% segura" no Hero pelo PNG enviado.

Passos:
1. Copiar `user-uploads://Captura_de_tela_2026-05-28_085037.png` para `src/assets/icon-secure-shield.png`.
2. Em `src/components/alphabio/Hero.tsx`:
   - Importar o asset.
   - Trocar `icon: ShieldCheck` por uma referência ao asset (ex.: `image: secureIcon`).
   - Ajustar o render do benefício para mostrar `<img>` quando houver `image`, mantendo o mesmo container/tamanho atual.
3. Manter os outros dois benefícios usando ícones Lucide normalmente.

Sem mudanças de cor/layout — apenas substituição do ícone.