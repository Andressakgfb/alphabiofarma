
# Integração Asaas — Checkout via Link de Pagamento

## Escopo
- Ambiente: **Sandbox** (`https://api-sandbox.asaas.com/v3`)
- Métodos: **Pix** e **Cartão de crédito**
- Fluxo: cliente é redirecionado para a página de pagamento hospedada pelo Asaas
- Coleta obrigatória de **CPF/CNPJ** no checkout

## O que você vai precisar fornecer
1. **API Key do Asaas Sandbox** — você gera em https://sandbox.asaas.com → Integrações → Chave de API. Vou pedir via formulário seguro do Lovable (nunca cole no chat).

## Mudanças no app

### 1. Checkout no carrinho (frontend)
Hoje o botão "Finalizar compra" só limpa o carrinho. Vai virar um formulário com:
- Nome completo
- E-mail
- CPF ou CNPJ (com máscara e validação)
- Telefone (opcional)
- Seleção: **Pix** ou **Cartão de crédito**

Validação com **zod** antes de enviar (formato CPF/CNPJ, e-mail, limites de tamanho).

Exige usuário logado (já existe AuthModal). Se deslogado → abre login.

### 2. Server function `createAsaasCheckout` (backend)
Arquivo: `src/lib/asaas.functions.ts` + helpers em `src/lib/asaas.server.ts`.

Fluxo:
1. Valida payload com zod (itens, total, dados do cliente).
2. Recalcula o total no servidor a partir do catálogo (nunca confia no preço enviado pelo cliente).
3. Cria/recupera cliente no Asaas (`POST /customers`) usando CPF/CNPJ como chave.
4. Cria a cobrança (`POST /payments`) com:
   - `billingType: "UNDEFINED"` (deixa o cliente escolher Pix ou Cartão na página do Asaas)
   - `value`, `dueDate` (hoje + 3 dias), `description` com resumo do pedido, `externalReference` = id do pedido no Supabase
5. Salva o pedido em `public.orders` com `status: 'pending'`, `asaas_payment_id`, `items`, `total`.
6. Retorna `invoiceUrl` para o frontend redirecionar.

Chamada do gateway protegida pelo `requireSupabaseAuth` (já configurado no projeto).

### 3. Webhook `/api/public/asaas-webhook` (server route)
Arquivo: `src/routes/api/public/asaas-webhook.ts`.

- Valida header `asaas-access-token` contra `ASAAS_WEBHOOK_TOKEN` (secret separado que você define ao cadastrar o webhook no painel Asaas).
- Trata eventos: `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED` → marca `orders.status = 'paid'`; `PAYMENT_OVERDUE`/`PAYMENT_REFUNDED` → atualiza status.
- Usa `supabaseAdmin` (service role) para atualizar a ordem por `asaas_payment_id`.
- Responde 200 rápido.

### 4. Página de retorno
Rota nova `src/routes/pedido.$id.tsx` que mostra status do pedido (consulta `orders` por id). Asaas redireciona para essa URL após pagamento.

## Banco de dados
Migração adicionando colunas em `public.orders`:
- `asaas_payment_id text unique`
- `asaas_invoice_url text`
- `customer jsonb` (nome, e-mail, documento, telefone)
- `payment_method text` (pix | credit_card | mixed)

RLS atual já cobre (usuário vê só os próprios pedidos). O webhook usa service role e bypassa RLS.

## Secrets a configurar
- `ASAAS_API_KEY` — sua chave do Sandbox
- `ASAAS_WEBHOOK_TOKEN` — token que você define ao cadastrar o webhook no painel Asaas (qualquer string secreta)
- `ASAAS_ENV` = `sandbox` (para depois trocar para `production` sem mexer no código)

## Passos pós-implementação (você faz no painel Asaas)
1. Gerar a API Key Sandbox e colar quando eu pedir.
2. Cadastrar o webhook em **Integrações → Webhooks** apontando para:
   `https://project--e65a226e-e887-4071-85b7-ddb02ea430f7-dev.lovable.app/api/public/asaas-webhook`
   (depois trocar para o domínio de produção)
3. Definir o token de autenticação do webhook (mesmo valor de `ASAAS_WEBHOOK_TOKEN`).
4. Marcar os eventos: `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_OVERDUE`, `PAYMENT_REFUNDED`.

## Quando passar para produção
Trocar `ASAAS_API_KEY` pela chave de produção e `ASAAS_ENV` para `production`. O código lê a base URL a partir dessa variável.

## Fora do escopo (posso fazer depois se quiser)
- Split de pagamento, assinaturas recorrentes, antecipação de recebíveis
- Cálculo de frete real (hoje é só CEP visual)
- E-mail de confirmação de pedido
