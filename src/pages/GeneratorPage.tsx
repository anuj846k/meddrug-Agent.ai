
import React, { useState } from 'react';
import { toast } from 'sonner';
import InputForm from '../components/InputForm';
import MoleculeCard from '../components/MoleculeCard';
import MedDrugService from '../api/apiService';
import { useNavigate } from 'react-router-dom';

const GeneratorPage = () => {
  const [molecules, setMolecules] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerateSubmit = async (data: {
    numSamples: number;
    seedSmiles?: string;
  }) => {
    try {
      setIsLoading(true);
      const result = await MedDrugService.generateMolecules(
        data.numSamples,
        data.seedSmiles
      );
      
      setMolecules(result.molecules || []);
      
      if (result.molecules && result.molecules.length > 0) {
        toast.success(`Generated ${result.molecules.length} molecule(s)`);
      } else {
        toast.warning('No molecules were generated');
      }
    } catch (error) {
      console.error('Failed to generate molecules:', error);
      toast.error('Failed to generate molecules');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoleculeSelect = (smiles: string) => {
    // Navigate to full analysis with the selected SMILES
    navigate('/', { state: { smiles } });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-pharma-800 mb-2">Molecule Generator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Generate novel molecular structures with AI. Optionally provide a seed SMILES 
          to generate similar molecules.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <InputForm 
            formType="generator" 
            onSubmit={handleGenerateSubmit}
            isLoading={isLoading}
          />
        </div>
        
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white h-64 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded mb-4 w-1/3"></div>
                  <div className="h-40 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : molecules.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-pharma-700">
                Generated Molecules ({molecules.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {molecules.map((smiles, index) => (
                  <MoleculeCard 
                    key={index} 
                    smiles={smiles} 
                    index={index}
                    onSelect={handleMoleculeSelect}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center bg-white bg-opacity-70 rounded-lg border border-gray-200 p-8">
              <Flask className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Molecules Generated Yet</h3>
              <p className="text-gray-500 max-w-md">
                Use the form to generate AI-created molecules. You can optionally provide a seed SMILES to create similar structures.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratorPage;
