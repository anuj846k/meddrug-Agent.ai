
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';
import InputForm from '../components/InputForm';
import AnalysisDashboard from '../components/AnalysisDashboard';
import MedDrugService from '../api/apiService';
import { Brain } from 'lucide-react';

// Define types for the full analysis result
interface LipinskiResult {
  mw: number;
  logp: number;
  hbd: number;
  hba: number;
  is_valid: boolean;
}

interface BindingResult {
  binding_score: number;
  target: string;
}

interface AdmetProperty {
  name: string;
  value: number | string;
  status: 'good' | 'moderate' | 'poor' | 'info';
  description: string;
}

interface AdmetResult {
  absorption: AdmetProperty[];
  distribution: AdmetProperty[];
  metabolism: AdmetProperty[];
  excretion: AdmetProperty[];
  toxicity: AdmetProperty[];
}

interface FullAnalysisResult {
  smiles: string;
  lipinski: LipinskiResult;
  binding: BindingResult;
  admet: AdmetResult;
  agent_response?: string;
}

const Index = () => {
  const [result, setResult] = useState<FullAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAgentLoading, setIsAgentLoading] = useState(false);
  const location = useLocation();

  // Check if SMILES is passed from another page
  useEffect(() => {
    const state = location.state as { smiles?: string } | null;
    if (state?.smiles) {
      // Pre-fill the form and reset the state
      // In a real app, you would update a form ref or state here
      console.log('SMILES received from navigation:', state.smiles);
      // Reset the location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleAnalysisSubmit = async (data: { 
    smiles: string; 
    target: string;
    modelType: string;
    question?: string;
  }) => {
    try {
      setIsLoading(true);
      const analysisResult = await MedDrugService.getFullAnalysis(
        data.smiles,
        data.target,
        data.modelType,
        data.question
      );
      
      // Format the result to match our expected structure
      const formattedResult: FullAnalysisResult = {
        smiles: data.smiles,
        lipinski: analysisResult.lipinski || {
          mw: 0, logp: 0, hbd: 0, hba: 0, is_valid: false
        },
        binding: {
          binding_score: analysisResult.binding?.score || 0,
          target: data.target
        },
        admet: analysisResult.admet || {
          absorption: [], distribution: [], metabolism: [], excretion: [], toxicity: []
        },
        agent_response: analysisResult.agent_response || "Analysis complete. This molecule has been evaluated for drug-likeness, binding affinity, and ADMET properties."
      };
      
      setResult(formattedResult);
      toast.success('Analysis completed successfully');
    } catch (error) {
      console.error('Failed to perform full analysis:', error);
      toast.error('Failed to perform full analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = async (question: string) => {
    if (!result) return;
    
    try {
      setIsAgentLoading(true);
      
      // Call the agent endpoint with the current SMILES and the new question
      const response = await MedDrugService.getFullAnalysis(
        result.smiles,
        result.binding.target,
        'CNN', // Using default model type
        question
      );
      
      // Update only the agent response portion of the result
      setResult((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          agent_response: response.agent_response || "The agent couldn't generate a response to your question."
        };
      });
      
      toast.success('Question answered');
    } catch (error) {
      console.error('Failed to get answer:', error);
      toast.error('Failed to answer question');
    } finally {
      setIsAgentLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-pharma-800 mb-2">AI Full Analysis</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Complete pharmaceutical analysis pipeline with AI-powered insights and reasoning.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <InputForm 
            formType="agent" 
            onSubmit={handleAnalysisSubmit}
            isLoading={isLoading}
          />
        </div>
        
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-pulse">
                <div className="h-64 bg-gray-200 rounded lg:col-span-1"></div>
                <div className="h-64 bg-gray-200 rounded lg:col-span-2"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-1/3 mt-6"></div>
              <div className="h-60 bg-gray-200 rounded"></div>
            </div>
          ) : result ? (
            <AnalysisDashboard 
              data={result} 
              onAskQuestion={handleAskQuestion}
              isAgentLoading={isAgentLoading}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center bg-white bg-opacity-70 rounded-lg border border-gray-200 p-8">
              <Brain className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Analysis Started Yet</h3>
              <p className="text-gray-500 max-w-md">
                Enter a SMILES string and target protein to perform a comprehensive analysis 
                with AI-powered insights.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
