-- Set BELLATRIX as not featured and move it to a different order
UPDATE public.stars SET is_featured_home = false, display_order = 99 WHERE star_name = 'BELLATRIX';

-- Set ALNILAM as featured and set its order to 3 (where MINTAKA was originally)
UPDATE public.stars SET is_featured_home = true, display_order = 3 WHERE star_name = 'ALNILAM';

-- Set MINTAKA order to 5 (where BELLATRIX was originally)
UPDATE public.stars SET display_order = 5 WHERE star_name = 'MINTAKA';

-- ALNITAK remains at 1
UPDATE public.stars SET display_order = 1 WHERE star_name = 'ALNITAK';
