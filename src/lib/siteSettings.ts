// Site-wide settings stored in localStorage. Admin-editable.
export type SocialLinks = {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  twitter?: string;
  whatsapp?: string;
};

const KEY = "alphabio:siteSettings:v1";
const EVENT = "alphabio:site-settings-changed";

const DEFAULTS: SocialLinks = {
  instagram: "",
  facebook: "",
  youtube: "",
  tiktok: "",
  twitter: "",
  whatsapp: "",
};

export const DEFAULT_CATEGORIES = [
  "Suplementação e Performance",
  "Hormônio Crescimento Regenerativo",
  "Retatrutida",
  "Tirzepatida / Mounjaro",
];

export const DEFAULT_BRANDS = ["AlphaBio Lab", "AlphaBio Clinic", "Lipoland", "T.G Pharma"];

function readRaw(): any {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
function writeRaw(patch: any) {
  if (typeof window === "undefined") return;
  const raw = readRaw();
  localStorage.setItem(KEY, JSON.stringify({ ...raw, ...patch }));
  window.dispatchEvent(new Event(EVENT));
}

export const siteSettings = {
  getSocial(): SocialLinks {
    return { ...DEFAULTS, ...(readRaw().social ?? {}) };
  },
  setSocial(social: SocialLinks) {
    writeRaw({ social });
  },
  getCategories(): string[] {
    const v = readRaw().categories;
    return Array.isArray(v) && v.length ? v : DEFAULT_CATEGORIES;
  },
  setCategories(categories: string[]) {
    writeRaw({ categories });
  },
  getBrands(): string[] {
    const v = readRaw().brands;
    return Array.isArray(v) && v.length ? v : DEFAULT_BRANDS;
  },
  setBrands(brands: string[]) {
    writeRaw({ brands });
  },
  subscribe(cb: () => void) {
    if (typeof window === "undefined") return () => {};
    const h = () => cb();
    window.addEventListener(EVENT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(EVENT, h);
      window.removeEventListener("storage", h);
    };
  },
};
