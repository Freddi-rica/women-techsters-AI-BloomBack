
import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Play, Mic, Book, ChevronLeft, Bookmark, Plus, Check } from 'lucide-react';
import { DUMMY_RESOURCES } from '../constants';
import { ResourceType, Resource } from '../types';

interface ResourcesProps {
  onBack: () => void;
  onAddGoal: (resource: Resource) => void;
  addedGoalIds: Set<string>;
}

const Resources: React.FC<ResourcesProps> = ({ onBack, onAddGoal, addedGoalIds }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All', icon: null },
    { id: 'article', label: 'Articles', icon: BookOpen },
    { id: 'video', label: 'Videos', icon: Play },
    { id: 'podcast', label: 'Podcasts', icon: Mic },
    { id: 'book', label: 'Books', icon: Book },
  ];

  const filteredResources = useMemo(() => {
    return DUMMY_RESOURCES.filter(res => {
      const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            res.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeCategory === 'all' || res.type === activeCategory;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeCategory]);

  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'article': return <BookOpen size={16} />;
      case 'video': return <Play size={16} />;
      case 'podcast': return <Mic size={16} />;
      case 'book': return <Book size={16} />;
    }
  };

  const getTypeColor = (type: ResourceType) => {
    switch (type) {
      case 'article': return 'text-blue-500 bg-blue-50';
      case 'video': return 'text-red-500 bg-red-50';
      case 'podcast': return 'text-purple-500 bg-purple-50';
      case 'book': return 'text-amber-600 bg-amber-50';
    }
  };

  return (
    <div className="min-h-full animate-in fade-in duration-500 bg-bloom-50/30 pb-24">
      <header className="bg-white border-b border-pink-50 sticky top-0 z-20">
        <div className="p-6 pb-2">
          <div className="flex items-center space-x-3 mb-6">
            <button onClick={onBack} className="p-2 -ml-2 text-bloom-300 hover:text-bloom-500 transition-colors">
              <ChevronLeft size={24} />
            </button>
            <h1 className="serif-title text-2xl text-bloom-500">Resource Library</h1>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-bloom-300" size={18} />
            <input 
              type="text" 
              placeholder="Search articles, videos, podcasts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bloom-50 border border-pink-100 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-bloom-200 outline-none transition-all placeholder:text-bloom-200"
            />
          </div>
        </div>

        {/* Scrollable Category Bar with Indicator Slider */}
        <div className="relative overflow-hidden group border-b border-pink-50/50">
          <div className="flex space-x-2 overflow-x-auto no-scrollbar px-6 pb-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative flex items-center space-x-2 whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat.id 
                    ? 'text-bloom-500' 
                    : 'text-bloom-200 hover:text-bloom-400'
                }`}
              >
                {cat.icon && <cat.icon size={12} />}
                <span>{cat.label}</span>
                {activeCategory === cat.id && (
                  <div className="absolute bottom-[-16px] left-0 right-0 h-1 bg-bloom-500 rounded-full animate-in slide-in-from-left-2 duration-300" />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="p-6 space-y-5">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-black text-bloom-300 uppercase tracking-[0.2em]">
            {filteredResources.length} Items Found
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {filteredResources.map((res, idx) => {
            const isAdded = addedGoalIds.has(res.id);
            return (
              <div 
                key={res.id} 
                style={{ animationDelay: `${idx * 40}ms` }}
                className="bg-white p-6 rounded-[2rem] border border-pink-100 shadow-sm flex flex-col group transition-all animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg font-black uppercase text-[8px] tracking-wider ${getTypeColor(res.type)}`}>
                    {getTypeIcon(res.type)}
                    <span>{res.type}</span>
                  </div>
                  <Bookmark size={16} className="text-pink-100" />
                </div>
                
                <h3 className="font-bold text-bloom-500 text-lg leading-tight mb-2">
                  {res.title}
                </h3>
                <p className="text-xs text-bloom-500/60 leading-relaxed mb-6 line-clamp-2">
                  {res.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-pink-50">
                  <span className="text-[9px] text-bloom-200 font-black uppercase tracking-widest">
                    {res.duration}
                  </span>
                  <button 
                    onClick={() => onAddGoal(res)}
                    disabled={isAdded}
                    className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 ${
                      isAdded 
                        ? 'bg-green-50 text-accent-green' 
                        : 'bg-accent-green text-white shadow-lg shadow-green-100'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        <span>Add Goal</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Resources;
