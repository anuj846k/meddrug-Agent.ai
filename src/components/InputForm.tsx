import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BeakerIcon, 
  ClipboardCheck, 
  Activity, 
  Sliders,
  Search
} from 'lucide-react';

// Updated interfaces for API types
interface AgentAnalysisRequest {
  smiles: string;
  target: string;
  modelType: string;
  question?: string;
}

interface DrugLikeness {
  molecular_weight: number;
  logP: number;
  HBD: number;
  HBA: number;
  drug_likeness: string;
  message: string;
}

interface ADMET {
  absorption: {
    intestinal_absorption: string;
    blood_brain_barrier: string;
    TPSA: number;
    rotatable_bonds: number;
  };
  metabolism: {
    risk_level: string;
    molecular_weight: number;
    logP: number;
  };
  toxicity: {
    risk_level: string;
    hbd: number;
    hba: number;
  };
  message: string;
}

interface AgentAnalysisResponse {
  drug_smiles: string;
  target_sequence: string;
  drug_likeness: DrugLikeness;
  binding_score: number;
  admet: ADMET;
  message: string;
  ai_analysis?: {
    response: string;
    error?: string;
  };
}

interface InputFormProps {
  onSubmit: (data: {
    smiles: string;
    target?: string;
    modelType?: string;
    numSamples?: number;
    question?: string;
    analysisResult?: AgentAnalysisResponse;
  }) => void;
  formType: 'generator' | 'lipinski' | 'binding' | 'admet' | 'agent';
  isLoading?: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, formType, isLoading = false }) => {
  // Form states
  const [smiles, setSmiles] = useState('');
  const [target, setTarget] = useState('');
  const [modelType, setModelType] = useState('CNN');
  const [numSamples, setNumSamples] = useState(5);
  const [question, setQuestion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AgentAnalysisResponse | null>(null);

  // API call function
  const getAgentAnalysis = async (data: AgentAnalysisRequest): Promise<AgentAnalysisResponse> => {
    try {
      const response = await fetch('http://localhost:8001/agent/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          smiles: data.smiles,  // Changed from drug to smiles
          target: data.target,
          model_type: data.modelType,
          question: data.question
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.detail || 'Analysis failed');
      }

      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.error('Error in agent analysis:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    
    try {
      if (formType === 'agent') {
        const analysisResult = await getAgentAnalysis({
          smiles,
          target,
          modelType,
          question: question || undefined
        });
        
        setResult(analysisResult);
        
        onSubmit({
          smiles,
          target,
          modelType,
          question,
          analysisResult
        });
      } else {
        onSubmit({
          smiles,
          target,
          modelType,
          numSamples: formType === 'generator' ? numSamples : undefined,
          question: formType === 'agent' ? question : undefined
        });
      }
    } catch (error) {
      console.error('Form submission failed:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  // Example SMILES
  const exampleSmiles = [
    'CC(=O)OC1=CC=CC=C1C(=O)O', // Aspirin
    'CCC1(C(=O)NC(=O)NC1=O)C', // Phenobarbital
    'CC(C)NCC(O)COC1=CC=C(C=C1)CCOC' // Metoprolol
  ];

  const fillExampleSmiles = () => {
    const randomIndex = Math.floor(Math.random() * exampleSmiles.length);
    setSmiles(exampleSmiles[randomIndex]);
  };

  const getFormTitle = () => {
    switch (formType) {
      case 'generator': return 'Molecule Generator';
      case 'lipinski': return 'Lipinski Rule Validator';
      case 'binding': return 'Binding Affinity Predictor';
      case 'admet': return 'ADMET Profiler';
      case 'agent': return 'AI Full Analysis';
      default: return 'Input Form';
    }
  };

  const getFormIcon = () => {
    switch (formType) {
      case 'generator': return <BeakerIcon className="h-5 w-5 text-pharma-600" />;
      case 'lipinski': return <ClipboardCheck className="h-5 w-5 text-pharma-600" />;
      case 'binding': return <Activity className="h-5 w-5 text-pharma-600" />;
      case 'admet': return <Sliders className="h-5 w-5 text-pharma-600" />;
      case 'agent': return <Search className="h-5 w-5 text-pharma-600" />;
      default: return <Search className="h-5 w-5 text-pharma-600" />;
    }
  };

  // Result display component
  const ResultDisplay = ({ result }: { result: AgentAnalysisResponse }) => (
    <div className="mt-6 space-y-4">
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-xl font-semibold mb-6">Analysis Results</h3>
        
        {/* Drug Likeness Section */}
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3 text-pharma-600 flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Lipinski's Rule Analysis
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-medium mb-2">Parameters</div>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Molecular Weight:</span>
                  <span>{result.drug_likeness.molecular_weight.toFixed(2)} g/mol</span>
                </li>
                <li className="flex justify-between">
                  <span>LogP:</span>
                  <span>{result.drug_likeness.logP.toFixed(2)}</span>
                </li>
                <li className="flex justify-between">
                  <span>H-Bond Donors:</span>
                  <span>{result.drug_likeness.HBD}</span>
                </li>
                <li className="flex justify-between">
                  <span>H-Bond Acceptors:</span>
                  <span>{result.drug_likeness.HBA}</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-medium mb-2">Limits</div>
              <ul className="space-y-2 text-sm">
                <li>MW ≤ 500 g/mol</li>
                <li>LogP ≤ 5</li>
                <li>HBD ≤ 5</li>
                <li>HBA ≤ 10</li>
              </ul>
            </div>
          </div>
          <div className="mt-3 text-sm font-medium text-green-600">
            Status: {result.drug_likeness.drug_likeness}
          </div>
        </div>
  
        {/* Binding Affinity Section */}
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3 text-pharma-600 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Binding Affinity Analysis
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Binding Score:</span>
                <span className="font-medium">{result.binding_score.toFixed(3)}</span>
              </li>
              <li className="text-gray-600 text-sm mt-2">
                {result.message}
              </li>
            </ul>
          </div>
        </div>
  
        {/* ADMET Properties Section */}
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3 text-pharma-600 flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            ADMET Properties
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Absorption */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium mb-2">Absorption</h5>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Intestinal:</span>
                  <span>{result.admet.absorption.intestinal_absorption}</span>
                </li>
                <li className="flex justify-between">
                  <span>Blood-Brain Barrier:</span>
                  <span>{result.admet.absorption.blood_brain_barrier}</span>
                </li>
                <li className="flex justify-between">
                  <span>TPSA:</span>
                  <span>{result.admet.absorption.TPSA}</span>
                </li>
                <li className="flex justify-between">
                  <span>Rotatable Bonds:</span>
                  <span>{result.admet.absorption.rotatable_bonds}</span>
                </li>
              </ul>
            </div>
  
            {/* Metabolism */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium mb-2">Metabolism</h5>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Risk Level:</span>
                  <span className={`font-medium ${
                    result.admet.metabolism.risk_level === 'Low' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {result.admet.metabolism.risk_level}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Molecular Weight:</span>
                  <span>{result.admet.metabolism.molecular_weight.toFixed(2)}</span>
                </li>
                <li className="flex justify-between">
                  <span>LogP:</span>
                  <span>{result.admet.metabolism.logP.toFixed(2)}</span>
                </li>
              </ul>
            </div>
  
            {/* Toxicity */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium mb-2">Toxicity</h5>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Risk Level:</span>
                  <span className={`font-medium ${
                    result.admet.toxicity.risk_level === 'Low' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {result.admet.toxicity.risk_level}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>HBD:</span>
                  <span>{result.admet.toxicity.hbd}</span>
                </li>
                <li className="flex justify-between">
                  <span>HBA:</span>
                  <span>{result.admet.toxicity.hba}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
  
        {/* AI Analysis Section */}
        {result.ai_analysis && (
          <div className="mt-6">
            <h4 className="text-lg font-medium mb-3 text-pharma-600 flex items-center gap-2">
              <Search className="h-5 w-5" />
              AI Analysis
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              {result.ai_analysis.error ? (
                <div className="text-red-500 text-sm">{result.ai_analysis.error}</div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <h5 className="font-medium mb-2">Key Findings:</h5>
                  <ul className="list-disc pl-5 space-y-2">
                    {result.ai_analysis.response.split('\n').map((point, index) => (
                      <li key={index}>{point.trim()}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="w-full shadow-md border-pharma-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            {getFormIcon()}
            {getFormTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formType === 'generator' && (
              <div className="space-y-2">
                <label htmlFor="numSamples" className="text-sm font-medium">
                  Number of Molecules to Generate
                </label>
                <div className="flex gap-3">
                  <Input
                    id="numSamples"
                    type="number"
                    min={1}
                    max={10}
                    value={numSamples}
                    onChange={(e) => setNumSamples(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="smiles" className="text-sm font-medium">
                  {formType === 'generator' ? 'Seed SMILES (Optional)' : 'SMILES String'}
                </label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-5 px-2 text-pharma-600" 
                  onClick={fillExampleSmiles}
                >
                  Use Example
                </Button>
              </div>
              <Textarea
                id="smiles"
                placeholder="Enter SMILES notation, e.g., CC(=O)OC1=CC=CC=C1C(=O)O for Aspirin"
                value={smiles}
                onChange={(e) => setSmiles(e.target.value)}
                className="font-mono text-sm"
                required={formType !== 'generator'}
              />
            </div>

            {(formType === 'binding' || formType === 'agent') && (
              <div className="space-y-2">
                <label htmlFor="target" className="text-sm font-medium">Target Protein</label>
                <Input
                  id="target"
                  placeholder="e.g., 5HT2A, EGFR"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  required
                />
              </div>
            )}

            {(formType === 'binding' || formType === 'agent') && (
              <div className="space-y-2">
                <label htmlFor="modelType" className="text-sm font-medium">Model Type</label>
                <Select value={modelType} onValueChange={setModelType}>
                  <SelectTrigger id="modelType">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CNN">CNN</SelectItem>
                    <SelectItem value="GNN">GNN</SelectItem>
                    <SelectItem value="Transformer">Transformer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {formType === 'agent' && (
              <div className="space-y-2">
                <label htmlFor="question" className="text-sm font-medium">
                  Question (Optional)
                </label>
                <Textarea
                  id="question"
                  placeholder="e.g., Is this molecule suitable for diabetic patients?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
            )}

            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-pharma-600 hover:bg-pharma-700"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Submit'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Display results if available */}
      {result && <ResultDisplay result={result} />}
    </div>
  );
};

export default InputForm;