import React from 'react';
import { Home, LayoutDashboard, Users, UserCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-bloom-50 shadow-xl overflow-hidden relative">
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-pink-100 px-6 py-4 flex justify-between items-center z-50">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center space-y-1 transition-all ${activeTab === 'home' ? 'text-bloom-500 scale-110' : 'text-pink-300'}`}
        >
          <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center space-y-1 transition-all ${activeTab === 'dashboard' ? 'text-bloom-500 scale-110' : 'text-pink-300'}`}
        >
          <LayoutDashboard size={24} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Insights</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('community')}
          className={`flex flex-col items-center space-y-1 transition-all ${activeTab === 'community' ? 'text-bloom-500 scale-110' : 'text-pink-300'}`}
        >
          <Users size={24} strokeWidth={activeTab === 'community' ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Forum</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center space-y-1 transition-all ${activeTab === 'profile' ? 'text-bloom-500 scale-110' : 'text-pink-300'}`}
        >
          <UserCircle size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;