
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Sparkles, BookOpen, Heart, Play, UserCheck, X, Share2, Bookmark, Plus, Trash2, Calendar, ShieldCheck, Zap, Wand2, Loader2, AlertCircle, RefreshCcw, ExternalLink, Clock, Lightbulb, ChevronLeft, ChevronRight, ArrowRight, Star } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { DUMMY_CHART_DATA } from '../constants';
import { UpcomingEvent, User } from '../types';

interface AiRecommendation {
  title: string;
  type: 'Article' | 'Guide' | 'Video' | 'Tool' | 'External Resource';
  source: string;
  estimatedTime: string;
  whyItHelps: string;
  tags: string[];
  category: 'Affirmation' | 'Strategy' | 'Community' | 'Health';
}

interface DashboardProps {
  user: User;
  userCheckIns: any[];
}

type ViewMode = 'CHART' | 'RECS_LIST' | 'REC_DETAIL';

const Dashboard: React.FC<DashboardProps> = ({ user, userCheckIns }) => {
  const [view, setView] = useState<ViewMode>('CHART');
  const [selectedRec, setSelectedRec] = useState<AiRecommendation | null>(null);

  // AI States
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiRecs, setAiRecs] = useState<AiRecommendation[]>(() => {
    const saved = localStorage.getItem('bloomback_ai_recs');
    return saved ? JSON.parse(saved) : [];
  });
  const [genTimestamp, setGenTimestamp] = useState<string | null>(() => {
    return localStorage.getItem('bloomback_ai_timestamp');
  });
  const [genError, setGenError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    `Reviewing your last ${Math.min(userCheckIns.length || 1, 4)} weeks of check-ins...`,
    "Analyzing confidence and wellbeing patterns...",
    `Considering your role as ${user.role || 'Professional'}...`,
    "Finding resources matched to your needs..."
  ];

  useEffect(() => {
    let interval: number;
    if (isGenerating) {
      interval = window.setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video': return <Play size={14} />;
      case 'article': return <BookOpen size={14} />;
      case 'tool': return <Zap size={14} />;
      case 'guide': return <BookOpen size={14} />;
      default: return <ExternalLink size={14} />;
    }
  };

  const chartData = userCheckIns.length > 0 
    ? userCheckIns.map((ci, i) => ({
        name: `Entry ${i + 1}`,
        confidence: ci.confidence * 10,
        wellbeing: ci.wellbeing * 10,
        readiness: ci.readiness * 10,
        support: ci.support * 10,
        energy: ci.energy * 10
      }))
    : DUMMY_CHART_DATA.map(d => ({
        ...d,
        confidence: d.confidence || 50,
        wellbeing: d.wellbeing || 50,
        readiness: d.readiness || 50,
        support: 40,
        energy: 60
      }));

  const generateAiRecommendations = async () => {
    setIsGenerating(true);
    setGenError(null);
    setLoadingStep(0);
    setView('RECS_LIST');
    
    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const latestCheckIn = userCheckIns[userCheckIns.length - 1] || { confidence: 5, wellbeing: 5, readiness: 5, support: 5, energy: 5 };
      
      const prompt = `User Info: Name: ${user.firstName}, Role: ${user.role}, Stage: ${user.stage}.
      Latest check-in scores (1-10): Confidence: ${latestCheckIn.confidence}, Wellbeing: ${latestCheckIn.wellbeing}, Readiness: ${latestCheckIn.readiness}, Support: ${latestCheckIn.support}, Energy: ${latestCheckIn.energy}.
      
      Generate exactly 4 prioritized recommendations for a mother in career transition. 
      Priority order: 
      1. Most urgent need (address lowest score).
      2. Secondary concern.
      3. Preventive resource (boundary setting/burnout).
      4. Community/peer connection.
      
      Provide fields: title, type (Article, Guide, Video, Tool, External Resource), source, estimatedTime, whyItHelps (1-2 sentences), tags (max 3), and category.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['Article', 'Guide', 'Video', 'Tool', 'External Resource'] },
                    source: { type: Type.STRING },
                    estimatedTime: { type: Type.STRING },
                    whyItHelps: { type: Type.STRING },
                    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    category: { type: Type.STRING, enum: ['Affirmation', 'Strategy', 'Community', 'Health'] }
                  },
                  required: ['title', 'type', 'source', 'estimatedTime', 'whyItHelps', 'tags', 'category']
                }
              }
            }
          }
        }
      });

      const result = JSON.parse(response.text);
      const now = new Date().toLocaleString();
      setAiRecs(result.recommendations);
      setGenTimestamp(now);
      localStorage.setItem('bloomback_ai_recs', JSON.stringify(result.recommendations));
      localStorage.setItem('bloomback_ai_timestamp', now);
    } catch (error) {
      console.error("AI Generation Error:", error);
      setGenError("We couldn't reach the BloomBack AI. Please check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const metrics = [
    { key: 'confidence', label: 'Confidence', color: '#4e1952', icon: Zap },
    { key: 'wellbeing', label: 'Wellbeing', color: '#F472B6', icon: Heart },
    { key: 'support', label: 'Support', color: '#9D6FB3', icon: ShieldCheck },
    { key: 'readiness', label: 'Readiness', color: '#22C55E', icon: TrendingUp },
  ];

  // SUB-VIEW: RECOMMENDATION DETAIL
  if (view === 'REC_DETAIL' && selectedRec) {
    return (
      <div className="fixed inset-0 z-[100] bg-bloom-50 flex flex-col animate-in slide-in-from-right duration-500 overflow-y-auto">
        <header className="bg-white border-b border-pink-50 sticky top-0 z-20 px-6 py-5 flex items-center justify-between">
          <button 
            onClick={() => setView('RECS_LIST')} 
            className="flex items-center space-x-2 text-bloom-500 font-bold text-xs uppercase tracking-widest"
          >
            <ChevronLeft size={20} />
            <span>Back to Path</span>
          </button>
          <div className="flex space-x-3">
             <button className="p-2 text-bloom-300 hover:text-bloom-500 transition-colors">
               <Share2 size={18} />
             </button>
             <button className="p-2 text-bloom-300 hover:text-accent-green transition-colors">
               <Bookmark size={18} />
             </button>
          </div>
        </header>

        <div className="p-8 max-w-sm mx-auto w-full space-y-8 pb-20">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="bg-accent-green/10 text-accent-green px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                {selectedRec.type}
              </span>
              <span className="text-[9px] text-bloom-300 font-bold uppercase tracking-widest">
                {selectedRec.source} • {selectedRec.estimatedTime}
              </span>
            </div>
            <h1 className="serif-title text-3xl text-bloom-500 leading-tight">
              {selectedRec.title}
            </h1>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-pink-100 shadow-sm space-y-6">
            <div className="flex items-center space-x-3 text-accent-green">
              <Lightbulb size={20} />
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em]">AI Insights for {user.firstName}</h3>
            </div>
            <p className="text-bloom-700 text-sm leading-relaxed font-medium">
              {selectedRec.whyItHelps}
            </p>
            <div className="pt-4 border-t border-pink-50">
               <p className="text-xs text-bloom-500/70 italic leading-relaxed">
                 "Based on your profile as a <span className="font-bold text-bloom-500">{user.role}</span> currently in the <span className="font-bold text-bloom-500">{user.stage}</span> stage, this resource is prioritized to support your growth."
               </p>
            </div>
          </div>

          <div className="space-y-4">
             <h4 className="font-black text-bloom-500 uppercase text-[10px] tracking-widest opacity-60 ml-1">Focus Topics</h4>
             <div className="flex flex-wrap gap-2">
               {selectedRec.tags.map((tag, i) => (
                 <span key={i} className="bg-bloom-100/50 text-bloom-500 px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-pink-100">
                   #{tag}
                 </span>
               ))}
             </div>
          </div>

          <div className="pt-8 space-y-3">
             <button className="w-full bg-accent-green text-white py-5 rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-green-100 active:scale-95 transition-all flex items-center justify-center space-x-3">
               <span>Open Resource</span>
               <ExternalLink size={18} />
             </button>
          </div>
        </div>
      </div>
    );
  }

  // SUB-VIEW: RECOMMENDATIONS LIST (The "Fresh Page")
  if (view === 'RECS_LIST') {
    return (
      <div className="fixed inset-0 z-[90] bg-bloom-50 flex flex-col animate-in slide-in-from-right duration-500 overflow-y-auto pb-24">
        <header className="bg-white border-b border-pink-50 sticky top-0 z-20 px-6 py-5 flex items-center justify-between shadow-sm">
          <button 
            onClick={() => setView('CHART')} 
            className="flex items-center space-x-2 text-bloom-500 font-bold text-xs uppercase tracking-widest"
          >
            <ChevronLeft size={20} />
            <span>Back to Insights</span>
          </button>
          {aiRecs.length > 0 && !isGenerating && (
            <button 
              onClick={generateAiRecommendations}
              className="p-2 text-bloom-300 hover:text-bloom-500 transition-colors"
            >
              <RefreshCcw size={16} />
            </button>
          )}
        </header>

        {isGenerating ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-8 animate-in fade-in duration-500">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-bloom-100 border-t-accent-green rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-bloom-500">
                <Sparkles size={32} className="animate-pulse" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="serif-title text-3xl text-bloom-500">Creating Your Personalized Plan</h2>
              <div className="h-6 overflow-hidden flex justify-center">
                <p className="text-xs font-black text-accent-green uppercase tracking-[0.1em] animate-in slide-in-from-bottom-2 duration-300" key={loadingStep}>
                  {loadingMessages[loadingStep]}
                </p>
              </div>
              <div className="w-48 bg-pink-100 h-1 rounded-full mx-auto overflow-hidden">
                <div 
                  className="h-full bg-accent-green transition-all duration-1000" 
                  style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-bloom-300 font-bold uppercase tracking-widest mt-8">
                This takes about 10-15 seconds
              </p>
            </div>
          </div>
        ) : genError ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
             <AlertCircle size={48} className="text-red-400 mb-4" />
             <h3 className="serif-title text-xl text-bloom-500 mb-2">Something went wrong</h3>
             <p className="text-sm text-bloom-300 mb-6">{genError}</p>
             <button 
              onClick={generateAiRecommendations}
              className="bg-bloom-500 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <header className="px-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="serif-title text-2xl text-bloom-500">Your Personalized Recommendations</h2>
                <span className="bg-bloom-500 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Top 4</span>
              </div>
              <p className="text-[10px] text-bloom-300 font-bold uppercase tracking-widest">Generated {genTimestamp}</p>
            </header>

            <div className="space-y-4">
              {aiRecs.map((rec, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    setSelectedRec(rec);
                    setView('REC_DETAIL');
                  }}
                  className="bg-white p-6 rounded-[2.5rem] border border-pink-100 flex flex-col space-y-4 shadow-sm group active:scale-[0.98] transition-all cursor-pointer hover:border-bloom-300 animate-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="bg-bloom-50 w-12 h-12 rounded-2xl flex items-center justify-center text-bloom-500 group-hover:bg-pink-100 transition-colors">
                        {getTypeIcon(rec.type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-0.5">
                           <span className="text-[8px] font-black text-accent-green bg-green-50 px-2 py-0.5 rounded-lg uppercase tracking-widest">
                            {rec.type}
                          </span>
                          <span className="text-[8px] text-bloom-300 font-bold uppercase tracking-widest">• {rec.source}</span>
                        </div>
                        <h4 className="font-bold text-bloom-500 text-[16px] leading-tight group-hover:text-bloom-700 transition-colors">{rec.title}</h4>
                      </div>
                    </div>
                  </div>

                  <div className="bg-bloom-50/50 p-4 rounded-2xl border border-pink-50/50">
                    <div className="flex items-start space-x-2">
                      <Lightbulb size={14} className="text-accent-green mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] text-bloom-600 leading-relaxed italic">
                        <span className="font-black uppercase tracking-widest mr-1 text-[9px] text-accent-green opacity-80">Why this helps you:</span>
                        {rec.whyItHelps}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {rec.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[8px] bg-pink-50 text-bloom-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">#{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-bloom-300 space-x-1 mr-2">
                        <Clock size={12} />
                        <span className="text-[9px] font-bold uppercase">{rec.estimatedTime}</span>
                      </div>
                      <ArrowRight size={18} className="text-bloom-200 group-hover:text-bloom-500 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-8">
               <p className="text-[10px] text-bloom-200 font-bold uppercase tracking-widest leading-relaxed max-w-[200px] mx-auto">
                 Recommendations are updated based on your weekly check-ins.
               </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // MAIN VIEW: TRENDS & CHART
  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700 pb-12">
      <header>
        <h1 className="serif-title text-3xl text-bloom-500">Insights</h1>
        <p className="text-bloom-500/80 mt-1 opacity-80">Holistic tracking of your professional evolution.</p>
      </header>

      {/* Chart Section */}
      <section className="bg-white p-6 rounded-[2.5rem] border border-pink-100 shadow-sm">
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-bloom-500">
              <TrendingUp size={18} />
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em]">Growth Roadmap Trends</h3>
            </div>
            <span className="text-[9px] font-black text-bloom-500/40 bg-bloom-50 px-2 py-1 rounded-lg uppercase tracking-widest">
              {userCheckIns.length > 0 ? `${userCheckIns.length} Milestones` : 'Overview'}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {metrics.map((m) => (
              <div key={m.key} className="flex items-center space-x-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                <span className="text-[9px] font-bold text-bloom-400 uppercase tracking-widest">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                {metrics.map(m => (
                  <linearGradient key={`grad-${m.key}`} id={`color-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={m.color} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={m.color} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FCE7F3" />
              <XAxis dataKey="name" hide />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '20px', 
                  border: '1px solid #FCE7F3', 
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                  backgroundColor: '#FFF',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}
              />
              {metrics.map(m => (
                <Area 
                  key={m.key}
                  type="monotone" 
                  dataKey={m.key} 
                  stroke={m.color} 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill={`url(#color-${m.key})`}
                  stackId="1"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 pt-4 border-t border-pink-50 grid grid-cols-2 gap-4">
           {metrics.slice(0, 2).map(m => (
             <div key={m.key} className="flex items-center space-x-3">
               <div className="p-2 rounded-xl bg-bloom-50" style={{ color: m.color }}>
                 <m.icon size={16} />
               </div>
               <div>
                 <p className="text-[8px] font-black text-bloom-300 uppercase tracking-widest">{m.label}</p>
                 <p className="text-sm font-bold text-bloom-600">Stable Progress</p>
               </div>
             </div>
           ))}
        </div>
      </section>

      {/* AI INITIATION SECTION */}
      <section className="bg-gradient-to-br from-bloom-500 to-bloom-600 p-8 rounded-[3rem] text-white shadow-xl shadow-pink-200 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
           <Wand2 size={120} />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles size={18} className="text-accent-green" />
            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-white/80">AI Strategy Path</h3>
          </div>
          <h2 className="serif-title text-2xl leading-tight">Get Personalized Recommendations</h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-[240px]">
            Ready to bloom? Let our AI curate a custom path for your professional transition.
          </p>
          <button 
            onClick={generateAiRecommendations}
            className="w-full bg-white text-bloom-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-3"
          >
            <span>Generate My Path</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {aiRecs.length > 0 && (
        <button 
          onClick={() => setView('RECS_LIST')}
          className="w-full bg-white border border-pink-100 p-5 rounded-[2rem] flex items-center justify-between shadow-sm group hover:border-bloom-300 transition-all"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-pink-50 rounded-2xl text-bloom-500">
              <Star size={20} />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-bloom-500 text-sm">View Last Generated Path</h4>
              <p className="text-[9px] text-bloom-300 font-bold uppercase tracking-widest">{genTimestamp}</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-bloom-200" />
        </button>
      )}
    </div>
  );
};

export default Dashboard;
