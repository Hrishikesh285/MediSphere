import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface AdherenceSuggestionsProps {
  suggestions: string[];
  adherenceScore: number;
}

const AdherenceSuggestions = ({ suggestions, adherenceScore }: AdherenceSuggestionsProps) => {
  const [expanded, setExpanded] = useState(true);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const getAdherenceIcon = () => {
    if (adherenceScore >= 90) {
      return <CheckCircle className="h-5 w-5 text-success-500" />;
    } else if (adherenceScore >= 70) {
      return <Info className="h-5 w-5 text-warning-500" />;
    } else {
      return <AlertTriangle className="h-5 w-5 text-error-500" />;
    }
  };
  
  const getAdherenceTitle = () => {
    if (adherenceScore >= 90) {
      return "Keep up the great work!";
    } else if (adherenceScore >= 70) {
      return "Here's how to improve your adherence";
    } else {
      return "Your adherence needs attention";
    }
  };

  return (
    <div className="card overflow-hidden">
      <div 
        className="flex cursor-pointer items-center justify-between border-b border-gray-200 px-6 py-4"
        onClick={toggleExpanded}
      >
        <div className="flex items-center">
          <Brain className="h-5 w-5 text-primary-600" />
          <h2 className="ml-2 text-lg font-medium text-gray-900">AI Suggestions</h2>
        </div>
        <button className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {getAdherenceIcon()}
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">{getAdherenceTitle()}</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Based on your medication history, here are some personalized suggestions:
                  </p>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                {suggestions.map((suggestion, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">{suggestion}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6">
                <p className="text-sm text-gray-500">
                  These suggestions are generated based on patterns observed in your medication history. 
                  Always consult with your healthcare provider before making significant changes to your medication routine.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdherenceSuggestions;