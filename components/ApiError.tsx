import React from 'react';
import { AlertCircle } from 'lucide-react';

const ApiError: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-lg shadow-lg border border-red-200 p-8 max-w-md w-full">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
          <h2 className="text-xl font-bold text-slate-900">Configuration Error</h2>
        </div>
        <p className="text-slate-700 mb-4">
          The API URL is not configured. Please set the <code className="bg-slate-100 px-2 py-1 rounded text-sm">VITE_API_URL</code> environment variable in your deployment settings.
        </p>
        <div className="bg-slate-50 p-4 rounded border border-slate-200">
          <p className="text-sm text-slate-600 font-medium mb-2">For Vercel:</p>
          <ol className="text-sm text-slate-600 list-decimal list-inside space-y-1">
            <li>Go to Project Settings → Environment Variables</li>
            <li>Add <code className="bg-white px-1 rounded">VITE_API_URL</code></li>
            <li>Set value to your backend API URL (e.g., <code className="bg-white px-1 rounded">https://your-api.com/api</code>)</li>
            <li>Redeploy your application</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ApiError;

