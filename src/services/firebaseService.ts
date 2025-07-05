
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc,
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { AnalysisResult } from '@/utils/aiAnalysis';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'staff';
  createdAt: Timestamp;
}

export interface MedicalReport {
  id: string;
  userId: string;
  fileName: string;
  fileURL: string;
  aiSummary: AnalysisResult;
  uploadedAt: Timestamp;
  doctorNotes?: string;
}

export interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  department: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Timestamp;
}

export interface Emergency {
  id: string;
  ward: string;
  patientId: string;
  condition: string;
  timestamp: Timestamp;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledgedBy?: string;
}

// User operations
export const createUserProfile = async (user: Omit<UserProfile, 'id' | 'createdAt'>) => {
  const userRef = doc(db, 'users', user.email);
  await setDoc(userRef, {
    ...user,
    createdAt: Timestamp.now()
  });
};

export const getUserProfile = async (email: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', email);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() } as UserProfile;
  }
  return null;
};

// Report operations
export const uploadReport = async (
  file: File, 
  userId: string, 
  aiSummary: AnalysisResult
): Promise<string> => {
  // Upload file to Firebase Storage
  const storageRef = ref(storage, `reports/${userId}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  // Save report metadata to Firestore
  const reportRef = await addDoc(collection(db, 'reports'), {
    userId,
    fileName: file.name,
    fileURL: downloadURL,
    aiSummary,
    uploadedAt: Timestamp.now()
  });
  
  return reportRef.id;
};

export const getUserReports = async (userId: string): Promise<MedicalReport[]> => {
  const q = query(
    collection(db, 'reports'),
    where('userId', '==', userId),
    orderBy('uploadedAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as MedicalReport[];
};

// Appointment operations
export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'createdAt'>) => {
  const appointmentRef = await addDoc(collection(db, 'appointments'), {
    ...appointment,
    createdAt: Timestamp.now()
  });
  return appointmentRef.id;
};

export const getUserAppointments = async (userId: string): Promise<Appointment[]> => {
  const q = query(
    collection(db, 'appointments'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Appointment[];
};

// Emergency operations
export const createEmergency = async (emergency: Omit<Emergency, 'id' | 'timestamp' | 'status'>) => {
  const emergencyRef = await addDoc(collection(db, 'emergencies'), {
    ...emergency,
    timestamp: Timestamp.now(),
    status: 'active'
  });
  return emergencyRef.id;
};

export const getActiveEmergencies = async (): Promise<Emergency[]> => {
  const q = query(
    collection(db, 'emergencies'),
    where('status', '==', 'active'),
    orderBy('timestamp', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Emergency[];
};

export const acknowledgeEmergency = async (emergencyId: string, doctorId: string) => {
  const emergencyRef = doc(db, 'emergencies', emergencyId);
  await updateDoc(emergencyRef, {
    status: 'acknowledged',
    acknowledgedBy: doctorId
  });
};
