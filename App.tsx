import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import SOPView from './components/SOPView';
import Login from './components/Login';
import TimeReport from './components/TimeReport';
import ApiError from './components/ApiError';
import { SOPService } from './services/sopService';
import { authService } from './services/authService';
import { SOPCollection, SOPCategory } from './types';
import { Loader2, LogOut, User, Clock } from 'lucide-react';

// In production, use same origin (Vercel handles routing)
// In development, use localhost backend
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001/api' : '/api');

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [view, setView] = useState<'dashboard' | 'sop' | 'time-report'>('dashboard');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [data, setData] = useState<SOPCollection>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial Data Load (only if authenticated)
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setError(null);
        const result = await SOPService.getAll();
        console.log('Fetched categories:', result);
        if (!Array.isArray(result)) {
          throw new Error('Invalid data format received from API');
        }
        setData(result);
      } catch (error) {
        console.error("Failed to load SOP data", error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setView('dashboard');
    setActiveCategoryId(null);
  };

  // Reload data to reflect updates
  const handleDataUpdate = async () => {
    const result = await SOPService.getAll();
    setData(result);
  };

  const handleSelectCategory = (id: string) => {
    setActiveCategoryId(id);
    setView('sop');
  };

  const handleBack = () => {
    setActiveCategoryId(null);
    setView('dashboard');
  };

  // Show API error if API URL is not configured (in production)
  if (!API_BASE_URL && !import.meta.env.DEV) {
    return <ApiError />;
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const currentUser = authService.getCurrentUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Loading System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header with user info and logout */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-slate-900">Agency Process Hub</h1>
        </div>
        <div className="flex items-center space-x-4">
          {currentUser && (
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <User className="w-4 h-4" />
              <span>{currentUser.name}</span>
              {currentUser.clientId && (
                <span className="text-slate-400">•</span>
              )}
              {currentUser.clientId && (
                <span className="text-xs bg-slate-100 px-2 py-1 rounded">{currentUser.clientId}</span>
              )}
            </div>
          )}
          <button
            onClick={() => setView('time-report')}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Clock className="w-4 h-4" />
            <span>Time Report</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {view === 'dashboard' && (
        <>
          {error && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">Error loading data:</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    setLoading(true);
                    SOPService.getAll()
                      .then(result => {
                        setData(result);
                        setLoading(false);
                      })
                      .catch(err => {
                        setError(err.message);
                        setLoading(false);
                      });
                  }}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          {!error && data.length === 0 && !loading && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center">
                <p className="text-slate-600 text-lg">No categories found.</p>
                <p className="text-slate-500 text-sm mt-2">Please check your database connection and ensure data is imported.</p>
              </div>
            </div>
          )}
          {!error && (data.length > 0 || loading) && (
            <Dashboard 
              categories={data} 
              onSelectCategory={handleSelectCategory} 
            />
          )}
        </>
      )}

      {view === 'sop' && activeCategoryId && (
        <SOPView 
          category={data.find(c => c.id === activeCategoryId)!} 
          onBack={handleBack}
          onUpdate={handleDataUpdate}
        />
      )}

      {view === 'time-report' && (
        <TimeReport 
          onBack={() => setView('dashboard')}
        />
      )}
    </div>
  );
};

export default App;