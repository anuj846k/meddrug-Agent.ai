
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, InfoIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Define types for different result types
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

interface ResultCardProps {
  type: 'lipinski' | 'binding' | 'admet';
  data: LipinskiResult | BindingResult | AdmetResult;
  onClose?: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ type, data, onClose }) => {
  // Render different content based on the result type
  const renderContent = () => {
    switch (type) {
      case 'lipinski':
        return renderLipinskiResult(data as LipinskiResult);
      case 'binding':
        return renderBindingResult(data as BindingResult);
      case 'admet':
        return renderAdmetResult(data as AdmetResult);
      default:
        return <p>No data available</p>;
    }
  };

  const renderLipinskiResult = (data: LipinskiResult) => {
    return (
      <div className="space-y-3">
        <div className="flex justify-center mb-2">
          {data.is_valid ? (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              <span className="font-semibold">Passes Lipinski's Rule of Five</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-red-500">
              <XCircle className="h-6 w-6" />
              <span className="font-semibold">Does Not Pass Lipinski's Rule of Five</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <LipinskiProperty 
            name="Molecular Weight" 
            value={data.mw} 
            limit={500} 
            unit="g/mol"
            description="Lipinski's rule states that molecules with MW > 500 may have poor absorption" 
          />
          
          <LipinskiProperty 
            name="LogP" 
            value={data.logp} 
            limit={5} 
            unit=""
            description="Measure of lipophilicity. Lipinski's rule states that molecules with LogP > 5 may have poor absorption" 
          />
          
          <LipinskiProperty 
            name="H-Bond Donors" 
            value={data.hbd} 
            limit={5} 
            unit=""
            description="Number of hydrogen bond donors. Lipinski's rule states that molecules with HBD > 5 may have poor absorption" 
          />
          
          <LipinskiProperty 
            name="H-Bond Acceptors" 
            value={data.hba} 
            limit={10} 
            unit=""
            description="Number of hydrogen bond acceptors. Lipinski's rule states that molecules with HBA > 10 may have poor absorption" 
          />
        </div>
      </div>
    );
  };

  const renderBindingResult = (data: BindingResult) => {
    // Calculate a normalized score for visual indicators
    // Assuming scores range from 0 to 1 where 1 is best binding
    const score = data.binding_score;
    const scorePercentage = Math.min(100, Math.max(0, score * 100));
    
    // Determine color based on score
    let colorClass = 'bg-red-500';
    if (score > 0.7) colorClass = 'bg-green-500';
    else if (score > 0.4) colorClass = 'bg-yellow-500';
    
    return (
      <div className="space-y-4">
        <div className="text-center mb-2">
          <h3 className="font-semibold mb-1">Binding Affinity to {data.target}</h3>
          <div className="text-3xl font-bold text-pharma-700">
            {(score * 100).toFixed(1)}%
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className={`h-4 rounded-full ${colorClass}`} 
            style={{ width: `${scorePercentage}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-3 text-center text-sm mt-2">
          <div className="text-red-500">Weak</div>
          <div className="text-yellow-500">Moderate</div>
          <div className="text-green-500">Strong</div>
        </div>
        
        <div className="text-center text-sm text-gray-600 mt-3">
          Binding prediction based on {data.target} interaction model
        </div>
      </div>
    );
  };

  const renderAdmetResult = (data: AdmetResult) => {
    const categories = [
      { key: 'absorption', name: 'Absorption', data: data.absorption || [] },
      { key: 'distribution', name: 'Distribution', data: data.distribution || [] },
      { key: 'metabolism', name: 'Metabolism', data: data.metabolism || [] },
      { key: 'excretion', name: 'Excretion', data: data.excretion || [] },
      { key: 'toxicity', name: 'Toxicity', data: data.toxicity || [] },
    ];
    
    return (
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.key} className="space-y-2">
            <h3 className="font-semibold text-pharma-700">{category.name}</h3>
            {category.data.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {category.data.map((property, index) => (
                  <AdmetPropertyItem key={index} property={property} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No data available</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Lipinski property component
  const LipinskiProperty = ({ name, value, limit, unit, description }: { 
    name: string; 
    value: number; 
    limit: number;
    unit: string;
    description: string;
  }) => {
    const isValid = name === 'LogP' ? value <= limit : name === 'Molecular Weight' ? value <= limit : value <= limit;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`p-3 rounded-lg border ${isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">{name}</p>
                  <p className="text-xl font-bold">
                    {value.toFixed(1)}{unit && unit}
                  </p>
                </div>
                {isValid ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="mt-1 text-xs text-gray-600">
                Limit: {limit}{unit && unit}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // ADMET property component
  const AdmetPropertyItem = ({ property }: { property: AdmetProperty }) => {
    let badgeClass = '';
    let icon = null;
    
    switch (property.status) {
      case 'good':
        badgeClass = 'bg-green-100 text-green-800';
        icon = <CheckCircle className="h-3.5 w-3.5 text-green-600" />;
        break;
      case 'moderate':
        badgeClass = 'bg-yellow-100 text-yellow-800';
        icon = <AlertCircle className="h-3.5 w-3.5 text-yellow-600" />;
        break;
      case 'poor':
        badgeClass = 'bg-red-100 text-red-800';
        icon = <XCircle className="h-3.5 w-3.5 text-red-600" />;
        break;
      case 'info':
        badgeClass = 'bg-blue-100 text-blue-800';
        icon = <InfoIcon className="h-3.5 w-3.5 text-blue-600" />;
        break;
    }
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-between p-2 rounded-md bg-white border border-gray-100 hover:bg-gray-50">
              <div className="flex items-center space-x-2">
                {icon}
                <span className="text-sm">{property.name}</span>
              </div>
              <Badge variant="secondary" className={badgeClass}>
                {typeof property.value === 'number' ? property.value.toFixed(2) : property.value}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{property.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const getCardTitle = () => {
    switch (type) {
      case 'lipinski': return 'Lipinski Rule Analysis';
      case 'binding': return 'Binding Affinity Results';
      case 'admet': return 'ADMET Profile';
      default: return 'Results';
    }
  };

  return (
    <Card className="shadow-md w-full">
      <CardHeader className="bg-gradient-to-r from-pharma-500 to-pharma-700 text-white rounded-t-lg">
        <CardTitle className="text-lg">{getCardTitle()}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {renderContent()}
      </CardContent>
      {onClose && (
        <CardFooter className="flex justify-end border-t pt-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ResultCard;
