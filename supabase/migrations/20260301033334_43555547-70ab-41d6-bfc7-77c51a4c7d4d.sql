
-- Create role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS on user_roles: admins can read all, users can read own
CREATE POLICY "Admins can read all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());

-- Drop old permissive policies on missions
DROP POLICY IF EXISTS "Allow public read access to missions" ON public.missions;
DROP POLICY IF EXISTS "Allow public update to missions" ON public.missions;
DROP POLICY IF EXISTS "Allow public insert to missions" ON public.missions;

-- New RLS policies on missions
-- Public can INSERT (booking form)
CREATE POLICY "Anyone can create bookings"
ON public.missions FOR INSERT
WITH CHECK (true);

-- Only authenticated admins can SELECT
CREATE POLICY "Admins can view all missions"
ON public.missions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only authenticated admins can UPDATE
CREATE POLICY "Admins can update missions"
ON public.missions FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only authenticated admins can DELETE
CREATE POLICY "Admins can delete missions"
ON public.missions FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
