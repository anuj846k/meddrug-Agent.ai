
import React, { useState } from 'react';
import { toast } from 'sonner';
import InputForm from '../components/InputForm';
import ResultCard from '../components/ResultCard';
import MoleculeViewer from '../components/MoleculeViewer';
import MedDrugService from '../api/apiService';
import { SlidersHorizontal } from 'lucide-react';

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

const AdmetPage = () => {
  const [result, setResult] = useState<AdmetResult | null>(null);
  const [smiles, setSmiles] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: { smiles: string }) => {
    try {
      setIsLoading(true);
      const result = await MedDrugService.getAdmetProfile(data.smiles);
      
      setSmiles(data.smiles);
      setResult(result);
      
      toast.success('ADMET profile generated successfully');
    } catch (error) {
      console.error('Failed to generate ADMET profile:', error);
      toast.error('Failed to generate ADMET profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-pharma-800 mb-2">ADMET Profiler</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Analyze Absorption, Distribution, Metabolism, Excretion, and Toxicity properties
          to evaluate pharmacokinetic behavior of drug candidates.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <InputForm 
            formType="admet" 
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
                <div className="space-y-4">
                  <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div className="molecule-card">
                <MoleculeViewer smiles={smiles} size={250} />
              </div>
              <ResultCard type="admet" data={result} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center bg-white bg-opacity-70 rounded-lg border border-gray-200 p-8">
              <SlidersHorizontal className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No ADMET Profile Yet</h3>
              <p className="text-gray-500 max-w-md">
                Enter a SMILES string to analyze the ADMET properties of your molecule.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdmetPage;
