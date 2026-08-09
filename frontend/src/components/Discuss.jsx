import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://letscode-1-08lv.onrender.com';

export default function Discuss() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reply State
  const [expandedId, setExpandedId] = useState(null);
  const [replies, setReplies] = useState({});
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const getCurrentUser = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload).sub;
    } catch (e) {
      return null;
    }
  };
  const currentUser = getCurrentUser();

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/discuss`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/discuss`, {
        title,
        content,
        tags: tags.split(',').map(t => t.trim()).filter(t => t)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowForm(false);
      setTitle('');
      setContent('');
      setTags('');
      fetchPosts();
    } catch (err) {
      console.error('Failed to create post', err);
      alert('Failed to post. Are you logged in?');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/discuss/${id}/upvote`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts(); // Refresh votes
    } catch (err) {
      console.error('Failed to upvote', err);
      if (err.response && err.response.status === 401) {
        alert('Please log in to upvote.');
      }
    }
  };

  const fetchReplies = async (postId) => {
    try {
      const res = await axios.get(`${API_URL}/discuss/${postId}/replies`);
      setReplies(prev => ({ ...prev, [postId]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleReplies = (postId) => {
    if (expandedId === postId) {
      setExpandedId(null);
    } else {
      setExpandedId(postId);
      fetchReplies(postId);
    }
  };

  const handleReplySubmit = async (e, postId) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    setIsReplying(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/discuss/${postId}/reply`, {
        content: replyContent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReplyContent('');
      fetchReplies(postId);
      fetchPosts(); // update replies count
    } catch (err) {
      alert('Failed to reply. Are you logged in?');
    } finally {
      setIsReplying(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this broadcast?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/discuss/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
    } catch (err) {
      console.error('Failed to delete post', err);
      alert('Failed to delete broadcast');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-8 overflow-y-auto bg-[#0F0F12] custom-scrollbar">
      <div className="max-w-4xl w-full mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-[#1A1A1A]/80 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[60px] pointer-events-none"></div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
              Global Broadcasts
            </h1>
            <p className="text-slate-400">Ask questions and discuss solutions with the entire community in real-time.</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:scale-105 flex items-center gap-2"
          >
            {showForm ? 'Cancel' : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                New Broadcast
              </>
            )}
          </button>
        </div>

        {/* Composer */}
        {showForm && (
          <div className="glass-card p-6 mb-8 border-t border-t-white/10 animate-fade-in shadow-2xl relative overflow-hidden">
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px]"></div>
            <form onSubmit={handleCreatePost} className="space-y-4 relative z-10">
              <input 
                type="text" 
                placeholder="Broadcast Title" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-semibold text-lg outline-none focus:border-blue-500 transition-colors shadow-inner"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea 
                placeholder="What's on your mind? Ask the community..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500 transition-colors h-32 resize-none shadow-inner"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Tags (comma separated, e.g. python, arrays, help)" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-blue-500 transition-colors shadow-inner"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <div className="flex justify-end pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                  className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                >
                  {isSubmitting ? 'Broadcasting...' : 'Send Broadcast'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-6 pb-20">
          {loading ? (
            <div className="text-center text-gray-500 py-12">Loading broadcasts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-500 py-12 glass-card">No broadcasts yet. Be the first to start a discussion!</div>
          ) : (
            posts.map(post => (
              <div key={post._id} className="glass-card border-t border-t-white/10 transition-all hover:border-white/20 overflow-hidden">
                <div className="p-6">
                  {/* Post Header */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
                      <button 
                        onClick={() => handleUpvote(post._id)}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 text-gray-400 flex items-center justify-center transition-colors border border-transparent hover:border-blue-500/30 group"
                      >
                        <svg className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                      </button>
                      <span className="text-sm font-bold text-white">{post.votes}</span>
                    </div>
                    
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white mb-1 hover:text-blue-400 transition-colors cursor-pointer" onClick={() => toggleReplies(post._id)}>
                        {post.title}
                      </h2>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mb-4">
                        <span className="font-bold text-slate-300">@{post.author}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <p className="text-slate-200 whitespace-pre-wrap leading-relaxed mb-4 text-[15px]">
                        {post.content}
                      </p>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-2 mb-4">
                          {post.tags.map((tag, idx) => (
                            <span key={idx} className="text-[10px] bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/20 font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Action Bar */}
                      <div className="flex items-center gap-4 text-sm text-slate-400 border-t border-white/5 pt-3">
                        <button 
                          onClick={() => toggleReplies(post._id)}
                          className="flex items-center gap-2 hover:text-white transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
                          {post.replies || 0} {post.replies === 1 ? 'Reply' : 'Replies'}
                        </button>
                        <button className="flex items-center gap-2 hover:text-white transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-5.368m0 5.368l3 1.62m-3-1.62l-3 1.62m5.368-5.368l3-1.62m-3 1.62l-3-1.62m5.368 5.368l3-1.62m-3 1.62l-3-1.62M12 18h.01M12 6h.01"></path></svg>
                          Share
                        </button>
                        {currentUser === post.author && (
                          <button onClick={() => handleDeletePost(post._id)} className="flex items-center gap-1.5 hover:text-red-500 transition-colors group ml-auto text-rose-500/70 hover:text-rose-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Replies Section */}
                {expandedId === post._id && (
                  <div className="bg-black/40 border-t border-white/5 p-6 animate-fade-in">
                    
                    {/* Reply Form */}
                    <form onSubmit={(e) => handleReplySubmit(e, post._id)} className="flex gap-3 mb-8">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.3)]"></div>
                      <div className="flex-1 relative">
                        <input 
                          type="text"
                          placeholder="Write a reply..."
                          className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-24 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors shadow-inner"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                        />
                        <button 
                          type="submit"
                          disabled={isReplying || !replyContent.trim()}
                          className="absolute right-1 top-1 bottom-1 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-full transition-colors shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                        >
                          {isReplying ? '...' : 'Reply'}
                        </button>
                      </div>
                    </form>

                    {/* Replies List */}
                    <div className="space-y-6 pl-4 border-l-2 border-white/5 ml-4">
                      {!replies[post._id] ? (
                        <div className="text-sm text-slate-500">Loading replies...</div>
                      ) : replies[post._id].length === 0 ? (
                        <div className="text-sm text-slate-500 italic">No replies yet. Be the first!</div>
                      ) : (
                        replies[post._id].map(reply => (
                          <div key={reply._id} className="relative">
                            <div className="absolute -left-6 top-4 w-4 h-0.5 bg-white/5"></div>
                            <div className="flex gap-3">
                               <div className="w-8 h-8 rounded-full bg-[#282828] border border-white/10 flex items-center justify-center font-bold text-slate-400 text-xs shrink-0">
                                {reply.author.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-4">
                                <div className="flex items-baseline gap-2 mb-1">
                                  <span className="font-bold text-white text-sm">{reply.author}</span>
                                  <span className="text-xs text-slate-500">{new Date(reply.createdAt).toLocaleString()}</span>
                                </div>
                                <p className="text-slate-300 text-sm">{reply.content}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
