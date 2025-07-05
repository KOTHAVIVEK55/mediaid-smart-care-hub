
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { analyzeReport, AnalysisResult } from "@/utils/aiAnalysis";
import { uploadReport } from "@/services/firebaseService";

interface UploadSectionProps {
  userEmail: string;
  onUploadComplete: (analysis: AnalysisResult) => void;
  onReportsReload: () => void;
}

const UploadSection = ({ userEmail, onUploadComplete, onReportsReload }: UploadSectionProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
    if (!selectedFile) return;

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
      await uploadReport(selectedFile, userEmail, analysisResult);
      
      setUploadProgress(100);
      onUploadComplete(analysisResult);
      
      // Reload reports
      await onReportsReload();
      
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

  return (
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
  );
};

export default UploadSection;
