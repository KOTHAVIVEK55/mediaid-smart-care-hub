
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, AlertCircle } from "lucide-react";
import { AnalysisResult } from "@/utils/aiAnalysis";

interface AIAnalysisSectionProps {
  analysis: AnalysisResult | null;
}

const AIAnalysisSection = ({ analysis }: AIAnalysisSectionProps) => {
  const getVitalColor = (type: string) => {
    switch (type) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'elevated': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-orange-600 bg-orange-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Health Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!analysis ? (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Please upload your first medical report to get AI-powered health insights.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {/* Detected Diseases */}
            {analysis.diseases.length > 0 && (
              <div className="bg-purple-50 p-4 rounded-xl">
                <h4 className="font-semibold mb-2 text-purple-800">🔍 Detected Conditions</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.diseases.map((disease, index) => (
                    <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      {disease}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Vitals */}
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(analysis.vitals).map(([key, value]) => {
                const flag = analysis.flags.find(f => f.message.toLowerCase().includes(key.toLowerCase()));
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
            {analysis.flags.length > 0 && (
              <div className="bg-red-50 p-4 rounded-xl">
                <p className="text-sm text-red-700 font-medium">⚠️ Health Alerts</p>
                {analysis.flags.map((flag, index) => (
                  <p key={index} className="text-sm text-red-600 mt-1">• {flag.message}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAnalysisSection;
