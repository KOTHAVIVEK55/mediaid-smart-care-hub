
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { MedicalReport } from "@/services/firebaseService";

interface ReportHistoryProps {
  reports: MedicalReport[];
}

const ReportHistory = ({ reports }: ReportHistoryProps) => {
  return (
    <Card className="rounded-2xl shadow-sm">
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
  );
};

export default ReportHistory;
