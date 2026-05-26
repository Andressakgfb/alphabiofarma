import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/alphabio/Header";
import { Hero } from "@/components/alphabio/Hero";
import { SmartSearch } from "@/components/alphabio/SmartSearch";
import { Filters } from "@/components/alphabio/Filters";
import { ProductGrid } from "@/components/alphabio/ProductGrid";
import { Footer } from "@/components/alphabio/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "AlphaBio Farma — Suplementação clínica e hormônios regenerativos" },
      { name: "description", content: "Farmácia especializada em suplementação, hormônios bioidênticos e biohacking. Compra segura, entrega rápida e melhores preços." },
      { property: "og:title", content: "AlphaBio Farma" },
      { property: "og:description", content: "Plataforma farmacêutica premium — suplementação, hormônios e longevidade." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <SmartSearch />
        <Filters />
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
}
