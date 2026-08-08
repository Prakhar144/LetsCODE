import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function StudyPlan() {
  const [goal, setGoal] = useState(() => {
    return parseInt(localStorage.getItem('coding_goal_minutes') || '60', 10);
  });
  
  const [saved, setSaved] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const mockSpent = parseInt(localStorage.getItem('mock_time_spent_minutes') || '0', 10);
    setTimeSpent(mockSpent);
  }, []);

  const handleSave = () => {
    localStorage.setItem('coding_goal_minutes', goal.toString());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const progress = Math.min((timeSpent / Math.max(goal, 1)) * 100, 100);

  return (
    <div className="flex-1 overflow-y-auto bg-[#1A1A1A] p-8 pb-24 text-slate-200">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Link to="/problems" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </Link>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Study Plan</h1>
          </div>
          <p className="text-slate-400 pl-12 text-lg">Set your daily coding goals and track your consistency.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Goal Setting Card */}
          <div className="glass-card p-8 border border-white/5 bg-[#222]">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Daily Time Goal
            </h2>
            
            <p className="text-slate-400 mb-8">How many minutes do you want to commit to problem solving every day?</p>
            
            <div className="flex items-center justify-center gap-6 mb-8">
              <button 
                onClick={() => setGoal(Math.max(15, goal - 15))}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
              </button>
              
              <div className="text-center w-32">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{goal}</span>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-2 font-bold">Minutes</div>
              </div>
              
              <button 
                onClick={() => setGoal(Math.min(300, goal + 15))}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={handleSave}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                Save Plan
              </button>
              {saved && (
                <span className="text-emerald-400 text-sm font-medium animate-in fade-in slide-in-from-right-4 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Saved
                </span>
              )}
            </div>
          </div>

          {/* Today's Progress Card */}
          <div className="glass-card p-8 border border-white/5 bg-[#222] relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              Today's Status
            </h2>

            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="84" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                  <circle cx="96" cy="96" r="84" fill="none" stroke="url(#progress-gradient)" strokeWidth="12" strokeDasharray="527.7" strokeDashoffset={527.7 - (progress / 100) * 527.7} strokeLinecap="round" className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                  <defs>
                    <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="text-center">
                  <div className="text-4xl font-black text-white">{timeSpent}<span className="text-lg text-slate-500 font-medium ml-1">/ {goal}</span></div>
                  <div className="text-xs text-purple-300/70 font-bold uppercase tracking-[0.1em] mt-1">Minutes Coded</div>
                </div>
              </div>
              
              <div className="text-center w-full">
                {timeSpent >= goal ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 font-medium">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Daily Goal Reached!
                  </div>
                ) : (
                  <p className="text-slate-400">You need <strong className="text-white">{goal - timeSpent}</strong> more minutes to reach your goal today. Keep going!</p>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
