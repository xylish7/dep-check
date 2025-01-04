ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_anyone"
  ON public.profiles FOR SELECT
  USING (TRUE);

CREATE POLICY "profiles_insert_none"
  ON public.profiles FOR INSERT
  WITH CHECK (FALSE);

CREATE POLICY "profiles_update_none"
  ON public.profiles FOR UPDATE
  USING (FALSE);

CREATE POLICY "profiles_delete_none"
  ON public.profiles FOR DELETE
  USING (FALSE);
