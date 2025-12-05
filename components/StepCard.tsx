import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { Step } from '../types';

interface StepCardProps {
  step: Step;
  onClick: () => void;
}

const StepCard: React.FC<StepCardProps> = ({ step, onClick }) => {
  const getStatusIcon = () => {
    switch (step.status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <Circle className="w-4 h-4 text-gray-300" />;
    }
  };

  const getStatusColor = () => {
    switch (step.status) {
      case 'completed': return 'border-l-green-500';
      case 'in-progress': return 'border-l-blue-500';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`group relative bg-white p-4 rounded-lg shadow-sm border border-gray-100 border-l-4 ${getStatusColor()} hover:shadow-md hover:border-l-indigo-600 transition-all cursor-pointer`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold text-gray-400 font-mono tracking-wider">{step.code}</span>
        {getStatusIcon()}
      </div>
      <h4 className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700 leading-tight">
        {step.title}
      </h4>
    </div>
  );
};

export default StepCard;