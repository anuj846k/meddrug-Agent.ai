
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Flask, Dna, Clipboard, SlidersHorizontal } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: {
    smiles: string;
    target?: string;
    modelType?: string;
    numSamples?: number;
    question?: string;
  }) => void;
  formType: 'generator' | 'lipinski' | 'binding' | 'admet' | 'agent';
  isLoading?: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, formType, isLoading = false }) => {
  // Common form states
  const [smiles, setSmiles] = useState('');
  const [target, setTarget] = useState('');
  const [modelType, setModelType] = useState('CNN');
  const [numSamples, setNumSamples] = useState(5);
  const [question, setQuestion] = useState('');

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData: any = { smiles };
    
    if (formType === 'generator') {
      formData.numSamples = numSamples;
      // SMILES is optional for generator, but we'll use it as seed if provided
      if (smiles) formData.seedSmiles = smiles;
      delete formData.smiles; // Remove the standard smiles field
    }
    
    if (formType === 'binding' || formType === 'agent') {
      formData.target = target;
      formData.modelType = modelType;
    }
    
    if (formType === 'agent' && question) {
      formData.question = question;
    }
    
    onSubmit(formData);
  };

  // Default SMILES examples
  const exampleSmiles = [
    'CC(=O)OC1=CC=CC=C1C(=O)O', // Aspirin
    'CCC1(C(=O)NC(=O)NC1=O)C', // Phenobarbital
    'CC(C)NCC(O)COC1=CC=C(C=C1)CCOC' // Metoprolol
  ];

  // Fill with example SMILES
  const fillExampleSmiles = () => {
    const randomIndex = Math.floor(Math.random() * exampleSmiles.length);
    setSmiles(exampleSmiles[randomIndex]);
  };

  // Determine which form to render based on formType
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
      case 'generator': return <Flask className="h-5 w-5 text-pharma-600" />;
      case 'lipinski': return <Clipboard className="h-5 w-5 text-pharma-600" />;
      case 'binding': return <Dna className="h-5 w-5 text-pharma-600" />;
      case 'admet': return <SlidersHorizontal className="h-5 w-5 text-pharma-600" />;
      case 'agent': return <Search className="h-5 w-5 text-pharma-600" />;
      default: return <Search className="h-5 w-5 text-pharma-600" />;
    }
  };

  return (
    <Card className="w-full shadow-md border-pharma-100">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {getFormIcon()}
          {getFormTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Generator Input - Number of Samples */}
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

          {/* SMILES Input - Present in all forms */}
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

          {/* Target Protein - Only for binding and agent */}
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

          {/* Model Type - Only for binding and agent */}
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

          {/* Question for Agent - Only for agent */}
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
  );
};

export default InputForm;
