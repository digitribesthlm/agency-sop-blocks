import React, { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, Loader2, RefreshCw, Search, X, Filter, Eye, EyeOff } from 'lucide-react';

interface ReffViewProps {
  onBack: () => void;
}

interface AirtableRecord {
  id: string;
  createdTime?: string;
  fields: Record<string, any>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001/api' : '/api');

const ReffView: React.FC<ReffViewProps> = ({ onBack }) => {
  const [data, setData] = useState<AirtableRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set());

  const fetchAirtableData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!API_BASE_URL) {
        throw new Error('API URL not configured. Please set VITE_API_URL environment variable.');
      }
      
      const response = await fetch(`${API_BASE_URL}/airtable`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.message || result.error);
      }
      
      if (result.records && result.records.length > 0) {
        setData(result.records);
        
        const allFields = new Set<string>();
        result.records.forEach((record: AirtableRecord) => {
          Object.keys(record.fields).forEach(field => allFields.add(field));
        });
        
        // Prioritize Title and URL columns, then sort the rest
        const priorityColumns = ['Title', 'URL'];
        const otherColumns = Array.from(allFields)
          .filter(field => !priorityColumns.includes(field))
          .sort();
        const orderedColumns = [...priorityColumns.filter(col => allFields.has(col)), ...otherColumns];
        setColumns(orderedColumns);
        
        // Show Title, URL, Category, Owner, File Type by default
        const defaultVisible = new Set(['Title', 'URL', 'Category', 'Owner', 'File Type', 'Flow']);
        setVisibleColumns(new Set(orderedColumns.filter(col => defaultVisible.has(col) || priorityColumns.includes(col))));
      } else {
        setData([]);
        setColumns([]);
      }
    } catch (err) {
      console.error('Error fetching Airtable data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirtableData();
  }, []);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set<string>();
    data.forEach(record => {
      const category = record.fields['Category'];
      if (Array.isArray(category)) {
        category.forEach(cat => cats.add(cat));
      } else if (category) {
        cats.add(String(category));
      }
    });
    return Array.from(cats).sort();
  }, [data]);

  // Filter data based on search query and category
  const filteredData = useMemo(() => {
    let filtered = data;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(record => {
        const category = record.fields['Category'];
        if (Array.isArray(category)) {
          return category.includes(selectedCategory);
        }
        return String(category) === selectedCategory;
      });
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(record => {
        return Object.values(record.fields).some(value => {
          if (Array.isArray(value)) {
            return value.some(item => String(item).toLowerCase().includes(query));
          }
          return String(value).toLowerCase().includes(query);
        });
      });
    }
    
    return filtered;
  }, [data, searchQuery, selectedCategory]);

  // Get visible columns (default visible or user-selected)
  const displayColumns = useMemo(() => {
    if (visibleColumns.size === 0) {
      // If no columns selected, show all
      return columns;
    }
    return columns.filter(col => visibleColumns.has(col));
  }, [columns, visibleColumns]);

  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'string' && value.length > 100) {
      return value.substring(0, 100) + '...';
    }
    return String(value);
  };

  const formatCellValueWithHighlight = (value: any, column: string): React.ReactNode => {
    const formatted = formatCellValue(value);
    if (!searchQuery.trim() || !formatted) return formatted;
    
    const query = searchQuery.toLowerCase();
    const lowerFormatted = formatted.toLowerCase();
    const index = lowerFormatted.indexOf(query);
    
    if (index === -1) return formatted;
    
    const before = formatted.substring(0, index);
    const match = formatted.substring(index, index + searchQuery.length);
    const after = formatted.substring(index + searchQuery.length);
    
    return (
      <span>
        {before}
        <mark className="bg-yellow-200 px-0.5 rounded">{match}</mark>
        {after}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
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
                Reff
                <span className="mx-2 text-gray-300">/</span>
                <span className="text-sm font-normal text-slate-500">Reference</span>
              </h1>
            </div>
          </div>
          
          <button
            onClick={fetchAirtableData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Loading data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">Error loading data:</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button
                onClick={fetchAirtableData}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-slate-600 text-lg">No data found</p>
              <p className="text-slate-500 text-sm mt-2">The Airtable appears to be empty.</p>
            </div>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="max-w-full">
            {/* Filters and Search Bar */}
            <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search across all fields..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                {/* Category Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Column Visibility Toggle */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">Visible Columns:</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {columns.map(column => {
                    const isVisible = visibleColumns.has(column) || visibleColumns.size === 0;
                    return (
                      <button
                        key={column}
                        onClick={() => {
                          const newVisible = new Set(visibleColumns);
                          if (isVisible) {
                            newVisible.delete(column);
                            // Always keep Title and URL visible
                            if (column !== 'Title' && column !== 'URL') {
                              setVisibleColumns(newVisible);
                            }
                          } else {
                            newVisible.add(column);
                            setVisibleColumns(newVisible);
                          }
                        }}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          isVisible || (column === 'Title' || column === 'URL')
                            ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                            : 'bg-gray-100 text-gray-500 border-gray-300'
                        } ${(column === 'Title' || column === 'URL') ? 'cursor-not-allowed opacity-75' : 'hover:bg-indigo-50'}`}
                        disabled={column === 'Title' || column === 'URL'}
                        title={column === 'Title' || column === 'URL' ? 'Required column' : ''}
                      >
                        {isVisible ? <Eye className="w-3 h-3 inline mr-1" /> : <EyeOff className="w-3 h-3 inline mr-1" />}
                        {column}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
                <span>
                  Showing <span className="font-semibold text-indigo-600">{filteredData.length}</span> of{' '}
                  <span className="font-semibold">{data.length}</span> records
                </span>
                {(searchQuery || selectedCategory !== 'all') && (
                  <span className="text-xs text-gray-500">
                    {searchQuery && `Search: "${searchQuery}"`}
                    {searchQuery && selectedCategory !== 'all' && ' • '}
                    {selectedCategory !== 'all' && `Category: ${selectedCategory}`}
                  </span>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      {displayColumns.map((column) => (
                        <th
                          key={column}
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 whitespace-nowrap"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={displayColumns.length} className="px-6 py-8 text-center text-gray-500">
                          No records match your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((record) => (
                        <tr key={record.id} className="hover:bg-indigo-50 transition-colors border-b border-gray-100">
                          {displayColumns.map((column) => {
                            const value = record.fields[column];
                            const formatted = formatCellValue(value);
                            const isLongText = formatted.length > 50;
                            const isUrl = column === 'URL';
                            
                            return (
                              <td
                                key={`${record.id}-${column}`}
                                className={`px-4 py-3 text-sm text-gray-900 ${isUrl ? 'max-w-md' : ''}`}
                              >
                                {isUrl && formatted ? (
                                  <a
                                    href={formatted}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-800 hover:underline truncate block"
                                    title={formatted}
                                  >
                                    {formatCellValueWithHighlight(value, column)}
                                  </a>
                                ) : isLongText ? (
                                  <div className="max-w-xs">
                                    <div className="truncate" title={formatted}>
                                      {formatCellValueWithHighlight(value, column)}
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    {formatCellValueWithHighlight(value, column)}
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReffView;

