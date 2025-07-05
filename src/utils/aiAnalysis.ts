
export interface AnalysisResult {
  diseases: string[];
  vitals: {
    bloodPressure?: string;
    glucose?: string;
    cholesterol?: string;
    hemoglobin?: string;
  };
  flags: {
    type: 'normal' | 'elevated' | 'high' | 'low';
    message: string;
  }[];
}

export const analyzeReport = async (file: File): Promise<AnalysisResult> => {
  // Simulate AI analysis delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock OCR and disease detection based on filename or random simulation
  const fileName = file.name.toLowerCase();
  const mockResults: AnalysisResult = {
    diseases: [],
    vitals: {},
    flags: []
  };

  // Simulate disease detection based on file name patterns
  if (fileName.includes('diabetes') || fileName.includes('blood')) {
    mockResults.diseases.push('Diabetes Type 2');
    mockResults.vitals.glucose = '210 mg/dL';
    mockResults.flags.push({
      type: 'high',
      message: 'Elevated glucose levels detected. Consult your doctor.'
    });
  }

  if (fileName.includes('pressure') || fileName.includes('cardio')) {
    mockResults.diseases.push('Hypertension');
    mockResults.vitals.bloodPressure = '140/90';
    mockResults.flags.push({
      type: 'elevated',
      message: 'Blood pressure is elevated. Monitor regularly.'
    });
  }

  // Default case - simulate normal results with some variation
  if (mockResults.diseases.length === 0) {
    const random = Math.random();
    if (random > 0.7) {
      mockResults.diseases.push('Pre-diabetes');
      mockResults.vitals.glucose = '125 mg/dL';
      mockResults.flags.push({
        type: 'elevated',
        message: 'Glucose levels slightly elevated. Consider dietary changes.'
      });
    } else if (random > 0.4) {
      mockResults.diseases.push('Mild Anemia');
      mockResults.vitals.hemoglobin = '10.5 g/dL';
      mockResults.flags.push({
        type: 'low',
        message: 'Hemoglobin levels are low. Iron supplementation may be needed.'
      });
    }
  }

  // Always add some basic vitals
  if (!mockResults.vitals.bloodPressure) {
    mockResults.vitals.bloodPressure = '120/80';
  }
  if (!mockResults.vitals.cholesterol) {
    mockResults.vitals.cholesterol = '180 mg/dL';
  }
  if (!mockResults.vitals.hemoglobin) {
    mockResults.vitals.hemoglobin = '12.5 g/dL';
  }

  return mockResults;
};
