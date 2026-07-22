import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/authSlice';
import Icon from '../../components/AppIcon';
import {
  fetchFollowedAuthorIds,
  fetchFeed,
  likePost,
  unlikePost,
  bookmarkPost,
  unbookmarkPost
} from '../../lib/queries';

const Feed = () => {
  const user = useSelector(selectUser);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [likes, setLikes] = useState({});
  const [bookmarks, setBookmarks] = useState({});

  useEffect(() => {
    if (user) loadFeed(true);
  }, [user]);

  const loadFeed = async (isInitial = false) => {
    if (!user) return;
    if (isInitial) setIsLoading(true);
    setError(null);
    try {
      const { data: followedIds, error: followErr } = await fetchFollowedAuthorIds(user.id);
      if (followErr) throw followErr;
      if (followedIds.length === 0) {
        setPosts([]);
        setHasMore(false);
        setIsLoading(false);
        return;
      }
      const queryCursor = isInitial ? null : cursor;
      const { data: feedPosts, error: feedErr } = await fetchFeed({
        followedAuthorIds: followedIds,
        cursor: queryCursor,
        limit: 10,
      });
      if (feedErr) throw feedErr;
      if (feedPosts.length < 10) setHasMore(false);
      setPosts(prev => isInitial ? feedPosts : [...prev, ...feedPosts]);
      if (feedPosts.length > 0) setCursor(feedPosts[feedPosts.length - 1].published_at);
    } catch (err) {
      setError(err.message || 'Failed to load feed.');
    } finally {
      if (isInitial) setIsLoading(false);
    }
  };

  const handleLike = async (postId) => {
    if (!user) return;
    const isLiked = likes[postId];
    setLikes(prev => ({ ...prev, [postId]: !isLiked }));
    try {
      isLiked ? await unlikePost(user.id, postId) : await likePost(user.id, postId);
    } catch {
      setLikes(prev => ({ ...prev, [postId]: isLiked }));
    }
  };

  const handleBookmark = async (postId) => {
    if (!user) return;
    const isBookmarked = bookmarks[postId];
    setBookmarks(prev => ({ ...prev, [postId]: !isBookmarked }));
    try {
      isBookmarked ? await unbookmarkPost(user.id, postId) : await bookmarkPost(user.id, postId);
    } catch {
      setBookmarks(prev => ({ ...prev, [postId]: isBookmarked }));
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 rounded-2xl skeleton" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
      {/* Main Feed */}
      <main className="lg:col-span-2 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-border/50">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Your Feed</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Stories from writers you follow</p>
          </div>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all" aria-label="Filter">
            <Icon name="SlidersHorizontal" size={16} />
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200/80 text-sm text-red-700">
            <Icon name="AlertCircle" size={16} className="mt-0.5 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {posts.length === 0 && !error ? (
          <div className="card-pro p-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4">
              <Icon name="Users" size={20} className="text-muted-foreground/50" />
            </div>
            <h2 className="font-heading text-lg font-bold text-foreground mb-2">Your feed is empty</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
              Follow some writers to see their latest stories here.
            </p>
            <Link
              to="/discover"
              className="btn-primary text-sm"
            >
              Discover writers
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <article
                key={post.id}
                className="card-pro p-5 lg:p-6 group"
              >
                {/* Author row */}
                <div className="flex items-center gap-3 mb-4">
                  <Link to={`/profile/${post.author_username}`} className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={post.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author_display_name || post.author_username)}&background=e7e5e4&color=44403c&size=40`}
                      alt={post.author_display_name || post.author_username}
                      className="w-8 h-8 rounded-full object-cover border border-border/60 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground hover:text-accent transition-colors leading-none truncate">
                        {post.author_display_name || post.author_username}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        @{post.author_username} · {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                </div>

                {/* Title + excerpt */}
                <Link to={`/post/${post.slug}`} className="block mb-3">
                  <h2 className="font-heading text-xl font-bold text-foreground group-hover:text-accent transition-colors duration-200 leading-snug mb-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 font-body">
                    {post.excerpt || 'Read the full story…'}
                  </p>
                </Link>

                {/* Tags */}
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.map((tag) => (
                      <span key={tag} className="tag-pill">#{tag}</span>
                    ))}
                  </div>
                )}

                {/* Actions footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`btn-ghost-sm rounded-lg px-2.5 py-1.5 ${likes[post.id] ? 'text-rose-500 bg-rose-50' : ''}`}
                    >
                      <Icon name="Heart" size={15} fill={likes[post.id] ? 'currentColor' : 'none'} />
                      <span className="text-xs">Like</span>
                    </button>
                    <Link
                      to={`/post/${post.slug}#comments`}
                      className="btn-ghost-sm rounded-lg px-2.5 py-1.5"
                    >
                      <Icon name="MessageSquare" size={15} />
                      <span className="text-xs">Comment</span>
                    </Link>
                    <span className="text-xs text-muted-foreground/60 ml-1 font-medium">
                      {post.reading_time || 1} min read
                    </span>
                  </div>
                  <button
                    onClick={() => handleBookmark(post.id)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 ${
                      bookmarks[post.id]
                        ? 'text-accent bg-accent/10'
                        : 'text-muted-foreground hover:text-accent hover:bg-accent/10'
                    }`}
                  >
                    <Icon name="Bookmark" size={15} fill={bookmarks[post.id] ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </article>
            ))}

            {hasMore && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => loadFeed(false)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-border/80 text-sm font-medium text-foreground hover:bg-muted/40 hover:border-accent/30 transition-all duration-200"
                >
                  Load more
                  <Icon name="ChevronDown" size={15} />
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Sidebar */}
      <aside className="hidden lg:block space-y-6">
        {/* Welcome card */}
        <div className="card-pro p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Icon name="Moon" size={13} className="text-primary-foreground" />
            </div>
            <h3 className="font-heading text-base font-bold text-foreground">The Longform</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            A distraction-free space for immersive reading and independent publishing.
          </p>
          <Link to="/write" className="btn-primary w-full justify-center text-sm">
            <Icon name="PenTool" size={14} />
            Start Writing
          </Link>
        </div>

        {/* Popular tags */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground/70 mb-3">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {['reflection', 'poetry', 'personal', 'writing', 'essays', 'midnight'].map((tag) => (
              <Link to={`/discover?tag=${tag}`} key={tag}>
                <span className="tag-pill">#{tag}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter teaser */}
        <div className="card-pro p-5 bg-muted/30">
          <Icon name="Mail" size={18} className="text-accent mb-3" />
          <h3 className="font-heading text-sm font-bold text-foreground mb-1.5">Get weekly essays</h3>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
            Curated reflections and stories delivered every Sunday.
          </p>
          <Link
            to="/subscription-management"
            className="text-xs font-semibold text-accent hover:text-accent/80 flex items-center gap-1 transition-colors"
          >
            Subscribe free
            <Icon name="ArrowRight" size={11} />
          </Link>
        </div>
      </aside>
    </div>
  );
};

export default Feed;
