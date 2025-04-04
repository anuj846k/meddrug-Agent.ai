
import axios from 'axios';
import { toast } from 'sonner';

// API base URL - in a real app, use env variables
const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with base config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || 'An unexpected error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

// API Services
export const MedDrugService = {
  // Generate molecules
  generateMolecules: async (numSamples: number, seedSmiles?: string) => {
    const params = new URLSearchParams();
    params.append('num_samples', numSamples.toString());
    if (seedSmiles) params.append('seed_smiles', seedSmiles);
    
    const response = await api.get(`/generate?${params.toString()}`);
    return response.data;
  },
  
  // Validate Lipinski rules
  validateLipinski: async (smiles: string) => {
    const response = await api.post('/lipinski', { smiles });
    return response.data;
  },
  
  // Predict binding affinity
  predictBinding: async (smiles: string, target: string, modelType: string = 'CNN') => {
    const response = await api.post('/binding', { 
      smiles,
      target,
      model_type: modelType
    });
    return response.data;
  },
  
  // ADMET profile
  getAdmetProfile: async (smiles: string) => {
    const response = await api.post('/admet', { smiles });
    return response.data;
  },
  
  // Full agent analysis
  getFullAnalysis: async (smiles: string, target: string, modelType: string = 'CNN', question?: string) => {
    const payload: any = {
      smiles,
      target,
      model_type: modelType
    };
    
    if (question) {
      payload.question = question;
    }
    
    const response = await api.post('/agent', payload);
    return response.data;
  }
};

export default MedDrugService;
