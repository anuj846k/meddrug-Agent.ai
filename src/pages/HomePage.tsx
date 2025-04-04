import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Flask, 
  Clipboard, 
  Dna, 
  SlidersHorizontal,
  Search,
  ArrowRight
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      title: 'Molecule Generator',
      icon: <Flask className="h-6 w-6 text-pharma-600" />,
      description: 'Generate novel molecular structures with optional seed SMILES.',
      path: '/generator',
      color: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-700'
    },
    {
      title: 'Lipinski Rule Validator',
      icon: <Clipboard className="h-6 w-6 text-pharma-600" />,
      description: "Validate drug-likeness using Lipinski's Rule of Five.",
      path: '/lipinski',
      color: 'from-green-50 to-green-100',
      textColor: 'text-green-700'
    },
    {
      title: 'Binding Affinity Predictor',
      icon: <Dna className="h-6 w-6 text-pharma-600" />,
      description: 'Predict binding affinity to target proteins.',
      path: '/binding',
      color: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-700'
    },
    {
      title: 'ADMET Profiler',
      icon: <SlidersHorizontal className="h-6 w-6 text-pharma-600" />,
      description: 'Analyze absorption, distribution, metabolism, excretion and toxicity.',
      path: '/admet',
      color: 'from-amber-50 to-amber-100',
      textColor: 'text-amber-700'
    },
    {
      title: 'AI Full Analysis',
      icon: <Search className="h-6 w-6 text-pharma-600" />,
      description: 'Complete pipeline with AI insights and reasoning.',
      path: '/',
      color: 'from-pharma-50 to-pharma-100',
      textColor: 'text-pharma-700'
    }
  ];

  return (
    <div className="space-y-12 py-6">
      {/* Hero section */}
      <div className="text-center space-y-4 mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-pharma-900">
          AI-Powered Drug Discovery
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Accelerate your pharmaceutical research with MedDrug Agent's intelligent analysis platform
        </p>
        <div className="pt-4">
          <Button asChild size="lg" className="bg-pharma-600 hover:bg-pharma-700">
            <Link to="/" className="px-8">
              Start Full Analysis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Main features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="relative overflow-hidden group rounded-xl shadow-md transition-all duration-300 hover:shadow-lg animate-slide-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-50 group-hover:opacity-70 transition-opacity`}></div>
            <div className="relative p-6 flex flex-col h-full">
              <div className="mb-4 bg-white rounded-full p-3 w-fit shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-pharma-800">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <div className="mt-auto">
                <Button asChild variant="outline" className={`${feature.textColor} border-current hover:bg-white/50`}>
                  <Link to={feature.path} className="group-hover:translate-x-1 transition-transform">
                    Explore
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How it works section */}
      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 mt-16">
        <h2 className="text-2xl font-bold text-center mb-8 text-pharma-800">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="bg-pharma-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
              <span className="text-xl font-bold text-pharma-700">1</span>
            </div>
            <h3 className="font-semibold text-lg">Input Molecule</h3>
            <p className="text-gray-600">Enter a SMILES string or generate new molecules</p>
          </div>
          <div className="text-center space-y-3">
            <div className="bg-pharma-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
              <span className="text-xl font-bold text-pharma-700">2</span>
            </div>
            <h3 className="font-semibold text-lg">AI Analysis</h3>
            <p className="text-gray-600">Our AI evaluates drug properties and suitability</p>
          </div>
          <div className="text-center space-y-3">
            <div className="bg-pharma-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
              <span className="text-xl font-bold text-pharma-700">3</span>
            </div>
            <h3 className="font-semibold text-lg">Interactive Results</h3>
            <p className="text-gray-600">Explore detailed analysis and ask follow-up questions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
