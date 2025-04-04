
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResultCard from './ResultCard';
import MoleculeViewer from './MoleculeViewer';
import AgentResponse from './AgentResponse';
import { Card, CardContent } from '@/components/ui/card';

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

interface AnalysisDashboardProps {
  data: FullAnalysisResult;
  onAskQuestion: (question: string) => void;
  isAgentLoading?: boolean;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ 
  data, 
  onAskQuestion,
  isAgentLoading = false
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Molecule structure card */}
        <Card className="lg:col-span-1 molecule-card">
          <CardContent className="p-4">
            <MoleculeViewer smiles={data.smiles} size={250} />
          </CardContent>
        </Card>

        {/* AI analysis */}
        <div className="lg:col-span-2">
          <AgentResponse 
            response={data.agent_response || "No AI analysis available yet. Ask a question to get started."}
            onAskQuestion={onAskQuestion}
            isLoading={isAgentLoading}
          />
        </div>
      </div>

      {/* Detailed results tabs */}
      <Tabs defaultValue="lipinski" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lipinski">Lipinski Rules</TabsTrigger>
          <TabsTrigger value="binding">Binding Affinity</TabsTrigger>
          <TabsTrigger value="admet">ADMET Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lipinski" className="mt-4">
          <ResultCard type="lipinski" data={data.lipinski} />
        </TabsContent>
        
        <TabsContent value="binding" className="mt-4">
          <ResultCard type="binding" data={data.binding} />
        </TabsContent>
        
        <TabsContent value="admet" className="mt-4">
          <ResultCard type="admet" data={data.admet} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisDashboard;
