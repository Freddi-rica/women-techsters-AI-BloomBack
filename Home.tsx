
import React, { useState } from 'react';
import { Calendar, Sparkles, ArrowRight, Quote, Plus, Trash2, X, CheckCircle2, BookOpen, Target, MessageSquare } from 'lucide-react';
import { User, UpcomingEvent } from '../types';

interface HomeProps {
  user: User;
  onStartCheckIn: () => void;
  onNavigate: (tab: string) => void;
  upcomingEvents: UpcomingEvent[];
  onAddEvent: (event: Omit<UpcomingEvent, 'id'>) => void;
  onDeleteEvent: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ user, onStartCheckIn, onNavigate, upcomingEvents, onAddEvent, onDeleteEvent }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newTime, setNewTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddEvent({
        title: newTask,
        time: newTime || 'Just now',
        type: user.stage === 'Preparing' ? 'Prep' : user.stage === 'On Leave' ? 'Care' : 'Work'
      });
      setNewTask('');
      setNewTime('');
      setShowAddForm(false);
    }
  };

  const quickActions = [
    { id: 'resources', label: 'Resources', icon: BookOpen, tab: 'resources', color: 'text-bloom-500', bg: 'bg-bloom-50' },
    { id: 'goals', label: 'Goals', icon: Target, tab: 'goals', color: 'text-accent-green', bg: 'bg-green-50' },
    { id: 'insights', label: 'Insights', icon: Calendar, tab: 'dashboard', color: 'text-bloom-400', bg: 'bg-pink-50' },
    { id: 'stories', label: 'Stories', icon: MessageSquare, tab: 'community', color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-1000">
      <header className="flex justify-between items-start">
        <div>
          <span className="text-[10px] uppercase font-bold text-bloom-500/60 tracking-[0.2em]">Good Morning,</span>
          <h1 className="serif-title text-3xl text-bloom-500">{user.firstName || user.email.split('@')[0]}</h1>
        </div>
        <div className="bg-white p-2 rounded-xl border border-pink-200 shadow-sm text-bloom-500">
          <Calendar size={20} />
        </div>
      </header>

      <section 
        onClick={onStartCheckIn}
        className="relative bg-bloom-500 p-6 rounded-[2.5rem] text-white shadow-xl shadow-bloom-200 group active:scale-[0.98] transition-all cursor-pointer overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
          <Sparkles size={120} />
        </div>
        
        <div className="relative z-10">
          <div className="bg-white/20 backdrop-blur-md w-max px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            Weekly Ritual
          </div>
          <h2 className="serif-title text-2xl mb-2">Weekly Check-In</h2>
          <p className="text-white/90 text-sm leading-relaxed mb-6 max-w-[80%]">
            Reflect on your emotional wellbeing and track your readiness for the week ahead.
          </p>
          <div className="flex items-center space-x-2 text-sm font-semibold">
            <span>Start Reflecting</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="space-y-4">
        <h3 className="font-semibold text-bloom-500 uppercase text-[10px] tracking-widest opacity-70 px-1">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onNavigate(action.tab)}
              className="bg-white border border-pink-100 p-4 rounded-3xl flex items-center space-x-3 shadow-sm hover:border-bloom-300 transition-all active:scale-[0.97] group text-left"
            >
              <div className={`${action.bg} ${action.color} p-2 rounded-2xl group-hover:scale-110 transition-transform`}>
                <action.icon size={20} />
              </div>
              <span className="text-xs font-bold text-bloom-700">{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white border border-pink-200 p-6 rounded-3xl relative shadow-sm">
        <Quote size={24} className="text-bloom-100 absolute top-4 left-4" />
        <p className="text-bloom-700 italic text-center font-serif leading-relaxed px-4">
          "The power to nurture is also the power to grow. Take this moment just for you."
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h3 className="font-semibold text-bloom-500 uppercase text-xs tracking-widest opacity-70">
            Upcoming for {user.stage}
          </h3>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-1 text-accent-green font-black uppercase text-[10px] tracking-widest hover:text-accent-green-hover transition-colors"
          >
            {showAddForm ? <X size={14} /> : <Plus size={14} />}
            <span>{showAddForm ? 'Close' : 'Add Task'}</span>
          </button>
        </div>

        {showAddForm && (
          <form 
            onSubmit={handleSubmit}
            className="bg-white p-5 rounded-[2rem] border-2 border-accent-green/20 shadow-xl shadow-green-100/20 animate-in slide-in-from-top-2 duration-300 space-y-3"
          >
            <input 
              autoFocus
              type="text" 
              placeholder="What needs doing?" 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="w-full bg-bloom-50 border border-pink-100 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-accent-green outline-none"
            />
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="Time (e.g. 2pm)" 
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="flex-1 bg-bloom-50 border border-pink-100 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-accent-green outline-none"
              />
              <button 
                type="submit"
                className="bg-accent-green text-white px-6 py-3 rounded-xl shadow-lg shadow-green-100 active:scale-95 transition-all"
              >
                <Plus size={18} />
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
            <div 
              key={event.id} 
              className="bg-white p-4 rounded-2xl border border-pink-100 flex items-center justify-between shadow-sm hover:border-bloom-300 transition-colors group animate-in fade-in"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center text-bloom-400">
                   <CheckCircle2 size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-bloom-500 text-sm">{event.title}</h4>
                  <p className="text-[10px] text-bloom-500/60 font-bold uppercase tracking-wider">{event.time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-[10px] bg-accent-green/10 text-accent-green px-2 py-1 rounded-lg font-bold uppercase">
                  {event.type}
                </span>
                <button 
                  onClick={() => onDeleteEvent(event.id)}
                  className="p-2 text-pink-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center bg-white/50 rounded-2xl border border-dashed border-pink-200">
               <p className="text-xs text-bloom-300 font-bold uppercase tracking-widest">No events scheduled</p>
               {!showAddForm && (
                 <button 
                   onClick={() => setShowAddForm(true)}
                   className="mt-2 text-[10px] text-accent-green font-black underline uppercase tracking-widest"
                 >
                   Create your first task
                 </button>
               )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
