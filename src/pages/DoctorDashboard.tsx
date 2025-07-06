
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Eye, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import EmergencyAlerts from "@/components/emergency/EmergencyAlerts";
import { useAuth } from "@/contexts/AuthContext";

const DoctorDashboard = () => {
  const { userProfile } = useAuth();
  const [notes, setNotes] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const patients = [
    { id: 1, name: "John Doe", age: 45, reports: 3, lastVisit: "2024-01-15", condition: "Diabetes" },
    { id: 2, name: "Jane Smith", age: 32, reports: 2, lastVisit: "2024-01-14", condition: "Hypertension" },
    { id: 3, name: "Mike Johnson", age: 58, reports: 5, lastVisit: "2024-01-13", condition: "Asthma" },
    { id: 4, name: "Sarah Wilson", age: 28, reports: 1, lastVisit: "2024-01-12", condition: "Anemia" },
  ];

  const handleSaveNotes = () => {
    toast.success("Clinical notes saved successfully!");
    setNotes("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, Dr. {userProfile?.name}
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
                  Assigned Patients ({patients.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Stethoscope className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                            <p className="text-sm text-gray-600">Age: {patient.age} • Reports: {patient.reports}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{patient.condition}</Badge>
                          <span className="text-xs text-gray-500">Last visit: {patient.lastVisit}</span>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedPatient(patient)}
                            className="ml-4"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Report
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Medical Report - {patient.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Patient Info */}
                            <div className="bg-blue-50 p-4 rounded-xl">
                              <h4 className="font-semibold mb-2 text-blue-800">Patient Information</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>Name: {patient.name}</div>
                                <div>Age: {patient.age}</div>
                                <div>Condition: {patient.condition}</div>
                                <div>Last Visit: {patient.lastVisit}</div>
                              </div>
                            </div>

                            {/* Latest Report Preview */}
                            <div className="bg-gray-50 p-4 rounded-xl">
                              <h4 className="font-semibold mb-2">Latest Medical Report</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                {patient.condition === 'Diabetes' && (
                                  <>
                                    <div>Blood Glucose: <span className="text-red-600 font-semibold">210 mg/dL (High)</span></div>
                                    <div>HbA1c: <span className="text-red-600 font-semibold">8.2% (High)</span></div>
                                    <div>Blood Pressure: <span className="text-yellow-600 font-semibold">140/90 (Elevated)</span></div>
                                    <div>BMI: <span className="text-yellow-600 font-semibold">28.5 (Overweight)</span></div>
                                  </>
                                )}
                                {patient.condition === 'Hypertension' && (
                                  <>
                                    <div>Blood Pressure: <span className="text-red-600 font-semibold">160/100 (High)</span></div>
                                    <div>Cholesterol: <span className="text-yellow-600 font-semibold">220 mg/dL (Elevated)</span></div>
                                    <div>Heart Rate: <span className="text-green-600 font-semibold">75 BPM (Normal)</span></div>
                                    <div>BMI: <span className="text-green-600 font-semibold">24.1 (Normal)</span></div>
                                  </>
                                )}
                                {patient.condition === 'Asthma' && (
                                  <>
                                    <div>Peak Flow: <span className="text-yellow-600 font-semibold">350 L/min (Below normal)</span></div>
                                    <div>SpO2: <span className="text-green-600 font-semibold">98% (Normal)</span></div>
                                    <div>Heart Rate: <span className="text-green-600 font-semibold">82 BPM (Normal)</span></div>
                                    <div>Temperature: <span className="text-green-600 font-semibold">98.6°F (Normal)</span></div>
                                  </>
                                )}
                                {patient.condition === 'Anemia' && (
                                  <>
                                    <div>Hemoglobin: <span className="text-red-600 font-semibold">9.5 g/dL (Low)</span></div>
                                    <div>Iron: <span className="text-red-600 font-semibold">45 μg/dL (Low)</span></div>
                                    <div>Ferritin: <span className="text-yellow-600 font-semibold">25 ng/mL (Low)</span></div>
                                    <div>B12: <span className="text-green-600 font-semibold">350 pg/mL (Normal)</span></div>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* AI Analysis */}
                            <div className="bg-green-50 p-4 rounded-xl">
                              <h4 className="font-semibold mb-2 text-green-800">AI Health Analysis</h4>
                              <p className="text-sm text-green-700">
                                {patient.condition === 'Diabetes' && 'Patient shows poorly controlled diabetes with elevated glucose and HbA1c. Blood pressure is also elevated. Recommend medication adjustment, dietary counseling, and follow-up in 2 weeks.'}
                                {patient.condition === 'Hypertension' && 'Patient has uncontrolled hypertension with elevated cholesterol. Recommend medication optimization and lifestyle modifications. Schedule follow-up in 4 weeks.'}
                                {patient.condition === 'Asthma' && 'Patient shows mild asthma with reduced peak flow. Current symptoms appear stable. Continue current inhaler therapy and monitor symptoms.'}
                                {patient.condition === 'Anemia' && 'Patient has iron deficiency anemia. Recommend iron supplementation and dietary changes. Follow-up in 6 weeks to reassess hemoglobin levels.'}
                              </p>
                            </div>

                            {/* Suggested Medications */}
                            <div className="bg-blue-50 p-4 rounded-xl">
                              <h4 className="font-semibold mb-2 text-blue-800">Suggested Medications</h4>
                              <div className="flex flex-wrap gap-2">
                                {patient.condition === 'Diabetes' && ['Metformin', 'Glimepiride', 'Amlodipine'].map(med => (
                                  <Badge key={med} variant="secondary">{med}</Badge>
                                ))}
                                {patient.condition === 'Hypertension' && ['Amlodipine', 'Telmisartan', 'Atorvastatin'].map(med => (
                                  <Badge key={med} variant="secondary">{med}</Badge>
                                ))}
                                {patient.condition === 'Asthma' && ['Salbutamol', 'Budesonide', 'Montelukast'].map(med => (
                                  <Badge key={med} variant="secondary">{med}</Badge>
                                ))}
                                {patient.condition === 'Anemia' && ['Iron Sulphate', 'Folic Acid', 'Vitamin B12'].map(med => (
                                  <Badge key={med} variant="secondary">{med}</Badge>
                                ))}
                              </div>
                            </div>

                            {/* Doctor Notes */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FileText className="inline h-4 w-4 mr-1" />
                                Clinical Notes & Recommendations
                              </label>
                              <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Enter your clinical assessment, treatment plan, and recommendations..."
                                className="min-h-[120px]"
                              />
                              <Button 
                                onClick={handleSaveNotes}
                                className="mt-3 bg-blue-600 hover:bg-blue-700"
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Save Clinical Notes
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

          {/* Emergency Alerts Section */}
          <div>
            <EmergencyAlerts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
