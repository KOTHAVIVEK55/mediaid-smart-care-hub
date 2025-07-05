
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Calendar, Activity, AlertCircle, Brain } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { analyzeReport, AnalysisResult } from "@/utils/aiAnalysis";
import { uploadReport, getUserReports, MedicalReport } from "@/services/firebaseService";

const PatientDashboard = () => {
  const { userProfile } = useAuth();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [latestAnalysis, setLatestAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (userProfile) {
      loadUserReports();
    }
  }, [userProfile]);

  const loadUserReports = async () => {
    if (!userProfile) return;
    try {
      const userReports = await getUserReports(userProfile.email);
      setReports(userReports);
      if (userReports.length > 0) {
        setLatestAnalysis(userReports[0].aiSummary);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Failed to load your reports');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userProfile) return;

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size must be under 5MB");
      return;
    }

    setSelectedFile(file);
    toast.success(`File "${file.name}" selected successfully`);
  };

  const handleUpload = async () => {
    if (!selectedFile || !userProfile) return;

    setUploadProgress(0);
    setIsAnalyzing(true);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Analyze the report
      toast.info("Analyzing your medical report with AI...");
      const analysisResult = await analyzeReport(selectedFile);
      
      // Upload to Firebase
      await uploadReport(selectedFile, userProfile.email, analysisResult);
      
      setUploadProgress(100);
      setLatestAnalysis(analysisResult);
      
      // Reload reports
      await loadUserReports();
      
      toast.success("Medical report uploaded and analyzed successfully!");
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload and analyze report");
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    fileInput?.click();
  };

  const getVitalColor = (type: string) => {
    switch (type) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'elevated': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-orange-600 bg-orange-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hi {userProfile?.name || 'Guest'}, here's your health hub
          </h1>
          <p className="text-gray-600">Your personalized health dashboard</p>
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
                  Drag and drop your medical reports here, or click to browse
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports all file types: PDF, DOCX, TXT, JPG, PNG, CSV, etc.
                </p>
                
                {/* Hidden file input - accepts all file types */}
                <input
                  type="file"
                  accept="*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  disabled={isAnalyzing}
                />
                
                <Button 
                  onClick={triggerFileInput}
                  className="bg-blue-600 hover:bg-blue-700 mb-4" 
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? 'Processing...' : 'Browse Files'}
                </Button>

                {selectedFile && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                    <Button 
                      onClick={handleUpload}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isAnalyzing}
                    >
                      Upload Now
                    </Button>
                  </div>
                )}
              </div>
              
              {uploadProgress > 0 && (
                <div className="mt-4">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-gray-600 mt-2">
                    {isAnalyzing ? 'Analyzing with AI...' : `Uploading... ${uploadProgress}%`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Summary */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Health Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!latestAnalysis ? (
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Please upload your first medical report to get AI-powered health insights.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {/* Detected Diseases */}
                  {latestAnalysis.diseases.length > 0 && (
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <h4 className="font-semibold mb-2 text-purple-800">🔍 Detected Conditions</h4>
                      <div className="flex flex-wrap gap-2">
                        {latestAnalysis.diseases.map((disease, index) => (
                          <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                            {disease}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vitals */}
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(latestAnalysis.vitals).map(([key, value]) => {
                      const flag = latestAnalysis.flags.find(f => f.message.toLowerCase().includes(key.toLowerCase()));
                      const colorClass = flag ? getVitalColor(flag.type) : 'text-green-600 bg-green-50';
                      
                      return (
                        <div key={key} className={`p-4 rounded-xl ${colorClass}`}>
                          <p className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                          <p className="text-2xl font-bold">{value}</p>
                          <p className="text-xs capitalize">{flag?.type || 'Normal'}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Flags */}
                  {latestAnalysis.flags.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-xl">
                      <p className="text-sm text-red-700 font-medium">⚠️ Health Alerts</p>
                      {latestAnalysis.flags.map((flag, index) => (
                        <p key={index} className="text-sm text-red-600 mt-1">• {flag.message}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Report History */}
        <Card className="rounded-2xl shadow-sm mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Report History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{report.fileName}</p>
                      <p className="text-sm text-gray-600">
                        Uploaded {report.uploadedAt.toDate().toLocaleDateString()} • 
                        {report.aiSummary.diseases.length > 0 
                          ? ` Detected: ${report.aiSummary.diseases.join(', ')}` 
                          : ' No conditions detected'}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={report.fileURL} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No reports uploaded yet</p>
            )}
          </CardContent>
        </Card>

        {/* Book Appointment CTA */}
        <div className="mt-8 text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl">
            <Calendar className="mr-2 h-5 w-5" />
            Book Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
