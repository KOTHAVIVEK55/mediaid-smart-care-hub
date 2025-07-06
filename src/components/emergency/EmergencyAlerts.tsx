
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Emergency {
  id: string;
  patient_id: string;
  condition: string;
  status: string;
  created_at: string;
  patient_name?: string;
}

const EmergencyAlerts = () => {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();

  const fetchEmergencies = async () => {
    if (!userProfile || userProfile.role !== 'doctor') return;

    try {
      // Fetch emergencies assigned to this doctor or unassigned ones
      const { data, error } = await supabase
        .from('emergencies')
        .select(`
          id,
          patient_id,
          condition,
          status,
          created_at,
          users!emergencies_patient_id_fkey(name)
        `)
        .or(`doctor_id.eq.${userProfile.id},doctor_id.is.null`)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map(item => ({
        id: item.id,
        patient_id: item.patient_id,
        condition: item.condition,
        status: item.status,
        created_at: item.created_at,
        patient_name: (item.users as any)?.name || 'Unknown Patient'
      })) || [];

      setEmergencies(formattedData);
    } catch (error) {
      console.error('Error fetching emergencies:', error);
      toast.error("Failed to load emergency alerts");
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (emergencyId: string) => {
    if (!userProfile) return;

    try {
      const { error } = await supabase
        .from('emergencies')
        .update({
          status: 'acknowledged',
          doctor_id: userProfile.id
        })
        .eq('id', emergencyId);

      if (error) throw error;

      toast.success("Emergency acknowledged successfully!");
      
      // Reload page after 2 seconds as requested
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error acknowledging emergency:', error);
      toast.error("Failed to acknowledge emergency");
    }
  };

  const formatTimeElapsed = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
    fetchEmergencies();
  }, [userProfile]);

  if (userProfile?.role !== 'doctor') {
    return null;
  }

  if (loading) {
    return (
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Emergency Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading alerts...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          Emergency Alerts
          {emergencies.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {emergencies.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {emergencies.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No pending emergency alerts</p>
          </div>
        ) : (
          <div className="space-y-4">
            {emergencies.map((emergency) => (
              <div key={emergency.id} className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-800">
                      {emergency.patient_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <Clock className="h-4 w-4" />
                    {formatTimeElapsed(emergency.created_at)}
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium text-red-800 mb-1">Condition:</p>
                  <p className="text-sm text-red-700 bg-white p-3 rounded-lg border">
                    {emergency.condition}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="destructive">
                    {emergency.status.toUpperCase()}
                  </Badge>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleAcknowledge(emergency.id)}
                  >
                    Acknowledge
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyAlerts;
