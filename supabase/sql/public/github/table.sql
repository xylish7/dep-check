-- Drop table if exists github_tokens
DROP TABLE IF EXISTS public.github_tokens;

-- Create github_tokens table
CREATE TABLE public.github_tokens (
    id              UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,


    access_token    TEXT NOT NULL,
    access_token_expires_at INT NOT NULL,
    refresh_token   TEXT NOT NULL,
    refresh_token_expires_at INT NOT NULL
);

