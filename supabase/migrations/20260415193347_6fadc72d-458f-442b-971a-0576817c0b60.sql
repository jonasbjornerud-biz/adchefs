-- Allow admins to insert completions
CREATE POLICY "Admins can insert completions"
ON public.module_completions
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

-- Allow admins to update completions
CREATE POLICY "Admins can update completions"
ON public.module_completions
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Allow admins to delete completions
CREATE POLICY "Admins can delete completions"
ON public.module_completions
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));