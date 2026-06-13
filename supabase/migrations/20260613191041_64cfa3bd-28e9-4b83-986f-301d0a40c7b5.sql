
-- 1) Storage: restrict module-assets reads to admins
DROP POLICY IF EXISTS "Authenticated can view module assets" ON storage.objects;
CREATE POLICY "Admins can view module assets"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'module-assets' AND public.is_admin(auth.uid()));

-- 2) Clients: prevent privilege escalation via trigger (defense-in-depth)
CREATE OR REPLACE FUNCTION public.prevent_client_privilege_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;
  IF NEW.is_admin IS DISTINCT FROM OLD.is_admin
     OR NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'Not authorized to modify privileged fields';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS clients_prevent_privilege_escalation ON public.clients;
CREATE TRIGGER clients_prevent_privilege_escalation
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.prevent_client_privilege_escalation();

-- 3) Replace always-true INSERT policies with minimally-validated ones
DROP POLICY IF EXISTS "Anyone can apply" ON public.applications;
CREATE POLICY "Anyone can apply"
  ON public.applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(btrim(first_name)) > 0
    AND length(btrim(last_name)) > 0
    AND length(btrim(email)) > 0
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(btrim(software)) > 0
    AND length(btrim(availability)) > 0
  );

DROP POLICY IF EXISTS "Anyone can submit task" ON public.trial_submissions;
CREATE POLICY "Anyone can submit task"
  ON public.trial_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(btrim(email)) > 0
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );
