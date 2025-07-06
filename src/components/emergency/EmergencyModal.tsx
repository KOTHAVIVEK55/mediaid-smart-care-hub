
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface EmergencyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmergencyModal = ({ open, onOpenChange }: EmergencyModalProps) => {
  const [condition, setCondition] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!condition.trim()) {
      toast.error("Please describe your emergency condition");
      return;
    }

    if (!userProfile) {
      toast.error("User not authenticated");
      return;
    }

    setIsSubmitting(true);

    try {
      // For now, we'll insert without a specific doctor (doctor_id will be null)
      // In a real application, you'd have a system to assign doctors to patients
      const { error } = await supabase
        .from('emergencies')
        .insert({
          patient_id: userProfile.id,
          doctor_id: null, // This would be assigned based on your doctor assignment logic
          condition: condition.trim(),
          status: 'pending'
        });

      if (error) throw error;

      toast.success("Emergency alert sent successfully!");
      setCondition("");
      onOpenChange(false);
      
      // Reload page after 2 seconds as requested
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error sending emergency alert:', error);
      toast.error("Failed to send emergency alert. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Emergency Alert
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="condition" className="text-sm font-medium">
              Describe your emergency condition *
            </Label>
            <Textarea
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="Please describe your symptoms, pain level, or emergency situation..."
              className="mt-1 min-h-[100px]"
              required
            />
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
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Alert'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyModal;
