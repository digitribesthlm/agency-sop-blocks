import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Calendar, BarChart3, Loader2, TrendingUp } from 'lucide-react';
import { timeTrackingService, TimeSummary } from '../services/timeTrackingService';
import { authService } from '../services/authService';

interface TimeReportProps {
  onBack: () => void;
}

const TimeReport: React.FC<TimeReportProps> = ({ onBack }) => {
  const [summary, setSummary] = useState<TimeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(1); // First day of current month
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const loadSummary = async () => {
    setLoading(true);
    try {
      const user = authService.getCurrentUser();
      const data = await timeTrackingService.getSummary(startDate, endDate, user?._id);
      setSummary(data);
    } catch (error) {
      console.error('Failed to load time summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, [startDate, endDate]);

  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const formatTime = (seconds: number) => {
    const hours = seconds / 3600;
    return formatHours(hours);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Loading time report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full text-slate-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Time Summary Report</h1>
              <p className="text-sm text-slate-500 mt-1">Track where you spend your time</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-slate-400" />
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {!summary || summary.totalSeconds === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Time Data</h3>
            <p className="text-slate-500">Start tracking time by using the timer in step editor.</p>
          </div>
        ) : (
          <>
            {/* Total Time Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg p-8 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium mb-2">Total Time Tracked</p>
                  <h2 className="text-4xl font-bold">{formatHours(summary.totalHours)}</h2>
                  <p className="text-indigo-100 text-sm mt-2">{summary.totalSeconds} seconds</p>
                </div>
                <TrendingUp className="w-16 h-16 text-indigo-200 opacity-50" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* By Category */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                  Time by Category
                </h3>
                <div className="space-y-4">
                  {Object.entries(summary.byCategory)
                    .sort((a, b) => b[1].seconds - a[1].seconds)
                    .map(([categoryId, data]) => (
                      <div key={categoryId} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{data.categoryTitle}</p>
                          <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${(data.seconds / summary.totalSeconds) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="font-semibold text-slate-900">{formatTime(data.seconds)}</p>
                          <p className="text-xs text-slate-500">{data.hours.toFixed(2)}h</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* By Client */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                  Time by Client
                </h3>
                <div className="space-y-4">
                  {Object.entries(summary.byClient)
                    .sort((a, b) => b[1].seconds - a[1].seconds)
                    .map(([clientId, data]) => (
                      <div key={clientId} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{data.clientName}</p>
                          <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                            <div
                              className="bg-emerald-600 h-2 rounded-full"
                              style={{ width: `${(data.seconds / summary.totalSeconds) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="font-semibold text-slate-900">{formatTime(data.seconds)}</p>
                          <p className="text-xs text-slate-500">{data.hours.toFixed(2)}h</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* By Phase */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                  Time by Phase
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {Object.entries(summary.byPhase)
                    .sort((a, b) => b[1].seconds - a[1].seconds)
                    .slice(0, 10)
                    .map(([phaseId, data]) => (
                      <div key={phaseId} className="flex items-center justify-between py-2 border-b border-gray-100">
                        <p className="font-medium text-slate-700 text-sm">{data.phaseTitle}</p>
                        <p className="font-semibold text-slate-900">{formatTime(data.seconds)}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* By Date */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                  Time by Date
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {Object.entries(summary.byDate)
                    .sort((a, b) => b[0].localeCompare(a[0]))
                    .map(([date, data]) => (
                      <div key={date} className="flex items-center justify-between py-2 border-b border-gray-100">
                        <p className="font-medium text-slate-700 text-sm">
                          {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                        <p className="font-semibold text-slate-900">{formatTime(data.seconds)}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default TimeReport;

