
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface MoleculeViewerProps {
  smiles: string;
  size?: number;
  showCopyButton?: boolean;
}

const MoleculeViewer: React.FC<MoleculeViewerProps> = ({ 
  smiles, 
  size = 300,
  showCopyButton = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!smiles || !containerRef.current) return;

    // In a real app, you would use a molecule viewer library like SmilesDrawer or RDKit.js
    // For this demo, we'll use a placeholder and link to a service that renders SMILES
    const container = containerRef.current;
    
    // Clear previous content
    container.innerHTML = '';
    
    // Create an image that displays the molecule
    // Using the NIH Chemical Identifier Resolver service as an example
    const img = document.createElement('img');
    img.src = `https://cactus.nci.nih.gov/chemical/structure/${encodeURIComponent(smiles)}/image`;
    img.alt = `Molecule: ${smiles}`;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.maxHeight = `${size}px`;
    
    container.appendChild(img);
    
    // Error handling for the image
    img.onerror = () => {
      container.innerHTML = `
        <div class="flex items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <p class="text-gray-500">Unable to render molecule: ${smiles}</p>
        </div>
      `;
    };
    
  }, [smiles, size]);

  const copySmiles = () => {
    navigator.clipboard.writeText(smiles);
    toast.success('SMILES copied to clipboard');
  };

  return (
    <div className="molecule-viewer-container">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">Molecular Structure</h3>
        {showCopyButton && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs" 
            onClick={copySmiles}
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy SMILES
          </Button>
        )}
      </div>
      
      <div 
        ref={containerRef} 
        className="flex items-center justify-center molecule-viewer bg-white bg-opacity-60 rounded-lg p-2 min-h-[200px]"
        style={{ height: `${size}px` }}
      >
        <div className="animate-pulse text-gray-400">Loading molecule...</div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="font-mono" title={smiles}>{smiles}</span>
      </div>
    </div>
  );
};

export default MoleculeViewer;
