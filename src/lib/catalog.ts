// Simple pub/sub store for catalog filters used by SmartSearch + ProductGrid
export type CatalogFilters = {
  query: string;
  category: string; // "Todas" | category label
  brand: string;    // "Todas" | brand name
  priceMax: number; // upper bound
};

const DEFAULT: CatalogFilters = {
  query: "",
  category: "Todas",
  brand: "Todas",
  priceMax: 5000,
};

type Listener = (f: CatalogFilters) => void;

let state: CatalogFilters = { ...DEFAULT };
const listeners = new Set<Listener>();

export const catalog = {
  get: () => state,
  set: (patch: Partial<CatalogFilters>) => {
    state = { ...state, ...patch };
    listeners.forEach((l) => l(state));
  },
  reset: () => {
    state = { ...DEFAULT };
    listeners.forEach((l) => l(state));
  },
  subscribe: (fn: Listener) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export const CATEGORIES = [
  "Todas",
  "Suplementação e Performance",
  "Hormônio Crescimento Regenerativo",
  "Retatrutida",
  "Tirzepatida / Mounjaro",
];

export const BRANDS = ["Todas", "AlphaBio Lab", "AlphaBio Clinic", "Lipoland", "T.G Pharma"];
