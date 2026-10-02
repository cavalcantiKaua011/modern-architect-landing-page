# Thais Macenna · Arquitetura & Interiores

Site pessoal premium da arquiteta **Thais Macenna** — portfólio, landing page de conversão,
catálogo de projetos e sistema de captação de leads com solicitação de orçamento.

> **Conceito de marca:** *Arquitetura contemporânea para pessoas reais.*
> Jovem, sofisticada, próxima, criativa e leve — inspirado em Airbnb, Apple, Aesop, Pinterest e Casa Vogue.
> Sem estética corporativa, sem dourado, sem excesso de preto, sem "cara de construtora".

---

## 1. O que já está pronto

### Experiência & interface
- **Home completa** com 11 seções: Hero, Sobre, Números, Portfólio, Depoimentos, Serviços, Pacotes, Regiões, Orçamento, Contato e CTA final.
- **Página individual de projeto** (`projeto.html?slug=...`) com banner parallax, ficha técnica, conceito, soluções aplicadas, galeria, vídeo 3D e comparador **antes × depois**.
- **Portfólio navegável** com filtros por categoria (Apartamentos, Casas, Comerciais, Reformas) e contagem dinâmica por filtro.
- **Formulário inteligente de orçamento** com validação, máscara de WhatsApp, upload de planta (drag & drop), consentimento LGPD e fallback de envio via WhatsApp.
- **Design System completo** baseado em tokens CSS (cores, tipografia, espaçamento, sombras, motion).
- **Dark mode** persistente (localStorage).
- **Mobile-first** com drawer de navegação, header colapsável e grid adaptativo.

### Animações & microinterações
- Scroll reveal (fade / left / right / scale) com `IntersectionObserver`.
- Contadores animados nos indicadores numéricos.
- Parallax leve no hero e nos banners.
- Hover elegante em cards (zoom de imagem + elevação), botões com preenchimento deslizante.
- Barra de progresso de leitura, botão "voltar ao topo", WhatsApp flutuante contextual.
- Respeita `prefers-reduced-motion`.

### Integrações
- **WhatsApp** — links dinâmicos com mensagem contextual por seção/projeto (`wa.me`).
- **Instagram** — `@thaismacenna.arq`.
- **Google Maps** — embed da região de atendimento.
- **E-mail** — `mailto:` configurável.

### Técnico
- HTML5 semântico, CSS3 com custom properties, JavaScript vanilla (sem frameworks).
- **SEO**: meta tags, Open Graph/Twitter Card, canonical, `robots.txt`, `sitemap.xml` e **JSON-LD** (`ArchitecturalService`).
- Performance: imagens `lazy` + `decoding="async"`, `preconnect` de fontes, zero dependências pesadas.
- Acessibilidade: landmarks semânticos, `aria-*`, foco visível, navegação por teclado no lightbox.
- Estrutura preparada para **CMS futuro**, **blog** e **área administrativa** (dados já vêm de tabelas).

---

## 2. Estrutura de arquivos

```
index.html                  Página principal (home + landing de conversão)
projeto.html                Página dinâmica de projeto individual (?slug=...)
robots.txt                  Diretivas de rastreamento
sitemap.xml                 Mapa do site
css/
  └── style.css             Design System completo (20 blocos comentados)
js/
  ├── main.js               Interatividade, portfólio, form, WhatsApp, tema
  ├── projeto.js            Render da página de projeto (galeria, lightbox, comparador)
  └── projetos-fallback.js  Dados de reserva caso a API de tabelas falte
.tables/
  └── schema.json           Schemas: projetos, leads, depoimentos
```

---

## 3. Design System

### Paleta
| Token | Hex | Uso |
|---|---|---|
| `--off-white` | `#F7F4EE` | Fundo principal |
| `--bege` | `#E7DDCF` | Seções alternadas |
| `--areia` | `#D3C2A8` | Detalhes, marcadores, destaque quente |
| `--azul-ceu` | `#9BB7D4` | Acento suave, ícones, hover |
| `--azul-profundo` | `#405C76` | Cor de marca, botões primários, CTA |
| `--grafite` | `#2C2C2C` | Texto e footer |

### Tipografia
- **Títulos:** Cormorant Garamond (300/400/500 + itálico).
- **Textos:** Inter (300/400/500/600).
- Escala fluida com `clamp()` — do mobile ao desktop sem quebras.

### Componentes
Botões (5 variantes), chips de filtro, badges, cards de portfólio (3 layouts),
cards de serviço/pacote/contato, blocos de destaque, campos de formulário,
upload com drag & drop, feedback inline, tags, lightbox e comparador de imagens.

### Motion
`--ease: cubic-bezier(0.22, 1, 0.36, 1)` · durações 0.25s–0.85s.
Todas as animações respeitam `prefers-reduced-motion: reduce`.

---

## 4. Jornada do usuário (UX)

1. **Descoberta** — Instagram / busca → Home com hero editorial e prova social ("Agenda aberta 2026").
2. **Inspiração** — Portfólio filtrável: o visitante se reconhece no tipo de projeto (compacto, casa, comercial, reforma).
3. **Aprofundamento** — Página de projeto: conceito, soluções, galeria, 3D e antes/depois geram confiança técnica.
4. **Qualificação** — Pacotes Essencial/Intermediário/Completo informam faixa de investimento e reduzem objeção de preço.
5. **Decisão** — Formulário de orçamento com upload de planta (micro-compromisso) ou WhatsApp direto (baixa fricção).
6. **Conversão** — Feedback imediato + abertura automática do WhatsApp com a mensagem já preenchida.
7. **Pós-conversão** — Lead registrado na tabela `leads` com status e origem para follow-up.

### Estratégia de conversão de leads
- **Dois caminhos**: formulário (qualificado) e WhatsApp (rápido) em todos os pontos-chave.
- **Redução de fricção**: WhatsApp flutuante persistente + CTA final.
- **Prova social**: números, depoimentos e antes/depois.
- **Ancoragem**: pacotes com faixa de preço e "Mais escolhido".
- **Urgência suave**: "vagas limitadas por ano" e agenda aberta.
- **Transparência**: prazos, LGPD, "sem compromisso".

---

## 5. Rotas e parâmetros

| Rota | Descrição | Parâmetros |
|---|---|---|
| `/` · `index.html` | Home | — |
| `index.html#sobre` | Seção Sobre | — |
| `index.html#portfolio` | Portfólio | `?categoria=Apartamentos\|Casas\|Comerciais\|Reformas` (pré-filtra) |
| `index.html#servicos` | Serviços | — |
| `index.html#pacotes` | Pacotes | — |
| `index.html#regioes` | Regiões atendidas | — |
| `index.html#orcamento` | Formulário de orçamento | — |
| `index.html#contato` | Contato | — |
| `projeto.html` | Projeto individual | `?slug=<slug>` (ex.: `?slug=casa-jardim-alphaville`) |

---

## 6. Modelos de dados

As três tabelas alimentam o site via RESTful Table API (`tables/{tabela}`).
Existe um **fallback local** (`js/projetos-fallback.js`) para garantir que o portfólio sempre renderize.

### `projetos`
`id` · `slug` · `titulo` · `categoria` · `local` · `ano` · `area_m2` · `resumo` · `capa` ·
`galeria[]` · `conceito` · `solucoes` · `antes` · `depois` · `video_url` · `destaque` · `ordem`

### `leads`
`id` · `nome` · `whatsapp` · `email` · `tipo_imovel` · `area_aprox` · `objetivos` ·
`pacote_interesse` · `arquivo_nome` · `arquivo_tamanho` · `origem` · `status` · `observacoes`

### `depoimentos`
`id` · `nome` · `cidade` · `projeto` · `texto` · `nota` · `ordem`

> **Importante sobre o upload de planta:** por ser um site estático, o arquivo **não é armazenado no servidor**.
> O site registra o nome/tamanho do anexo no lead e orienta o envio definitivo pelo WhatsApp,
> onde o cliente compartilha o arquivo com segurança e de forma imediata.

---

## 7. Personalização rápida

Todas as informações de contato ficam em **um único ponto** — o objeto `CONFIG` no topo de `js/main.js`:

```js
var CONFIG = {
  whatsapp: '5511912345678',      // só dígitos, com DDI
  whatsappLabel: '(11) 91234-5678',
  email: 'contato@thaismacenna.com.br',
  instagram: 'thaismacenna.arq',
  cidade: 'São Paulo · SP',
  atendimento: 'Seg a Sex · 9h às 18h'
};
```

Cores e tipografia: bloco **1. TOKENS** em `css/style.css`.
Projetos e depoimentos: tabelas `projetos` / `depoimentos` (ou o fallback em `js/projetos-fallback.js`).

---

## 8. SEO

- Title, description e keywords otimizados por página.
- Open Graph + Twitter Card com imagem de compartilhamento.
- `canonical`, `robots.txt` e `sitemap.xml`.
- **JSON-LD** `ArchitecturalService` com serviços, área atendida e fundadora.
- A página de projeto atualiza dinamicamente `title`, `description`, `og:image` e breadcrumb.
- Hierarquia semântica correta (um `h1` por página, `h2`/`h3` sequenciais).

---

## 9. Ainda não implementado (roadmap)

- **Área administrativa / CMS**: o site já lê de tabelas, mas ainda não há UI de gestão de projetos e leads.
- **Blog / journal**: estrutura SEO pronta, conteúdos e listagem não criados.
- **i18n** (EN/ES) para clientes internacionais.
- **Página dedicada de "Sobre"**, "Serviços" e listagem de pacotes como rotas próprias (hoje são âncoras da home).
- **Integração de envio de arquivo na nuvem** (requer backend/serviço externo — fora do escopo estático).
- **Analytics/Meta Pixel** e eventos de conversão.
- **Depoimentos em vídeo** e seção de imprensa/mídia.

## 10. Próximos passos recomendados

1. **Publicar** o site (aba **Publish**) e apontar o domínio próprio.
2. Substituir as fotos do portfólio pelas imagens reais dos projetos da arquiteta (mesmos campos da tabela `projetos`).
3. Trocar o retrato da seção Sobre pela foto oficial da profissional.
4. Atualizar `CONFIG` (WhatsApp, e-mail, Instagram) com os dados reais.
5. Inserir os links de **tour 3D** (YouTube/Vimeo) no campo `video_url` dos projetos.
6. Cadastrar depoimentos reais e atualizar os números da seção Indicadores.
7. Conectar analytics e definir um funil de acompanhamento dos leads da tabela `leads`.
8. Evoluir para um painel administrativo e blog quando houver volume de conteúdo.

---

## 11. Observação sobre segurança

Este é um **site estático**: não há autenticação de servidor. Se uma área administrativa for
adicionada no futuro, ela **não pode** ser protegida apenas por JavaScript no navegador —
qualquer visitante consegue ler o código da página. Uma área restrita real exige backend ou um
serviço externo de autenticação.

---

© Thais Macenna Arquitetura · CAU-SP.
Imagens de apoio: banco de imagens com licença livre (Creative Commons / domínio público), para demonstração.
