import { Link } from 'react-router-dom';

export default function Curriculum() {
  const studyPlans = [
    {
      id: "top-interview-150",
      title: "Top Interview 150",
      description: "Must-do list for interview prep. Comprehensive coverage of all topics.",
      problems: 150,
      duration: "30 Days",
      color: "from-amber-400 to-orange-500",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
      )
    },
    {
      id: "letscode-75",
      title: "Lets<CODE> 75",
      description: "Ace coding interview with 75 Qs. Essential questions to master DSA.",
      problems: 75,
      duration: "15 Days",
      color: "from-blue-400 to-indigo-500",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
      )
    },
    {
      id: "sql-50",
      title: "SQL 50",
      description: "Crack SQL Interview in 50 Qs. Master basic to advanced queries.",
      problems: 50,
      duration: "10 Days",
      color: "from-cyan-400 to-teal-500",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
      )
    },
    {
      id: "dynamic-programming",
      title: "Dynamic Programming",
      description: "Master DP through 21 Days. From basic memoization to advanced state DP.",
      problems: 60,
      duration: "21 Days",
      color: "from-purple-400 to-pink-500",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
      )
    },
    {
      id: "30-days-of-javascript",
      title: "30 Days of JavaScript",
      description: "Learn JavaScript basic to advanced. Closures, Promises, and more.",
      problems: 30,
      duration: "30 Days",
      color: "from-yellow-400 to-yellow-600",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
      )
    },
    {
      id: "graph-theory",
      title: "Graph Theory",
      description: "Comprehensive guide to Graphs. DFS, BFS, Shortest Paths, and MST.",
      problems: 45,
      duration: "14 Days",
      color: "from-emerald-400 to-green-600",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
      )
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#1A1A1A] p-8 pb-24 text-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center md:text-left relative">
          <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight mb-4 drop-shadow-lg">
            Curriculum
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl">
            Structured study plans designed to help you prepare for technical interviews and master data structures and algorithms. Follow the path, stay consistent, and ace your next interview.
          </p>
        </div>

        {/* Featured Plan */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            Featured Plan
          </h2>
          <div className="glass-card relative overflow-hidden group hover:border-orange-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 relative z-10">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30 flex-shrink-0">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 text-xs font-bold rounded-full mb-3 border border-orange-500/30 uppercase tracking-wide">Highly Recommended</div>
                <h3 className="text-3xl font-bold text-white mb-2">Top Interview 150</h3>
                <p className="text-slate-400 mb-4 max-w-2xl">Must-do list for interview prep. Comprehensive coverage of all topics ranging from arrays to graphs and dynamic programming.</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                    150 Problems
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    ~30 Days
                  </div>
                </div>
              </div>
              <div>
                <Link to="/problems" className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all transform hover:scale-105">
                  Start Plan
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Study Plans Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            Comprehensive Study Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyPlans.map((plan) => (
              <div key={plan.id} className="glass-card group hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden relative h-full flex flex-col">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.color} opacity-10 rounded-full blur-[40px] group-hover:opacity-30 transition-opacity`}></div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg mb-6 transform group-hover:-translate-y-1 transition-transform`}>
                    {plan.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{plan.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 flex-1 leading-relaxed">{plan.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Problems</span>
                        <span className="text-white font-medium text-sm">{plan.problems}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Duration</span>
                        <span className="text-white font-medium text-sm">{plan.duration}</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
