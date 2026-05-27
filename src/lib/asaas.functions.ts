import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getProductById } from "@/lib/products-data";
import {
  createPayment,
  findOrCreateCustomer,
  isValidCpfCnpj,
  todayPlusDays,
} from "@/lib/asaas.server";

const CartItemSchema = z.object({
  id: z.string().min(1).max(64),
  qty: z.number().int().min(1).max(99),
});

const CheckoutSchema = z.object({
  items: z.array(CartItemSchema).min(1).max(50),
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(180),
    cpfCnpj: z
      .string()
      .trim()
      .min(11)
      .max(20)
      .refine((v) => isValidCpfCnpj(v), { message: "CPF/CNPJ inválido" }),
    phone: z.string().trim().max(20).optional().or(z.literal("")),
  }),
});

export const createAsaasCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => CheckoutSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Server-side price recalculation: trust the catalog, never the client.
    let total = 0;
    const enriched = data.items.map((it) => {
      const p = getProductById(it.id);
      if (!p) throw new Error(`Produto não encontrado: ${it.id}`);
      if (p.stock <= 0) throw new Error(`Produto sem estoque: ${p.name}`);
      const lineTotal = p.price * it.qty;
      total += lineTotal;
      return {
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        qty: it.qty,
        lineTotal,
      };
    });

    if (total <= 0) throw new Error("Total inválido");

    const cpfCnpj = data.customer.cpfCnpj.replace(/\D/g, "");
    const phone = (data.customer.phone || "").replace(/\D/g, "") || undefined;

    // 1. Customer in Asaas
    const asaasCustomer = await findOrCreateCustomer({
      name: data.customer.name,
      email: data.customer.email,
      cpfCnpj,
      phone,
    });

    // 2. Pre-insert order (pending) so we have a stable external reference
    const description = enriched
      .map((i) => `${i.qty}x ${i.name}`)
      .join(" | ")
      .slice(0, 480);

    const { data: order, error: insertErr } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        status: "pending",
        total,
        items: enriched,
        customer: {
          name: data.customer.name,
          email: data.customer.email,
          cpfCnpj,
          phone: phone ?? null,
        },
        payment_method: "pix_or_card",
      })
      .select("id")
      .single();

    if (insertErr || !order) {
      throw new Error(`Falha ao criar pedido: ${insertErr?.message ?? "unknown"}`);
    }

    // 3. Create payment in Asaas
    const payment = await createPayment({
      customerId: asaasCustomer.id,
      value: +total.toFixed(2),
      description: `Pedido ${order.id} — ${description}`,
      externalReference: order.id,
      dueDate: todayPlusDays(3),
      billingType: "UNDEFINED",
    });

    // 4. Persist Asaas references on the order
    const { error: updateErr } = await supabase
      .from("orders")
      .update({
        asaas_payment_id: payment.id,
        asaas_invoice_url: payment.invoiceUrl,
      })
      .eq("id", order.id);

    if (updateErr) {
      console.error("Failed to update order with Asaas refs:", updateErr);
    }

    return {
      orderId: order.id,
      invoiceUrl: payment.invoiceUrl,
      total,
    };
  });
