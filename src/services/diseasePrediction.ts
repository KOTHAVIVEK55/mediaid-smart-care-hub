
import Tesseract from 'tesseract.js';
import { supabase } from '@/integrations/supabase/client';

export interface PredictionResult {
  diseases: string[];
  vitals: Record<string, string>;
  suggestedMeds: string[];
  confidence: number;
}

// Disease keywords and patterns
const DISEASE_PATTERNS = {
  diabetes: {
    keywords: ['diabetes', 'diabetic', 'glucose', 'blood sugar', 'insulin', 'hba1c', 'hyperglycemia'],
    vitals: ['glucose', 'blood sugar', 'hba1c'],
    medications: ['Metformin', 'Glimepiride', 'Insulin', 'Gliclazide']
  },
  hypertension: {
    keywords: ['hypertension', 'high blood pressure', 'bp', 'systolic', 'diastolic'],
    vitals: ['blood pressure', 'bp', 'systolic', 'diastolic'],
    medications: ['Amlodipine', 'Telmisartan', 'Lisinopril', 'Metoprolol']
  },
  asthma: {
    keywords: ['asthma', 'wheezing', 'bronchial', 'respiratory', 'inhaler'],
    vitals: ['peak flow', 'fev1', 'oxygen saturation'],
    medications: ['Salbutamol', 'Budesonide', 'Montelukast', 'Prednisolone']
  },
  covid: {
    keywords: ['covid', 'coronavirus', 'sars-cov-2', 'fever', 'cough', 'pneumonia'],
    vitals: ['temperature', 'oxygen saturation', 'spo2'],
    medications: ['Paracetamol', 'Zinc', 'Vitamin C', 'Dexamethasone']
  },
  anemia: {
    keywords: ['anemia', 'anaemia', 'hemoglobin', 'iron deficiency', 'fatigue'],
    vitals: ['hemoglobin', 'hb', 'iron', 'ferritin'],
    medications: ['Iron Sulphate', 'Folic Acid', 'Vitamin B12', 'Ferrous Fumarate']
  },
  thyroid: {
    keywords: ['thyroid', 'hyperthyroid', 'hypothyroid', 'tsh', 't3', 't4'],
    vitals: ['tsh', 't3', 't4', 'thyroid hormone'],
    medications: ['Levothyroxine', 'Methimazole', 'Propylthiouracil', 'Carbimazole']
  }
};

// Extract text from file
const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileType = file.type;
    
    if (fileType.startsWith('image/')) {
      // Use Tesseract for image OCR
      Tesseract.recognize(file, 'eng', {
        logger: m => console.log(m)
      }).then(({ data: { text } }) => {
        resolve(text);
      }).catch(reject);
    } else if (fileType === 'text/plain') {
      // Read text file directly
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.onerror = reject;
      reader.readAsText(file);
    } else if (fileType === 'application/pdf') {
      // For PDF, we'll extract basic text (simplified)
      resolve('PDF text extraction not fully implemented - please use text or image files for now');
    } else {
      reject(new Error('Unsupported file type'));
    }
  });
};

// Extract vital signs from text
const extractVitals = (text: string): Record<string, string> => {
  const vitals: Record<string, string> = {};
  const lowerText = text.toLowerCase();
  
  // Blood pressure patterns
  const bpPattern = /(?:blood pressure|bp)[\s:]*(\d{2,3}\/\d{2,3})/i;
  const bpMatch = text.match(bpPattern);
  if (bpMatch) vitals['Blood Pressure'] = bpMatch[1];
  
  // Glucose patterns
  const glucosePattern = /(?:glucose|blood sugar)[\s:]*(\d{1,3})\s*(?:mg\/dl|mmol\/l)?/i;
  const glucoseMatch = text.match(glucosePattern);
  if (glucoseMatch) vitals['Blood Glucose'] = glucoseMatch[1] + ' mg/dL';
  
  // Temperature patterns
  const tempPattern = /(?:temperature|temp)[\s:]*(\d{2,3}(?:\.\d)?)\s*(?:°f|°c|f|c)?/i;
  const tempMatch = text.match(tempPattern);
  if (tempMatch) vitals['Temperature'] = tempMatch[1] + '°F';
  
  // Hemoglobin patterns
  const hbPattern = /(?:hemoglobin|hb)[\s:]*(\d{1,2}(?:\.\d)?)\s*(?:g\/dl|gm\/dl)?/i;
  const hbMatch = text.match(hbPattern);
  if (hbMatch) vitals['Hemoglobin'] = hbMatch[1] + ' g/dL';
  
  // Heart rate patterns
  const hrPattern = /(?:heart rate|pulse)[\s:]*(\d{2,3})\s*(?:bpm|\/min)?/i;
  const hrMatch = text.match(hrPattern);
  if (hrMatch) vitals['Heart Rate'] = hrMatch[1] + ' BPM';
  
  return vitals;
};

// Predict diseases from text
const predictDisease = (text: string): PredictionResult => {
  const lowerText = text.toLowerCase();
  const detectedDiseases: string[] = [];
  const allSuggestedMeds: string[] = [];
  let totalConfidence = 0;
  
  // Check each disease pattern
  Object.entries(DISEASE_PATTERNS).forEach(([disease, pattern]) => {
    const matchCount = pattern.keywords.filter(keyword => 
      lowerText.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > 0) {
      detectedDiseases.push(disease.charAt(0).toUpperCase() + disease.slice(1));
      allSuggestedMeds.push(...pattern.medications);
      totalConfidence += matchCount;
    }
  });
  
  // Remove duplicate medications
  const uniqueMeds = [...new Set(allSuggestedMeds)];
  
  // Extract vitals
  const vitals = extractVitals(text);
  
  return {
    diseases: detectedDiseases,
    vitals,
    suggestedMeds: uniqueMeds,
    confidence: Math.min(totalConfidence / detectedDiseases.length || 0, 1)
  };
};

// Upload file to Supabase storage
const uploadFileToStorage = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('medical-reports')
    .upload(fileName, file);
    
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('medical-reports')
    .getPublicUrl(fileName);
    
  return publicUrl;
};

// Main prediction function
export const analyzeMedicalReport = async (file: File, userId: string): Promise<PredictionResult> => {
  try {
    // Extract text from file
    const extractedText = await extractTextFromFile(file);
    
    // Predict disease
    const prediction = predictDisease(extractedText);
    
    // Upload file to storage
    const fileUrl = await uploadFileToStorage(file, userId);
    
    // Save to database
    const { error } = await supabase
      .from('reports')
      .insert({
        user_id: userId,
        file_name: file.name,
        file_url: fileUrl,
        disease: prediction.diseases,
        vitals: prediction.vitals,
        suggested_meds: prediction.suggestedMeds
      });
      
    if (error) throw error;
    
    return prediction;
  } catch (error) {
    console.error('Error analyzing medical report:', error);
    throw error;
  }
};

// Get user reports
export const getUserReports = async (userId: string) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};
