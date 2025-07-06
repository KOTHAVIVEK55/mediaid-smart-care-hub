
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Medication {
  id: string;
  medicine: string;
  dosage: string;
  times: string[];
  status: string;
}

export const useMedicationReminders = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const { userProfile } = useAuth();

  // Load user medications
  useEffect(() => {
    if (userProfile) {
      loadMedications();
    }
  }, [userProfile]);

  // Set up medication reminder intervals
  useEffect(() => {
    if (medications.length === 0) return;

    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
      
      medications.forEach(medication => {
        if (medication.status === 'active' && medication.times.includes(currentTime)) {
          toast.success(
            `💊 Time to take your medication!`,
            {
              description: `${medication.medicine} - ${medication.dosage}`,
              duration: 10000,
              action: {
                label: "Mark as Taken",
                onClick: () => markAsTaken(medication.id)
              }
            }
          );
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [medications]);

  const loadMedications = async () => {
    if (!userProfile) return;

    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('patient_id', userProfile.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedications(data || []);
    } catch (error) {
      console.error('Error loading medications:', error);
    }
  };

  const markAsTaken = async (medicationId: string) => {
    try {
      // In a real app, you might want to log when medication was taken
      // For now, we'll just show a success message
      toast.success("Medication marked as taken!");
    } catch (error) {
      console.error('Error marking medication as taken:', error);
      toast.error("Failed to mark medication as taken");
    }
  };

  return {
    medications,
    loadMedications,
    markAsTaken
  };
};
