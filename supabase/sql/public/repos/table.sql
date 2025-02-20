-- Drop table if exists github_repos
DROP TABLE IF EXISTS public.github_repos;

-- Create github_repos table
CREATE TABLE public.github_repos (
    id              BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    uuid            UUID REFERENCES profiles ON DELETE CASCADE NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,


    name            TEXT NOT NULL,
    last_check      TIMESTAMP WITH TIME ZONE,
    package_json    TEXT NOT NULL,
    packages        JSON 
);