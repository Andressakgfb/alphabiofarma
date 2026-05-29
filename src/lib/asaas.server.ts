// Server-only Asaas API helpers. Do NOT import from client code.

export function asaasBaseUrl(): string {
  const env = (process.env.ASAAS_ENV || "sandbox").trim().toLowerCase();
  return env === "production"
    ? "https://api.asaas.com/v3"
    : "https://api-sandbox.asaas.com/v3";
}

function asaasHeaders() {
  const key = process.env.ASAAS_API_KEY;
  if (!key) throw new Error("ASAAS_API_KEY is not configured");
  return {
    "Content-Type": "application/json",
    access_token: key,
    "User-Agent": "AlphaBio-Farma/1.0",
  };
}

async function asaasFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${asaasBaseUrl()}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: { ...asaasHeaders(), ...(init.headers || {}) },
  });
  const text = await res.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    console.error(
      `Asaas API ${res.status} on ${path}:`,
      typeof body === "string" ? body : JSON.stringify(body),
    );
    throw new Error("Erro ao processar pagamento. Tente novamente.");
  }
  return body as T;
}

export type AsaasCustomer = { id: string; name: string; cpfCnpj: string; email?: string };

export async function findOrCreateCustomer(input: {
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
}): Promise<AsaasCustomer> {
  // Try to find by CPF/CNPJ first to avoid duplicates
  const found = await asaasFetch<{ data: AsaasCustomer[] }>(
    `/customers?cpfCnpj=${encodeURIComponent(input.cpfCnpj)}`,
    { method: "GET" },
  );
  if (found.data && found.data.length > 0) {
    return found.data[0];
  }
  return asaasFetch<AsaasCustomer>("/customers", {
    method: "POST",
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      cpfCnpj: input.cpfCnpj,
      mobilePhone: input.phone || undefined,
      notificationDisabled: false,
    }),
  });
}

export type AsaasPayment = {
  id: string;
  status: string;
  invoiceUrl: string;
  bankSlipUrl?: string;
  value: number;
  dueDate: string;
};

export type AsaasSplitConfig = {
  walletId: string;
  percentualValue: number;
}[];

export async function createPayment(input: {
  customerId: string;
  value: number;
  description: string;
  externalReference: string;
  dueDate: string; // YYYY-MM-DD
  billingType?: "UNDEFINED" | "PIX" | "CREDIT_CARD" | "BOLETO";
  split?: AsaasSplitConfig;
}): Promise<AsaasPayment> {
  const body: Record<string, unknown> = {
    customer: input.customerId,
    billingType: input.billingType ?? "UNDEFINED",
    value: input.value,
    dueDate: input.dueDate,
    description: input.description,
    externalReference: input.externalReference,
  };

  if (input.split && input.split.length > 0) {
    body.split = input.split;
  }

  return asaasFetch<AsaasPayment>("/payments", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      // Idempotency: prevents duplicate charges if retried
      "X-Idempotency-Key": input.externalReference,
    },
  });
}

export function todayPlusDays(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// CPF/CNPJ digit validation (offline). Accepts string with or without mask.
export function isValidCpfCnpj(raw: string): boolean {
  const s = raw.replace(/\D/g, "");
  if (s.length === 11) return isValidCpf(s);
  if (s.length === 14) return isValidCnpj(s);
  return false;
}

function isValidCpf(cpf: string): boolean {
  if (/^(\d)\1+$/.test(cpf)) return false;
  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += parseInt(cpf[i], 10) * (len + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(9) === parseInt(cpf[9], 10) && calc(10) === parseInt(cpf[10], 10);
}

function isValidCnpj(cnpj: string): boolean {
  if (/^(\d)\1+$/.test(cnpj)) return false;
  const calc = (len: number) => {
    const weights =
      len === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < len; i++) sum += parseInt(cnpj[i], 10) * weights[i];
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return calc(12) === parseInt(cnpj[12], 10) && calc(13) === parseInt(cnpj[13], 10);
}
