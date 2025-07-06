
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface MedicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MedicationModal = ({ open, onOpenChange }: MedicationModalProps) => {
  const [medicine, setMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [times, setTimes] = useState<string[]>([]);
  const [newTime, setNewTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userProfile } = useAuth();

  const addTime = () => {
    if (newTime && !times.includes(newTime)) {
      setTimes([...times, newTime]);
      setNewTime("");
    }
  };

  const removeTime = (timeToRemove: string) => {
    setTimes(times.filter(time => time !== timeToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!medicine.trim()) {
      toast.error("Please enter medicine name");
      return;
    }
    
    if (!dosage.trim()) {
      toast.error("Please enter dosage");
      return;
    }
    
    if (times.length === 0) {
      toast.error("Please add at least one time");
      return;
    }

    if (!userProfile) {
      toast.error("User not authenticated");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('medications')
        .insert({
          patient_id: userProfile.id,
          medicine: medicine.trim(),
          dosage: dosage.trim(),
          times: times,
          status: 'active'
        });

      if (error) throw error;

      toast.success("Medication reminder set successfully!");
      
      // Reset form
      setMedicine("");
      setDosage("");
      setTimes([]);
      setNewTime("");
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error setting medication reminder:', error);
      toast.error("Failed to set medication reminder");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setMedicine("");
    setDosage("");
    setTimes([]);
    setNewTime("");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <Clock className="h-5 w-5" />
            Set Medication Reminder
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="medicine" className="text-sm font-medium">
              Medicine Name *
            </Label>
            <Input
              id="medicine"
              value={medicine}
              onChange={(e) => setMedicine(e.target.value)}
              placeholder="e.g., Paracetamol"
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="dosage" className="text-sm font-medium">
              Dosage *
            </Label>
            <Input
              id="dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g., 500mg, 1 tablet"
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium">
              Reminder Times *
            </Label>
            <div className="mt-1 space-y-2">
              <div className="flex gap-2">
                <Input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addTime}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {times.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {times.map((time, idx) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                      {time}
                      <button
                        type="button"
                        onClick={() => removeTime(time)}
                        className="ml-1 hover:bg-gray-300 rounded"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Setting...' : 'Set Reminder'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationModal;
