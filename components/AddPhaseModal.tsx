import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Phase } from '../types';

interface AddPhaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, phaseNumber: number) => Promise<void>;
  categoryId: string;
  categoryTitle: string;
  existingPhases: Phase[];
}

const AddPhaseModal: React.FC<AddPhaseModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  categoryId,
  categoryTitle,
  existingPhases 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [phaseNumber, setPhaseNumber] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate suggested phase number
  const getSuggestedPhaseNumber = () => {
    if (existingPhases.length === 0) {
      return 1;
    }
    const maxPhaseNumber = Math.max(...existingPhases.map(p => p.phaseNumber));
    return maxPhaseNumber + 1;
  };

  React.useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setPhaseNumber(getSuggestedPhaseNumber());
      setError(null);
    }
  }, [isOpen, existingPhases]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    // Check if phase number already exists
    if (existingPhases.some(p => p.phaseNumber === phaseNumber)) {
      setError('A phase with this number already exists');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(title.trim(), description.trim(), phaseNumber);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create phase');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add New Phase</h2>
            <p className="text-sm text-slate-500 mt-1">Category: {categoryTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phase Number <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={phaseNumber}
              onChange={(e) => setPhaseNumber(parseInt(e.target.value) || 1)}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">The order/sequence number for this phase</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phase Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Learning Process, Building Process"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this phase covers..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving || !title.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Creating...' : 'Create Phase'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPhaseModal;

