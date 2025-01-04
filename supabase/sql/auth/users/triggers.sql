-- Commented code is not used but kept for reference
CREATE OR REPLACE FUNCTION auth.f_users_insert()
    RETURNS TRIGGER
    LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
    profile_id BIGINT;
    updated_data auth.users%ROWTYPE;
BEGIN   
    -- Insert a new profile for the user
    INSERT INTO public.profiles (id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$;


DROP TRIGGER IF EXISTS t_on_users_insert ON auth.users;
CREATE TRIGGER t_on_users_insert
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION auth.f_users_insert();
