CREATE TABLE public.meta_ads_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id TEXT NOT NULL,
  since TEXT NOT NULL,
  until TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '[]',
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (account_id, since, until)
);

ALTER TABLE public.meta_ads_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access" ON public.meta_ads_cache FOR ALL USING (true) WITH CHECK (true);