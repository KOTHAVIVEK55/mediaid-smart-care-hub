
-- Add reports table for disease predictions and file storage
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  disease TEXT[],
  vitals JSONB,
  suggested_meds TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add medications table for tablet reminders
CREATE TABLE public.medications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  medicine TEXT NOT NULL,
  dosage TEXT NOT NULL,
  times TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for new tables
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reports table
CREATE POLICY "Users can view their own reports" 
  ON public.reports 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports" 
  ON public.reports 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" 
  ON public.reports 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for medications table
CREATE POLICY "Patients can view their own medications" 
  ON public.medications 
  FOR SELECT 
  USING (auth.uid() = patient_id);

CREATE POLICY "Patients can insert their own medications" 
  ON public.medications 
  FOR INSERT 
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own medications" 
  ON public.medications 
  FOR UPDATE 
  USING (auth.uid() = patient_id);

CREATE POLICY "Patients can delete their own medications" 
  ON public.medications 
  FOR DELETE 
  USING (auth.uid() = patient_id);

-- Add policy to allow users to create their profile during signup
CREATE POLICY "Users can insert their own profile during signup" 
  ON public.users 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX idx_reports_user_id ON public.reports(user_id);
CREATE INDEX idx_medications_patient_id ON public.medications(patient_id);
CREATE INDEX idx_medications_times ON public.medications USING GIN(times);
