import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function CodingPanel({ user, setUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  
  const defaultCode = {
    python: 'import sys\n\ndef solve():\n    # Read all inputs from standard input\n    input_data = sys.stdin.read().split()\n    if not input_data: return\n    \n    # Write your logic here\n    # print(result)\n\nif __name__ == "__main__":\n    solve()',
    c: '#include <stdio.h>\n\nint main() {\n    // Read from standard input (e.g. scanf)\n    \n    // Write your logic here\n    // Print to standard output (e.g. printf)\n    \n    return 0;\n}',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Read from standard input (e.g. cin)\n    \n    // Write your logic here\n    // Print to standard output (e.g. cout)\n    \n    return 0;\n}',
    java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Read from standard input (e.g. scanner.nextInt())\n        \n        // Write your logic here\n        // Print to standard output (e.g. System.out.println())\n    }\n}'
  };

  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(defaultCode.python);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [testCases, setTestCases] = useState([]);
  
  // UI State
  const [leftTab, setLeftTab] = useState('description'); // description, submissions
  const [bottomTab, setBottomTab] = useState('testcases'); // testcases, results
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [activeTestCase, setActiveTestCase] = useState(0);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`${API_URL}/code/problems/${id}`);
        setProblem(res.data);
        try {
          setTestCases(JSON.parse(res.data.test_cases));
        } catch(e) {
          setTestCases([]);
        }
      } catch (err) {
        console.error("Failed to fetch problem", err);
        navigate('/problems');
      }
    };
    fetchProblem();
  }, [id, navigate]);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/code/submissions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (leftTab === 'submissions') {
      fetchSubmissions();
    }
  }, [leftTab]);

  const handleAction = async (actionType) => {
    if (!problem) return;
    setLoading(true);
    setResult(null);
    setConsoleOpen(true);
    setBottomTab('results');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/code/submit`, {
        problem_id: problem._id,
        code: code,
        language: language,
        run_only: actionType === 'run'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(res.data);
      if (actionType === 'submit') {
        fetchSubmissions(); // refresh submissions in background
        if (res.data.streak !== undefined && user) {
          localStorage.setItem('streak', res.data.streak);
          setUser({ ...user, streak: res.data.streak });
        }
      }
    } catch (err) {
      setResult({ status: 'System Error', message: err.response?.data?.detail || err.message, results: [] });
    } finally {
      setLoading(false);
    }
  };

  if (!problem) return <div className="flex items-center justify-center h-full">Loading...</div>;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background w-full">
      {/* Toolbar for panel */}
      <div className="h-14 glass z-40 flex shrink-0 items-center justify-between px-6 border-b border-white/10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/problems" className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            Problem List
          </Link>
          <span className="text-white/20">|</span>
          <span className="font-bold text-white text-lg tracking-tight">{problem.title}</span>
        </div>
        <div className="flex items-center gap-6">
          <select 
            value={language}
            onChange={(e) => {
              const newLang = e.target.value;
              setLanguage(newLang);
              if (code.trim() === '' || Object.values(defaultCode).some(dc => dc.trim() === code.trim())) {
                setCode(defaultCode[newLang]);
              }
            }}
            className="bg-black/50 text-slate-300 text-sm rounded-lg px-4 py-2 outline-none border border-white/10 hover:border-blue-500/50 focus:border-blue-500 transition-all cursor-pointer shadow-inner backdrop-blur-md"
          >
            <option value="python">Python</option>
            <option value="c">C (gcc)</option>
            <option value="cpp">C++ (g++)</option>
            <option value="java">Java (javac)</option>
          </select>
          
          <div className="flex bg-black/40 rounded-full p-1 border border-white/5 backdrop-blur-md shadow-inner">
            <button 
              onClick={() => handleAction('run')}
              disabled={loading}
              className="px-6 py-1.5 rounded-full text-sm font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              Run Code
            </button>
            <button 
              onClick={() => handleAction('submit')}
              disabled={loading}
              className="px-6 py-1.5 rounded-full text-sm font-bold bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white border border-green-500/30 hover:border-green-500 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Submit
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex w-full bg-[#0F0F12] overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 border-r border-white/5 flex flex-col bg-[#16161A]/80 backdrop-blur-md relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-0 w-full h-32 bg-blue-500/5 filter blur-[80px] pointer-events-none"></div>
          
          <div className="flex p-4 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-10">
            <div className="flex bg-black/50 p-1 rounded-lg border border-white/5">
              <button 
                onClick={() => setLeftTab('description')}
                className={`px-6 py-1.5 text-sm font-medium rounded-md transition-all ${leftTab === 'description' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                Description
              </button>
              <button 
                onClick={() => setLeftTab('submissions')}
                className={`px-6 py-1.5 text-sm font-medium rounded-md transition-all ${leftTab === 'submissions' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                Submissions
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {leftTab === 'description' ? (
              <div className="animate-in fade-in duration-300">
                <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
                <div className="flex gap-2 mb-6">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    problem.difficulty === 'Easy' ? 'bg-secondary/20 text-secondary' : 
                    problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {problem.difficulty}
                  </span>
                </div>
                <div className="prose prose-invert max-w-none text-slate-300">
                  <ReactMarkdown>{problem.description}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-lg font-bold mb-4">Past Submissions</h2>
                {submissions.length === 0 ? (
                  <p className="text-muted">No submissions yet.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {submissions.map(s => (
                      <div key={s._id} className="bg-surface/50 p-3 rounded-lg border border-white/5 flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className={`font-semibold ${s.status === 'Accepted' ? 'text-secondary' : s.status === 'Partially Accepted' ? 'text-yellow-500' : 'text-red-500'}`}>
                            {s.status}
                          </span>
                          {s.score !== undefined && (
                            <span className="text-xs font-bold mt-1 text-white/80">Score: {s.score}%</span>
                          )}
                        </div>
                        <span className="text-xs text-muted font-mono">{new Date(s.created_at).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex flex-col bg-[#0F0F12]">
          {/* Editor Area */}
          <div className="flex-1 relative flex flex-col min-h-[300px]">
            <div className="h-10 bg-black/40 border-b border-white/5 flex items-center px-4 justify-between backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <span className="text-xs text-slate-400 font-mono bg-black/50 px-3 py-1 rounded-full border border-white/5 capitalize">{language === 'cpp' ? 'c++' : language} Workspace</span>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                language={language === 'c' ? 'cpp' : language}
                theme="vs-dark"
                value={code}
                onChange={setCode}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: 'JetBrains Mono, monospace',
                  padding: { top: 16 }
                }}
              />
            </div>
          </div>
          
          {/* Bottom Console Area */}
          <div className={`border-t border-white/10 bg-[#16161A]/90 backdrop-blur-xl flex flex-col transition-all duration-500 ease-in-out ${consoleOpen ? 'h-72 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]' : 'h-10'}`}>
            <div className="h-10 flex items-center justify-between px-4 bg-black/40 border-b border-white/5 cursor-pointer select-none group" onClick={() => setConsoleOpen(!consoleOpen)}>
              <div className="flex gap-2 h-full items-center">
                <div className="flex bg-black/50 p-1 rounded-lg border border-white/5">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setBottomTab('testcases'); setConsoleOpen(true); }}
                    className={`px-4 py-1 text-xs font-bold rounded transition-all flex items-center gap-2 ${bottomTab === 'testcases' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                    Test Cases
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setBottomTab('results'); setConsoleOpen(true); }}
                    className={`px-4 py-1 text-xs font-bold rounded transition-all flex items-center gap-2 ${bottomTab === 'results' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    Test Result
                  </button>
                </div>
              </div>
              <div className="p-1 rounded-full group-hover:bg-white/10 transition-colors">
                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${consoleOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
              </div>
            </div>

            {consoleOpen && (
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {loading ? (
                  <div className="flex items-center justify-center h-full text-muted gap-2">
                    <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Executing...
                  </div>
                ) : bottomTab === 'testcases' ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                      {testCases.map((tc, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setActiveTestCase(idx)}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${activeTestCase === idx ? 'bg-surface border border-white/20 text-white' : 'hover:bg-surface/50 text-muted'}`}
                        >
                          Case {idx + 1}
                        </button>
                      ))}
                    </div>
                    {testCases[activeTestCase] && (
                      <div className="flex flex-col gap-3">
                        <div>
                          <div className="text-xs text-muted mb-1 font-semibold">Input:</div>
                          <div className="bg-black/30 p-2 rounded border border-white/5 font-mono text-sm">{testCases[activeTestCase].input || 'None'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted mb-1 font-semibold">Expected Output:</div>
                          <div className="bg-black/30 p-2 rounded border border-white/5 font-mono text-sm">{testCases[activeTestCase].expected || 'None'}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {!result ? (
                      <div className="text-muted">You must run your code first.</div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className={`text-xl font-bold ${
                            result.status === 'Accepted' ? 'text-secondary' : 
                            result.status === 'Partially Accepted' ? 'text-yellow-500' :
                            result.status === 'Error' ? 'text-red-500' : 'text-red-400'
                          }`}>
                            {result.status}
                          </div>
                          {result.score !== undefined && (
                            <div className={`text-2xl font-black ${
                              result.score === 100 ? 'text-secondary' : 
                              result.score > 0 ? 'text-yellow-500' : 'text-red-500'
                            }`}>
                              {result.score}%
                            </div>
                          )}
                        </div>
                        {result.message && (
                          <div className="text-red-400 bg-red-500/10 p-3 rounded font-mono text-sm whitespace-pre-wrap">
                            {result.message}
                          </div>
                        )}
                        {result.results && result.results.map((r, i) => (
                          <div key={i} className="bg-black/20 rounded-lg p-3 border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`w-2 h-2 rounded-full ${r.passed ? 'bg-secondary' : r.similarity > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                              <span className="font-semibold text-sm">Test Case {r.test_case}</span>
                              {r.error && <span className={`text-xs px-2 py-0.5 rounded ${r.error === 'Partially Correct' ? 'text-yellow-500 bg-yellow-500/10' : 'text-red-400 bg-red-400/10'}`}>{r.error}</span>}
                              {r.similarity !== undefined && r.similarity < 100 && r.similarity > 0 && <span className="text-xs text-yellow-500 font-bold ml-auto">{r.similarity}% Match</span>}
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                              <div>
                                <div className="text-muted mb-1">Input</div>
                                <div className="bg-black/40 p-1.5 rounded text-white/80">{r.input || 'None'}</div>
                              </div>
                              <div>
                                <div className="text-muted mb-1">Expected Output</div>
                                <div className="bg-black/40 p-1.5 rounded text-white/80">{r.expected || 'None'}</div>
                              </div>
                            </div>
                            <div className="mt-2 text-xs font-mono">
                              <div className="text-muted mb-1">Actual Output</div>
                              <div className={`p-1.5 rounded ${r.passed ? 'bg-secondary/10 text-secondary' : r.similarity > 0 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-400'}`}>
                                {r.actual || 'No output'}
                              </div>
                            </div>
                            {r.stderr && (
                              <div className="mt-2 text-xs font-mono">
                                <div className="text-red-400/80 mb-1">StdErr</div>
                                <div className="bg-red-500/10 text-red-400 p-1.5 rounded whitespace-pre-wrap">
                                  {r.stderr}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
