
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS asaas_payment_id text,
  ADD COLUMN IF NOT EXISTS asaas_invoice_url text,
  ADD COLUMN IF NOT EXISTS customer jsonb,
  ADD COLUMN IF NOT EXISTS payment_method text;

CREATE UNIQUE INDEX IF NOT EXISTS orders_asaas_payment_id_key
  ON public.orders (asaas_payment_id)
  WHERE asaas_payment_id IS NOT NULL;
