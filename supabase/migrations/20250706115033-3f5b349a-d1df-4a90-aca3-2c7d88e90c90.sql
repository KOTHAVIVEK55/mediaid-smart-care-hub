
-- Create users table for authentication and role management
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('patient', 'doctor', 'staff')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create emergencies table for emergency alerts
CREATE TABLE public.emergencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  condition TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergencies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- RLS Policies for emergencies table
CREATE POLICY "Patients can insert their own emergencies" 
  ON public.emergencies 
  FOR INSERT 
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can view their own emergencies" 
  ON public.emergencies 
  FOR SELECT 
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view emergencies assigned to them" 
  ON public.emergencies 
  FOR SELECT 
  USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update emergencies assigned to them" 
  ON public.emergencies 
  FOR UPDATE 
  USING (auth.uid() = doctor_id);

-- Create an index for better performance
CREATE INDEX idx_emergencies_doctor_status ON public.emergencies(doctor_id, status);
CREATE INDEX idx_emergencies_patient ON public.emergencies(patient_id);
