
export interface AnalysisResult {
  diseases: string[];
  vitals: {
    bloodPressure?: string;
    glucose?: string;
    cholesterol?: string;
    hemoglobin?: string;
    heartRate?: string;
    temperature?: string;
  };
  flags: {
    type: 'normal' | 'elevated' | 'high' | 'low';
    message: string;
  }[];
}

export const analyzeReport = async (file: File): Promise<AnalysisResult> => {
  // Simulate AI analysis delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock OCR and disease detection based on filename or file type
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  
  console.log(`Analyzing file: ${fileName} (${fileType})`);
  
  const mockResults: AnalysisResult = {
    diseases: [],
    vitals: {},
    flags: []
  };

  // Simulate different analysis based on file type
  if (fileType.includes('pdf') || fileName.includes('report') || fileName.includes('lab')) {
    // Comprehensive medical report analysis
    const random = Math.random();
    
    if (fileName.includes('diabetes') || fileName.includes('glucose') || random > 0.7) {
      mockResults.diseases.push('Diabetes Type 2');
      mockResults.vitals.glucose = '210 mg/dL';
      mockResults.flags.push({
        type: 'high',
        message: 'Elevated glucose levels detected. Immediate medical consultation recommended.'
      });
    }

    if (fileName.includes('pressure') || fileName.includes('cardio') || fileName.includes('heart')) {
      mockResults.diseases.push('Hypertension');
      mockResults.vitals.bloodPressure = '145/95';
      mockResults.vitals.heartRate = '88 bpm';
      mockResults.flags.push({
        type: 'elevated',
        message: 'Blood pressure is elevated. Regular monitoring advised.'
      });
    }

    if (fileName.includes('anemia') || fileName.includes('blood') || random > 0.6) {
      mockResults.diseases.push('Iron Deficiency Anemia');
      mockResults.vitals.hemoglobin = '9.2 g/dL';
      mockResults.flags.push({
        type: 'low',
        message: 'Hemoglobin levels are significantly low. Iron supplementation needed.'
      });
    }

    if (fileName.includes('cholesterol') || fileName.includes('lipid')) {
      mockResults.vitals.cholesterol = '245 mg/dL';
      mockResults.flags.push({
        type: 'high',
        message: 'Cholesterol levels are high. Dietary changes recommended.'
      });
    }
  } else if (fileType.includes('image') || fileName.includes('xray') || fileName.includes('scan')) {
    // Image analysis (X-ray, scan, etc.)
    mockResults.diseases.push('Possible Pneumonia');
    mockResults.flags.push({
      type: 'elevated',
      message: 'Chest X-ray shows suspicious opacity. Further evaluation needed.'
    });
  } else if (fileName.includes('text') || fileName.includes('note')) {
    // Text file analysis
    mockResults.diseases.push('Follow-up Required');
    mockResults.flags.push({
      type: 'normal',
      message: 'Clinical notes reviewed. Regular follow-up recommended.'
    });
  }

  // Add baseline vitals if none detected
  if (Object.keys(mockResults.vitals).length === 0) {
    mockResults.vitals.bloodPressure = '120/80';
    mockResults.vitals.heartRate = '72 bpm';
    mockResults.vitals.temperature = '98.6°F';
  }

  // Add some standard vitals
  if (!mockResults.vitals.cholesterol) {
    mockResults.vitals.cholesterol = '185 mg/dL';
  }
  if (!mockResults.vitals.hemoglobin) {
    mockResults.vitals.hemoglobin = '13.2 g/dL';
  }

  // Add general health recommendation if no specific issues
  if (mockResults.diseases.length === 0 && mockResults.flags.length === 0) {
    mockResults.diseases.push('No Immediate Concerns');
    mockResults.flags.push({
      type: 'normal',
      message: 'All analyzed parameters appear to be within normal ranges.'
    });
  }

  return mockResults;
};
