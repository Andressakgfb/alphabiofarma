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
    case "PAYMENT_AWAITING_RISK_ANALYSIS":
    case "PAYMENT_APPROVED_BY_RISK_ANALYSIS":
      return "pending";
    default:
      return null;
  }
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
        if (!newStatus) {
          return new Response("ok", { status: 200 });
        }

        const paymentMethod: string | undefined = payment.billingType
          ? String(payment.billingType).toLowerCase()
          : undefined;

        const update: Record<string, unknown> = { status: newStatus };
        if (paymentMethod) update.payment_method = paymentMethod;

        const { error } = await supabaseAdmin
          .from("orders")
          .update(update)
          .eq("asaas_payment_id", payment.id);

        if (error) {
          console.error("Failed to update order from webhook:", error);
          return new Response("DB error", { status: 500 });
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
