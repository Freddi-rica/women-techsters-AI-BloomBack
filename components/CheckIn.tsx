import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, TrendingUp, Heart, UserCheck, Shield, Zap } from 'lucide-react';

interface CheckInProps {
  onComplete: (data: any) => void;
  onClose: () => void;
  previousCheckIns?: any[];
}

const questions = [
  { 
    id: 'confidence', 
    title: 'How confident do you feel about your professional skills today?', 
    minLabel: 'Unsure', 
    maxLabel: 'Empowered' 
  },
  { 
    id: 'wellbeing', 
    title: 'Rate your overall emotional wellbeing this week.', 
    minLabel: 'Struggling', 
    maxLabel: 'Balanced' 
  },
  { 
    id: 'readiness', 
    title: 'How ready do you feel to engage with work-related topics?', 
    minLabel: 'Not at all', 
    maxLabel: 'Very Ready' 
  },
  { 
    id: 'support', 
    title: 'Do you feel supported by your peer community?', 
    minLabel: 'Isolated', 
    maxLabel: 'Supported' 
  },
  { 
    id: 'energy', 
    title: 'Your current energy levels for personal growth?', 
    minLabel: 'Low', 
    maxLabel: 'High' 
  },
];

const CheckIn: React.FC<CheckInProps> = ({ onComplete, onClose, previousCheckIns = [] }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({
    confidence: 5,
    wellbeing: 5,
    readiness: 5,
    support: 5,
    energy: 5
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setIsSuccess(true);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const getInsight = () => {
    const { confidence, wellbeing, readiness, support, energy } = answers;
    const scores = Object.entries(answers);
    const [minKey, minVal] = scores.reduce((prev, curr) => curr[1] < prev[1] ? curr : prev);
    const [maxKey, maxVal] = scores.reduce((prev, curr) => curr[1] > prev[1] ? curr : prev);

    let summary = "Great job completing your check-in!";
    let advice = "You are taking intentional steps for your growth.";
    let icon = <Sparkles size={24} />;
    let color = "text-accent-green";

    // Dynamic Logic based on assessment
    if (previousCheckIns.length > 0) {
      const last = previousCheckIns[previousCheckIns.length - 1];
      const currentAvg = (confidence + wellbeing + readiness + support + energy) / 5;
      const lastAvg = (last.confidence + last.wellbeing + last.readiness + last.support + last.energy) / 5;
      const diff = currentAvg - lastAvg;

      if (diff > 0.5) {
        summary = "You're trending upward!";
        advice = `Your overall sentiment has improved by ${Math.round(diff * 10)}% since last week. Keep nurturing this momentum.`;
        icon = <TrendingUp size={24} />;
      } else if (diff < -0.5) {
        summary = "Take it slow this week.";
        advice = "Your scores suggest you might be feeling a bit overwhelmed. It's okay to prioritize rest right now.";
        icon = <Heart size={24} />;
        color = "text-bloom-400";
      }
    }

    // Specific focus areas
    if (confidence < 4) {
      summary = "Building Professional Confidence";
      advice = "Your professional identity is still there. Try a 'micro-win' today: one small work-related task to remind yourself of your capability.";
      icon = <UserCheck size={24} />;
    } else if (wellbeing < 4) {
      summary = "Emotional Wellbeing First";
      advice = "It seems you're carrying a lot. Have you tried the '5-minute grounding' in the Insights tab? It might help clear some mental space.";
      icon = <Heart size={24} />;
    } else if (support < 4) {
      summary = "Community Connection";
      advice = "Isolation is common in this transition. Reach out to one person in the 'On Leave' forum today—you aren't alone.";
      icon = <Shield size={24} />;
    } else if (readiness > 7 && energy > 7) {
      summary = "Ready to Bloom!";
      advice = "Your high readiness and energy scores suggest you're in a great place for career-focused content. Check the 'Strategy' section.";
      icon = <Zap size={24} />;
      color = "text-yellow-500";
    }

    return { summary, advice, icon, color };
  };

  const { summary, advice, icon, color } = getInsight();

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100] bg-bloom-50 flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
        <div className="bg-white p-6 rounded-full mb-8 text-accent-green shadow-xl shadow-green-100 animate-bounce">
          <CheckCircle2 size={64} />
        </div>
        <h2 className="serif-title text-3xl text-bloom-500 mb-4 text-center">Check-in Complete!</h2>
        
        <div className="bg-white p-6 rounded-3xl border border-pink-200 mb-8 shadow-sm w-full">
          <div className={`flex items-center space-x-3 mb-3 ${color}`}>
            {icon}
            <span className="font-black uppercase text-[10px] tracking-widest">Personal Insight</span>
          </div>
          <h3 className="font-bold text-bloom-500 mb-2">{summary}</h3>
          <p className="text-bloom-700 text-sm leading-relaxed opacity-80">
            {advice}
          </p>
        </div>

        <button
          onClick={() => onComplete(answers)}
          className="w-full bg-accent-green hover:bg-accent-green-hover text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl shadow-green-100/50 active:scale-95"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const currentQuestion = questions[step];

  return (
    <div className="fixed inset-0 z-[100] bg-bloom-50 flex flex-col p-6 overflow-hidden">
      {/* Header / Progress */}
      <div className="flex justify-between items-center mb-12">
        <button onClick={onClose} className="text-bloom-300 font-black uppercase text-[10px] tracking-widest hover:text-bloom-500">Cancel</button>
        <div className="flex space-x-1.5">
          {questions.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 w-8 rounded-full transition-all duration-300 ${idx === step ? 'bg-bloom-500 w-12' : (idx < step ? 'bg-bloom-200' : 'bg-pink-100')}`}
            />
          ))}
        </div>
        <span className="text-[10px] font-black text-bloom-500/40 uppercase tracking-tighter">{step + 1}/{questions.length}</span>
      </div>

      {/* Question Area */}
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <span className="bg-white px-3 py-1 rounded-full text-[9px] font-black text-bloom-300 uppercase tracking-widest mb-4 inline-block shadow-sm">
            Self-Reflection
          </span>
          <h2 className="serif-title text-3xl text-bloom-500 mb-16 leading-tight">
            {currentQuestion.title}
          </h2>

          <div className="space-y-12 px-2">
            <input 
              type="range" 
              min="1" 
              max="10" 
              step="1"
              value={answers[currentQuestion.id]}
              onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: parseInt(e.target.value) })}
              className="w-full h-2.5 bg-pink-100 rounded-full appearance-none cursor-pointer accent-bloom-500"
            />
            <div className="flex justify-between text-[10px] font-black text-bloom-500 uppercase tracking-widest opacity-40">
              <span>{currentQuestion.minLabel}</span>
              <span className="bg-white px-2 py-1 rounded-lg text-bloom-500 opacity-100 text-lg font-serif">
                {answers[currentQuestion.id]}
              </span>
              <span>{currentQuestion.maxLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex space-x-4 max-w-sm mx-auto w-full pt-8 pb-4">
        {step > 0 && (
          <button
            onClick={handleBack}
            className="p-4 rounded-2xl border border-pink-200 text-bloom-500 hover:bg-white transition-all active:scale-95"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <button
          onClick={handleNext}
          className="flex-1 bg-accent-green text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex justify-center items-center space-x-3 shadow-xl shadow-green-100 active:scale-95 transition-all"
        >
          <span>{step === questions.length - 1 ? 'See Results' : 'Next Step'}</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default CheckIn;