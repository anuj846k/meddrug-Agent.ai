
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Brain, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface AgentResponseProps {
  response: string;
  onAskQuestion: (question: string) => void;
  isLoading?: boolean;
}

const AgentResponse: React.FC<AgentResponseProps> = ({ 
  response, 
  onAskQuestion,
  isLoading = false
}) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onAskQuestion(question);
      setQuestion('');
    }
  };

  // Split response by newlines and paragraphs
  const renderFormattedResponse = () => {
    if (!response) return null;
    
    return response.split('\n').map((paragraph, index) => (
      <p key={index} className={index > 0 ? 'mt-2' : ''}>
        {paragraph}
      </p>
    ));
  };

  return (
    <Card className="shadow-md border-pharma-100 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-pharma-700 to-pharma-900 text-white pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Drug Analysis Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-pharma-100 p-2 rounded-full">
            <Brain className="h-5 w-5 text-pharma-700" />
          </div>
          <div className="flex-1 p-3 bg-gray-50 rounded-lg rounded-tl-none">
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : (
              <div className="text-gray-800 text-sm leading-relaxed">
                {renderFormattedResponse()}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t p-3">
        <form onSubmit={handleSubmit} className="w-full flex gap-2">
          <div className="flex-1">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about this molecule..."
              className="w-full"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            size="sm" 
            className="bg-pharma-600 hover:bg-pharma-700" 
            disabled={isLoading || !question.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default AgentResponse;
