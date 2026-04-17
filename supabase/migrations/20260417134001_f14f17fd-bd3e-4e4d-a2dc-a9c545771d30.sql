
-- Garantir página "inicio" existe
INSERT INTO public.pages (slug, title)
VALUES ('inicio', 'Página Inicial')
ON CONFLICT (slug) DO NOTHING;

-- Garantir páginas hero existem para contactos, faqs, blog, ligacoes-externas, constelacao-orion
INSERT INTO public.pages (slug, title) VALUES
  ('contactos', 'Contactos'),
  ('faqs', 'FAQs'),
  ('blog', 'Blog'),
  ('ligacoes-externas', 'Ligações Externas'),
  ('constelacao-orion', 'Constelação Órion')
ON CONFLICT (slug) DO NOTHING;

-- Adicionar 3 novas secções à página inicio: manifesto, processo, cta-final
WITH p AS (SELECT id FROM public.pages WHERE slug = 'inicio')
INSERT INTO public.page_sections (page_id, slug, title, subtitle, content, image_url, display_order)
SELECT p.id, x.slug, x.title, x.subtitle, x.content, x.image_url, x.display_order
FROM p, (VALUES
  (
    'manifesto',
    'Mais que um consultor. Um arquiteto de decisões.',
    'Manifesto',
    'Cada cliente recebe não apenas serviço — recebe estrutura. Recebe um método. Recebe alguém que pensa o longo prazo enquanto resolve o curto. Porque negócios imobiliários sólidos não nascem de oportunidades isoladas, nascem de uma direção clara mantida ao longo do tempo.',
    'https://qlxdidtestxifqcovezs.supabase.co/storage/v1/object/public/site-images/uploads/agent-keys.jpg',
    25
  ),
  (
    'processo',
    'Como trabalho contigo.',
    'O método Órion',
    E'**1. Escutar para entender.**\nAntes de propor, observo. Antes de agir, compreendo o teu contexto, objetivos e limites.\n\n**2. Estruturar a decisão.**\nMonto o cenário completo: variáveis, riscos, alavancas. Sem opiniões soltas — apenas direção fundamentada.\n\n**3. Executar com clareza.**\nNegociação, acompanhamento documental, fecho. Tu sabes sempre onde está o processo e o que vem a seguir.',
    'https://qlxdidtestxifqcovezs.supabase.co/storage/v1/object/public/site-images/uploads/compass-map.jpg',
    35
  ),
  (
    'cta-final',
    'O próximo passo é uma conversa.',
    'Vamos falar',
    'Sem compromisso. Sem pressão comercial. Apenas 30 minutos para perceberes se faz sentido avançarmos juntos. Se não fizer, sais com clareza. Se fizer, sais com um plano.',
    'https://qlxdidtestxifqcovezs.supabase.co/storage/v1/object/public/site-images/uploads/house-key.jpg',
    50
  )
) AS x(slug, title, subtitle, content, image_url, display_order)
ON CONFLICT DO NOTHING;

-- Garantir image_url na secção apresentacao (página inicio)
WITH p AS (SELECT id FROM public.pages WHERE slug = 'inicio')
UPDATE public.page_sections ps
SET image_url = COALESCE(ps.image_url, 'https://qlxdidtestxifqcovezs.supabase.co/storage/v1/object/public/site-images/uploads/navigation-map.jpg')
FROM p
WHERE ps.page_id = p.id AND ps.slug = 'apresentacao';

-- Criar/garantir secções "hero" com imagem nas páginas internas
WITH pcontactos AS (SELECT id FROM public.pages WHERE slug='contactos')
INSERT INTO public.page_sections (page_id, slug, title, subtitle, content, image_url, display_order)
SELECT pcontactos.id, 'hero', 'Vamos falar.', 'Contactos', 'Diga-me o que procura e ajudo-o a pensar com clareza antes de agir.',
  'https://qlxdidtestxifqcovezs.supabase.co/storage/v1/object/public/site-images/uploads/agent-keys.jpg', 0
FROM pcontactos
ON CONFLICT DO NOTHING;

WITH pf AS (SELECT id FROM public.pages WHERE slug='faqs')
INSERT INTO public.page_sections (page_id, slug, title, subtitle, content, image_url, display_order)
SELECT pf.id, 'hero', 'Perguntas frequentes.', 'FAQs', 'Respostas claras às dúvidas mais comuns sobre mercado, investimento e processo.',
  'https://qlxdidtestxifqcovezs.supabase.co/storage/v1/object/public/site-images/uploads/compass-map.jpg', 0
FROM pf
ON CONFLICT DO NOTHING;

WITH pb AS (SELECT id FROM public.pages WHERE slug='blog')
INSERT INTO public.page_sections (page_id, slug, title, subtitle, content, image_url, display_order)
SELECT pb.id, 'hero', 'Insights & Estratégia.', 'Blog', 'Análises, ferramentas e perspetivas sobre o mercado imobiliário, investimento e construção de carreira.',
  'https://qlxdidtestxifqcovezs.supabase.co/storage/v1/object/public/site-images/uploads/navigation-map.jpg', 0
FROM pb
ON CONFLICT DO NOTHING;

WITH pl AS (SELECT id FROM public.pages WHERE slug='ligacoes-externas')
INSERT INTO public.page_sections (page_id, slug, title, subtitle, content, image_url, display_order)
SELECT pl.id, 'hero', 'Acesso rápido.', 'Ligações Externas', 'Ferramentas e plataformas que utilizo no dia-a-dia para servir clientes e parceiros.',
  'https://qlxdidtestxifqcovezs.supabase.co/storage/v1/object/public/site-images/uploads/house-key.jpg', 0
FROM pl
ON CONFLICT DO NOTHING;

WITH po AS (SELECT id FROM public.pages WHERE slug='constelacao-orion')
INSERT INTO public.page_sections (page_id, slug, title, subtitle, content, image_url, display_order)
SELECT po.id, 'hero', 'Constelação Órion', 'Orion Legacy',
  'Quando cada elemento ocupa o seu lugar, tudo ganha clareza. Uma constelação não é apenas um conjunto de estrelas — é um sistema, uma lógica, uma leitura para quem sabe observar.',
  'https://qlxdidtestxifqcovezs.supabase.co/storage/v1/object/public/site-images/uploads/compass-map.jpg', 0
FROM po
ON CONFLICT DO NOTHING;
