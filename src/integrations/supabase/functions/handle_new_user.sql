
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  user_role text := 'user';
BEGIN
  -- Check if this email is in approved_admins
  SELECT CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.approved_admins 
      WHERE email = NEW.email AND used = false
    ) THEN 'admin'
    ELSE 'user'
  END INTO user_role;

  -- Insert the profile with the determined role
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    user_role
  );

  -- If user was approved admin, mark as used
  IF user_role = 'admin' THEN
    UPDATE public.approved_admins 
    SET used = true 
    WHERE email = NEW.email;
  END IF;

  RETURN NEW;
END;
$function$;
