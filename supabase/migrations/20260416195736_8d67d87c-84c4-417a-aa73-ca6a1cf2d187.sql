
-- Seed star sub-sections (investidores, compradores, vendedores, arrendamentos, embaixador)
-- These apply to relevant stars; using ALNITAK as the main commercial star for the full set
DO $$
DECLARE
  v_star_id uuid;
  star_record RECORD;
BEGIN
  -- For each star, add the standard sub-sections
  FOR star_record IN SELECT id, slug FROM public.stars LOOP
    -- Investidores
    INSERT INTO public.star_sections (star_id, slug, title, content, section_type, display_order)
    VALUES (star_record.id, 'investidores', 'Para Investidores',
      'Estrutura de análise para decisões de investimento com horizonte longo. Avaliação de rentabilidade, exposição ao risco, posicionamento geográfico e potencial de valorização. Trabalho com critério, não com pressa.',
      'audience', 1)
    ON CONFLICT DO NOTHING;

    -- Compradores
    INSERT INTO public.star_sections (star_id, slug, title, content, section_type, display_order)
    VALUES (star_record.id, 'compradores', 'Para Compradores',
      'Acompanhamento estratégico desde a definição de critérios até à escritura. Negociação informada, leitura de mercado e proteção dos seus interesses em cada etapa. Comprar bem é decidir com clareza.',
      'audience', 2)
    ON CONFLICT DO NOTHING;

    -- Vendedores
    INSERT INTO public.star_sections (star_id, slug, title, content, section_type, display_order)
    VALUES (star_record.id, 'vendedores', 'Para Vendedores',
      'Posicionamento do imóvel com base em análise de mercado real, marketing estruturado e qualificação rigorosa de compradores. Vender bem não é vender depressa — é vender com estratégia.',
      'audience', 3)
    ON CONFLICT DO NOTHING;

    -- Arrendamentos
    INSERT INTO public.star_sections (star_id, slug, title, content, section_type, display_order)
    VALUES (star_record.id, 'arrendamentos', 'Arrendamentos',
      'Gestão completa do processo de arrendamento — avaliação de rendas, seleção de inquilinos, contratos e acompanhamento contínuo. Tranquilidade para o proprietário, rigor no contrato.',
      'audience', 4)
    ON CONFLICT DO NOTHING;

    -- Embaixador (FAQ-style accordion)
    INSERT INTO public.star_sections (star_id, slug, title, content, section_type, display_order)
    VALUES (star_record.id, 'embaixador', 'Programa Embaixador',
      'O Programa Embaixador reconhece quem partilha esta visão. Indique clientes ou parceiros e participe nos resultados gerados pelas decisões que ajudou a tornar possíveis. Confiança que se transforma em legado partilhado.',
      'embaixador', 5)
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

-- Add Contactos page sections
INSERT INTO public.page_sections (page_id, slug, title, subtitle, content, display_order)
SELECT p.id, 'hero', 'Vamos conversar.',
  'Contactos',
  'Cada decisão estruturada começa por uma conversa honesta. Diga-me o que procura e ajudo-o a pensar com clareza antes de agir.',
  1
FROM public.pages p WHERE p.slug = 'contactos'
ON CONFLICT DO NOTHING;

INSERT INTO public.page_sections (page_id, slug, title, content, display_order)
SELECT p.id, 'info', 'Informação de contacto',
  'Resposta em 24h úteis. Atendimento presencial mediante marcação no Algarve.',
  2
FROM public.pages p WHERE p.slug = 'contactos'
ON CONFLICT DO NOTHING;
