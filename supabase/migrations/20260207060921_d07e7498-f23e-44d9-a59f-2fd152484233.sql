-- Create missions table for air ambulance bookings
CREATE TABLE public.missions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id TEXT NOT NULL UNIQUE,
  patient_name TEXT NOT NULL,
  patient_age INTEGER,
  patient_condition TEXT,
  aadhar_id TEXT,
  service_type TEXT NOT NULL,
  origin_city TEXT NOT NULL,
  origin_code TEXT NOT NULL,
  destination_city TEXT NOT NULL,
  destination_code TEXT NOT NULL,
  ambulance_pickup BOOLEAN DEFAULT false,
  ambulance_dropoff BOOLEAN DEFAULT false,
  quoted_price NUMERIC NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  mission_status TEXT DEFAULT 'payment_confirmed' CHECK (mission_status IN ('payment_confirmed', 'aircraft_prep', 'ambulance_enroute', 'airborne', 'landed', 'completed', 'cancelled')),
  status_step INTEGER DEFAULT 1,
  contact_phone TEXT,
  contact_email TEXT,
  medical_notes TEXT,
  flight_date DATE,
  passengers INTEGER DEFAULT 1,
  aircraft_model TEXT,
  operator_name TEXT,
  priority_level TEXT DEFAULT 'normal' CHECK (priority_level IN ('normal', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (for demo purposes - in production, restrict to admin/authenticated)
CREATE POLICY "Allow public read access to missions"
  ON public.missions
  FOR SELECT
  USING (true);

-- Create policy for public insert (for demo - in production, require authentication)
CREATE POLICY "Allow public insert to missions"
  ON public.missions
  FOR INSERT
  WITH CHECK (true);

-- Create policy for public update (for demo - in production, restrict to admin)
CREATE POLICY "Allow public update to missions"
  ON public.missions
  FOR UPDATE
  USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_missions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_missions_timestamp
  BEFORE UPDATE ON public.missions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_missions_updated_at();

-- Enable realtime for missions table
ALTER PUBLICATION supabase_realtime ADD TABLE public.missions;