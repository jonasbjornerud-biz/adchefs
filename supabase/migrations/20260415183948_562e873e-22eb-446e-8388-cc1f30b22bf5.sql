
-- Create clients table (linked to Supabase Auth)
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stages table
CREATE TABLE public.stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  stage_number INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create modules table
CREATE TABLE public.modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stage_id UUID NOT NULL REFERENCES public.stages(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  icon TEXT DEFAULT '📄',
  module_number TEXT NOT NULL DEFAULT '01',
  definition_of_done TEXT,
  content JSONB,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create module_completions table
CREATE TABLE public.module_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT true,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(module_id, client_id)
);

-- Enable RLS on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_completions ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if a user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.clients
    WHERE user_id = _user_id AND is_admin = true
  )
$$;

-- Security definer function to get client_id for a user
CREATE OR REPLACE FUNCTION public.get_client_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.clients
  WHERE user_id = _user_id AND is_admin = false
  LIMIT 1
$$;

-- Clients policies
CREATE POLICY "Admins can view all clients" ON public.clients
  FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can insert clients" ON public.clients
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update clients" ON public.clients
  FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete clients" ON public.clients
  FOR DELETE USING (public.is_admin(auth.uid()));
CREATE POLICY "Clients can view own record" ON public.clients
  FOR SELECT USING (auth.uid() = user_id);

-- Stages policies
CREATE POLICY "Admins can manage stages" ON public.stages
  FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Clients can view own stages" ON public.stages
  FOR SELECT USING (client_id = public.get_client_id(auth.uid()));

-- Modules policies
CREATE POLICY "Admins can manage modules" ON public.modules
  FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Clients can view own modules" ON public.modules
  FOR SELECT USING (client_id = public.get_client_id(auth.uid()));

-- Module completions policies
CREATE POLICY "Admins can view all completions" ON public.module_completions
  FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Clients can view own completions" ON public.module_completions
  FOR SELECT USING (client_id = public.get_client_id(auth.uid()));
CREATE POLICY "Clients can insert own completions" ON public.module_completions
  FOR INSERT WITH CHECK (client_id = public.get_client_id(auth.uid()));
CREATE POLICY "Clients can update own completions" ON public.module_completions
  FOR UPDATE USING (client_id = public.get_client_id(auth.uid()));
CREATE POLICY "Clients can delete own completions" ON public.module_completions
  FOR DELETE USING (client_id = public.get_client_id(auth.uid()));

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for module assets
INSERT INTO storage.buckets (id, name, public) VALUES ('module-assets', 'module-assets', true);

CREATE POLICY "Anyone can view module assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'module-assets');
CREATE POLICY "Admins can upload module assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'module-assets' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can update module assets" ON storage.objects
  FOR UPDATE USING (bucket_id = 'module-assets' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete module assets" ON storage.objects
  FOR DELETE USING (bucket_id = 'module-assets' AND public.is_admin(auth.uid()));
