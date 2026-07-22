import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/authSlice';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { 
  fetchDiscoverPosts, 
  likePost, 
  unlikePost, 
  bookmarkPost, 
  unbookmarkPost 
} from '../../lib/queries';

const Discover = () => {
  const user = useSelector(selectUser);
  const [searchParams] = useSearchParams();
  const currentTag = searchParams.get('tag');

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Optimistic UI state for likes/bookmarks
  const [likes, setLikes] = useState({});
  const [bookmarks, setBookmarks] = useState({});

  useEffect(() => {
    // Reset state when tag changes
    setPosts([]);
    setCursor(null);
    setHasMore(true);
    loadPosts(true, currentTag);
  }, [currentTag]);

  const loadPosts = async (isInitial = false, tag = null) => {
    if (isInitial) setIsLoading(true);
    setError(null);

    try {
      const queryCursor = isInitial ? null : cursor;
      const { data: discoverPosts, error: fetchErr } = await fetchDiscoverPosts({ 
        cursor: queryCursor,
        limit: 10,
        tag: tag
      });
      
      if (fetchErr) throw fetchErr;

      if (discoverPosts.length < 10) setHasMore(false);
      
      setPosts(prev => isInitial ? discoverPosts : [...prev, ...discoverPosts]);
      
      if (discoverPosts.length > 0) {
        setCursor(discoverPosts[discoverPosts.length - 1].published_at);
      }
    } catch (err) {
      setError(err.message || 'Failed to load posts.');
    } finally {
      if (isInitial) setIsLoading(false);
    }
  };

  const handleLike = async (postId) => {
    if (!user) return;
    const isLiked = likes[postId];
    setLikes(prev => ({ ...prev, [postId]: !isLiked }));
    try {
      if (isLiked) await unlikePost(user.id, postId);
      else await likePost(user.id, postId);
    } catch (err) {
      setLikes(prev => ({ ...prev, [postId]: isLiked }));
    }
  };

  const handleBookmark = async (postId) => {
    if (!user) return;
    const isBookmarked = bookmarks[postId];
    setBookmarks(prev => ({ ...prev, [postId]: !isBookmarked }));
    try {
      if (isBookmarked) await unbookmarkPost(user.id, postId);
      else await bookmarkPost(user.id, postId);
    } catch (err) {
      setBookmarks(prev => ({ ...prev, [postId]: isBookmarked }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Left: Feed Stream */}
      <main className="lg:col-span-2 space-y-12">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h1 className="font-heading text-2xl font-bold">
            {currentTag ? `Discover: #${currentTag}` : 'Discover'}
          </h1>
          {currentTag && (
            <Link to="/discover" className="text-sm text-primary hover:underline">
              Clear filter
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Icon name="RefreshCw" className="animate-spin text-stone-400" size={32} />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : posts.length === 0 ? (
          <div className="bg-card border border-border/40 rounded-xl p-8 text-center">
            <h2 className="text-lg font-bold mb-2">No posts found</h2>
            <p className="text-muted-foreground">Try a different tag or check back later.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {posts.map((post) => (
              <article key={post.id} className="group relative bg-card border border-border/40 hover:border-border rounded-xl p-6 lg:p-8 transition-all duration-300 shadow-sm hover:shadow-md">
                
                {/* Author Info */}
                <div className="flex items-center justify-between mb-4">
                  <Link to={`/profile/${post.author_username}`} className="flex items-center space-x-3">
                    <img 
                      src={post.author_avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80"} 
                      alt={post.author_display_name || post.author_username} 
                      className="w-10 h-10 rounded-full object-cover filter brightness-95 border border-border"
                    />
                    <div>
                      <h4 className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer">{post.author_display_name || post.author_username}</h4>
                      <p className="text-xs text-muted-foreground">@{post.author_username} • {new Date(post.published_at).toLocaleDateString()}</p>
                    </div>
                  </Link>
                </div>

                {/* Post Content */}
                <Link to={`/post/${post.slug}`} className="block group-hover:opacity-95 transition-opacity">
                  <h2 className="font-heading text-xl lg:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm lg:text-base leading-relaxed mb-4">
                    {post.excerpt || 'Read the full story...'}
                  </p>
                </Link>

                {/* Tags and Metadata */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags?.map((tag) => (
                    <Link to={`/discover?tag=${tag}`} key={tag}>
                      <span className="text-xs px-2.5 py-1 bg-muted/60 text-muted-foreground rounded-full hover:bg-muted cursor-pointer transition-colors">
                        #{tag}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between border-t border-border/30 pt-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-colors ${likes[post.id] ? 'text-red-500' : 'hover:text-foreground'}`}
                    >
                      <Icon name="Heart" size={16} fill={likes[post.id] ? "currentColor" : "none"} />
                    </button>
                    <Link to={`/post/${post.slug}#comments`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                      <Icon name="MessageSquare" size={16} />
                    </Link>
                    <span className="text-xs">{post.reading_time || 1} min read</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleBookmark(post.id)}
                      className={`hover:text-foreground p-1 transition-colors ${bookmarks[post.id] ? 'text-primary' : ''}`}
                    >
                      <Icon name="Bookmark" size={16} fill={bookmarks[post.id] ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button variant="outline" onClick={() => loadPosts(false, currentTag)}>
                  Load More
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Right Sidebar */}
      <aside className="space-y-8 hidden lg:block">
        {!user && (
          <div className="bg-card border border-border/50 rounded-xl p-6">
            <h3 className="font-heading text-lg font-bold mb-3">Join The Longform</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Create an account to follow writers, save posts, and publish your own work.
            </p>
            <Link to="/auth/signup">
              <Button fullWidth>Get Started</Button>
            </Link>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Topics to explore</h3>
          <div className="flex flex-wrap gap-2">
            {["reflection", "poetry", "personal", "writing", "culture"].map((tag) => (
              <Link to={`/discover?tag=${tag}`} key={tag}>
                <span className="text-xs px-3 py-1 bg-card border border-border/60 text-foreground rounded-full hover:bg-muted hover:border-primary/30 transition-all cursor-pointer">
                  #{tag}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Discover;
