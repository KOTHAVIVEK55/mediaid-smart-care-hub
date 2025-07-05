
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, AlertTriangle, Eye } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";

const DoctorDashboard = () => {
  const [doctorName] = useState("Dr. Smith");
  const [notes, setNotes] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const patients = [
    { id: 1, name: "John Doe", age: 45, reports: 3, lastVisit: "2024-01-15" },
    { id: 2, name: "Jane Smith", age: 32, reports: 2, lastVisit: "2024-01-14" },
    { id: 3, name: "Mike Johnson", age: 58, reports: 5, lastVisit: "2024-01-13" },
  ];

  const emergencyAlerts = [
    { id: 1, patientId: "P001", ward: "ICU-3", time: "2 mins ago", status: "critical" },
    { id: 2, patientId: "P047", ward: "Ward-7", time: "15 mins ago", status: "urgent" },
  ];

  const handleSaveNotes = () => {
    toast.success("Notes saved successfully!");
    setNotes("");
  };

  const handleAcknowledgeAlert = (alertId: number) => {
    toast.success("Emergency alert acknowledged");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome {doctorName}
          </h1>
          <p className="text-gray-600">Manage your patients and review medical reports</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assigned Patients */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Assigned Patients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                        <p className="text-sm text-gray-600">Age: {patient.age} • Reports: {patient.reports}</p>
                        <p className="text-xs text-gray-500">Last visit: {patient.lastVisit}</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedPatient(patient)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Report
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Medical Report - {patient.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Report Preview */}
                            <div className="bg-gray-50 p-4 rounded-xl">
                              <h4 className="font-semibold mb-2">Latest Blood Test Results</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>BP: 140/90 <span className="text-yellow-600">(Elevated)</span></div>
                                <div>Glucose: 210 mg/dL <span className="text-red-600">(High)</span></div>
                                <div>Cholesterol: 180 mg/dL <span className="text-green-600">(Normal)</span></div>
                                <div>Hemoglobin: 12.5 g/dL <span className="text-green-600">(Normal)</span></div>
                              </div>
                            </div>

                            {/* AI Summary */}
                            <div className="bg-blue-50 p-4 rounded-xl">
                              <h4 className="font-semibold mb-2 text-blue-800">AI Health Summary</h4>
                              <p className="text-sm text-blue-700">
                                Patient shows elevated blood pressure and glucose levels. Recommend dietary modifications and follow-up in 2 weeks. Consider diabetes screening.
                              </p>
                            </div>

                            {/* Doctor Notes */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Add Doctor Comments
                              </label>
                              <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Enter your clinical notes and recommendations..."
                                className="min-h-[100px]"
                              />
                              <Button 
                                onClick={handleSaveNotes}
                                className="mt-3 bg-blue-600 hover:bg-blue-700"
                              >
                                Save Notes
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Alerts */}
          <div>
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Emergency Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emergencyAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <Badge variant={alert.status === 'critical' ? 'destructive' : 'secondary'}>
                            {alert.status.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-xs text-red-600">{alert.time}</span>
                      </div>
                      <p className="text-sm font-medium text-red-800">Patient ID: {alert.patientId}</p>
                      <p className="text-sm text-red-700">Ward: {alert.ward}</p>
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => handleAcknowledgeAlert(alert.id)}
                        >
                          Acknowledge
                        </Button>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          View Details
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
    </div>
  );
};

export default DoctorDashboard;
