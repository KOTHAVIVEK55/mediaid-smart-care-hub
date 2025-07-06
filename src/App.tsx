
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useMedicationReminders } from "@/hooks/useMedicationReminders";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Emergency from "./pages/Emergency";
import Appointments from "./pages/Appointments";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import FirebaseBackendInfo from "./components/FirebaseBackendInfo";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userProfile) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(userProfile.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// App Content with Auth Context
const AppContent = () => {
  const { userProfile } = useAuth();
  
  // Initialize medication reminders for patients
  useMedicationReminders();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={userProfile ? <Navigate to={`/dashboard/${userProfile.role}`} replace /> : <Index />} />
        <Route path="/auth" element={userProfile ? <Navigate to={`/dashboard/${userProfile.role}`} replace /> : <Auth />} />
        
        {/* Dashboard Routes */}
        <Route 
          path="/dashboard/patient" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/doctor" 
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/staff" 
          element={
            <ProtectedRoute allowedRoles={['staff']}>
              <Emergency />
            </ProtectedRoute>
          } 
        />
        
        {/* Legacy Routes */}
        <Route path="/patient-dashboard" element={<Navigate to="/dashboard/patient" replace />} />
        <Route path="/doctor-dashboard" element={<Navigate to="/dashboard/doctor" replace />} />
        <Route path="/emergency" element={<Navigate to="/dashboard/staff" replace />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/backend" element={<FirebaseBackendInfo />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
