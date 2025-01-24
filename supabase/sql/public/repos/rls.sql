ALTER TABLE public.github_repos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "github_repos_select_owner"
    ON public.github_repos FOR SELECT
    USING (auth.uid() = uuid);

CREATE POLICY "github_repos_insert_none"
    ON public.github_repos FOR INSERT
    WITH CHECK (auth.uid() = uuid);

CREATE POLICY "github_repos_update_none"
    ON public.github_repos FOR UPDATE
    USING (auth.uid() = uuid);

CREATE POLICY "github_repos_delete_none"
    ON public.github_repos FOR DELETE
    USING (auth.uid() = uuid);