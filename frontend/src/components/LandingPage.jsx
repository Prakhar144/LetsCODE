import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="h-full w-full bg-[#0F0F12] flex flex-col relative overflow-y-auto text-slate-200 custom-scrollbar">
      
      {/* Animated Glowing Orbs Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar specific to Landing Page */}
      <nav className="relative z-20 flex justify-between items-center px-10 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
          <span className="text-2xl font-bold tracking-tight text-white">Lets&lt;CODE&gt;</span>
        </div>
        
        <div className="hidden md:flex gap-8 items-center font-medium">
          <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          <Link to="/login" className="px-5 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all">Sign In</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-grow flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto w-full px-10 py-16 gap-16">
        
        {/* Left Side: Text and CTA */}
        <div className="flex-1 flex flex-col items-start animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Lets&lt;CODE&gt; v2.0 is live
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight leading-[1.1] text-white">
            Master the art of <br/>
            <span className="text-gradient">Algorithms</span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-lg leading-relaxed">
            Lets&lt;CODE&gt; is the ultimate platform to elevate your coding skills, conquer algorithmic challenges, and ace your technical interviews.
          </p>
          <div className="flex gap-4">
            <Link to="/login">
              <button className="bg-white text-black hover:bg-gray-200 font-bold px-8 py-4 rounded-full flex items-center gap-2 transition-transform hover:scale-105">
                Start Coding Free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </Link>
            <button className="px-8 py-4 rounded-full font-bold border border-white/20 hover:bg-white/5 transition-colors">
              View Curriculum
            </button>
          </div>
        </div>

        {/* Right Side: Floating UI Mockup */}
        <div className="flex-1 w-full animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
          <div className="relative w-full max-w-2xl mx-auto glass-card p-4 aspect-[4/3] flex flex-col" style={{ transform: 'rotate(-2deg) scale(1.02)' }}>
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="ml-4 font-mono text-xs text-slate-400">editor.py</div>
            </div>
            <div className="font-mono text-sm text-blue-300 leading-relaxed">
              <span className="text-purple-400">def</span> <span className="text-blue-300">solve</span>(nums, target):<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;seen = {'{}'}<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">for</span> i, num <span className="text-purple-400">in</span> <span className="text-blue-200">enumerate</span>(nums):<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;diff = target - num<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">if</span> diff <span className="text-purple-400">in</span> seen:<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> [seen[diff], i]<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;seen[num] = i<br/>
            </div>
            <div className="mt-auto flex justify-end">
              <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded text-xs font-bold border border-green-500/30 animate-glow">
                Accepted • 100%
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Features */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto w-full px-10 pb-24 mt-12">
        <div className="glass-card p-8">
          <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Lightning Fast Execution</h3>
          <p className="text-slate-400 text-sm leading-relaxed">Execute Python, C++, and Java code with near-zero latency on our highly optimized backend containers.</p>
        </div>
        <div className="glass-card p-8">
          <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Community Discussions</h3>
          <p className="text-slate-400 text-sm leading-relaxed">Join thousands of developers sharing solutions, debugging tips, and algorithmic approaches.</p>
        </div>
        <div className="glass-card p-8">
          <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">100+ Premium Problems</h3>
          <p className="text-slate-400 text-sm leading-relaxed">Our massive database of algorithmic challenges covers everything from basic arrays to advanced dynamic programming.</p>
        </div>
      </div>
    </div>
  );
}
