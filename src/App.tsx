
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Emergency from "./pages/Emergency";
import Appointments from "./pages/Appointments";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import FirebaseBackendInfo from "./components/FirebaseBackendInfo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/login" element={<Login />} />
            <Route path="/backend" element={<FirebaseBackendInfo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
