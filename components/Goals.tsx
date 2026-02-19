
import React from 'react';
import { ChevronLeft, Target, Trash2, CheckCircle, ExternalLink, BookOpen, Play, Mic, Book, CheckCircle2 } from 'lucide-react';
import { UserGoal } from '../App';

interface GoalsProps {
  onBack: () => void;
  goals: UserGoal[];
  onRemoveGoal: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onToggleComplete: (id: string) => void;
}

const Goals: React.FC<GoalsProps> = ({ onBack, goals, onRemoveGoal, onUpdateProgress, onToggleComplete }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <BookOpen size={16} />;
      case 'video': return <Play size={16} />;
      case 'podcast': return <Mic size={16} />;
      case 'book': return <Book size={16} />;
      default: return <Target size={16} />;
    }
  };

  const calculateOverallProgress = () => {
    if (goals.length === 0) return 0;
    const sum = goals.reduce((acc, goal) => acc + goal.progress, 0);
    return Math.round(sum / goals.length);
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div className="min-h-full animate-in fade-in duration-500 bg-bloom-50/30 pb-24">
      <header className="bg-white border-b border-pink-50 sticky top-0 z-20 p-6">
        <div className="flex items-center space-x-3 mb-2">
          <button onClick={onBack} className="p-2 -ml-2 text-bloom-300 hover:text-bloom-500 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="serif-title text-2xl text-bloom-500">Growth Roadmap</h1>
        </div>
        <p className="text-xs text-bloom-300 font-bold uppercase tracking-widest ml-9">Resources committed to your growth</p>
      </header>

      <div className="p-6 space-y-6">
        {/* Progress Overview Card */}
        <div className="bg-gradient-to-br from-bloom-500 to-bloom-400 p-6 rounded-[2.5rem] text-white shadow-xl shadow-bloom-100 relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-center mb-4 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Total Mastery</span>
            <Target size={20} className="opacity-80" />
          </div>
          <div className="flex items-end space-x-2 mb-2 relative z-10">
            <span className="text-4xl serif-title">{overallProgress}%</span>
            <span className="text-sm font-bold opacity-70 mb-1">Overall Progress</span>
          </div>
          <div className="w-full h-2.5 bg-white/20 rounded-full mt-4 relative z-10">
            <div 
              className="h-full bg-accent-green rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(34,197,94,0.5)]" 
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <p className="text-[9px] font-bold uppercase tracking-widest mt-4 opacity-60 relative z-10">
            {goals.filter(g => g.completed).length} of {goals.length} Roadmap items completed
          </p>
        </div>

        <div className="space-y-5">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-black text-bloom-300 uppercase tracking-widest">Your Learning Path</h3>
          </div>
          
          {goals.length > 0 ? (
            goals.map((goal, idx) => (
              <div 
                key={goal.id}
                style={{ animationDelay: `${idx * 100}ms` }}
                className={`p-6 rounded-[2.5rem] border transition-all duration-500 group animate-in slide-in-from-bottom-4 shadow-sm ${
                  goal.completed 
                    ? 'bg-green-50 border-accent-green/20' 
                    : 'bg-white border-pink-100 hover:border-bloom-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      goal.completed ? 'bg-accent-green text-white shadow-lg shadow-green-100' : 'bg-bloom-50 text-bloom-500'
                    }`}>
                      {goal.completed ? <CheckCircle2 size={24} /> : getTypeIcon(goal.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${goal.completed ? 'text-accent-green' : 'text-bloom-300'}`}>
                          {goal.category}
                        </span>
                        {goal.completed && (
                          <span className="bg-accent-green text-white text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                            Completed
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-bloom-700 text-[15px] leading-tight group-hover:text-bloom-900 transition-colors">
                        {goal.title}
                      </h4>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemoveGoal(goal.id)}
                    className="p-2 text-pink-100 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Individual Progress Slider */}
                <div className="space-y-3 mt-6">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] font-black text-bloom-300 uppercase tracking-widest">Level of Progress</span>
                    <span className={`text-[11px] font-bold ${goal.completed ? 'text-accent-green' : 'text-bloom-500'}`}>
                      {goal.progress}%
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={goal.progress}
                    onChange={(e) => onUpdateProgress(goal.id, parseInt(e.target.value))}
                    className={`w-full h-2 rounded-full appearance-none cursor-pointer accent-bloom-500 transition-all ${
                      goal.completed ? 'bg-accent-green/20 opacity-50 cursor-not-allowed' : 'bg-pink-100'
                    }`}
                    disabled={goal.completed}
                  />
                </div>

                <div className="flex items-center space-x-3 mt-8">
                  <button className="flex-1 bg-white border border-pink-100 hover:border-bloom-200 text-bloom-700 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-sm active:scale-95">
                    <ExternalLink size={14} className="text-bloom-300" />
                    <span>Open Resource</span>
                  </button>
                  <button 
                    onClick={() => onToggleComplete(goal.id)}
                    className={`px-5 py-3.5 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center space-x-2 ${
                      goal.completed 
                        ? 'bg-accent-green text-white shadow-green-100' 
                        : 'bg-bloom-50 text-bloom-400 hover:bg-pink-100'
                    }`}
                  >
                    <CheckCircle size={20} strokeWidth={goal.completed ? 3 : 2} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {goal.completed ? 'Mastered' : 'Complete'}
                    </span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-white/50 rounded-[3rem] border-2 border-dashed border-pink-200/50 flex flex-col items-center">
              <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-6 text-bloom-100 animate-pulse">
                <Target size={40} />
              </div>
              <h3 className="serif-title text-xl text-bloom-500 mb-2">No active goals yet</h3>
              <p className="text-bloom-300 text-sm max-w-[240px] leading-relaxed mb-8">
                Your growth roadmap is empty. Explore the Library to find skills and strategies that inspire you.
              </p>
              <button 
                onClick={onBack}
                className="bg-bloom-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-pink-200 active:scale-95 transition-all"
              >
                Go to Library
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Goals;
