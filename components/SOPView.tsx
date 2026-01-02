import React, { useState } from 'react';
import { ArrowLeft, Settings, Share2, MoreHorizontal, Plus } from 'lucide-react';
import { SOPCategory, Step } from '../types';
import PhaseColumn from './PhaseColumn';
import StepEditor from './StepEditor';
import AddStepModal from './AddStepModal';
import AddPhaseModal from './AddPhaseModal';
import { SOPService } from '../services/sopService';

interface SOPViewProps {
  category: SOPCategory;
  onBack: () => void;
  onUpdate: () => void;
}

const SOPView: React.FC<SOPViewProps> = ({ category, onBack, onUpdate }) => {
  const [selectedStep, setSelectedStep] = useState<{ step: Step; phaseId: string } | null>(null);
  const [addStepPhaseId, setAddStepPhaseId] = useState<string | null>(null);
  const [showAddPhase, setShowAddPhase] = useState(false);

  const handleStepClick = (step: Step, phaseId: string) => {
    setSelectedStep({ step, phaseId });
  };

  const handleAddStep = (phaseId: string) => {
    setAddStepPhaseId(phaseId);
  };

  const handleSaveStep = async (stepId: string, content: string, status: Step['status'], notes?: string) => {
    if (selectedStep) {
        await SOPService.updateStep(category.id, selectedStep.phaseId, stepId, { content, status, notes });
        onUpdate(); // Trigger re-fetch in parent
    }
  };

  const handleCreateStep = async (code: string, title: string, content: string, status: Step['status']) => {
    if (addStepPhaseId) {
      await SOPService.createStep(addStepPhaseId, code, title, content, status);
      onUpdate(); // Trigger re-fetch in parent
      setAddStepPhaseId(null);
    }
  };

  const handleCreatePhase = async (title: string, description: string, phaseNumber: number) => {
    await SOPService.createPhase(category.id, title, description, phaseNumber);
    onUpdate(); // Trigger re-fetch in parent
    setShowAddPhase(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0 z-20">
        <div className="max-w-full mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full text-slate-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center">
                {category.title}
                <span className="mx-2 text-gray-300">/</span>
                <span className="text-sm font-normal text-slate-500">Master SOP</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center -space-x-2 mr-4">
                {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500">
                        {String.fromCharCode(64 + i)}
                    </div>
                ))}
            </div>
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowAddPhase(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Phase
            </button>
            <button className="hidden sm:inline-flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                Actions
            </button>
          </div>
        </div>
      </header>

      {/* Kanban/Phase Board Area */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden horizontal-scroll">
        <div className="h-full flex p-6 space-x-6 min-w-max">
            {category.phases.length > 0 ? (
                category.phases.map((phase, index) => (
                    <PhaseColumn 
                        key={phase.id} 
                        phase={phase} 
                        onStepClick={handleStepClick}
                        onAddStep={handleAddStep}
                        isLast={index === category.phases.length - 1}
                    />
                ))
            ) : (
                <div className="w-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Settings className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No Phases Defined</h3>
                    <p className="text-gray-500 max-w-md mt-2 mb-4">This category doesn't have any phases setup yet. Start by defining your high-level process blocks.</p>
                    <button
                      onClick={() => setShowAddPhase(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Create First Phase
                    </button>
                </div>
            )}
        </div>
      </main>

      {/* Editor Modal */}
      {selectedStep && (
        <StepEditor
            step={selectedStep.step}
            isOpen={!!selectedStep}
            onClose={() => setSelectedStep(null)}
            onSave={handleSaveStep}
            categoryId={category.id}
            categoryTitle={category.title}
            phaseId={selectedStep.phaseId}
            phaseTitle={category.phases.find(p => p.id === selectedStep.phaseId)?.title || ''}
        />
      )}

      {/* Add Step Modal */}
      {addStepPhaseId && (
        <AddStepModal
          isOpen={!!addStepPhaseId}
          onClose={() => setAddStepPhaseId(null)}
          onSave={handleCreateStep}
          phaseId={addStepPhaseId}
          phaseTitle={category.phases.find(p => p.id === addStepPhaseId)?.title || ''}
          existingSteps={category.phases.find(p => p.id === addStepPhaseId)?.steps || []}
        />
      )}

      {/* Add Phase Modal */}
      {showAddPhase && (
        <AddPhaseModal
          isOpen={showAddPhase}
          onClose={() => setShowAddPhase(false)}
          onSave={handleCreatePhase}
          categoryId={category.id}
          categoryTitle={category.title}
          existingPhases={category.phases}
        />
      )}
    </div>
  );
};

export default SOPView;