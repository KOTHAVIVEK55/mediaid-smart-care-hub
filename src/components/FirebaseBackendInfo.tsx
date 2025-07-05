
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Cloud, Users, FileText, Calendar, AlertTriangle } from "lucide-react";

const FirebaseBackendInfo = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6 text-blue-600" />
            Firebase Backend Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Firebase Services */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Cloud className="h-5 w-5 text-green-600" />
              Active Firebase Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-xl">
                <h4 className="font-medium text-green-800">Authentication</h4>
                <p className="text-sm text-green-600">Email/Password login</p>
                <Badge variant="secondary" className="mt-2">Active</Badge>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <h4 className="font-medium text-blue-800">Firestore Database</h4>
                <p className="text-sm text-blue-600">Real-time data storage</p>
                <Badge variant="secondary" className="mt-2">Active</Badge>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <h4 className="font-medium text-purple-800">Storage</h4>
                <p className="text-sm text-purple-600">File uploads & storage</p>
                <Badge variant="secondary" className="mt-2">Active</Badge>
              </div>
            </div>
          </div>

          {/* Firestore Collections */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Firestore Collections Schema
            </h3>
            <div className="space-y-4">
              {/* Users Collection */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <h4 className="font-medium">users</h4>
                  <Badge variant="outline">Collection</Badge>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                  <div className="text-gray-700">
                    {`{`}<br />
                    &nbsp;&nbsp;<span className="text-blue-600">id</span>: <span className="text-green-600">string</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">name</span>: <span className="text-green-600">string</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">email</span>: <span className="text-green-600">string</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">role</span>: <span className="text-green-600">'patient' | 'doctor' | 'staff'</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">createdAt</span>: <span className="text-green-600">Timestamp</span><br />
                    {`}`}
                  </div>
                </div>
              </div>

              {/* Reports Collection */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <h4 className="font-medium">reports</h4>
                  <Badge variant="outline">Collection</Badge>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                  <div className="text-gray-700">
                    {`{`}<br />
                    &nbsp;&nbsp;<span className="text-blue-600">id</span>: <span className="text-green-600">string</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">userId</span>: <span className="text-green-600">string</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">fileName</span>: <span className="text-green-600">string</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">fileURL</span>: <span className="text-green-600">string</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">aiSummary</span>: <span className="text-green-600">AnalysisResult</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">uploadedAt</span>: <span className="text-green-600">Timestamp</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">doctorNotes</span>: <span className="text-green-600">string</span><br />
                    {`}`}
                  </div>
                </div>
              </div>

              {/* Appointments Collection */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <h4 className="font-medium">appointments</h4>
                  <Badge variant="outline">Collection</Badge>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                  <div className="text-gray-700">
                    {`{`}<br />
                    &nbsp;&nbsp;<span className="text-blue-600">id</span>: <span className="text-green-600">string</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">userId</span>: <span className="text-green-600">string</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">doctorId</span>: <span className="text-green-600">string</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">department</span>: <span className="text-green-600">string</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">date</span>: <span className="text-green-600">string</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">time</span>: <span className="text-green-600">string</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">status</span>: <span className="text-green-600">'pending' | 'confirmed' | 'completed' | 'cancelled'</span><br />
                    {`}`}
                  </div>
                </div>
              </div>

              {/* Emergencies Collection */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <h4 className="font-medium">emergencies</h4>
                  <Badge variant="outline">Collection</Badge>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                  <div className="text-gray-700">
                    {`{`}<br />
                    &nbsp;&nbsp;<span className="text-blue-600">id</span>: <span className="text-green-600">string</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">ward</span>: <span className="text-green-600">string</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">patientId</span>: <span className="text-green-600">string</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">condition</span>: <span className="text-green-600">string</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">timestamp</span>: <span className="text-green-600">Timestamp</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">status</span>: <span className="text-green-600">'active' | 'acknowledged' | 'resolved'</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-600">acknowledgedBy</span>: <span className="text-green-600">string</span><br />
                    {`}`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Firebase Storage Structure */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Cloud className="h-5 w-5 text-purple-600" />
              Firebase Storage Structure
            </h3>
            <div className="bg-gray-50 p-4 rounded-xl font-mono text-sm">
              <div className="text-gray-700">
                📁 <span className="text-blue-600">reports/</span><br />
                &nbsp;&nbsp;📁 <span className="text-blue-600">&lt;user_email&gt;/</span><br />
                &nbsp;&nbsp;&nbsp;&nbsp;📄 <span className="text-green-600">timestamp_filename.pdf</span><br />
                &nbsp;&nbsp;&nbsp;&nbsp;📄 <span className="text-green-600">timestamp_filename.jpg</span><br />
                &nbsp;&nbsp;&nbsp;&nbsp;📄 <span className="text-green-600">timestamp_filename.docx</span><br />
              </div>
            </div>
          </div>

          {/* Firebase Console Link */}
          <div className="bg-blue-50 p-4 rounded-xl">
            <h4 className="font-medium text-blue-800 mb-2">Firebase Console Access</h4>
            <p className="text-sm text-blue-600 mb-3">
              View and manage your Firebase project data, authentication, and storage.
            </p>
            <a 
              href="https://console.firebase.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Database className="h-4 w-4" />
              Open Firebase Console
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirebaseBackendInfo;
