
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Clock } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";

const Emergency = () => {
  const [wardNumber, setWardNumber] = useState("");
  const [patientId, setPatientId] = useState("");
  const [condition, setCondition] = useState("");

  const activeCases = [
    { id: 1, patient: "John Doe", room: "ICU-3", time: "5 mins ago", urgency: "critical", doctor: "unassigned" },
    { id: 2, patient: "Jane Smith", room: "Ward-7", time: "12 mins ago", urgency: "urgent", doctor: "Dr. Johnson" },
    { id: 3, patient: "Mike Wilson", room: "Ward-2", time: "25 mins ago", urgency: "moderate", doctor: "Dr. Brown" },
  ];

  const handleTriggerAlert = () => {
    if (!wardNumber || !patientId || !condition) {
      toast.error("All fields are required");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to notify emergency doctors?");
    if (confirmed) {
      toast.success("Emergency alert triggered successfully!");
      setWardNumber("");
      setPatientId("");
      setCondition("");
    }
  };

  const handleAssignDoctor = (caseId: number, doctor: string) => {
    toast.success(`Doctor assigned successfully to case #${caseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Access Notice */}
        <div className="mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
            <Shield className="h-5 w-5 text-yellow-600" />
            <p className="text-yellow-800 font-medium">
              This panel is restricted to authorized ward staff.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emergency Trigger Form */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Emergency Trigger Form
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ward Number *
                </label>
                <Select value={wardNumber} onValueChange={setWardNumber}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ward number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ICU-1">ICU-1</SelectItem>
                    <SelectItem value="ICU-2">ICU-2</SelectItem>
                    <SelectItem value="ICU-3">ICU-3</SelectItem>
                    <SelectItem value="Ward-1">Ward-1</SelectItem>
                    <SelectItem value="Ward-2">Ward-2</SelectItem>
                    <SelectItem value="Ward-3">Ward-3</SelectItem>
                    <SelectItem value="Ward-4">Ward-4</SelectItem>
                    <SelectItem value="Ward-5">Ward-5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient ID *
                </label>
                <Input
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="Enter patient ID (e.g., P001)"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition Summary *
                </label>
                <Textarea
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  placeholder="Describe the emergency condition..."
                  className="min-h-[100px] w-full"
                />
              </div>

              <Button 
                onClick={handleTriggerAlert}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
                size="lg"
              >
                <AlertTriangle className="mr-2 h-5 w-5" />
                Trigger Emergency Alert
              </Button>
            </CardContent>
          </Card>

          {/* Active Emergency Cases */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Active Emergency Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeCases.map((case_) => (
                  <div key={case_.id} className="p-4 bg-white border rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{case_.patient}</h3>
                        <p className="text-sm text-gray-600">{case_.room} • {case_.time}</p>
                      </div>
                      <Badge 
                        variant={
                          case_.urgency === 'critical' ? 'destructive' : 
                          case_.urgency === 'urgent' ? 'secondary' : 
                          'outline'
                        }
                      >
                        {case_.urgency.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Select 
                        defaultValue={case_.doctor}
                        onValueChange={(value) => handleAssignDoctor(case_.id, value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Assign doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          <SelectItem value="Dr. Johnson">Dr. Johnson</SelectItem>
                          <SelectItem value="Dr. Brown">Dr. Brown</SelectItem>
                          <SelectItem value="Dr. Wilson">Dr. Wilson</SelectItem>
                          <SelectItem value="Dr. Davis">Dr. Davis</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline">
                        Assign
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
