import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://letscode-1-08lv.onrender.com';

export default function Profile() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/code/user-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching user stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0F0F12]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0F0F12] text-slate-400">
        Failed to load profile data.
      </div>
    );
  }

  // Dynamically populated from backend stats
  const totalEasy = stats.totalEasy || 0;
  const totalMedium = stats.totalMedium || 0;
  const totalHard = stats.totalHard || 0;
  const totalProblems = stats.totalProblems || 0;

  const getStrokeDashoffset = (percent, circumference) => {
    return circumference - (percent / 100) * circumference;
  };

  const CircleProgress = ({ percent, color, size, strokeWidth, children }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = getStrokeDashoffset(percent, circumference);

    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0F0F12] p-8 relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Header / Hero Section */}
        <div className="relative glass-card overflow-hidden p-8 flex flex-col md:flex-row items-center gap-8 border-t border-t-white/10">
          
          <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-purple-600 shadow-[0_0_30px_rgba(59,130,246,0.3)] shrink-0">
            <div className="w-full h-full bg-[#1A1A1A] rounded-full flex items-center justify-center overflow-hidden">
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
          
          <div className="relative z-10 text-center md:text-left flex-1">
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">{stats.username || "Lets<CODE> Developer"}</h1>
            <p className="text-slate-400 text-lg mb-4">Rank ~1,402,109</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <div className="px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.559-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"></path></svg>
                {stats.streak} Day Streak
              </div>
              <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium">
                Top 5% Global
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Progress Ring */}
          <div className="glass-card p-6 flex flex-col items-center justify-center border-t border-t-white/10 lg:col-span-1">
            <h3 className="text-slate-400 font-semibold mb-6 uppercase tracking-wider text-sm">Solved Problems</h3>
            <CircleProgress 
              percent={stats.totalSolved > 0 && totalProblems > 0 ? (stats.totalSolved / totalProblems) * 100 : 0} 
              color="#3B82F6" 
              size={200} 
              strokeWidth={12}
            >
              <div className="text-4xl font-bold text-white mb-1">{stats.totalSolved}</div>
              <div className="text-sm text-slate-500">/ {totalProblems}</div>
            </CircleProgress>
          </div>

          {/* Difficulty Breakdowns */}
          <div className="glass-card p-6 border-t border-t-white/10 lg:col-span-2 flex flex-col justify-center">
            <h3 className="text-slate-400 font-semibold mb-8 uppercase tracking-wider text-sm">Difficulty Breakdown</h3>
            
            <div className="space-y-6">
              {/* Easy */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-emerald-400 font-medium">Easy</span>
                  <span className="text-slate-400"><span className="text-white font-semibold">{stats.easySolved}</span> / {totalEasy}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden shadow-inner">
                  <div className="bg-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${totalEasy > 0 ? (stats.easySolved / totalEasy) * 100 : 0}%` }}></div>
                </div>
              </div>

              {/* Medium */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-amber-400 font-medium">Medium</span>
                  <span className="text-slate-400"><span className="text-white font-semibold">{stats.mediumSolved}</span> / {totalMedium}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden shadow-inner">
                  <div className="bg-amber-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: `${totalMedium > 0 ? (stats.mediumSolved / totalMedium) * 100 : 0}%` }}></div>
                </div>
              </div>

              {/* Hard */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-rose-400 font-medium">Hard</span>
                  <span className="text-slate-400"><span className="text-white font-semibold">{stats.hardSolved}</span> / {totalHard}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden shadow-inner">
                  <div className="bg-rose-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(244,63,94,0.5)]" style={{ width: `${totalHard > 0 ? (stats.hardSolved / totalHard) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="glass-card overflow-hidden border-t border-t-white/10">
          <div className="p-6 border-b border-white/5 bg-black/20">
            <h3 className="text-white font-semibold text-lg">Recent Submissions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase text-slate-400 bg-black/40">
                <tr>
                  <th className="py-4 px-6 text-center w-24">Status</th>
                  <th className="py-4 px-6">Problem</th>
                  <th className="py-4 px-6 text-center w-32">Language</th>
                  <th className="py-4 px-6 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.recentSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500">No recent submissions found.</td>
                  </tr>
                ) : (
                  stats.recentSubmissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-6 text-center font-medium">
                        {sub.status === 'Accepted' ? (
                          <span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">Accepted</span>
                        ) : sub.status === 'Partially Accepted' ? (
                          <span className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">Partially Accepted</span>
                        ) : sub.status === 'Wrong Answer' ? (
                          <span className="text-rose-400">Wrong Answer</span>
                        ) : (
                          <span className="text-slate-400">{sub.status}</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {sub.problem_id ? (
                          <Link to={`/problems/${sub.problem_id}`} className="text-white group-hover:text-blue-400 transition-colors font-medium">
                            {sub.title}
                          </Link>
                        ) : (
                          <span className="text-slate-400">{sub.title}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center text-slate-400 capitalize">
                        {sub.language}
                      </td>
                      <td className="py-4 px-6 text-right text-slate-500 whitespace-nowrap">
                        {new Date(sub.timestamp).toLocaleString(undefined, {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
