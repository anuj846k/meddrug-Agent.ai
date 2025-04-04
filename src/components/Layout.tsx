
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  BeakerIcon, 
  ClipboardCheck, 
  Activity, 
  Sliders, 
  Search, 
  Github 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: <Search className="h-4 w-4 mr-2" /> },
    { path: '/generator', label: 'Generator', icon: <BeakerIcon className="h-4 w-4 mr-2" /> },
    { path: '/lipinski', label: 'Lipinski', icon: <ClipboardCheck className="h-4 w-4 mr-2" /> },
    { path: '/binding', label: 'Binding', icon: <Activity className="h-4 w-4 mr-2" /> },
    { path: '/admet', label: 'ADMET', icon: <Sliders className="h-4 w-4 mr-2" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pharma-50 to-white molecule-bg">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white bg-opacity-90 backdrop-blur-sm border-b border-pharma-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-pharma-600 text-white p-1.5 rounded-md">
                <BeakerIcon className="h-5 w-5" />
              </div>
              <span className="text-xl font-semibold text-pharma-800">MedDrug Agent</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                asChild
                className="text-gray-600 hover:text-pharma-700"
              >
                <a 
                  href="https://github.com/yourusername/meddrug-agent-ui" 
                  target="_blank" 
                  rel="noreferrer"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <div className="container mx-auto px-4 sm:px-6 pt-4">
        <nav className="flex overflow-x-auto pb-2 hide-scrollbar">
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "default" : "outline"}
                size="sm"
                asChild
                className={
                  location.pathname === item.path
                    ? "bg-pharma-600 hover:bg-pharma-700 text-white"
                    : "text-pharma-700 hover:bg-pharma-50"
                }
              >
                <Link to={item.path} className="flex items-center">
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>
        </nav>
      </div>
      
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 bg-white bg-opacity-90 backdrop-blur-sm border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              © 2025 MedDrug Agent - AI-Powered Drug Discovery Tool
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="link" size="sm" className="text-pharma-600 hover:text-pharma-800">
                API Documentation
              </Button>
              <Button variant="link" size="sm" className="text-pharma-600 hover:text-pharma-800">
                Privacy Policy
              </Button>
              <Button variant="link" size="sm" className="text-pharma-600 hover:text-pharma-800">
                Terms of Service
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
