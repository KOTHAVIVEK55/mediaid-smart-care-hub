
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Calendar, Activity, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";

const PatientDashboard = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasReports, setHasReports] = useState(false);
  const [userName] = useState("John Doe");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload only PDF or JPG files");
      return;
    }

    if (file.size > maxSize) {
      toast.error("File size must be under 5MB");
      return;
    }

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setHasReports(true);
          toast.success("Medical report uploaded successfully!");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hi {userName}, ready to manage your health?
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
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                    Upload Now
                  </Button>
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  PDF or JPG files only, max 5MB
                </p>
              </div>
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-gray-600 mt-2">Uploading... {uploadProgress}%</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Summary or No Reports Alert */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                AI Health Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!hasReports ? (
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    No medical reports found. Please book your first appointment or upload a medical report to get started.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-xl">
                      <p className="text-sm text-green-700 font-medium">Blood Pressure</p>
                      <p className="text-2xl font-bold text-green-800">120/80</p>
                      <p className="text-xs text-green-600">Normal</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl">
                      <p className="text-sm text-yellow-700 font-medium">Glucose</p>
                      <p className="text-2xl font-bold text-yellow-800">210 mg/dL</p>
                      <p className="text-xs text-yellow-600">High</p>
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-xl">
                    <p className="text-sm text-red-700 font-medium">⚠️ Flagged Values</p>
                    <p className="text-sm text-red-600">Elevated glucose levels detected. Consult your doctor.</p>
                  </div>
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
            {hasReports ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Blood Test Report</p>
                    <p className="text-sm text-gray-600">Uploaded today • Dr. Smith reviewed</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
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
