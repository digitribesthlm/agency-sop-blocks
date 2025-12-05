import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Check, Loader2, Trash2, Timer, Pause, Play, RefreshCw, Users, FileText } from 'lucide-react';
import { Step } from '../types';
import { clientsService, Client } from '../services/clientsService';
import { timeTrackingService } from '../services/timeTrackingService';
import { authService } from '../services/authService';

interface StepEditorProps {
  step: Step;
  isOpen: boolean;
  onClose: () => void;
  onSave: (stepId: string, content: string, status: Step['status'], notes?: string) => Promise<void>;
  categoryId: string;
  categoryTitle: string;
  phaseId: string;
  phaseTitle: string;
}

const StepEditor: React.FC<StepEditorProps> = ({ step, isOpen, onClose, onSave, categoryId, categoryTitle, phaseId, phaseTitle }) => {
  const [content, setContent] = useState(step.content);
  const [status, setStatus] = useState<Step['status']>(step.status);
  const [notes, setNotes] = useState(step.notes || '');
  const [isSaving, setIsSaving] = useState(false);
  
  // Customer State
  const [selectedCustomer, setSelectedCustomer] = useState<string>(() => {
    return localStorage.getItem('agency_sop_selected_client') || '';
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);

  // Timer State
  const [timerActive, setTimerActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const accumulatedSecondsRef = useRef(0); // Track total seconds accumulated across sessions
  const sessionStartTimeRef = useRef<number | null>(null); // Track when current session started

  // Load clients from API
  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await clientsService.getAll();
        setClients(data);
      } catch (error) {
        console.error('Failed to load clients:', error);
      } finally {
        setClientsLoading(false);
      }
    };
    loadClients();
  }, []);

  // Sync state when step prop changes
  useEffect(() => {
    setContent(step.content);
    setStatus(step.status);
    setNotes(step.notes || '');
    setSeconds(0);
    setTimerActive(false);
    accumulatedSecondsRef.current = 0;
    sessionStartTimeRef.current = null;
  }, [step]);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timerActive) {
      if (sessionStartTimeRef.current === null) {
        sessionStartTimeRef.current = Date.now();
      }
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      // When paused, save the current session time
      if (sessionStartTimeRef.current !== null && seconds > 0) {
        accumulatedSecondsRef.current += seconds;
        setSeconds(0);
        sessionStartTimeRef.current = null;
      }
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCustomer(val);
    localStorage.setItem('agency_sop_selected_client', val);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (timerActive) {
      // Pausing - accumulate current session
      if (seconds > 0) {
        accumulatedSecondsRef.current += seconds;
        setSeconds(0);
      }
    }
    setTimerActive(!timerActive);
  };
  
  const resetTimer = () => {
    setTimerActive(false);
    setSeconds(0);
    accumulatedSecondsRef.current = 0;
    sessionStartTimeRef.current = null;
  };

  // Save time when closing
  const saveTimeLog = async () => {
    // Calculate total time: accumulated time + current session time
    let totalTime = accumulatedSecondsRef.current;
    if (timerActive && seconds > 0) {
      totalTime += seconds;
    }
    
    if (totalTime > 0) {
      const user = authService.getCurrentUser();
      if (user) {
        try {
          await timeTrackingService.logTime({
            userId: user._id,
            clientId: selectedCustomer || undefined,
            categoryId,
            categoryTitle,
            phaseId,
            phaseTitle,
            stepId: step.id,
            stepTitle: step.title,
            stepCode: step.code,
            seconds: totalTime,
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
          });
        } catch (error) {
          console.error('Failed to save time log:', error);
        }
      }
    }
  };

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(step.id, content, status, notes);
    await saveTimeLog();
    setIsSaving(false);
    onClose();
  };

  const handleClose = async () => {
    await saveTimeLog();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-7xl h-[90vh] rounded-xl shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-mono font-bold">
                {step.code}
              </span>
              <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">SOP Detail</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            
            {/* Customer Dropdown */}
            <div className="flex items-center space-x-2 border-r border-gray-200 pr-4 mr-2">
                <Users className="w-4 h-4 text-gray-400" />
                <select
                    value={selectedCustomer}
                    onChange={handleCustomerChange}
                    disabled={clientsLoading}
                    className="bg-transparent text-sm font-medium text-gray-600 focus:outline-none cursor-pointer hover:text-indigo-600 transition-colors disabled:opacity-50"
                >
                    <option value="" disabled>Select Client...</option>
                    {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            {/* Focus Timer Control */}
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-colors ${timerActive ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200'}`}>
                <div className="font-mono text-lg font-bold w-16 text-center text-slate-700">
                    {formatTime(seconds)}
                </div>
                <button 
                    onClick={toggleTimer}
                    className={`p-1.5 rounded-md transition-colors ${timerActive ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    title={timerActive ? "Pause Timer" : "Start Focus Timer"}
                >
                    {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button 
                    onClick={resetTimer}
                    className="p-1.5 rounded-md bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
                    title="Reset Timer"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            <button 
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Process Step Editor */}
            <div className="flex-1 flex flex-col border-r border-gray-100">
                <div className="bg-gray-50 px-6 py-2 border-b border-gray-100 text-xs font-medium text-gray-500 flex justify-between items-center">
                    <span className="flex items-center">
                        Process Step
                        {selectedCustomer && (
                             <span className="ml-2 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">
                                For: {clients.find(c => c.id === selectedCustomer)?.name}
                             </span>
                        )}
                    </span>
                    <span className="flex items-center text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        <Timer className="w-3 h-3 mr-1" />
                        {timerActive ? 'Focus Mode Active' : 'Focus Mode Paused'}
                    </span>
                </div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 w-full p-6 focus:outline-none resize-none font-mono text-sm leading-relaxed text-gray-700"
                    placeholder="Describe the SOP steps here..."
                />
            </div>

            {/* Improvement Notes Section */}
            <div className="flex-1 flex flex-col border-r border-gray-100">
                <div className="bg-gray-50 px-6 py-2 border-b border-gray-100 text-xs font-medium text-gray-500 flex items-center">
                    <FileText className="w-3 h-3 mr-2" />
                    Improvement Notes
                </div>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="flex-1 w-full p-6 focus:outline-none resize-none font-mono text-sm leading-relaxed text-gray-700"
                    placeholder="Add notes for improvements, observations, or ideas here..."
                />
            </div>

            {/* Sidebar Controls */}
            <div className="w-full md:w-64 bg-gray-50 p-6 flex-shrink-0 space-y-6 overflow-y-auto">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Status
                    </label>
                    <div className="space-y-2">
                        {['pending', 'in-progress', 'completed'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatus(s as Step['status'])}
                                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                                    status === s 
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <span className="capitalize flex-1 text-left">{s.replace('-', ' ')}</span>
                                {status === s && <Check className="w-4 h-4 ml-2" />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-400 mb-4">
                        Working on this block? <br/>
                        Start the timer above to track your focus session for 
                        <span className="font-semibold text-gray-600">
                            {selectedCustomer ? ` ${clients.find(c => c.id === selectedCustomer)?.name}` : ' your client'}.
                        </span>
                    </p>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-between items-center">
            <button className="text-red-500 text-sm hover:bg-red-50 px-3 py-2 rounded-lg transition-colors flex items-center">
                <Trash2 className="w-4 h-4 mr-2" /> Reset
            </button>
            <div className="flex space-x-3">
                <button 
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StepEditor;