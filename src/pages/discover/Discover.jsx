import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/authSlice';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
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

  const [likes, setLikes] = useState({});
  const [bookmarks, setBookmarks] = useState({});

  useEffect(() => {
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

  const tags = ["essays", "reflections", "poetry", "ecology", "craft", "philosophy", "personal"];

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1C1917]">
      <Header />

      <main className="pt-24 lg:pt-32 pb-20 max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header bar */}
        <div className="pb-8 border-b border-[#E0D9CE] mb-12">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#9C6B3C] block mb-2">
            CATALOGUE & ARCHIVES
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1C1917]">
              {currentTag ? `Topic: #${currentTag.toUpperCase()}` : 'The Discover Archive'}
            </h1>
            {currentTag && (
              <Link to="/discover" className="font-mono text-xs uppercase tracking-wider text-[#9C6B3C] hover:underline">
                View All Topics →
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Main Feed Stream */}
          <div className="lg:col-span-8 space-y-10">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <span className="font-mono text-xs tracking-widest uppercase text-[#78716C] animate-pulse">
                  Retrieving archives...
                </span>
              </div>
            ) : error ? (
              <div className="p-4 border border-[#991B1B]/30 bg-[#991B1B]/5 text-[#991B1B] font-mono text-xs">
                {error}
              </div>
            ) : posts.length === 0 ? (
              <div className="border border-[#E0D9CE] bg-[#FDFCF9] p-12 text-center space-y-3">
                <h3 className="font-heading text-xl font-normal text-[#1C1917]">No stories found in this section</h3>
                <p className="font-body text-xs text-[#78716C]">Explore other topics or clear the active filter.</p>
                <Link to="/discover" className="inline-block mt-4 px-4 py-2 border border-[#1C1917] font-mono text-xs uppercase tracking-widest text-[#1C1917] hover:bg-[#1C1917] hover:text-[#F8F5F0]">
                  Reset Archive
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#E0D9CE]">
                {posts.map((post) => (
                  <article key={post.id} className="py-8 first:pt-0 group">
                    <div className="flex items-center justify-between mb-3 font-mono text-[10px] uppercase tracking-wider text-[#78716C]">
                      <div className="flex items-center gap-2">
                        <Link to={`/@${post.author_username}`} className="text-[#1C1917] font-medium hover:text-[#9C6B3C]">
                          {post.author_display_name || post.author_username}
                        </Link>
                        <span>·</span>
                        <span>{new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <span>{post.reading_time || 5} MIN READ</span>
                    </div>

                    <Link to={`/post/${post.slug}`} className="block mb-3">
                      <h2 className="font-heading text-xl sm:text-2xl font-normal text-[#1C1917] leading-snug group-hover:text-[#9C6B3C] transition-colors">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="font-body text-sm text-[#44372A] leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt || 'Read the full essay...'}
                    </p>

                    {/* Footer Actions & Tags */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags?.map((tag) => (
                          <Link to={`/discover?tag=${tag}`} key={tag}>
                            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[#E0D9CE] text-[#78716C] hover:border-[#1C1917] hover:text-[#1C1917] transition-colors">
                              #{tag}
                            </span>
                          </Link>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-[#78716C]">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className={`hover:text-[#991B1B] transition-colors ${likes[post.id] ? 'text-[#991B1B]' : ''}`}
                        >
                          <Icon name="Heart" size={14} className={likes[post.id] ? 'fill-current' : ''} />
                        </button>
                        <button 
                          onClick={() => handleBookmark(post.id)}
                          className={`hover:text-[#9C6B3C] transition-colors ${bookmarks[post.id] ? 'text-[#9C6B3C]' : ''}`}
                        >
                          <Icon name="Bookmark" size={14} className={bookmarks[post.id] ? 'fill-current' : ''} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

                {hasMore && (
                  <div className="pt-8 text-center">
                    <button
                      onClick={() => loadPosts(false, currentTag)}
                      className="px-8 py-3 border border-[#1C1917] font-mono text-xs uppercase tracking-widest text-[#1C1917] hover:bg-[#1C1917] hover:text-[#F8F5F0] transition-colors"
                    >
                      Load More Stories
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="border border-[#E0D9CE] bg-[#FDFCF9] p-6 space-y-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9C6B3C] block">
                CURATED INDEX
              </span>
              <h3 className="font-heading text-lg font-normal text-[#1C1917]">
                Featured Themes
              </h3>
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag) => (
                  <Link to={`/discover?tag=${tag}`} key={tag}>
                    <span className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 border transition-all ${
                      currentTag === tag
                        ? 'border-[#1C1917] bg-[#1C1917] text-[#F8F5F0]'
                        : 'border-[#E0D9CE] text-[#78716C] hover:border-[#1C1917] hover:text-[#1C1917]'
                    }`}>
                      #{tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {!user && (
              <div className="border border-[#E0D9CE] bg-[#F3EFE8] p-6 space-y-3">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#78716C] block">
                  COMMUNITY
                </span>
                <h3 className="font-heading text-xl font-normal text-[#1C1917]">
                  Publish with Us
                </h3>
                <p className="font-body text-xs text-[#78716C] leading-relaxed">
                  Join a community of thoughtful essayists, poets, and cultural critics.
                </p>
                <Link
                  to="/auth/signup"
                  className="block text-center w-full py-2.5 bg-[#1C1917] text-[#F8F5F0] font-mono text-xs uppercase tracking-widest hover:bg-[#44372A] transition-colors"
                >
                  Create an Account
                </Link>
              </div>
            )}
          </aside>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Discover;
