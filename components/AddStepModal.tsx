import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Step } from '../types';

interface AddStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (code: string, title: string, content: string, status: Step['status']) => Promise<void>;
  phaseId: string;
  phaseTitle: string;
  existingSteps: Step[];
}

const AddStepModal: React.FC<AddStepModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  phaseId, 
  phaseTitle,
  existingSteps 
}) => {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<Step['status']>('pending');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate suggested code based on existing steps
  const getSuggestedCode = () => {
    if (existingSteps.length === 0) {
      return '1.1';
    }
    
    const codes = existingSteps.map(s => {
      const parts = s.code.split('.');
      return parts.length > 0 ? parseInt(parts[0]) : 0;
    });
    const maxCode = Math.max(...codes);
    const nextNum = maxCode + 1;
    return `${nextNum}.1`;
  };

  React.useEffect(() => {
    if (isOpen) {
      setCode(getSuggestedCode());
      setTitle('');
      setContent('');
      setStatus('pending');
      setError(null);
    }
  }, [isOpen, existingSteps]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code.trim() || !title.trim()) {
      setError('Code and title are required');
      return;
    }

    // Check if code already exists
    if (existingSteps.some(s => s.code === code.trim())) {
      setError('A step with this code already exists');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(code.trim(), title.trim(), content.trim(), status);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create step');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add New Step</h2>
            <p className="text-sm text-slate-500 mt-1">Phase: {phaseTitle}</p>
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
              Step Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g., 1.1, 2.3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Unique identifier for this step</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Step Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Questions, Analysis"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Step['status'])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Content (Optional)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add step content here (markdown supported)..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
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
            disabled={isSaving || !code.trim() || !title.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Creating...' : 'Create Step'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStepModal;

