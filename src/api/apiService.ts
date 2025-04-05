import axios from 'axios';
import { toast } from 'sonner';

// API base URL - in a real app, use env variables
const API_BASE_URL = 'http://localhost:8001';

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
    
    const response = await api.get(`/generate/?${params.toString()}`);
    console.log(response.data);
    return {
      molecules: response.data.generated_molecules,
      message: response.data.message
    };
  },
  
  // Validate Lipinski rules
  validateLipinski: async (smiles: string) => {
    const response = await api.post('/lipinski/', { smiles });
    return {
      mw: response.data.molecular_weight,
      logp: response.data.logP,
      hbd: response.data.HBD,
      hba: response.data.HBA,
      is_valid: response.data.drug_likeness === "Pass"
    };
  },
  
  // Predict binding affinity
  predictBinding: async (smiles: string, target: string, modelType: string = 'CNN') => {
    const response = await api.post('/binding/', { 
      drug: smiles,
      target,
      model_type: modelType
    });
    return {
      score: response.data.binding_score,
      message: response.data.message
    };
  },
  
  // ADMET profile
  getAdmetProfile: async (smiles: string) => {
    const response = await api.post('/admet/', { smiles });
    return {
      absorption: [
        {
          name: "Intestinal Absorption",
          value: response.data.absorption.intestinal_absorption,
          status: response.data.absorption.intestinal_absorption === "High" ? "good" : "moderate",
          description: "Predicted intestinal absorption"
        },
        {
          name: "Blood Brain Barrier",
          value: response.data.absorption.blood_brain_barrier,
          status: "info",
          description: "Blood-brain barrier penetration"
        },
        {
          name: "TPSA",
          value: response.data.absorption.TPSA,
          status: "info",
          description: "Topological Polar Surface Area"
        }
      ],
      metabolism: [
        {
          name: "Risk Level",
          value: response.data.metabolism.risk_level,
          status: response.data.metabolism.risk_level === "Low" ? "good" : "poor",
          description: "Metabolism risk assessment"
        }
      ],
      toxicity: [
        {
          name: "Risk Level",
          value: response.data.toxicity.risk_level,
          status: response.data.toxicity.risk_level === "Low" ? "good" : "poor",
          description: "Toxicity risk assessment"
        }
      ]
    };
  },
  
  // Full agent analysis
  getFullAnalysis: async (smiles: string, target: string, modelType: string = 'CNN', question?: string) => {
    const payload: any = {
      drug: smiles,
      target,
      model_type: modelType
    };
    
    if (question) {
      payload.question = question;
    }
      
      const response = await api.post('/agent/', payload);
      return {
        lipinski: response.data.drug_likeness,
        binding: {
          score: response.data.binding_score,
          target: response.data.target_sequence
        },
        admet: response.data.admet,
        agent_response: response.data.message
      };
  }
};

export default MedDrugService;
