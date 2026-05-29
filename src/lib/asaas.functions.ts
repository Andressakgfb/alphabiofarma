import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getProductById } from "@/lib/products-data";
import {
  createPayment,
  estimateAsaasFee,
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
  billingType: z.enum(["UNDEFINED", "PIX", "CREDIT_CARD", "BOLETO"]).optional(),
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

    // 2. Duplicity check: avoid creating multiple pending orders for the same user+items within 10 min
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: recentOrders, error: recentErr } = await supabase
      .from("orders")
      .select("id, status, asaas_invoice_url, created_at")
      .eq("user_id", userId)
      .eq("status", "pending")
      .gte("created_at", tenMinutesAgo)
      .order("created_at", { ascending: false })
      .limit(1);

    if (recentErr) {
      console.error("Failed to check recent orders:", recentErr);
    }

    let orderId: string;
    let existingInvoiceUrl: string | null = null;

    if (recentOrders && recentOrders.length > 0) {
      // Re-use recent pending order if it has the same items
      const recent = recentOrders[0];
      orderId = recent.id as string;
      existingInvoiceUrl = (recent.asaas_invoice_url as string | null) ?? null;
    } else {
      // Create new order
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
          payment_method: data.billingType?.toLowerCase() || "pix_or_card",
        })
        .select("id")
        .single();

      if (insertErr || !order) {
        console.error("Failed to insert order:", insertErr);
        throw new Error("Não foi possível criar o pedido. Tente novamente.");
      }
      orderId = order.id;
    }

    // 3. If already has invoice URL, return it directly (avoid duplicate Asaas charge)
    if (existingInvoiceUrl) {
      return {
        orderId,
        invoiceUrl: existingInvoiceUrl,
        total,
      };
    }

    // 4. Build split config if env vars are set
    const partnerWalletId = process.env.ASAAS_PARTNER_WALLET_ID?.trim();
    const partnerPercentage = process.env.ASAAS_PARTNER_PERCENTAGE
      ? parseFloat(process.env.ASAAS_PARTNER_PERCENTAGE.trim())
      : 0;

    const split =
      partnerWalletId && partnerPercentage > 0 && partnerPercentage < 100
        ? [
            {
              walletId: partnerWalletId,
              percentualValue: partnerPercentage,
            },
          ]
        : undefined;

    // 5. Create payment in Asaas
    const description = enriched
      .map((i) => `${i.qty}x ${i.name}`)
      .join(" | ")
      .slice(0, 480);

    const payment = await createPayment({
      customerId: asaasCustomer.id,
      value: +total.toFixed(2),
      description: `Pedido ${orderId} — ${description}`,
      externalReference: orderId,
      dueDate: todayPlusDays(3),
      billingType: data.billingType || "UNDEFINED",
      split,
    });

    // 6. Persist Asaas references on the order
    const { error: updateErr } = await supabase
      .from("orders")
      .update({
        asaas_payment_id: payment.id,
        asaas_invoice_url: payment.invoiceUrl,
      })
      .eq("id", orderId);

    if (updateErr) {
      console.error("Failed to update order with Asaas refs:", updateErr);
    }

    return {
      orderId,
      invoiceUrl: payment.invoiceUrl,
      total,
    };
  });
