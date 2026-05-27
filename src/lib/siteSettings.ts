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

export const siteSettings = {
  getSocial(): SocialLinks {
    if (typeof window === "undefined") return DEFAULTS;
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
      return { ...DEFAULTS, ...(raw.social ?? {}) };
    } catch {
      return DEFAULTS;
    }
  },
  setSocial(social: SocialLinks) {
    if (typeof window === "undefined") return;
    const raw = (() => {
      try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
    })();
    localStorage.setItem(KEY, JSON.stringify({ ...raw, social }));
    window.dispatchEvent(new Event(EVENT));
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
