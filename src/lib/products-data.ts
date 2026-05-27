// Server-safe product catalog data. Imported by both client components and
// server functions — DO NOT add React or browser-only imports here.

export type ProductData = {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  oldPrice?: number;
  stock: number;
  tag?: string;
};

const BASE =
  "https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867";

export const PRODUCTS_DATA: ProductData[] = [
  { id: "nad500", name: "NAD+ 500mg", brand: "AlphaBio Lab", image: `${BASE}/350ab0a39_nad.png`, price: 1156, stock: 52, tag: "Longevidade" },
  { id: "tesa10", name: "Tesamorelin 10mg", brand: "AlphaBio Lab", image: `${BASE}/a557e0e90_tesamorelim.png`, price: 1190, stock: 57 },
  { id: "pt141", name: "PT-141 10mg", brand: "AlphaBio Lab", image: `${BASE}/3a12c83c5_pt-141.png`, price: 945, stock: 55 },
  { id: "nadb12", name: "NAD+ Vitamina B12 (Pen)", brand: "AlphaBio Lab", image: `${BASE}/5453b7c2e_nadcaneta.png`, price: 1816, stock: 59, tag: "Energia" },
  { id: "ghkcu100pen", name: "GHK-Cu 100mg (Pen)", brand: "AlphaBio Lab", image: `${BASE}/d8c6bf296_ghkcupen100mg.png`, price: 1420, stock: 61 },
  { id: "glow70pen", name: "GLOW 70mg Pen", brand: "AlphaBio Lab", image: `${BASE}/4435494c5_glow70caneta.png`, price: 1816, stock: 60, tag: "Pele" },
  { id: "tirz60ag", name: "Tirzegen 60mg c/ agulha", brand: "AlphaBio Clinic", image: `${BASE}/1fae475ec_tirz60comagulha.png`, price: 1750, stock: 54, tag: "Receita" },
  { id: "tirz60pen", name: "Tirzegen Pen 60mg Tirzepatida", brand: "AlphaBio Clinic", image: `${BASE}/355c5a08d_tirze60mgsagulha.png`, price: 1684, stock: 58, tag: "Receita" },
  { id: "reta40pen", name: "Retagen Pen 40mg Retatrutida", brand: "AlphaBio Clinic", image: `${BASE}/3130f8d0e_retasemagulha40mg.png`, price: 1816, stock: 53, tag: "Receita" },
  { id: "reta40ag", name: "Retagen 40mg Retatrutida c/ agulha", brand: "AlphaBio Clinic", image: `${BASE}/d7f962379_retacanetaagulha40m.png`, price: 1882, stock: 57, tag: "Receita" },
  { id: "retaxt40", name: "Retagen XT 40mg — 4 Ampolas", brand: "AlphaBio Clinic", image: `${BASE}/2c76de753_retaampola40mg.png`, price: 1288, stock: 50, tag: "Receita" },
  { id: "ghkcu50", name: "GHK-Cu 50mg", brand: "AlphaBio Lab", image: `${BASE}/9c2bf5cd4_716C0B07-BDDC-4B98-860B-62D8F0E44535.png`, price: 734, stock: 60 },
  { id: "ghkcu100", name: "GHK-Cu 100mg", brand: "AlphaBio Lab", image: `${BASE}/e69c1d26d_ghcu100.png`, price: 998, stock: 66 },
  { id: "retalio40", name: "Retagen 40mg Liofilizada", brand: "AlphaBio Clinic", image: `${BASE}/284bcea93_retaliofi.png`, price: 1420, stock: 79, tag: "Receita" },
  { id: "tirz60", name: "Tirzegen 60mg Tirzepatida", brand: "AlphaBio Clinic", image: `${BASE}/75b9cbc5a_9F5CBAB3-8DB9-496D-81BE-9A3EA6621289.png`, price: 1288, stock: 60, tag: "Receita" },
  { id: "glow70", name: "GLOW 70mg", brand: "AlphaBio Lab", image: `${BASE}/f2b197c7a_FF0E1085-E71D-4EF8-99A0-A863225EFFC7.png`, price: 1235, stock: 55 },
  { id: "ghkcu50d", name: "GHK-Cu 50mg Diluído", brand: "AlphaBio Lab", image: `${BASE}/0d268913e_ChatGPTImage20demaide202619_36_22.png`, price: 707, stock: 57 },
  { id: "ghkcu100d", name: "GHK-Cu 100mg Diluído", brand: "AlphaBio Lab", image: `${BASE}/09f3bbe23_A3E3E677-7902-4F44-A99C-2D7E01436545.png`, price: 958, stock: 61 },
  { id: "tirzlp60", name: "Tirzepatida Lipoland 60mg (4x 15mg)", brand: "Lipoland", image: `${BASE}/103537377_IMG_7880.jpg`, price: 1500, oldPrice: 1700, stock: 21, tag: "-12%" },
  { id: "tirztg60", name: "Tirzepatida T.G 60mg (4x 15mg)", brand: "T.G Pharma", image: `${BASE}/9d6cc6c39_IMG_7874.WEBP`, price: 1500, oldPrice: 1700, stock: 40, tag: "-12%" },
  { id: "kit4x5", name: "Kit 4 Canetas 5mg Tirzepatida — 20mg", brand: "AlphaBio Clinic", image: `${BASE}/eeea08808_IMG_7869.jpg`, price: 1350, oldPrice: 1650, stock: 35, tag: "-18%" },
  { id: "kit4x10", name: "Kit 4 Canetas 10mg Tirzepatida — 40mg", brand: "AlphaBio Clinic", image: `${BASE}/58d04a952_IMG_7869.jpg`, price: 1500, stock: 58 },
  { id: "reta60amp", name: "Retatrutida Ampola 60mg (5x 12mg)", brand: "AlphaBio Clinic", image: `${BASE}/568d834ac_IMG_7863.PNG`, price: 2600, oldPrice: 2800, stock: 0, tag: "Esgotado" },
  { id: "reta30pen", name: "Retatrutida Caneta 30mg", brand: "AlphaBio Clinic", image: `${BASE}/44c3c1417_IMG_7861.JPG`, price: 1950, oldPrice: 2300, stock: 0, tag: "Esgotado" },
  { id: "reta120", name: "Retatrutida Ampola 120mg (5x 24mg)", brand: "AlphaBio Clinic", image: `${BASE}/8289ebac4_IMG_7857.JPG`, price: 4200, stock: 0, tag: "Esgotado" },
  { id: "reta40amp", name: "Retatrutida Ampola 40mg (5x 8mg)", brand: "AlphaBio Clinic", image: `${BASE}/d0b74dd7a_IMG_7855.PNG`, price: 1950, oldPrice: 2100, stock: 0, tag: "Esgotado" },
  { id: "reta15amp", name: "Retatrutida Ampola 15mg", brand: "AlphaBio Clinic", image: `${BASE}/4cf0bc34b_IMG_7853.jpg`, price: 800, oldPrice: 1300, stock: 6, tag: "-38%" },
];

export function getProductById(id: string): ProductData | undefined {
  return PRODUCTS_DATA.find((p) => p.id === id);
}
