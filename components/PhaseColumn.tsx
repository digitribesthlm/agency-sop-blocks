import React from 'react';
import { Phase, Step } from '../types';
import StepCard from './StepCard';
import { ArrowRight, Plus } from 'lucide-react';

interface PhaseColumnProps {
  phase: Phase;
  onStepClick: (step: Step, phaseId: string) => void;
  onAddStep?: (phaseId: string) => void;
  isLast: boolean;
}

const PhaseColumn: React.FC<PhaseColumnProps> = ({ phase, onStepClick, onAddStep, isLast }) => {
  return (
    <div className="flex-shrink-0 w-72 flex flex-col h-full relative">
      {/* Header */}
      <div className="bg-slate-800 text-white p-4 rounded-t-lg shadow-md z-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <span className="text-6xl font-black">{phase.phaseNumber}</span>
        </div>
        <div className="relative z-10">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Phase {phase.phaseNumber}</span>
          <h3 className="text-lg font-bold mt-1">{phase.title}</h3>
          <p className="text-xs text-slate-300 mt-1 line-clamp-2">{phase.description}</p>
        </div>
      </div>

      {/* Connection Line (Visual connector to next phase) */}
      {!isLast && (
        <div className="hidden lg:block absolute top-12 -right-6 z-0 text-slate-300">
           <ArrowRight className="w-6 h-6 opacity-50" />
        </div>
      )}

      {/* Steps List */}
      <div className="bg-slate-50 flex-1 p-3 rounded-b-lg border-x border-b border-gray-200 overflow-y-auto space-y-3 min-h-[500px]">
        {phase.steps.map((step) => (
          <StepCard 
            key={step.id} 
            step={step} 
            onClick={() => onStepClick(step, phase.id)} 
          />
        ))}
        {phase.steps.length === 0 && (
            <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
                No steps defined
            </div>
        )}
        {onAddStep && (
          <button
            onClick={() => onAddStep(phase.id)}
            className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Step
          </button>
        )}
      </div>
    </div>
  );
};

export default PhaseColumn;