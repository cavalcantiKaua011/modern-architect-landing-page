/* ==========================================================================
   THAIS MACENNA — Dados de reserva (fallback)
   Usados apenas se a API de tabelas estiver indisponível.
   Fonte de verdade em produção: tabelas `projetos` e `depoimentos`.
   ========================================================================== */
window.TM_PROJETOS = [
  {
    id: 'proj-01', slug: 'apartamento-vila-mariana', titulo: 'Apartamento Vila Mariana',
    categoria: 'Apartamentos', local: 'Vila Mariana, São Paulo', ano: '2024', area_m2: 62, ordem: 1,
    resumo: 'Um 62 m² que respira: planta integrada, marcenaria sob medida e luz natural como material principal.',
    capa: 'https://sspark.genspark.ai/i/MeMumD66MWsT7UGn?width=2560'
  },
  {
    id: 'proj-02', slug: 'casa-jardim-alphaville', titulo: 'Casa Jardim',
    categoria: 'Casas', local: 'Alphaville, Santana de Parnaíba', ano: '2024', area_m2: 320, ordem: 2,
    resumo: 'Residência de alto padrão onde o jardim atravessa a casa — pátios internos, pé-direito duplo e materiais naturais.',
    capa: 'https://sspark.genspark.ai/i/EggOtZr2bBMOchAc?width=2560'
  },
  {
    id: 'proj-03', slug: 'atelie-cafe-pinheiros', titulo: 'Ateliê Café',
    categoria: 'Comerciais', local: 'Pinheiros, São Paulo', ano: '2023', area_m2: 90, ordem: 3,
    resumo: 'Cafeteria e ateliê em um só endereço: fluxo de operação estudado e um balcão que funciona como vitrine.',
    capa: 'https://sspark.genspark.ai/i/UZjXF2wqJoZhTK9n?width=2560'
  },
  {
    id: 'proj-04', slug: 'reforma-apartamento-moema', titulo: 'Reforma Moema',
    categoria: 'Reformas', local: 'Moema, São Paulo', ano: '2023', area_m2: 110, ordem: 4,
    resumo: 'Uma reforma estrutural leve que transformou 110 m² escuros em um apartamento claro, contínuo e fácil de manter.',
    capa: 'https://sspark.genspark.ai/i/kWCTzjWYFCVNQMR0?width=2560'
  },
  {
    id: 'proj-05', slug: 'casa-de-praia-maresias', titulo: 'Casa de Praia',
    categoria: 'Casas', local: 'Maresias, São Sebastião', ano: '2022', area_m2: 180, ordem: 5,
    resumo: 'Casa de veraneio em linha com o horizonte: varandas generosas, materiais resistentes à maresia e vida ao ar livre.',
    capa: 'https://sspark.genspark.ai/i/cJr33uWE8YCZAeGq?width=2560'
  },
  {
    id: 'proj-06', slug: 'studio-compacto-centro', titulo: 'Studio Compacto',
    categoria: 'Apartamentos', local: 'República, São Paulo', ano: '2024', area_m2: 45, ordem: 6,
    resumo: '45 m² pensados como um móvel só: cada função do dia tem seu lugar e nada fica à vista quando não precisa.',
    capa: 'https://sspark.genspark.ai/i/TNfBUxzkuR9hxRWR?width=2560'
  },
  {
    id: 'proj-07', slug: 'escritorio-boutique', titulo: 'Escritório Boutique',
    categoria: 'Comerciais', local: 'Itaim Bibi, São Paulo', ano: '2022', area_m2: 140, ordem: 7,
    resumo: 'Sede de um escritório boutique onde a sala de reuniões é o coração — e o silêncio foi tratado como projeto.',
    capa: 'https://sspark.genspark.ai/i/ULukyx01ugHV16BT?width=2560'
  },
  {
    id: 'proj-08', slug: 'reforma-cozinha-gourmet', titulo: 'Cozinha Gourmet',
    categoria: 'Reformas', local: 'Perdizes, São Paulo', ano: '2023', area_m2: 28, ordem: 8,
    resumo: 'A cozinha deixou de ser bastidor e virou o lugar onde a família se encontra — sem deixar de ser prática.',
    capa: 'https://sspark.genspark.ai/i/3ShOOWckwbd6Bv1d?width=2560'
  }
];

window.TM_DEPOIMENTOS = [
  {
    id: 'dep-01', nome: 'Marina e Rafael', cidade: 'São Paulo', projeto: 'Apartamento Vila Mariana', nota: 5, ordem: 1,
    texto: 'A Thais entendeu a nossa rotina antes de desenhar qualquer parede. Moramos em 62 m² e parece que temos 100. Cada detalhe foi discutido com a gente, sem termos técnicos e sem pressa.'
  },
  {
    id: 'dep-02', nome: 'Juliana Ferraz', cidade: 'Santana de Parnaíba', projeto: 'Casa Jardim', nota: 5, ordem: 2,
    texto: 'Construir uma casa é assustador. A Thais transformou o processo em algo leve, com prazos claros e decisões explicadas. O resultado superou o que imaginávamos — e ficou dentro do orçamento.'
  },
  {
    id: 'dep-03', nome: 'Bruno Cardoso', cidade: 'Pinheiros', projeto: 'Ateliê Café', nota: 5, ordem: 3,
    texto: 'Nosso café recebe elogio pela arquitetura toda semana. Ela pensou na operação, no barulho, no fluxo de clientes — coisas que a gente nem sabia que eram projeto.'
  }
];
