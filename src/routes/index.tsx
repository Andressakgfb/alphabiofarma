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
      { title: "AlphaBio Farma — Suplementação e Hormônios" },
      { name: "description", content: "Farmácia especializada em suplementação, hormônios bioidênticos e biohacking. Compra segura, entrega rápida e melhores preços." },
      { property: "og:title", content: "AlphaBio Farma — Suplementação e Hormônios" },
      { property: "og:description", content: "Farmácia premium em suplementação clínica, hormônios bioidênticos e longevidade. Compra segura e entrega rápida." },
      { property: "og:url", content: "https://alphabiofarma.lovable.app/" },
    ],
    links: [
      { rel: "canonical", href: "https://alphabiofarma.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "AlphaBio Farma — Catálogo de suplementação e hormônios",
          description:
            "Catálogo de suplementos clínicos, hormônios bioidênticos e peptídeos para performance, longevidade e bem-estar.",
          url: "https://alphabiofarma.lovable.app/",
          isPartOf: { "@type": "WebSite", name: "AlphaBio Farma", url: "https://alphabiofarma.lovable.app/" },
          about: [
            "Suplementação e Performance",
            "Hormônio Crescimento Regenerativo",
            "Peptídeos",
            "Tirzepatida",
          ],
        }),
      },
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
