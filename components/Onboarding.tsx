
import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, User as UserIcon, LogIn, Type } from 'lucide-react';
import { JourneyStage, User } from '../types';
import Logo from './Logo';

interface OnboardingProps {
  onComplete: (user: User) => void;
  initialMode?: 'login' | 'signup';
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, initialMode = 'signup' }) => {
  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'login');
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [stage, setStage] = useState<JourneyStage | null>(null);

  const handleNext = () => {
    if (isLoginMode) {
      // Simulate login with default values if fields are empty for prototype convenience
      onComplete({ 
        firstName: email ? email.split('@')[0] : 'Member', 
        lastName: '', 
        email: email || 'user@example.com', 
        role: 'Professional', 
        stage: JourneyStage.ON_LEAVE 
      });
      return;
    }

    if (step === 1 && email && password) setStep(2);
    else if (step === 2 && firstName && lastName && role) setStep(3);
    else if (step === 3 && stage) {
      onComplete({ firstName, lastName, email, role, stage });
    }
  };

  return (
    <div className="min-h-screen bg-bloom-50 flex flex-col p-8 items-center justify-center animate-in fade-in duration-700">
      <div className="w-full max-w-xs text-center mb-10">
        <div className="bg-white w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-pink-200/50 rotate-3 transition-transform hover:rotate-0">
          <Logo className="w-14 h-14" />
        </div>
        <h1 className="serif-title text-4xl text-bloom-500 mb-2">BloomBack</h1>
        <p className="text-bloom-500/60 font-medium tracking-wide uppercase text-[10px]">Your journey, nurtured.</p>
      </div>

      <div className="w-full max-w-sm space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        {!isLoginMode ? (
          <>
            {step === 1 && (
              <div className="space-y-6">
                <header>
                  <h2 className="serif-title text-2xl text-bloom-500">Create your account</h2>
                  <p className="text-slate text-sm mt-1 opacity-80">Start your journey to empowerment.</p>
                </header>
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-bloom-300" size={18} />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-pink-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-bloom-200 outline-none text-slate transition-all shadow-sm"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-bloom-300" size={18} />
                    <input
                      type="password"
                      placeholder="Create Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-pink-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-bloom-200 outline-none text-slate transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <header>
                  <h2 className="serif-title text-2xl text-bloom-500">About you</h2>
                  <p className="text-slate text-sm mt-1 opacity-80">Help us personalize your experience.</p>
                </header>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-bloom-300" size={16} />
                      <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-white border border-pink-200 rounded-2xl pl-10 pr-4 py-4 focus:ring-2 focus:ring-bloom-200 outline-none text-slate text-sm transition-all shadow-sm"
                      />
                    </div>
                    <div className="relative">
                      <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-bloom-300" size={16} />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-white border border-pink-200 rounded-2xl pl-10 pr-4 py-4 focus:ring-2 focus:ring-bloom-200 outline-none text-slate text-sm transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-bloom-300" size={18} />
                    <input
                      type="text"
                      placeholder="Current Job Role (e.g. Lead Engineer)"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-white border border-pink-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-bloom-200 outline-none text-slate transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <header>
                  <h2 className="serif-title text-2xl text-bloom-500">Current Stage</h2>
                  <p className="text-slate text-sm mt-1 opacity-80">Where are you right now?</p>
                </header>
                <div className="grid grid-cols-1 gap-3">
                  {[JourneyStage.PREPARING, JourneyStage.ON_LEAVE, JourneyStage.RETURNING].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStage(s)}
                      className={`p-5 rounded-2xl border-2 text-left transition-all ${
                        stage === s 
                          ? 'border-bloom-500 bg-white text-bloom-500 shadow-inner' 
                          : 'border-pink-200 bg-white text-slate hover:border-bloom-200'
                      }`}
                    >
                      <span className="font-bold text-sm uppercase tracking-widest">{s}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <header>
              <h2 className="serif-title text-2xl text-bloom-500">Welcome back</h2>
              <p className="text-slate text-sm mt-1 opacity-80">Continue your journey where you left off.</p>
            </header>
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-bloom-300" size={18} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-pink-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-bloom-200 outline-none text-slate transition-all shadow-sm"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-bloom-300" size={18} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-pink-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-bloom-200 outline-none text-slate transition-all shadow-sm"
                />
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={
            isLoginMode 
              ? false // Allow login with empty for prototype convenience
              : ((step === 1 && (!email || !password)) || (step === 2 && (!role || !firstName || !lastName)) || (step === 3 && !stage))
          }
          className="w-full bg-accent-green text-white py-4 rounded-2xl font-bold flex justify-center items-center space-x-2 shadow-xl shadow-green-100/50 hover:bg-accent-green-hover disabled:opacity-50 transition-all active:scale-95"
        >
          <span>{isLoginMode ? 'Sign In' : (step === 3 ? 'Complete Setup' : 'Continue')}</span>
          {isLoginMode ? <LogIn size={20} /> : <ArrowRight size={20} />}
        </button>

        <div className="text-center">
          <button 
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setStep(1);
            }}
            className="text-bloom-400 font-bold text-xs uppercase tracking-widest hover:text-bloom-600 transition-colors"
          >
            {isLoginMode ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>

      {!isLoginMode && (
        <div className="mt-12 flex space-x-2">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 w-1.5 rounded-full ${i === step ? 'bg-bloom-500 w-4' : 'bg-pink-300'} transition-all`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Onboarding;
