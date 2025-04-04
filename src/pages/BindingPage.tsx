
import React, { useState } from 'react';
import { toast } from 'sonner';
import InputForm from '../components/InputForm';
import ResultCard from '../components/ResultCard';
import MoleculeViewer from '../components/MoleculeViewer';
import MedDrugService from '../api/apiService';
import { Dna } from 'lucide-react';

interface BindingResult {
  binding_score: number;
  target: string;
}

const BindingPage = () => {
  const [result, setResult] = useState<BindingResult | null>(null);
  const [smiles, setSmiles] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: { 
    smiles: string; 
    target: string;
    modelType: string;
  }) => {
    try {
      setIsLoading(true);
      const result = await MedDrugService.predictBinding(
        data.smiles,
        data.target,
        data.modelType
      );
      
      setSmiles(data.smiles);
      setResult({
        binding_score: result.score,
        target: data.target
      });
      
      // Show toast based on binding score
      if (result.score > 0.7) {
        toast.success(`Strong binding affinity detected: ${(result.score * 100).toFixed(1)}%`);
      } else if (result.score > 0.4) {
        toast.info(`Moderate binding affinity: ${(result.score * 100).toFixed(1)}%`);
      } else {
        toast.warning(`Weak binding affinity: ${(result.score * 100).toFixed(1)}%`);
      }
      
    } catch (error) {
      console.error('Failed to predict binding:', error);
      toast.error('Failed to predict binding affinity');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-pharma-800 mb-2">Binding Affinity Predictor</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Predict how strongly a molecule will bind to a specific target protein 
          using advanced machine learning models.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <InputForm 
            formType="binding" 
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
        
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-white h-64 animate-pulse">
                <div className="h-5 bg-gray-200 rounded mb-4 w-1/3"></div>
                <div className="h-52 bg-gray-200 rounded"></div>
              </div>
              <div className="border rounded-lg p-4 bg-white animate-pulse">
                <div className="h-5 bg-gray-200 rounded mb-4 w-1/3"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div className="molecule-card">
                <MoleculeViewer smiles={smiles} size={250} />
              </div>
              <ResultCard type="binding" data={result} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center bg-white bg-opacity-70 rounded-lg border border-gray-200 p-8">
              <Dna className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Binding Analysis Yet</h3>
              <p className="text-gray-500 max-w-md">
                Enter a SMILES string and target protein to predict binding affinity.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BindingPage;
