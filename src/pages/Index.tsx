
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Brain, AlertTriangle, Pill, Clock, Users, FileText, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">MediAid</h1>
              <Badge variant="secondary">Smart Hospital System</Badge>
            </div>
            <Link to="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Login / Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Smart Healthcare with AI-Powered 
            <span className="text-blue-600"> Medical Analysis</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Revolutionary hospital management system with AI disease prediction, emergency alerts, 
            medication reminders, and comprehensive patient care.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                Get Started
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Complete Healthcare Solution</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Advanced features designed for patients, doctors, and hospital staff
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Disease Prediction */}
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">AI Disease Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Upload medical reports and get instant AI-powered analysis with disease detection and vital signs extraction.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">OCR Processing</Badge>
                  <Badge variant="outline">Pattern Recognition</Badge>
                  <Badge variant="outline">Vital Signs</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Emergency System */}
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-xl">Emergency Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Real-time emergency notification system connecting patients directly to available doctors.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Instant Alerts</Badge>
                  <Badge variant="outline">Doctor Assignment</Badge>
                  <Badge variant="outline">Status Tracking</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Medication Reminders */}
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Smart Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Intelligent medication reminders with customizable schedules and dosage tracking.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Timely Notifications</Badge>
                  <Badge variant="outline">Multiple Schedules</Badge>
                  <Badge variant="outline">Dosage Tracking</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Tablet Suggestions */}
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Pill className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Medicine Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  AI-powered medication suggestions based on detected conditions and medical history.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Condition-Based</Badge>
                  <Badge variant="outline">Drug Database</Badge>
                  <Badge variant="outline">Interaction Checks</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Patient Management */}
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Patient Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Comprehensive patient records, appointment scheduling, and treatment history tracking.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Medical Records</Badge>
                  <Badge variant="outline">Appointments</Badge>
                  <Badge variant="outline">History Tracking</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Secure Platform */}
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-gray-600" />
                </div>
                <CardTitle className="text-xl">Secure & Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  HIPAA-compliant platform with role-based access control and encrypted data storage.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">HIPAA Compliant</Badge>
                  <Badge variant="outline">Encrypted Storage</Badge>
                  <Badge variant="outline">Role-Based Access</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Built for Everyone</h3>
            <p className="text-gray-600">Tailored dashboards for different healthcare roles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center rounded-2xl shadow-sm">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-blue-600">Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left text-gray-600 space-y-2">
                  <li>• Upload medical reports</li>
                  <li>• Get AI health analysis</li>
                  <li>• Set medication reminders</li>
                  <li>• Trigger emergency alerts</li>
                  <li>• View suggested medications</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center rounded-2xl shadow-sm">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-600">Doctors</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left text-gray-600 space-y-2">
                  <li>• Review patient reports</li>
                  <li>• Receive emergency alerts</li>
                  <li>• Add clinical notes</li>
                  <li>• Monitor patient progress</li>
                  <li>• Manage appointments</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center rounded-2xl shadow-sm">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl text-purple-600">Staff</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left text-gray-600 space-y-2">
                  <li>• Monitor emergency cases</li>
                  <li>• Assign doctors to patients</li>
                  <li>• Manage hospital operations</li>
                  <li>• Track system performance</li>
                  <li>• Generate reports</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Healthcare?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of healthcare professionals using MediAid for better patient care.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-6 w-6" />
              <span className="font-bold">MediAid</span>
            </div>
            <p className="text-gray-400">© 2024 MediAid. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
