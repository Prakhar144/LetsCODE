import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://letscode-1-08lv.onrender.com';

export default function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4 !== 0) {
          base64 += '=';
        }
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);

        localStorage.setItem('token', token);
        localStorage.setItem('is_admin', payload.is_admin);
        localStorage.setItem('streak', payload.streak);
        setUser({ token, is_admin: payload.is_admin, streak: payload.streak });
        navigate('/profile');
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }
  }, [location, setUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        const res = await axios.post(`${API_URL}/auth/login`, formData);
        
        // Decode token to get is_admin
        const base64Url = res.data.access_token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4 !== 0) {
          base64 += '=';
        }
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);

        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('is_admin', payload.is_admin);
        localStorage.setItem('streak', payload.streak);
        setUser({ token: res.data.access_token, is_admin: payload.is_admin, streak: payload.streak });
      } else {
        await axios.post(`${API_URL}/auth/register`, { username, email, password });
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        const res = await axios.post(`${API_URL}/auth/login`, formData);
        
        const base64Url = res.data.access_token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4 !== 0) {
          base64 += '=';
        }
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);

        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('is_admin', payload.is_admin);
        localStorage.setItem('streak', payload.streak);
        setUser({ token: res.data.access_token, is_admin: payload.is_admin, streak: payload.streak });
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#0F0F12] relative overflow-hidden text-slate-200">
      
      {/* Animated Code Background */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-[0.03] pointer-events-none select-none">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F12] via-transparent to-[#0F0F12] z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F12] via-transparent to-[#0F0F12] z-10"></div>
        <div className="animate-scroll-code font-mono text-sm text-blue-500 whitespace-pre leading-loose p-8 w-full h-[200%]">
          {Array(20).fill(`
function solve(nums, target) {
  const seen = {};
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (seen[diff] !== undefined) {
      return [seen[diff], i];
    }
    seen[nums[i]] = i;
  }
}
class LinkedListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}
const reverseList = (head) => {
  let prev = null, curr = head;
  while (curr) {
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
};
`).join('\\n')}
        </div>
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md p-8 glass-card animate-in fade-in zoom-in-95 duration-500 text-white">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-black mb-6 text-center tracking-tight">
          {isLogin ? 'Sign In to Lets<CODE>' : 'Create an Account'}
        </h2>
        
        {error && (
          <div className={`p-3 rounded-lg mb-6 text-sm font-medium text-center ${error.includes('successful') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {isLogin ? 'Username or Email id' : 'Username'}
            </label>
            <input 
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#1A1A1A]/80 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-500"
              placeholder={isLogin ? 'Username or Email id' : 'Username'}
            />
          </div>
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email id</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1A1A1A]/80 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-500"
                placeholder="Email id"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1A1A1A]/80 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-500"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            disabled={loading}
            className="w-full py-3 mt-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-6 flex items-center justify-between">
          <span className="border-b border-white/10 w-1/5 lg:w-1/4"></span>
          <span className="text-xs text-center text-slate-500 uppercase font-semibold">Or continue with</span>
          <span className="border-b border-white/10 w-1/5 lg:w-1/4"></span>
        </div>

        <div className="flex gap-4 mt-6">
          <button 
            onClick={(e) => { e.preventDefault(); window.location.href = `${API_URL}/auth/github`; }}
            className="flex-1 py-3 rounded-lg bg-[#24292e] hover:bg-[#1b1f23] text-white font-medium transition-all flex items-center justify-center gap-2 border border-white/10"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            GitHub
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); window.location.href = `${API_URL}/auth/google`; }}
            className="flex-1 py-3 rounded-lg bg-white hover:bg-gray-100 text-gray-900 font-medium transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
        </div>
        
        <p className="mt-8 text-center text-slate-400 text-sm font-medium">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-400 font-bold hover:text-blue-300 hover:underline">
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
