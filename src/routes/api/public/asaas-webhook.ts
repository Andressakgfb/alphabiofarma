import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Map Asaas event types to our internal order status.
function statusFromEvent(event: string): string | null {
  switch (event) {
    case "PAYMENT_CONFIRMED":
    case "PAYMENT_RECEIVED":
    case "PAYMENT_RECEIVED_IN_CASH":
      return "paid";
    case "PAYMENT_OVERDUE":
      return "overdue";
    case "PAYMENT_REFUNDED":
    case "PAYMENT_REFUND_IN_PROGRESS":
      return "refunded";
    case "PAYMENT_DELETED":
    case "PAYMENT_CHARGEBACK_REQUESTED":
    case "PAYMENT_CHARGEBACK_DISPUTE":
      return "cancelled";
    case "PAYMENT_REPROVED_BY_RISK_ANALYSIS":
    case "PAYMENT_CREDIT_CARD_CAPTURE_REFUSED":
      return "refused";
    case "PAYMENT_AWAITING_RISK_ANALYSIS":
    case "PAYMENT_APPROVED_BY_RISK_ANALYSIS":
    case "PAYMENT_PENDING":
    case "PAYMENT_BANK_SLIP_VIEWED":
      return "pending";
    default:
      return null;
  }
}

function logWebhook(event: string, paymentId: string, status: string | null) {
  console.log(`[Asaas Webhook] event=${event} paymentId=${paymentId} mappedStatus=${status ?? "ignored"}`);
}

export const Route = createFileRoute("/api/public/asaas-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN;
        if (!expectedToken) {
          console.error("ASAAS_WEBHOOK_TOKEN not configured");
          return new Response("Server misconfigured", { status: 500 });
        }

        const provided = request.headers.get("asaas-access-token");
        if (!provided || provided !== expectedToken) {
          return new Response("Invalid token", { status: 401 });
        }

        let payload: any;
        try {
          payload = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const event: string | undefined = payload?.event;
        const payment = payload?.payment;

        if (!event || !payment?.id) {
          return new Response("ok", { status: 200 });
        }

        const newStatus = statusFromEvent(event);
        logWebhook(event, payment.id, newStatus);

        if (!newStatus) {
          return new Response("ok", { status: 200 });
        }

        const paymentMethod: string | undefined = payment.billingType
          ? String(payment.billingType).toLowerCase()
          : undefined;

        const asaasPaymentId = String(payment.id);

        const update: { status: string; payment_method?: string } = { status: newStatus };
        if (paymentMethod) update.payment_method = paymentMethod;

        // First try by asaas_payment_id (most reliable after payment is created)
        let result = await supabaseAdmin
          .from("orders")
          .update(update)
          .eq("asaas_payment_id", asaasPaymentId)
          .select("id");

        // Fallback: if no rows updated, try by externalReference
        if ((!result.data || result.data.length === 0) && payment.externalReference) {
          result = await supabaseAdmin
            .from("orders")
            .update({
              ...update,
              asaas_payment_id: asaasPaymentId,
            })
            .eq("id", payment.externalReference)
            .select("id");
        }

        if (result.error) {
          console.error("Failed to update order from webhook:", result.error);
          return new Response("DB error", { status: 500 });
        }

        if (!result.data || result.data.length === 0) {
          console.warn(`[Asaas Webhook] No order found for payment ${asaasPaymentId}`);
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
