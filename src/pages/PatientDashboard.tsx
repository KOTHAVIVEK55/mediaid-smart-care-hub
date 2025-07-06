
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { AnalysisResult } from "@/utils/aiAnalysis";
import { getUserReports, MedicalReport } from "@/services/firebaseService";
import UploadSection from "@/components/dashboard/UploadSection";
import AIAnalysisSection from "@/components/dashboard/AIAnalysisSection";
import ReportHistory from "@/components/dashboard/ReportHistory";
import EmergencyModal from "@/components/emergency/EmergencyModal";

const PatientDashboard = () => {
  const { userProfile } = useAuth();
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [latestAnalysis, setLatestAnalysis] = useState<AnalysisResult | null>(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

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
    }
  };

  const handleUploadComplete = (analysis: AnalysisResult) => {
    setLatestAnalysis(analysis);
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

        {/* Emergency Alert Button - Only show for patients */}
        {userProfile?.role === 'patient' && (
          <div className="mb-8">
            <Button
              onClick={() => setEmergencyModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-lg"
              size="lg"
            >
              <AlertTriangle className="mr-2 h-5 w-5" />
              🚨 Trigger Emergency
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <UploadSection 
            userEmail={userProfile?.email || ''} 
            onUploadComplete={handleUploadComplete}
            onReportsReload={loadUserReports}
          />

          {/* AI Summary */}
          <AIAnalysisSection analysis={latestAnalysis} />
        </div>

        {/* Report History */}
        <div className="mt-8">
          <ReportHistory reports={reports} />
        </div>

        {/* Book Appointment CTA */}
        <div className="mt-8 text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl">
            <Calendar className="mr-2 h-5 w-5" />
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Emergency Modal */}
      <EmergencyModal 
        open={emergencyModalOpen} 
        onOpenChange={setEmergencyModalOpen} 
      />
    </div>
  );
};

export default PatientDashboard;
