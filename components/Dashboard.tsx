import React from 'react';
import { 
  Search, MousePointerClick, Facebook, Linkedin, Zap, MapPin, 
  ArrowRight, FileText, Activity, Briefcase
} from 'lucide-react';
import { SOPCollection } from '../types';

interface DashboardProps {
  categories: SOPCollection;
  onSelectCategory: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ categories, onSelectCategory }) => {
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search': return <Search className="w-8 h-8" />;
      case 'MousePointerClick': return <MousePointerClick className="w-8 h-8" />;
      case 'Facebook': return <Facebook className="w-8 h-8" />;
      case 'Linkedin': return <Linkedin className="w-8 h-8" />;
      case 'Zap': return <Zap className="w-8 h-8" />;
      case 'MapPin': return <MapPin className="w-8 h-8" />;
      case 'Briefcase': return <Briefcase className="w-8 h-8" />;
      case 'Activity': return <Activity className="w-8 h-8" />;
      default: return <FileText className="w-8 h-8" />;
    }
  };

  const getColor = (id: string) => {
    const colors: Record<string, string> = {
      'seo': 'bg-blue-50 text-blue-600 hover:border-blue-200',
      'google-ads': 'bg-red-50 text-red-600 hover:border-red-200',
      'fb-ads': 'bg-sky-50 text-sky-600 hover:border-sky-200',
      'linkedin-ads': 'bg-indigo-50 text-indigo-600 hover:border-indigo-200',
      'conversion': 'bg-amber-50 text-amber-600 hover:border-amber-200',
      'local-seo': 'bg-emerald-50 text-emerald-600 hover:border-emerald-200',
      'bo': 'bg-purple-50 text-purple-600 hover:border-purple-200',
      'tracking': 'bg-pink-50 text-pink-600 hover:border-pink-200',
    };
    return colors[id] || 'bg-gray-50 text-gray-600';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Agency Process Hub
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Select a domain below to access the operational block system and standard procedures.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div 
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
          >
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-colors ${getColor(cat.id)}`}>
              {getIcon(cat.icon)}
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
              {cat.title}
            </h3>
            
            <p className="text-slate-500 mb-8 leading-relaxed h-12 overflow-hidden">
              {cat.description}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="flex items-center text-xs text-gray-400 font-medium">
                <Activity className="w-4 h-4 mr-1.5" />
                {cat.phases.length} Phases
              </div>
              <span className="flex items-center text-sm font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                Access SOP <ArrowRight className="w-4 h-4 ml-1.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;