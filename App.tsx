
import React, { useState, useEffect, useMemo } from 'react';
import { User, JourneyStage, UpcomingEvent, NotificationSettings, Resource } from './types';
import Layout from './components/Layout';
import Onboarding from './components/Onboarding';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Community from './components/Community';
import CheckIn from './components/CheckIn';
import Resources from './components/Resources';
import Goals from './components/Goals';
import { BADGES } from './constants';
import { Trophy, MessageCircle, Calendar, Zap, Heart, Star, LogOut, ChevronRight, Settings, ShieldCheck, X, Bell, BellOff, Clock } from 'lucide-react';

// Extended Resource type for the Goals page
export interface UserGoal extends Resource {
  progress: number;
  completed: boolean;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bloomback_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [activeTab, setActiveTab] = useState('home');
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [onboardingMode, setOnboardingMode] = useState<'login' | 'signup'>('signup');
  
  const [checkIns, setCheckIns] = useState<any[]>(() => {
    const saved = localStorage.getItem('bloomback_checkins');
    return saved ? JSON.parse(saved) : [];
  });

  const [userGoals, setUserGoals] = useState<UserGoal[]>(() => {
    const saved = localStorage.getItem('bloomback_user_goals');
    return saved ? JSON.parse(saved) : [];
  });

  const addedGoalIds = useMemo(() => new Set(userGoals.map(g => g.id)), [userGoals]);

  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>(() => {
    const saved = localStorage.getItem('bloomback_events');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Handover Document Prep', time: 'Monday, 10:00', type: 'Work' },
      { id: '2', title: 'Prenatal Yoga Session', time: 'Wednesday, 14:00', type: 'Self-Care' }
    ];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('bloomback_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bloomback_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('bloomback_checkins', JSON.stringify(checkIns));
  }, [checkIns]);

  useEffect(() => {
    localStorage.setItem('bloomback_events', JSON.stringify(upcomingEvents));
  }, [upcomingEvents]);

  useEffect(() => {
    localStorage.setItem('bloomback_user_goals', JSON.stringify(userGoals));
  }, [userGoals]);

  const addEvent = (event: Omit<UpcomingEvent, 'id'>) => {
    const newEvent = { ...event, id: Math.random().toString(36).substr(2, 9) };
    setUpcomingEvents(prev => [...prev, newEvent]);
  };

  const deleteEvent = (id: string) => {
    setUpcomingEvents(prev => prev.filter(e => e.id !== id));
  };

  const addGoal = (resource: Resource) => {
    if (!addedGoalIds.has(resource.id)) {
      const newGoal: UserGoal = {
        ...resource,
        progress: 0,
        completed: false
      };
      setUserGoals(prev => [...prev, newGoal]);
    }
  };

  const removeGoal = (id: string) => {
    setUserGoals(prev => prev.filter(g => g.id !== id));
  };

  const updateGoalProgress = (id: string, progress: number) => {
    setUserGoals(prev => prev.map(g => 
      g.id === id ? { ...g, progress, completed: progress === 100 } : g
    ));
  };

  const toggleGoalComplete = (id: string) => {
    setUserGoals(prev => prev.map(g => 
      g.id === id ? { ...g, completed: !g.completed, progress: !g.completed ? 100 : g.progress } : g
    ));
  };

  const updateNotificationSettings = (settings: NotificationSettings) => {
    if (user) {
      setUser({ ...user, notificationSettings: settings });
    }
  };

  const getBadgeIcon = (iconName: string, size: number, color: string, earned: boolean) => {
    const props = { size, color: earned ? color : '#FBCFE8' };
    switch (iconName) {
      case 'Trophy': return <Trophy {...props} />;
      case 'MessageCircle': return <MessageCircle {...props} />;
      case 'Calendar': return <Calendar {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Heart': return <Heart {...props} />;
      default: return <Star {...props} />;
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('home');
    setOnboardingMode('login');
    localStorage.removeItem('bloomback_user');
  };

  const renderContent = () => {
    if (!user) {
      return <Onboarding initialMode={onboardingMode} onComplete={(u) => {
        setUser(u);
        setOnboardingMode('signup'); 
      }} />;
    }

    switch (activeTab) {
      case 'home':
        return (
          <Home 
            user={user} 
            onStartCheckIn={() => setShowCheckIn(true)} 
            onNavigate={setActiveTab}
            upcomingEvents={upcomingEvents} 
            onAddEvent={addEvent}
            onDeleteEvent={deleteEvent}
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
            user={user}
            userCheckIns={checkIns} 
            upcomingEvents={upcomingEvents} 
            onAddEvent={addEvent} 
            onDeleteEvent={deleteEvent}
          />
        );
      case 'community':
        return <Community userName={user.firstName} />;
      case 'resources':
        return <Resources 
          onBack={() => setActiveTab('home')} 
          onAddGoal={addGoal}
          addedGoalIds={addedGoalIds}
        />;
      case 'goals':
        return <Goals 
          onBack={() => setActiveTab('home')} 
          goals={userGoals} 
          onRemoveGoal={removeGoal}
          onUpdateProgress={updateGoalProgress}
          onToggleComplete={toggleGoalComplete}
        />;
      case 'profile':
        return (
          <div className="p-6 pb-12 space-y-8 animate-in fade-in duration-700">
            <header className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-bloom-100 to-pink-200 border-4 border-white shadow-xl flex items-center justify-center text-3xl font-serif text-bloom-500 mb-4 overflow-hidden transform transition-transform group-hover:scale-105">
                  <span className="animate-in slide-in-from-top-4 duration-1000">
                    {(user.firstName || user.email[0]).toUpperCase().charAt(0)}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-accent-green p-2 rounded-2xl text-white shadow-lg border-2 border-white animate-bounce">
                  <Star size={16} fill="currentColor" />
                </div>
              </div>
              <h1 className="serif-title text-2xl text-bloom-500 mt-2 text-center">
                {user.firstName} {user.lastName}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-accent-green font-bold text-[10px] uppercase tracking-[0.2em]">{user.role}</span>
                <span className="w-1 h-1 bg-pink-200 rounded-full"></span>
                <span className="text-bloom-400 font-bold text-[10px] uppercase tracking-[0.2em]">{user.stage}</span>
              </div>
              <button className="mt-4 px-6 py-2 bg-white border border-pink-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-bloom-500 shadow-sm hover:shadow-md transition-all active:scale-95">
                Edit Profile
              </button>
            </header>

            <section className="bg-white rounded-[2.5rem] border border-pink-100 p-6 shadow-sm">
               <div className="flex justify-between items-center mb-6 px-1">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-bloom-300">Milestones & Badges</h3>
                <span className="text-[10px] font-bold text-accent-green bg-green-50 px-2 py-1 rounded-lg">
                  {BADGES.filter(b => b.earned).length}/{BADGES.length} Earned
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-y-8 gap-x-4">
                {BADGES.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center text-center">
                    <div 
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 transition-all duration-500 ${
                        badge.earned ? 'bg-white shadow-xl shadow-pink-100/50 border border-pink-50' : 'bg-pink-50 border border-dashed border-pink-200 opacity-40'
                      }`}
                    >
                      {getBadgeIcon(badge.icon, 24, badge.earned ? '#22C55E' : badge.color, badge.earned)}
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-tighter leading-tight max-w-[60px] ${badge.earned ? 'text-bloom-600' : 'text-pink-300'}`}>
                      {badge.name}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-pink-100/50 p-4 rounded-3xl border border-pink-200/50 text-center">
                <span className="text-[10px] font-bold text-bloom-300 uppercase block mb-1">Total Points</span>
                <span className="text-2xl font-serif text-bloom-500">{1240 + (checkIns.length * 100)}</span>
              </div>
              <div className="bg-green-50 p-4 rounded-3xl border border-green-100 text-center">
                <span className="text-[10px] font-bold text-accent-green/60 uppercase block mb-1">Check-ins</span>
                <span className="text-2xl font-serif text-accent-green">{checkIns.length}</span>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-pink-100 p-2 shadow-sm space-y-1">
              {[
                { icon: ShieldCheck, label: 'Account Security', color: 'text-bloom-400', onClick: () => {} },
                { 
                  icon: Settings, 
                  label: 'Notification Preferences', 
                  color: 'text-bloom-400', 
                  onClick: () => setShowNotificationModal(true) 
                },
                { icon: Heart, label: 'Saved Resources', color: 'text-accent-green', onClick: () => {} },
                { icon: MessageCircle, label: 'My Forum Posts', color: 'text-bloom-400', onClick: () => {} },
              ].map((item, i) => (
                <button 
                  key={i} 
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-pink-50 transition-colors group text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-xl bg-pink-50 ${item.color}`}>
                      <item.icon size={18} />
                    </div>
                    <span className="text-sm font-semibold text-bloom-700">{item.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-pink-200 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 text-pink-300 hover:text-red-400 transition-colors py-4 font-bold uppercase text-[10px] tracking-[0.2em] active:scale-95"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        );
      default:
        return (
          <Home 
            user={user} 
            onStartCheckIn={() => setShowCheckIn(true)} 
            onNavigate={setActiveTab}
            upcomingEvents={upcomingEvents} 
            onAddEvent={addEvent}
            onDeleteEvent={deleteEvent}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-bloom-50 font-sans text-bloom-700">
      {user ? (
        <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
          {renderContent()}
        </Layout>
      ) : (
        renderContent()
      )}

      {showCheckIn && (
        <CheckIn 
          onComplete={(results) => {
            setCheckIns(prev => [...prev, { ...results, timestamp: new Date().toISOString() }]);
            setShowCheckIn(false);
          }}
          onClose={() => setShowCheckIn(false)}
          previousCheckIns={checkIns}
        />
      )}

      {showNotificationModal && user && (
        <NotificationSettingsModal 
          settings={user.notificationSettings || { enabled: true, day: 'Sunday', time: '09:00' }}
          onSave={(settings) => {
            updateNotificationSettings(settings);
            setShowNotificationModal(false);
          }}
          onClose={() => setShowNotificationModal(false)}
        />
      )}
    </div>
  );
};

interface NotificationSettingsModalProps {
  settings: NotificationSettings;
  onSave: (settings: NotificationSettings) => void;
  onClose: () => void;
}

const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [enabled, setEnabled] = useState(settings.enabled);
  const [day, setDay] = useState(settings.day);
  const [time, setTime] = useState(settings.time);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="fixed inset-0 z-[110] bg-bloom-700/40 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-300">
      <div className="bg-white w-full max-md rounded-t-[3rem] shadow-2xl animate-in slide-in-from-bottom-full duration-500 overflow-hidden border-t border-pink-100">
        <div className="p-8 space-y-8">
          <header className="flex justify-between items-center">
            <div>
              <h3 className="serif-title text-2xl text-bloom-500">Notifications</h3>
              <p className="text-xs text-bloom-300 font-bold uppercase tracking-widest mt-1">Weekly Ritual Preferences</p>
            </div>
            <button onClick={onClose} className="p-2 bg-pink-50 rounded-full text-bloom-300 hover:text-bloom-500 transition-colors">
              <X size={20} />
            </button>
          </header>

          <div className="space-y-6">
            <div className="flex items-center justify-between bg-bloom-50/50 p-5 rounded-3xl border border-pink-100">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl ${enabled ? 'bg-accent-green/10 text-accent-green' : 'bg-pink-100 text-pink-300'}`}>
                  {enabled ? <Bell size={24} /> : <BellOff size={24} />}
                </div>
                <div>
                  <span className="font-bold text-bloom-700 block text-sm">Push Notifications</span>
                  <span className="text-[10px] text-bloom-400 uppercase font-black tracking-wider">Weekly Check-in Reminders</span>
                </div>
              </div>
              <button 
                onClick={() => setEnabled(!enabled)}
                className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${enabled ? 'bg-accent-green' : 'bg-pink-200'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${enabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {enabled && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-bloom-300 uppercase tracking-widest ml-2">Preferred Day</label>
                  <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar px-1">
                    {days.map((d) => (
                      <button
                        key={d}
                        onClick={() => setDay(d)}
                        className={`flex-shrink-0 px-5 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                          day === d 
                            ? 'bg-bloom-500 text-white shadow-lg shadow-pink-200' 
                            : 'bg-pink-50 text-bloom-300 hover:bg-pink-100'
                        }`}
                      >
                        {d.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-bloom-300 uppercase tracking-widest ml-2">Preferred Time</label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-bloom-300">
                      <Clock size={20} />
                    </div>
                    <input 
                      type="time" 
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-bloom-50 border border-pink-100 rounded-[1.5rem] pl-14 pr-6 py-4 text-bloom-700 font-bold focus:ring-2 focus:ring-bloom-200 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex flex-col space-y-3">
            <button 
              onClick={() => onSave({ enabled, day, time })}
              className="w-full bg-bloom-500 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-pink-200 active:scale-[0.98] transition-all"
            >
              Save Preferences
            </button>
            <button 
              onClick={onClose}
              className="w-full text-bloom-300 py-3 text-[10px] font-black uppercase tracking-widest hover:text-bloom-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
        <div className="h-6 bg-bloom-500/5"></div>
      </div>
    </div>
  );
};

export default App;
