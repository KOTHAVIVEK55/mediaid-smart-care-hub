
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, AlertTriangle, Activity, Pill, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Header from "@/components/Header";
import EmergencyModal from "@/components/emergency/EmergencyModal";
import MedicationModal from "@/components/medications/MedicationModal";
import { analyzeMedicalReport, getUserReports, PredictionResult } from "@/services/diseasePrediction";

interface Report {
  id: string;
  file_name: string;
  disease: string[];
  vitals: Record<string, string>;
  suggested_meds: string[];
  created_at: string;
}

const PatientDashboard = () => {
  const { userProfile } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [latestPrediction, setLatestPrediction] = useState<PredictionResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [medicationModalOpen, setMedicationModalOpen] = useState(false);

  useEffect(() => {
    if (userProfile) {
      loadReports();
    }
  }, [userProfile]);

  const loadReports = async () => {
    if (!userProfile) return;
    
    try {
      const data = await getUserReports(userProfile.id);
      setReports(data || []);
      
      if (data && data.length > 0) {
        const latest = data[0];
        setLatestPrediction({
          diseases: latest.disease || [],
          vitals: latest.vitals || {},
          suggestedMeds: latest.suggested_meds || [],
          confidence: 0.8
        });
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Failed to load reports');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userProfile) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }

    setUploadProgress(0);
    setIsAnalyzing(true);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const prediction = await analyzeMedicalReport(file, userProfile.id);
      
      setUploadProgress(100);
      setLatestPrediction(prediction);
      
      toast.success('Medical report analyzed successfully!');
      await loadReports();
      
      // Reset input
      e.target.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to analyze report');
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userProfile?.name}!
          </h1>
          <p className="text-gray-600">Your health dashboard and AI-powered medical analysis</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setEmergencyModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white"
            size="lg"
          >
            <AlertTriangle className="mr-2 h-5 w-5" />
            🚨 Emergency Alert
          </Button>
          
          <Button
            onClick={() => setMedicationModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            <Clock className="mr-2 h-5 w-5" />
            Set Medication Reminder
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                Upload Medical Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Upload your medical reports for AI analysis
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports PDF, images (JPG, PNG), and text files
                </p>
                
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={isAnalyzing}
                />
                
                <Button 
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Choose File'}
                </Button>
              </div>
              
              {uploadProgress > 0 && (
                <div className="mt-4">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-gray-600 mt-2">
                    {isAnalyzing ? 'Analyzing with AI...' : `Upload complete: ${uploadProgress}%`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Analysis Results */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                AI Health Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {latestPrediction ? (
                <div className="space-y-4">
                  {/* Detected Diseases */}
                  <div>
                    <h4 className="font-semibold mb-2">Detected Conditions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {latestPrediction.diseases.map((disease, idx) => (
                        <Badge key={idx} variant="destructive">
                          {disease}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Vital Signs */}
                  {Object.keys(latestPrediction.vitals).length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Vital Signs:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(latestPrediction.vitals).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600">{key}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Medications */}
                  {latestPrediction.suggestedMeds.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Suggested Medications:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {latestPrediction.suggestedMeds.map((med, idx) => (
                          <Badge key={idx} variant="secondary">
                            {med}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Upload a medical report to see AI analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Report History */}
        {reports.length > 0 && (
          <Card className="mt-8 rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Report History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{report.file_name}</h4>
                      <span className="text-sm text-gray-500">
                        {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {report.disease && report.disease.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-600">Conditions: </span>
                        {report.disease.map((disease, idx) => (
                          <Badge key={idx} variant="outline" className="mr-1">
                            {disease}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {report.suggested_meds && report.suggested_meds.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600">Medications: </span>
                        {report.suggested_meds.slice(0, 3).map((med, idx) => (
                          <Badge key={idx} variant="secondary" className="mr-1">
                            {med}
                          </Badge>
                        ))}
                        {report.suggested_meds.length > 3 && (
                          <span className="text-sm text-gray-500">
                            +{report.suggested_meds.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      <EmergencyModal 
        open={emergencyModalOpen} 
        onOpenChange={setEmergencyModalOpen} 
      />
      
      <MedicationModal 
        open={medicationModalOpen} 
        onOpenChange={setMedicationModalOpen} 
      />
    </div>
  );
};

export default PatientDashboard;
