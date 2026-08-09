import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://letscode-1-08lv.onrender.com';

export default function AdminPortal() {
  const [problems, setProblems] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  
  const [newProblem, setNewProblem] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    test_cases: '[\n  {"input": "1 2\\n3", "expected": "3"}\n]'
  });

  const fetchProblems = async () => {
    try {
      const res = await axios.get(`${API_URL}/code/problems`);
      setProblems(res.data);
    } catch (err) {
      console.error("Failed to fetch problems", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchProblems();
    fetchUsers();
  }, []);

  const handleCreateProblem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/admin/problems`, newProblem, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProblems();
      setNewProblem({ title: '', description: '', difficulty: 'Easy', test_cases: '[]' });
      alert("Problem created successfully");
    } catch (err) {
      alert("Failed to create problem: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteProblem = async (problemId) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/problems/${problemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProblems();
    } catch (err) {
      alert("Failed to delete problem: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/admin/users/${userId}/toggle-block`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      alert("Failed to toggle block status: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="flex-1 p-8 max-w-7xl mx-auto w-full relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="relative z-10">
        <h1 className="text-4xl font-extrabold mb-8 text-white tracking-tight">Admin Analytics Dashboard</h1>
        
        <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg transition-all font-medium ${activeTab === 'users' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'glass hover:bg-surface'}`}
        >
          User Analytics
        </button>
        <button 
          onClick={() => setActiveTab('problems')}
          className={`px-4 py-2 rounded-lg transition-all font-medium ${activeTab === 'problems' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'glass hover:bg-surface'}`}
        >
          Manage Problems
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="glass p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">User Performance & Statistics</h2>
            <div className="text-sm text-muted">Total Users: {users.length}</div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-surface/50">
                  <th className="p-4 text-muted font-medium rounded-tl-lg">User</th>
                  <th className="p-4 text-muted font-medium text-center">Total Attempts</th>
                  <th className="p-4 text-muted font-medium text-center">Successful Submissions</th>
                  <th className="p-4 text-muted font-medium text-center">Unique Problems Solved</th>
                  <th className="p-4 text-muted font-medium text-right">Accuracy Rate</th>
                  <th className="p-4 text-muted font-medium text-center rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-muted">No users found.</td></tr>
                ) : (
                  users.map(u => {
                    const accuracy = u.totalAttempts > 0 
                      ? Math.round((u.totalCorrect / u.totalAttempts) * 100) 
                      : 0;
                    
                    return (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 hover:scale-[1.01] transition-all duration-300">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${u.is_admin ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                              {u.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold">{u.username}</div>
                              {u.is_admin && <div className="text-xs text-purple-400">Administrator</div>}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center font-mono">{u.totalAttempts}</td>
                        <td className="p-4 text-center font-mono text-secondary">{u.totalCorrect}</td>
                        <td className="p-4 text-center">
                          <span className="bg-surface px-3 py-1 rounded-full text-sm border border-white/10">
                            {u.uniqueSolved}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="font-mono">{accuracy}%</span>
                            <div className="w-16 h-2 bg-surface rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${accuracy > 70 ? 'bg-secondary' : accuracy > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                style={{ width: `${accuracy}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          {!u.is_admin && (
                            <button
                              onClick={() => handleToggleBlock(u.id)}
                              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${u.is_blocked ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-surface border border-white/10 hover:bg-white/10 text-white'}`}
                            >
                              {u.is_blocked ? 'Blocked' : 'Block'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'problems' && (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">Create New Problem</h2>
            <form onSubmit={handleCreateProblem} className="flex flex-col gap-4">
              <input 
                placeholder="Title" 
                required 
                className="bg-surface border border-white/10 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none text-white"
                value={newProblem.title}
                onChange={e => setNewProblem({...newProblem, title: e.target.value})}
              />
              <textarea 
                placeholder="Description" 
                required 
                rows={4}
                className="bg-surface border border-white/10 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none text-white"
                value={newProblem.description}
                onChange={e => setNewProblem({...newProblem, description: e.target.value})}
              />
              <select 
                className="bg-surface border border-white/10 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none text-white"
                value={newProblem.difficulty}
                onChange={e => setNewProblem({...newProblem, difficulty: e.target.value})}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
              <textarea 
                placeholder='Test Cases (JSON)' 
                required 
                rows={4}
                className="bg-surface border border-white/10 p-3 rounded-lg font-mono text-sm focus:ring-2 focus:ring-primary outline-none text-white"
                value={newProblem.test_cases}
                onChange={e => setNewProblem({...newProblem, test_cases: e.target.value})}
              />
              <button className="bg-secondary hover:bg-secondary/90 text-white font-semibold py-3 rounded-lg transition-colors">
                Add Problem
              </button>
            </form>
          </div>
          
      <div className="glass p-6 rounded-2xl flex flex-col max-h-[600px] border border-white/10 shadow-2xl">
        <h2 className="text-xl font-bold mb-4">Existing Problems</h2>
        <div className="flex-1 overflow-y-auto overflow-x-auto pr-2 custom-scrollbar flex flex-col gap-3">
          {problems.map(p => (
            <div key={p._id} className="bg-surface p-4 rounded-xl border border-white/5 flex justify-between items-center group hover:border-blue-500/30 hover:bg-white/5 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:scale-[1.01] transition-all duration-300 min-w-max gap-4">
              <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate pr-4">{p.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${p.difficulty === 'Easy' ? 'bg-secondary/20 text-secondary' : p.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>
                      {p.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-muted text-sm font-mono opacity-50 group-hover:opacity-100 transition-opacity">ID: {p._id}</div>
                    <button 
                      onClick={() => handleDeleteProblem(p._id)}
                      className="text-muted hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                      title="Delete Problem"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
              ))}
              {problems.length === 0 && <p className="text-muted text-center py-8">No problems found.</p>}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
