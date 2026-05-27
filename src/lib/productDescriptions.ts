// Descrições importadas da loja referência (shop.atualizadigital.com.br/shop/lojaalphabio)
export type ProductDescription = {
  intro: string;
  sectionTitle?: string;
  bullets?: string[];
  extra?: string;
};

const GHKCU: ProductDescription = {
  intro:
    "O peptídeo GHK-Cu (Copper Peptide) é uma molécula formada por três aminoácidos ligados ao cobre. Ficou conhecido por sua aplicação em estética, regeneração da pele, crescimento capilar e estudos sobre rejuvenescimento celular.",
  sectionTitle: "Para que serve o GHK-Cu",
  bullets: [
    "Regeneração da pele",
    "Estímulo de colágeno e elastina",
    "Melhora da cicatrização",
    "Auxílio no crescimento capilar",
    "Redução de inflamação",
    "Ação antioxidante",
    "Possível melhora da qualidade da pele envelhecida",
  ],
  extra:
    "Benefícios mais comentados: firmeza da pele, redução de linhas finas, suporte ao crescimento capilar e ação anti-inflamatória.",
};

const RETA: ProductDescription = {
  intro:
    "Retatrutida é um peptídeo de nova geração estudado por sua ação tripla em receptores GLP-1, GIP e Glucagon, voltado para protocolos de pesquisa em controle metabólico, composição corporal e suporte ao bem-estar.",
  sectionTitle: "Aplicações estudadas",
  bullets: [
    "Suporte ao controle do apetite",
    "Auxílio em protocolos de composição corporal",
    "Estudos relacionados ao metabolismo de glicose e lipídios",
    "Pesquisa em performance e longevidade metabólica",
  ],
  extra:
    "Produto sujeito a prescrição médica. Conservação refrigerada e lote rastreável.",
};

const TIRZ: ProductDescription = {
  intro:
    "Tirzepatida é um peptídeo dual-agonista (GLP-1 / GIP) amplamente estudado para suporte ao controle metabólico, saciedade e composição corporal em protocolos clínicos.",
  sectionTitle: "Para que é utilizada",
  bullets: [
    "Auxílio na regulação do apetite e saciedade",
    "Suporte em protocolos de emagrecimento clínico",
    "Estudos em controle glicêmico",
    "Composição corporal e performance metabólica",
  ],
  extra:
    "Uso sob orientação profissional. Conservação refrigerada. Lote rastreável com COA disponível.",
};

export const productDescriptions: Record<string, ProductDescription> = {
  nad500: {
    intro:
      "O NAD+ (Nicotinamida Adenina Dinucleotídeo) é uma molécula naturalmente presente no organismo, essencial para a produção de energia celular e funcionamento metabólico. Amplamente utilizado em protocolos de bem-estar, recuperação, longevidade e performance.",
    sectionTitle: "Para que serve",
    bullets: [
      "Energia e disposição",
      "Recuperação física e mental",
      "Performance e vitalidade",
      "Suporte metabólico",
      "Bem-estar e longevidade",
      "Protocolos de saúde integrativa",
    ],
    extra:
      "Auxílio na produção de energia celular, suporte mitocondrial e participação em processos de manutenção celular associados à longevidade.",
  },
  nadb12: {
    intro:
      "NAD+ + Vitamina B12 — combinação desenvolvida para protocolos de bem-estar, recuperação e suporte metabólico, associando NAD+ e Vitamina B12 em uma fórmula voltada para energia celular, disposição e performance do organismo.",
    sectionTitle: "Para que serve",
    bullets: [
      "Energia celular e mitocondrial",
      "Suporte ao metabolismo energético",
      "Disposição física e mental",
      "Reposição de B12 em protocolos integrativos",
      "Recuperação e bem-estar geral",
    ],
  },
  tesa10: {
    intro:
      "Tesamorelin é um análogo do GHRH (hormônio liberador do hormônio do crescimento) estudado por seu papel no estímulo natural à secreção de GH, com aplicações em composição corporal e bem-estar.",
    sectionTitle: "Aplicações estudadas",
    bullets: [
      "Estímulo à liberação fisiológica de GH",
      "Suporte à composição corporal",
      "Recuperação e regeneração",
      "Protocolos de longevidade",
    ],
  },
  pt141: {
    intro:
      "PT-141 (Bremelanotida) é um peptídeo melanocortina estudado por sua ação central em libido e função sexual, com aplicações em protocolos de bem-estar.",
    sectionTitle: "Aplicações estudadas",
    bullets: ["Suporte à libido", "Estudos em função sexual masculina e feminina", "Ação central via receptores melanocortina"],
  },
  ghkcu100pen: { ...GHKCU, intro: GHKCU.intro + " Apresentação em caneta aplicadora 100mg, prática e dosada." },
  ghkcu50: GHKCU,
  ghkcu100: GHKCU,
  ghkcu50d: { ...GHKCU, intro: GHKCU.intro + " Apresentação diluída pronta para uso, 50mg." },
  ghkcu100d: { ...GHKCU, intro: GHKCU.intro + " Apresentação diluída pronta para uso, 100mg." },
  glow70pen: {
    intro:
      "GLOW é uma combinação avançada de múltiplos peptídeos desenvolvida para protocolos de bem-estar com foco em recuperação, regeneração e suporte ao equilíbrio do organismo. Apresentação em caneta 70mg.",
    sectionTitle: "Benefícios estudados",
    bullets: [
      "Reparo celular e comunicação tecidual",
      "Recuperação física e regeneração",
      "Suporte estético e à qualidade da pele",
      "Bem-estar e equilíbrio metabólico",
    ],
  },
  glow70: {
    intro:
      "GLOW 70mg — blend de peptídeos voltado para protocolos de regeneração, estética e bem-estar. Fórmula desenvolvida para potencializar a sinergia entre peptídeos com ação no reparo celular e na qualidade da pele.",
    sectionTitle: "Benefícios estudados",
    bullets: [
      "Reparo celular",
      "Recuperação física",
      "Qualidade da pele",
      "Bem-estar geral",
    ],
  },
  tirz60ag: TIRZ,
  tirz60pen: TIRZ,
  tirz60: TIRZ,
  reta40pen: RETA,
  reta40ag: RETA,
  retaxt40: RETA,
  retalio40: { ...RETA, extra: "Apresentação liofilizada para reconstituição. " + (RETA.extra ?? "") },
  tirzlp60: { ...TIRZ, intro: TIRZ.intro + " Apresentação Lipoland 60mg (4x 15mg)." },
  tirztg60: { ...TIRZ, intro: TIRZ.intro + " Apresentação T.G Pharma 60mg (4x 15mg)." },
  kit4x5: { ...TIRZ, intro: TIRZ.intro + " Kit com 4 canetas de 5mg (20mg totais)." },
  kit4x10: { ...TIRZ, intro: TIRZ.intro + " Kit com 4 canetas de 10mg (40mg totais)." },
  reta60amp: { ...RETA, intro: RETA.intro + " Apresentação em ampola 60mg (5x 12mg)." },
  reta30pen: { ...RETA, intro: RETA.intro + " Apresentação em caneta 30mg." },
  reta120: { ...RETA, intro: RETA.intro + " Apresentação em ampola 120mg (5x 24mg)." },
  reta40amp: { ...RETA, intro: RETA.intro + " Apresentação em ampola 40mg (5x 8mg)." },
  reta15amp: { ...RETA, intro: RETA.intro + " Apresentação em ampola 15mg." },
};
