import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export default function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
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
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
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
