
import React, { useState, useEffect } from 'react';
import { Bookmark, MessageCircle, Heart, Plus, Share2, Send, X, PenLine } from 'lucide-react';
import { JourneyStage, ForumPost } from '../types';
import { DUMMY_POSTS } from '../constants';

interface CommunityProps {
  userName: string;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

const Community: React.FC<CommunityProps> = ({ userName }) => {
  const [activeStage, setActiveStage] = useState<JourneyStage>(JourneyStage.PREPARING);
  
  // State for user-created posts
  const [userPosts, setUserPosts] = useState<ForumPost[]>(() => {
    const saved = localStorage.getItem('bloomback_user_posts');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence for interactions
  const [bookmarked, setBookmarked] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('bloomback_bookmarks');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  
  const [liked, setLiked] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('bloomback_likes');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [postComments, setPostComments] = useState<Record<string, Comment[]>>(() => {
    const saved = localStorage.getItem('bloomback_comments');
    if (saved) return JSON.parse(saved);
    return {
      '1': [{ id: 'c1', author: 'Joanne K.', text: 'This resonates so much. I found that blocking 15 mins for transition really helped!', date: 'Just now' }]
    };
  });

  const [showCommentsFor, setShowCommentsFor] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  
  // New Post Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostStage, setNewPostStage] = useState<JourneyStage>(activeStage);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('bloomback_bookmarks', JSON.stringify(Array.from(bookmarked)));
  }, [bookmarked]);

  useEffect(() => {
    localStorage.setItem('bloomback_likes', JSON.stringify(Array.from(liked)));
  }, [liked]);

  useEffect(() => {
    localStorage.setItem('bloomback_comments', JSON.stringify(postComments));
  }, [postComments]);

  useEffect(() => {
    localStorage.setItem('bloomback_user_posts', JSON.stringify(userPosts));
  }, [userPosts]);

  const toggleBookmark = (id: string) => {
    const next = new Set(bookmarked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setBookmarked(next);
  };

  const toggleLike = (id: string) => {
    const next = new Set(liked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setLiked(next);
  };

  const handleShare = (id: string) => {
    setToast('Link copied to clipboard!');
    setTimeout(() => setToast(null), 3000);
  };

  const handleSendComment = (postId: string) => {
    if (!commentInput.trim()) return;

    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      author: userName,
      text: commentInput,
      date: 'Just now'
    };

    setPostComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));
    setCommentInput('');
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: ForumPost = {
      id: `up-${Date.now()}`,
      author: userName,
      content: newPostContent,
      stage: newPostStage,
      likes: 0,
      comments: 0,
      date: 'Just now'
    };

    setUserPosts([newPost, ...userPosts]);
    setNewPostContent('');
    setShowCreateModal(false);
    setToast('Post published successfully!');
    setTimeout(() => setToast(null), 3000);
    setActiveStage(newPostStage); // Navigate to the stage of the new post
  };

  // Combine dummy posts and user-created posts
  const allPosts = [...userPosts, ...DUMMY_POSTS];
  const filteredPosts = allPosts.filter(p => p.stage === activeStage);

  return (
    <div className="min-h-full animate-in fade-in duration-700 relative">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-bloom-700 text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-2xl z-[60] animate-in slide-in-from-top-4">
          {toast}
        </div>
      )}

      <div className="bg-white px-6 pt-8 pb-4 border-b border-pink-50 sticky top-0 z-10">
        <h1 className="serif-title text-3xl text-bloom-500 mb-6">Peer Forum</h1>
        
        <div className="flex space-x-4 overflow-x-auto pb-2 no-scrollbar">
          {[JourneyStage.PREPARING, JourneyStage.ON_LEAVE, JourneyStage.RETURNING].map((stage) => (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeStage === stage 
                  ? 'bg-bloom-500 text-white shadow-lg shadow-pink-100' 
                  : 'bg-pink-50 text-bloom-300 hover:bg-pink-100'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <article key={post.id} className="bg-white p-5 rounded-[2.5rem] border border-pink-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 hover:border-bloom-100 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 border border-white flex items-center justify-center text-accent-green font-bold shadow-sm">
                    {post.author[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-bloom-500 text-sm tracking-tight">{post.author}</h4>
                    <span className="text-[9px] text-bloom-300 font-bold uppercase tracking-widest">{post.date}</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => toggleBookmark(post.id)}
                    className={`p-2 rounded-xl transition-colors ${bookmarked.has(post.id) ? 'bg-accent-green/10 text-accent-green' : 'text-bloom-200 hover:bg-pink-50'}`}
                  >
                    <Bookmark size={18} fill={bookmarked.has(post.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
              
              <p className="text-bloom-700 text-[15px] leading-relaxed mb-6 font-medium px-1 whitespace-pre-wrap">
                {post.content}
              </p>
              
              <div className="flex items-center justify-between border-t border-pink-50 pt-4">
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center space-x-2 transition-colors ${liked.has(post.id) ? 'text-red-500' : 'text-bloom-300 hover:text-red-400'}`}
                  >
                    <Heart size={20} fill={liked.has(post.id) ? 'currentColor' : 'none'} />
                    <span className="text-xs font-extrabold">{post.likes + (liked.has(post.id) ? 1 : 0)}</span>
                  </button>
                  <button 
                    onClick={() => setShowCommentsFor(showCommentsFor === post.id ? null : post.id)}
                    className={`flex items-center space-x-2 transition-colors ${showCommentsFor === post.id ? 'text-bloom-500' : 'text-bloom-300 hover:text-bloom-500'}`}
                  >
                    <MessageCircle size={20} />
                    <span className="text-xs font-extrabold">{(postComments[post.id]?.length || 0)}</span>
                  </button>
                </div>
                
                <button 
                  onClick={() => handleShare(post.id)}
                  className="p-2 text-bloom-300 hover:text-accent-green transition-colors"
                >
                  <Share2 size={18} />
                </button>
              </div>

              {showCommentsFor === post.id && (
                <div className="mt-4 pt-4 border-t border-pink-50 space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-bloom-300">Comments</h5>
                    <button onClick={() => setShowCommentsFor(null)} className="text-bloom-200 hover:text-bloom-500"><X size={14} /></button>
                  </div>
                  
                  <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar pr-1">
                    {(postComments[post.id] || []).map((comment) => (
                      <div key={comment.id} className="bg-pink-50/50 p-3 rounded-2xl text-[13px] text-bloom-700 font-medium">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-bloom-500">{comment.author}</span>
                          <span className="text-[9px] text-bloom-300 uppercase font-black">{comment.date}</span>
                        </div>
                        {comment.text}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2 bg-white border border-pink-100 rounded-2xl p-1 shadow-inner">
                    <input 
                      type="text" 
                      placeholder="Add a comment..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                      className="flex-1 bg-transparent px-4 py-2 text-xs focus:outline-none"
                    />
                    <button 
                      onClick={() => handleSendComment(post.id)}
                      className="p-3 bg-accent-green text-white rounded-xl shadow-lg shadow-green-100 active:scale-90 transition-all hover:bg-accent-green-hover"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))
        ) : (
          <div className="text-center py-20 px-6">
            <div className="bg-pink-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-bloom-200">
              <MessageCircle size={40} />
            </div>
            <h3 className="text-bloom-500 font-serif text-xl">No posts here yet</h3>
            <p className="text-bloom-300 text-sm mt-2 max-w-[200px] mx-auto leading-relaxed">Be the first to share your journey with other moms!</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => {
          setNewPostStage(activeStage);
          setShowCreateModal(true);
        }}
        className="fixed bottom-24 right-6 bg-accent-green text-white w-14 h-14 rounded-2xl shadow-xl shadow-green-200/50 active:scale-95 transition-all z-20 hover:bg-accent-green-hover flex items-center justify-center animate-bounce-subtle"
        aria-label="Create new post"
      >
        <Plus size={28} strokeWidth={3} />
      </button>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] bg-bloom-50/95 backdrop-blur-md flex flex-col animate-in fade-in duration-300">
          <header className="p-6 flex justify-between items-center border-b border-pink-100 bg-white">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="text-bloom-300 font-black uppercase text-[10px] tracking-widest hover:text-bloom-500"
            >
              Cancel
            </button>
            <h2 className="serif-title text-xl text-bloom-500">New Thread</h2>
            <button 
              onClick={handleCreatePost}
              disabled={!newPostContent.trim()}
              className="bg-accent-green text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-100 disabled:opacity-50 transition-all active:scale-95"
            >
              Post
            </button>
          </header>

          <div className="flex-1 p-6 space-y-8 overflow-y-auto">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-bloom-300 uppercase tracking-widest ml-1">Journey Stage</label>
              <div className="grid grid-cols-1 gap-2">
                {[JourneyStage.PREPARING, JourneyStage.ON_LEAVE, JourneyStage.RETURNING].map((stage) => (
                  <button
                    key={stage}
                    onClick={() => setNewPostStage(stage)}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      newPostStage === stage 
                        ? 'border-bloom-500 bg-white text-bloom-500 shadow-sm' 
                        : 'border-pink-100 bg-white/50 text-bloom-300'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest">{stage}</span>
                    {newPostStage === stage && <Plus size={16} className="text-bloom-500" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-bloom-100 flex items-center justify-center text-bloom-500">
                  <PenLine size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-bloom-500 text-sm">Share your experience</h3>
                  <p className="text-[9px] text-bloom-300 uppercase font-black tracking-widest">Post as {userName}</p>
                </div>
              </div>
              <textarea 
                autoFocus
                placeholder="What's on your mind? Tips, questions, or just a shoutout to the community..."
                className="w-full h-48 bg-white border border-pink-100 rounded-[2.5rem] p-8 text-bloom-700 text-lg focus:ring-2 focus:ring-bloom-200 outline-none resize-none shadow-sm placeholder:text-bloom-100"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
            </div>

            <div className="bg-bloom-100/30 p-4 rounded-2xl border border-pink-50">
               <p className="text-[11px] text-bloom-400 leading-relaxed italic text-center">
                 "BloomBack is a safe space for all mothers. Please be kind and supportive in your contributions."
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
