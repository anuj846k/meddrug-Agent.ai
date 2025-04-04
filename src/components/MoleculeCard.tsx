
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MoleculeViewer from './MoleculeViewer';
import { ArrowRight } from 'lucide-react';

interface MoleculeCardProps {
  smiles: string;
  index: number;
  onSelect: (smiles: string) => void;
}

const MoleculeCard: React.FC<MoleculeCardProps> = ({ smiles, index, onSelect }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Molecule #{index + 1}</CardTitle>
      </CardHeader>
      <CardContent>
        <MoleculeViewer smiles={smiles} size={180} showCopyButton={false} />
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button 
          variant="outline" 
          className="w-full text-pharma-600 hover:text-pharma-700 hover:bg-pharma-50"
          onClick={() => onSelect(smiles)}
        >
          Analyze <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MoleculeCard;
