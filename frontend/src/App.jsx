import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import Auth from './components/Auth';
import AdminPortal from './components/AdminPortal';
import CodingPanel from './components/CodingPanel';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import HomeFeed from './components/HomeFeed';
import Contest from './components/Contest';
import Discuss from './components/Discuss';
import Profile from './components/Profile';
import StudyPlan from './components/StudyPlan';
import Quest from './components/Quest';
import Contact from './components/Contact';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const is_admin = localStorage.getItem('is_admin') === 'true';
    const streak = parseInt(localStorage.getItem('streak') || '0', 10);
    return token ? { token, is_admin, streak } : null;
  });
  const location = useLocation();
  const navigate = useNavigate();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [allProblems, setAllProblems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (user) {
      // Fetch problems for global search
      axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/code/problems`)
        .then(res => setAllProblems(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  useEffect(() => {
    // Handle click outside search dropdown
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const results = allProblems.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) || 
        p.difficulty.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('is_admin');
    setUser(null);
  };

  // Hide nav on the landing page and auth page
  const isLandingPage = location.pathname === '/' && !user;
  const isAuthPage = location.pathname === '/login';
  const isContactPage = location.pathname === '/contact';
  
  const hideNav = isLandingPage || isAuthPage || isContactPage;

  return (
    <div className="min-h-screen flex flex-col h-screen bg-[#1A1A1A] text-[#D5D5D5]">
      {!hideNav && (
        <nav className="fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center justify-between px-6 shadow-lg border-b border-white/10 bg-[#282828]">
          <div className="flex items-center gap-8">
            <Link to="/home" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-all">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-500 transition-all">Lets&lt;CODE&gt;</span>
            </Link>
            
            {user && (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/home" className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${location.pathname === '/home' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>Feed</Link>
                <Link to="/problems" className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${location.pathname === '/problems' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>Problems</Link>
                <Link to="/contest" className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${location.pathname === '/contest' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>Contest</Link>
                <Link to="/discuss" className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${location.pathname === '/discuss' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>Discuss</Link>
              </div>
            )}
          </div>

          <div className="flex gap-4 items-center">
            {user ? (
              <>
                <div ref={searchRef} className="relative hidden lg:block">
                  <div className="flex items-center bg-[#3A3A3A] rounded-md px-3 py-1.5 w-64 border border-transparent hover:border-gray-500 focus-within:border-blue-500 transition-colors">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input 
                      type="text" 
                      placeholder="Search problems..." 
                      className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-400" 
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() => { if (searchQuery.trim().length > 0) setIsSearchOpen(true); }}
                    />
                  </div>

                  {/* Search Dropdown */}
                  {isSearchOpen && (
                    <div className="absolute top-full mt-2 w-full bg-[#282828] border border-[#3A3A3A] rounded-lg shadow-xl overflow-hidden z-50">
                      {searchResults.length > 0 ? (
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                          {searchResults.map(p => (
                            <Link 
                              key={p._id} 
                              to={`/problems/${p._id}`}
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="px-4 py-3 border-b border-[#3A3A3A] hover:bg-[#3A3A3A] flex justify-between items-center group transition-colors"
                            >
                              <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors truncate pr-2">{p.title}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${p.difficulty === 'Easy' ? 'bg-secondary/20 text-secondary' : p.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>
                                {p.difficulty}
                              </span>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-400 text-center">No problems found.</div>
                      )}
                    </div>
                  )}
                </div>
                
                <button className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                </button>
                <div className="relative group flex items-center">
                  <button className={`transition-colors flex items-center gap-1 ${user.streak > 0 ? 'text-orange-500 animate-fire drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'text-gray-400 hover:text-orange-500'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path></svg>
                    <span className="text-sm font-bold">{user.streak || 0}</span>
                  </button>
                  <div className="absolute top-full right-1/2 translate-x-1/2 mt-4 w-48 p-3 bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 text-center scale-95 group-hover:scale-100">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1A1A1A] border-t border-l border-[#3A3A3A] rotate-45"></div>
                    <p className="text-sm font-bold text-orange-500 mb-1 relative z-10">Daily Streak</p>
                    <p className="text-xs text-gray-400 relative z-10">Solve 1 question per day to keep your streak burning!</p>
                  </div>
                </div>

                <Link to="/profile" className="w-7 h-7 hover:ring-2 hover:ring-blue-500 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white border border-gray-500 cursor-pointer overflow-hidden transition-all shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                  <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                </Link>

                {user.is_admin && (
                  <Link to="/admin" className="text-gray-400 hover:text-white transition-colors text-sm font-medium ml-2 border-l border-gray-600 pl-4">Admin</Link>
                )}
                <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors ml-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </button>
              </>
            ) : (
              <Link to="/login" className="px-4 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] transition-all text-white font-medium text-sm">Sign In</Link>
            )}
          </div>
        </nav>
      )}

      <div className={`flex-1 flex overflow-hidden relative ${!hideNav ? 'pt-16' : ''}`}>
            
        {/* Background elements for authenticated area */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-900/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 flex-1 flex overflow-hidden">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={user ? <HomeFeed /> : <Navigate to="/login" />} />
            <Route path="/contest" element={user ? <Contest /> : <Navigate to="/login" />} />
            <Route path="/discuss" element={user ? <Discuss /> : <Navigate to="/login" />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={!user ? <Auth setUser={setUser} /> : <Navigate to="/profile" />} />
            <Route path="/problems" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/problems/:id" element={user ? <CodingPanel user={user} setUser={setUser} /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/study-plan" element={user ? <StudyPlan /> : <Navigate to="/login" />} />
            <Route path="/quest" element={user ? <Quest /> : <Navigate to="/login" />} />
            <Route path="/workspace" element={<Navigate to="/problems" />} />
            <Route path="/admin" element={user?.is_admin ? <AdminPortal /> : <Navigate to="/home" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
