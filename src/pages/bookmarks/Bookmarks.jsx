import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/authSlice';
import { fetchBookmarks, unbookmarkPost } from '../../lib/queries';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../components/AppIcon';
import { BackgroundGradientAnimation } from '../../components/ui/background-gradient-animation';

const Bookmarks = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    async function load() {
      if (!currentUser) return;
      setIsLoading(true);
      const { data } = await fetchBookmarks(currentUser.id);
      setBookmarks(data || []);
      setIsLoading(false);
    }
    load();
  }, [currentUser]);

  const handleRemove = async (postId) => {
    if (!currentUser) return;
    setRemovingId(postId);
    setBookmarks(prev => prev.filter(b => b.post_id !== postId));
    try {
      await unbookmarkPost(currentUser.id, postId);
    } catch {
      const { data } = await fetchBookmarks(currentUser.id);
      setBookmarks(data || []);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
      <BackgroundGradientAnimation 
        interactive={false}
        containerClassName="fixed inset-0 z-[-1] opacity-30"
        firstColor="var(--color-primary, 18, 113, 255)"
        secondColor="var(--color-accent, 221, 74, 255)"
        thirdColor="100, 220, 255"
        fourthColor="200, 50, 50"
        fifthColor="180, 180, 50"
        pointerColor="140, 100, 255"
      />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/60">
        <div className="max-w-3xl mx-auto px-5 flex items-center justify-between h-[60px]">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Icon name="Moon" size={12} className="text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg text-foreground tracking-tight">
              The Longform<span className="text-accent">.</span>
            </span>
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            <Link to="/feed" className="text-[13px] font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-all duration-150">Feed</Link>
            <Link to="/discover" className="text-[13px] font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-all duration-150">Discover</Link>
            <Link to="/write" className="flex items-center gap-1.5 text-[13px] font-medium text-primary-foreground bg-primary px-3 py-1.5 rounded-lg hover:opacity-90 transition-all duration-150 ml-1">
              <Icon name="PenTool" size={12} />
              Write
            </Link>
          </nav>
          <Link to={currentUser ? `/@${currentUser.username}` : '/auth/login'}>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-border/70 hover:border-accent/40 transition-colors bg-muted flex items-center justify-center">
              {currentUser?.avatar_url ? (
                <img src={currentUser.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-muted-foreground">
                  {(currentUser?.display_name || 'U')[0].toUpperCase()}
                </span>
              )}
            </div>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-10 lg:py-14">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-1">
            <Icon name="Bookmark" size={18} className="text-accent" />
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">Saved Posts</h1>
          </div>
          {!isLoading && bookmarks.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1 ml-7">
              {bookmarks.length} {bookmarks.length === 1 ? 'post' : 'posts'} saved
            </p>
          )}
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 rounded-2xl skeleton" style={{ opacity: 1 - i * 0.15 }} />
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20 px-6 rounded-2xl border border-border/50 bg-card">
            <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-5">
              <Icon name="BookmarkX" size={22} className="text-muted-foreground/50" />
            </div>
            <h3 className="font-heading font-bold text-xl text-foreground mb-2">Nothing saved yet</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto leading-relaxed">
              Bookmark posts as you read to find them here anytime.
            </p>
            <Link
              to="/discover"
              className="btn-primary text-sm"
            >
              Explore posts
            </Link>
          </div>
        ) : (
          /* Bookmark list */
          <motion.div 
            className="space-y-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            <AnimatePresence mode="popLayout">
            {bookmarks.map(bookmark => {
              const post = bookmark.posts;
              if (!post) return null;
              const author = post.profiles;
              const authorAvatar = author?.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.display_name || 'Author')}&background=e7e5e4&color=44403c&size=40`;

              return (
                <motion.div
                  key={bookmark.post_id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  transition={{ duration: 0.25, type: 'spring', bounce: 0.3 }}
                  className="group card-pro p-5 flex gap-4 items-start relative overflow-hidden"
                >
                  {/* Decorative background glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    {/* Author row */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <img src={authorAvatar} alt={author?.display_name} className="w-5 h-5 rounded-full object-cover" />
                      <Link to={`/@${author?.username}`} className="font-medium hover:text-foreground transition-colors">
                        {author?.display_name || author?.username}
                      </Link>
                      {post.published_at && (
                        <>
                          <span className="text-muted-foreground/30">·</span>
                          <span>{new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </>
                      )}
                    </div>

                    {/* Title */}
                    <Link to={`/post/${post.slug}`} className="block">
                      <h3 className="font-heading font-bold text-[1.05rem] leading-snug text-foreground group-hover:text-accent transition-colors duration-200">
                        {post.title}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-body">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta tags */}
                    <div className="flex items-center gap-2 pt-0.5">
                      {post.category && (
                        <span className="badge-muted text-[10px]">{post.category}</span>
                      )}
                      <span className="text-xs text-muted-foreground">{post.reading_time || 1} min read</span>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(bookmark.post_id)}
                    disabled={removingId === bookmark.post_id}
                    title="Remove bookmark"
                    className="opacity-0 group-hover:opacity-100 w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:bg-rose-50 transition-all duration-200 disabled:opacity-50"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Bookmarks;
