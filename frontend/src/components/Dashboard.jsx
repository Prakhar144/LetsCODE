import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import CalendarWidget from './CalendarWidget';

const API_URL = 'http://localhost:8000';

export default function Dashboard() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [solvedIds, setSolvedIds] = useState(new Set());
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeSpent, setTimeSpent] = useState(() => parseInt(localStorage.getItem('mock_time_spent_minutes') || '0', 10));
  const codingGoal = parseInt(localStorage.getItem('coding_goal_minutes') || '60', 10);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProblems = problems.filter(p => {
    if (showFavoritesOnly && !favoriteIds.has(p._id)) return false;
    
    const query = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(query) || 
           p.difficulty.toLowerCase().includes(query) ||
           (p.tags && p.tags.some(tag => tag.toLowerCase().includes(query)));
  });

  // Mock data for topics
  const topics = [
    { name: 'Array', count: 2197 },
    { name: 'String', count: 880 },
    { name: 'Hash Table', count: 825 },
    { name: 'Math', count: 684 },
    { name: 'Dynamic Programming', count: 666 },
    { name: 'Sorting', count: 527 },
    { name: 'Greedy', count: 470 },
    { name: 'Depth-First Search', count: 432 },
  ];

  // Mock data for trending companies
  const companies = [
    { name: 'Google', count: 2339 },
    { name: 'Amazon', count: 2000 },
    { name: 'Apple', count: 300 },
    { name: 'Bloomberg', count: 1215 },
    { name: 'Infosys', count: 210 },
    { name: 'Meta', count: 1403 },
    { name: 'Microsoft', count: 1385 },
    { name: 'LinkedIn', count: 175 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const [problemsRes, progressRes] = await Promise.all([
          axios.get(`${API_URL}/code/problems`),
          axios.get(`${API_URL}/code/my-progress`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setProblems(problemsRes.data);
        setSolvedIds(new Set(progressRes.data.solved));
        if (progressRes.data.favorites) {
          setFavoriteIds(new Set(progressRes.data.favorites));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleFavorite = async (e, problemId) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/code/favorite/${problemId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        setFavoriteIds(new Set(res.data.favorites));
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    }
  };

  // Setup basic mock timer for time spent coding
  useEffect(() => {
    const interval = setInterval(() => {
      let spent = parseInt(localStorage.getItem('mock_time_spent_minutes') || '0', 10);
      // Increment 1 minute every 60 seconds (for demo, we'll increment every 60s, but here we'll just read)
      // Actually to make the demo active we can simulate 1 minute passing every 10 seconds
      spent += 1;
      localStorage.setItem('mock_time_spent_minutes', spent.toString());
      setTimeSpent(spent);
    }, 60000); // Normally 60000, but works for background

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex overflow-hidden bg-[#1A1A1A] text-[#D5D5D5]">
      
      {/* LEFT SIDEBAR (Navigation) */}
      <div className="w-56 flex-shrink-0 border-r border-[#282828] bg-[#1A1A1A] hidden md:flex flex-col py-4">
        <div className="flex flex-col gap-1 px-3">
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 bg-[#282828] rounded-lg">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            <span className="font-medium text-white">Library</span>
          </a>
          <Link to="/quest" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:bg-[#282828] hover:text-white rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            <span className="font-medium">Quest</span>
          </Link>
          <Link to="/study-plan" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:bg-[#282828] hover:text-white rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            <span className="font-medium">Study Plan</span>
          </Link>

          {/* Timing Widget */}
          <div className="mt-4 px-3">
            <Link to="/study-plan" className="block bg-[#222] border border-white/5 p-3 rounded-xl shadow-inner hover:bg-[#2a2a2a] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">Today's Focus</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-white">{timeSpent}</span>
                <span className="text-xs text-slate-500">/ {codingGoal} min</span>
              </div>
              <div className="w-full bg-[#111] h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min((timeSpent / Math.max(codingGoal, 1)) * 100, 100)}%` }}
                ></div>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="mt-8 px-6 flex items-center justify-between group cursor-pointer">
          <span className="text-xs text-gray-500 font-semibold group-hover:text-gray-300">My Lists</span>
          <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
        </div>
        
        <div className="mt-3 px-3">
          <button 
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${showFavoritesOnly ? 'bg-[#282828] text-white border border-[#3A3A3A]' : 'text-gray-400 hover:bg-[#282828] hover:text-white border border-transparent'}`}
          >
            <svg className={`w-5 h-5 ${showFavoritesOnly ? 'text-pink-500' : 'text-yellow-500'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            <span className="font-medium text-white">Favorite</span>
          </button>
        </div>
      </div>

      {/* MIDDLE COLUMN (Main Content) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar p-6">
        
        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-[#0F0F12] border border-blue-500/20 p-8 mb-8 shadow-2xl">
          {/* Background glows */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.559-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"></path></svg>
                Daily Goal Active
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">Ready to level up?</h2>
              <p className="text-blue-100/70 text-lg max-w-xl mb-6">
                You have successfully conquered <strong className="text-white">{solvedIds.size}</strong> challenges. Consistency is the key to mastery—dive into your next problem below!
              </p>
              <div className="flex justify-center md:justify-start gap-4">
                <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Resume Practice
                </button>
              </div>
            </div>
            
            {/* Animated Stats Ring */}
            <div className="shrink-0 relative w-40 h-40 bg-black/20 rounded-full border border-white/5 flex items-center justify-center backdrop-blur-md shadow-2xl">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <circle cx="80" cy="80" r="70" fill="none" stroke="url(#blue-gradient)" strokeWidth="10" strokeDasharray="439.8" strokeDashoffset={439.8 - ((solvedIds.size / Math.max(problems.length, 1)) * 439.8)} strokeLinecap="round" className="transition-all duration-1500 ease-out drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <defs>
                  <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="text-center">
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-sm">
                  {Math.round((solvedIds.size / Math.max(problems.length, 1)) * 100)}%
                </div>
                <div className="text-[10px] text-blue-300/70 font-bold uppercase tracking-[0.2em] mt-1">Completed</div>
              </div>
            </div>
          </div>
        </div>



        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button className="px-4 py-1.5 bg-white text-black font-semibold rounded-full text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            All Topics
          </button>
          <button className="px-4 py-1.5 bg-[#282828] hover:bg-[#3A3A3A] text-gray-300 font-medium rounded-full text-sm transition-colors border border-[#3A3A3A]">
            Algorithms
          </button>
          <button className="px-4 py-1.5 bg-[#282828] hover:bg-[#3A3A3A] text-gray-300 font-medium rounded-full text-sm transition-colors border border-[#3A3A3A]">
            Database
          </button>
          <button className="px-4 py-1.5 bg-[#282828] hover:bg-[#3A3A3A] text-gray-300 font-medium rounded-full text-sm transition-colors border border-[#3A3A3A]">
            Shell
          </button>
          <button className="px-4 py-1.5 bg-[#282828] hover:bg-[#3A3A3A] text-gray-300 font-medium rounded-full text-sm transition-colors border border-[#3A3A3A]">
            Concurrency
          </button>
          <button className="px-4 py-1.5 bg-[#282828] hover:bg-[#3A3A3A] text-gray-300 font-medium rounded-full text-sm transition-colors border border-[#3A3A3A]">
            JavaScript
          </button>
        </div>

        {/* Problems List */}
        <div className="flex flex-col gap-1 pb-10">
          
          <div className="flex items-center justify-between mb-4 mt-6">
            <h2 className="text-xl font-bold text-white">{showFavoritesOnly ? "My Favorites" : "All Problems"}</h2>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 bg-white/5 border border-white/10 rounded-full text-sm text-white outline-none focus:border-blue-500 focus:bg-white/10 transition-all shadow-inner"
              />
              <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase text-slate-400 bg-black/40 sticky top-0 backdrop-blur-md z-10 border-b border-white/10">
                  <tr>
                    <th className="py-4 px-4 text-center w-24">Status</th>
                    <th className="py-4 px-4">Title</th>
                    <th className="py-4 px-4 text-center w-32">Difficulty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="py-8 text-center text-slate-500">Loading problems...</td>
                    </tr>
                  ) : (
                    filteredProblems.map(p => (
                      <tr key={p._id} className="border-b border-white/5 hover:bg-white/5 transition-all group cursor-pointer" onClick={() => navigate(`/problems/${p._id}`)}>
                        <td className="py-4 px-4 text-center">
                          {solvedIds.has(p._id) ? (
                            <svg className="w-5 h-5 text-green-500 mx-auto drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                          ) : (
                            <span className="text-gray-600">○</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-white group-hover:text-blue-400 transition-colors font-medium">
                                {p.title}
                              </span>
                              <button 
                                onClick={(e) => toggleFavorite(e, p._id)} 
                                className={`transition-all hover:scale-110 ${favoriteIds.has(p._id) ? 'text-pink-500 drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]' : 'text-slate-600 hover:text-pink-400'}`}
                              >
                                <svg className={`w-4 h-4 ${favoriteIds.has(p._id) ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                              </button>
                            </div>
                            {p.tags && p.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {p.tags.map(tag => (
                                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                            p.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            p.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                          }`}>
                            {p.difficulty}
                          </span>
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

      {/* RIGHT SIDEBAR (Widgets) */}
      <div className="w-80 flex-shrink-0 border-l border-[#282828] bg-[#1A1A1A] hidden xl:flex flex-col p-4 gap-6 overflow-y-auto custom-scrollbar">
        {/* Calendar Widget */}
        <CalendarWidget streak={parseInt(localStorage.getItem('streak') || '0', 10)} />

        {/* Trending Companies */}
        <div className="bg-[#282828] rounded-xl p-5 border border-[#3A3A3A]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white text-sm font-semibold">Trending Companies</span>
            <div className="flex gap-1">
               <button className="bg-[#3A3A3A] p-1 rounded hover:bg-gray-600 transition-colors"><svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg></button>
               <button className="bg-[#3A3A3A] p-1 rounded hover:bg-gray-600 transition-colors"><svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></button>
            </div>
          </div>
          
          <div className="relative mb-4">
            <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Search for a company..." className="bg-[#1A1A1A] border border-[#3A3A3A] text-xs text-white placeholder-gray-500 rounded-full pl-9 pr-4 py-2 outline-none focus:border-gray-500 w-full" />
          </div>

          <div className="flex flex-wrap gap-2">
            {companies.map(c => (
              <button key={c.name} className="px-3 py-1.5 bg-[#3A3A3A] hover:bg-gray-600 text-gray-300 text-xs font-medium rounded-full flex items-center gap-2 transition-colors">
                {c.name}
                <span className="text-[10px] text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded-full">{c.count}</span>
              </button>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
