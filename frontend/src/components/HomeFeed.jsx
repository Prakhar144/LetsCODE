import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://letscode-1-08lv.onrender.com';

export default function HomeFeed() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Composer state
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File is too large. Please select an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const fetchFeed = async () => {
    try {
      const res = await axios.get(`${API_URL}/feed`);
      setFeed(res.data);
    } catch (err) {
      console.error('Failed to fetch feed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsPosting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/feed`, {
        content,
        image_url: imageUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setContent('');
      setImageUrl('');
      fetchFeed(); // Refresh feed
    } catch (err) {
      console.error('Failed to post', err);
      alert('Failed to post. Are you logged in?');
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/feed/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFeed();
    } catch (err) {
      console.error('Failed to delete post', err);
      alert('Failed to delete post');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0F0F12] p-8 custom-scrollbar">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Composer */}
        <div className="glass-card p-6 border-t border-t-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-blue-500/20 rounded-full blur-[40px] pointer-events-none"></div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            Share an Achievement
          </h2>
          <form onSubmit={handlePost} className="space-y-4 relative z-10">
            <textarea
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors resize-none shadow-inner"
              placeholder="What did you build today?"
              rows="3"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <input
                  type="text"
                  className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-12 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors shadow-inner"
                  placeholder={imageUrl && imageUrl.startsWith('data:image') ? "Image selected" : "Paste an Image URL to showcase a design..."}
                  value={imageUrl && imageUrl.startsWith('data:image') ? '' : imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  readOnly={imageUrl && imageUrl.startsWith('data:image')}
                />
                <input 
                  type="file" 
                  id="image-upload" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
                {imageUrl && imageUrl.startsWith('data:image') ? (
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('');
                      document.getElementById('image-upload').value = '';
                    }}
                    className="absolute right-2 top-1.5 p-1 text-gray-400 hover:text-rose-500 cursor-pointer bg-white/5 hover:bg-white/10 rounded transition-colors"
                    title="Remove Image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                ) : (
                  <label 
                    htmlFor="image-upload" 
                    className="absolute right-2 top-1.5 p-1 text-gray-400 hover:text-white cursor-pointer bg-white/5 hover:bg-white/10 rounded transition-colors"
                    title="Upload Image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                  </label>
                )}
              </div>
              <button 
                type="submit"
                disabled={isPosting || !content.trim()}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-2"
              >
                {isPosting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        </div>

        {/* Feed List */}
        <div className="space-y-6 pb-20">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading feed...</div>
          ) : feed.length === 0 ? (
            <div className="text-center text-gray-500 py-8 glass-card">No posts yet. Be the first!</div>
          ) : (
            feed.map((item) => (
              <div key={`${item.type}-${item.id}`} className="glass-card p-6 border-t border-t-white/10 transition-all hover:bg-white/5 hover:border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] shrink-0">
                    {item.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-white">{item.author}</div>
                    <div className="text-xs text-slate-400">{new Date(item.timestamp).toLocaleString()}</div>
                  </div>
                </div>

                {item.type === 'post' ? (
                  <div>
                    <p className="text-gray-200 whitespace-pre-wrap mb-4 text-[15px] leading-relaxed">{item.content}</p>
                    {item.image_url && (
                      <div className="rounded-xl overflow-hidden border border-white/10 mb-4 bg-black/50">
                        <img src={item.image_url} alt="Post attachment" className="w-full object-cover max-h-96" onError={(e) => e.target.style.display='none'} />
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-gray-500 border-t border-white/5 pt-4 mt-2">
                      <button className="flex items-center gap-1.5 hover:text-rose-500 transition-colors group">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        <span className="text-sm font-medium">{item.likes || 0}</span>
                      </button>
                      {currentUser === item.author && (
                        <button onClick={() => handleDeletePost(item.id)} className="flex items-center gap-1.5 hover:text-red-500 transition-colors group ml-auto">
                          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          <span className="text-sm font-medium">Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-emerald-400 mb-4 flex items-center gap-2 font-medium">
                      <div className="p-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                      Successfully conquered a challenge!
                    </div>
                    {item.problem ? (
                      <Link to={`/problems/${item.problem._id}`} className="block bg-black/40 border border-white/5 p-4 rounded-xl hover:border-blue-500/50 hover:bg-white/5 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] group-hover:bg-blue-500/20 transition-colors"></div>
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2 relative z-10">
                          <span className="font-bold text-white group-hover:text-blue-400 transition-colors text-lg">{item.problem.title}</span>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium inline-block max-w-max ${
                            item.problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 
                            item.problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                          }`}>
                            {item.problem.difficulty}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 flex items-center gap-4 relative z-10">
                          <span className="flex items-center gap-1 font-mono text-green-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            Score: {item.score}%
                          </span>
                        </div>
                      </Link>
                    ) : (
                      <div className="text-gray-500 italic bg-black/40 border border-white/5 p-4 rounded-xl">Problem data unavailable</div>
                    )}
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
