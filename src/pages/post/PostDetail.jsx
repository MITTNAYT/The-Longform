import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../store/authSlice';
import { selectIsFollowing, toggleSubscription } from '../../store/subscriptionsSlice';
import {
  fetchPostBySlug,
  likePost, unlikePost, hasLiked,
  bookmarkPost, unbookmarkPost,
  fetchComments, addComment
} from '../../lib/queries';
import { MarkdownRenderer } from '../../lib/markdown';
import Icon from '../../components/AppIcon';
import { playBell, setTypewriterAudioEnabled } from '../../utils/typewriterAudio';

// ─── Like Button ─────────────────────────────────────────────
const LikeButton = ({ postId, userId }) => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!postId || !userId) return;
    hasLiked(userId, postId).then(result => setLiked(result));
  }, [postId, userId]);

  const handleToggle = async () => {
    if (!userId) { navigate('/auth/login'); return; }
    if (busy) return;
    setBusy(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setCount(c => wasLiked ? c - 1 : c + 1);
    try {
      if (wasLiked) await unlikePost(userId, postId);
      else await likePost(userId, postId);
    } catch {
      setLiked(wasLiked);
      setCount(c => wasLiked ? c + 1 : c - 1);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-4 py-2 border font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
        liked
          ? 'bg-[#9C6B3C] border-[#9C6B3C] text-[#F8F5F0]'
          : 'border-[#E0D9CE] text-[#1C1917] hover:border-[#1C1917]'
      }`}
    >
      <Icon name="Heart" size={14} className={liked ? 'fill-current' : ''} />
      {count > 0 && <span>{count}</span>}
      <span>{liked ? 'Applauded' : 'Applaud'}</span>
    </button>
  );
};

// ─── Bookmark Button ─────────────────────────────────────────
const BookmarkButton = ({ postId, userId }) => {
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleToggle = async () => {
    if (!userId) { navigate('/auth/login'); return; }
    if (busy) return;
    setBusy(true);
    const wasSaved = saved;
    setSaved(!wasSaved);
    try {
      if (wasSaved) await unbookmarkPost(userId, postId);
      else await bookmarkPost(userId, postId);
    } catch {
      setSaved(wasSaved);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-4 py-2 border font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
        saved
          ? 'bg-[#1C1917] border-[#1C1917] text-[#F8F5F0]'
          : 'border-[#E0D9CE] text-[#1C1917] hover:border-[#1C1917]'
      }`}
    >
      <Icon name="Bookmark" size={14} className={saved ? 'fill-current' : ''} />
      <span>{saved ? 'Saved' : 'Save'}</span>
    </button>
  );
};

// ─── Comments Section ─────────────────────────────────────────
const CommentsSection = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const { data } = await fetchComments(postId);
      setComments(data || []);
      setIsLoading(false);
    }
    if (postId) load();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) { navigate('/auth/login'); return; }
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await addComment({
        postId,
        userId: currentUser.id,
        content: newComment.trim(),
        parentId: replyTo?.id || null
      });
      if (error) throw error;

      // Optimistically add the new comment to state
      const optimisticComment = {
        ...data,
        profiles: {
          username: currentUser.username,
          display_name: currentUser.display_name,
          avatar_url: currentUser.avatar_url
        }
      };
      setComments(prev => [...prev, optimisticComment]);
      setNewComment('');
      setReplyTo(null);
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build tree from flat list
  const topLevel = comments.filter(c => !c.parent_id);
  const getReplies = (parentId) => comments.filter(c => c.parent_id === parentId);

  const CommentItem = ({ comment, depth = 0 }) => {
    const replies = getReplies(comment.id);
    const avatar = comment.profiles?.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.profiles?.display_name || 'User')}&background=e7e5e4&color=44403c&size=40`;

    return (
      <div className={`${depth > 0 ? 'ml-8 border-l-2 border-stone-100 pl-4' : ''}`}>
        <div className="flex gap-3 mb-3">
          <img src={avatar} alt={comment.profiles?.display_name} className="w-8 h-8 rounded-full flex-shrink-0 mt-1 object-cover" />
          <div className="flex-1 min-w-0">
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-stone-900 font-lato">{comment.profiles?.display_name || 'Anonymous'}</span>
                <span className="text-xs text-stone-400">{new Date(comment.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-stone-700 font-lato leading-relaxed">{comment.content}</p>
            </div>
            <button
              onClick={() => setReplyTo(comment)}
              className="mt-1 ml-1 text-xs text-stone-400 hover:text-stone-600 font-lato transition-colors"
            >
              Reply
            </button>
          </div>
        </div>
        {replies.map(r => <CommentItem key={r.id} comment={r} depth={depth + 1} />)}
      </div>
    );
  };

  return (
    <div className="mt-16 pt-12 border-t border-stone-200">
      <h2 className="font-playfair font-bold text-2xl text-stone-900 mb-8">
        {comments.length} Comment{comments.length !== 1 ? 's' : ''}
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        {replyTo && (
          <div className="flex items-center gap-2 mb-2 text-sm text-stone-500 font-lato">
            <Icon name="CornerDownRight" size={14} />
            <span>Replying to <strong>{replyTo.profiles?.display_name}</strong></span>
            <button type="button" onClick={() => setReplyTo(null)} className="text-stone-400 hover:text-stone-600 ml-1">
              <Icon name="X" size={12} />
            </button>
          </div>
        )}
        <div className="flex gap-3">
          <img
            src={currentUser?.avatar_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.display_name || 'You')}&background=e7e5e4&color=44403c&size=40`}
            alt="You"
            className="w-9 h-9 rounded-full flex-shrink-0 object-cover"
          />
          <div className="flex-1 flex flex-col gap-2">
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder={currentUser ? 'Leave a thoughtful comment...' : 'Sign in to comment'}
              disabled={!currentUser || isSubmitting}
              rows={3}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 font-lato text-sm resize-none disabled:opacity-60 disabled:bg-stone-50"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!currentUser || !newComment.trim() || isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-stone-900 rounded-md hover:bg-stone-800 font-lato disabled:opacity-40 flex items-center gap-2 transition-colors"
              >
                {isSubmitting && <Icon name="RefreshCw" size={14} className="animate-spin" />}
                {currentUser ? 'Post comment' : 'Sign in to comment'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comment List */}
      {isLoading ? (
        <p className="text-stone-400 text-sm font-lato animate-pulse">Loading comments...</p>
      ) : topLevel.length === 0 ? (
        <div className="text-center py-10 text-stone-400 font-lato text-sm">
          <Icon name="MessageSquare" size={32} className="mx-auto mb-2 opacity-30" />
          <p>No comments yet. Be the first to share your thoughts.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {topLevel.map(c => <CommentItem key={c.id} comment={c} />)}
        </div>
      )}
    </div>
  );
};

// ─── Main Post Detail Page ─────────────────────────────────────
const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typewriterMode, setTypewriterMode] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  const isFollowing = useSelector(state =>
    post?.author_id ? selectIsFollowing(state, post.author_id) : false
  );
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);

  const MOCK_POSTS = {
    'art-of-solitude': {
      id: 'mock-1',
      title: 'The Art of Solitude: Finding Peace in Quiet Moments',
      category: 'Reflection',
      tags: ['Solitude', 'Mindfulness', 'Essays'],
      author_username: 'ismail',
      author_display_name: 'Ismail Ismail',
      author_bio: 'Independent essayist, author of Quiet Horizons and contributor to The Longform.',
      published_at: '2025-01-20T10:00:00Z',
      reading_time: 8,
      content: `In a world that never stops talking, we've forgotten the profound beauty of silence. Solitude isn't loneliness—it is an intimate, long-overdue conversation with our deepest selves.

### The Modern Noise Paradox

We wake up to alarm notifications, commute with podcasts in our ears, and fall asleep scrolling through algorithmic feeds. We have engineered out the empty spaces of our days. But it is precisely in those empty spaces where original thought flourishes.

> "All of humanity's problems stem from man's inability to sit quietly in a room alone." — Blaise Pascal

When you step away from the hum of external validation, something extraordinary happens. The dust settles. The chatter clears. You begin to hear the quiet rhythm of your own intuition.

### Practicing Solitude in Daily Life

Solitude does not require retreating to a cabin in the woods for six months. It begins with simple, intentional choices:

1. **The Morning Sanctum**: Spend the first 20 minutes of your day without screens. Let your thoughts wander freely before the world demands your attention.
2. **Silent Walks**: Leave your headphones behind. Observe the world around you with unmediated curiosity.
3. **Journaling without Judgment**: Write down thoughts without editing or preparing them for an audience.

As we reclaim solitude, we regain our capacity for depth, clarity, and genuine connection with others.`
    },
    'architecture-of-silence': {
      id: 'mock-2',
      title: 'The Architecture of Deep Silence',
      category: 'Philosophy',
      tags: ['Architecture', 'Silence', 'Focus'],
      author_username: 'ismail',
      author_display_name: 'Ismail Ismail',
      author_bio: 'Independent essayist, author of Quiet Horizons and contributor to The Longform.',
      published_at: '2025-01-18T14:30:00Z',
      reading_time: 6,
      content: `Silence is not merely the absence of sound; it is a physical space we construct through intentional design and boundary-setting.

### Designing Quiet Spaces

In traditional Japanese architecture, the concept of *Ma* (negative space) is as vital as the structural beams holding up the ceiling. The empty space allows room for reflection and breath.

When we examine our modern digital work environments, we find almost zero negative space. Notifications pierce through focus, and open-plan offices amplify acoustic chaos. Re-architecting our environments for silence requires:

- Setting strict digital office hours.
- Designating non-negotiable deep-work blocks.
- Cultivating physical environments with minimal visual clutter.`
    },
    'reclaiming-attention': {
      id: 'mock-3',
      title: 'On Reclaiming Attention in an Economy of Noise',
      category: 'Culture',
      tags: ['Attention', 'Digital Wellbeing', 'Society'],
      author_username: 'marcus',
      author_display_name: 'Marcus Vance',
      author_bio: 'Culture critic and editor writing on tech, society, and cognitive sovereignty.',
      published_at: '2025-01-16T09:15:00Z',
      reading_time: 12,
      content: `Your attention is the most valuable commodity on Earth. Tech giants deploy hyper-optimized machine learning models to capture every fraction of a second you spend online.

### The Attention Extraction Paradigm

Every refresh, scroll, and notification is engineered to trigger dopamine loops. When our attention is fragmented into 15-second intervals, our ability to engage in complex reasoning, deep reading, and long-term planning is eroded.

To reclaim cognitive sovereignty, we must transition from passive consumption to intentional curation.`
    },
    'midnight-musings-on-love': {
      id: 'mock-4',
      title: 'Midnight Musings on Love',
      category: 'Poetry',
      tags: ['Poetry', 'Love', 'Night'],
      author_username: 'ismail',
      author_display_name: 'Ismail Ismail',
      author_bio: 'Independent essayist, author of Quiet Horizons and contributor to The Longform.',
      published_at: '2025-01-08T22:00:00Z',
      reading_time: 5,
      content: `When the world sleeps, hearts speak their truest language. Tonight I write about the love that exists in silence, in stolen glances, in the space between words that say everything we cannot.

*The quiet hours hold no secrets,*
*Only the soft echo of remembered laughter,*
*And the steady warmth of a presence*
*That needs no proof, no performance, no pretense.*`
    }
  };

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const { data, error: err } = await fetchPostBySlug(slug);
      if (data) {
        setPost(data);
      } else if (MOCK_POSTS[slug]) {
        setPost(MOCK_POSTS[slug]);
      } else {
        // Fallback generic article using slug formatting
        const formattedTitle = slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Untitled Essay';
        setPost({
          id: `mock-${slug}`,
          title: formattedTitle,
          category: 'Essay',
          tags: ['Longform', 'Literature', 'Reflections'],
          author_username: 'ismail',
          author_display_name: 'Ismail Ismail',
          author_bio: 'Independent essayist, author of Quiet Horizons and contributor to The Longform.',
          published_at: new Date().toISOString(),
          reading_time: 7,
          content: `Welcome to this essay on **The Longform.**

### Reflections on Depth and Discourse

Great writing is an invitation to slow down. In an era characterized by brevity and instant reactions, longform prose offers space for nuance, complexity, and deliberate contemplation.

> "Reading is to the mind what exercise is to the body." — Joseph Addison

### The Core Thesis

1. **Depth over Speed**: Meaningful ideas take time to formulate and assimilate.
2. **Clarity over Noise**: Quality curation protects our mental landscape.
3. **Community over Algorithms**: Human connection flourishes around shared appreciation for ideas.

Thank you for reading this issue on The Longform.`
        });
      }
      setIsLoading(false);
    }
    if (slug) load();
  }, [slug]);

  const handleFollowAuthor = async () => {
    if (!currentUser) { navigate('/auth/login'); return; }
    if (!post || isTogglingFollow) return;
    setIsTogglingFollow(true);
    try {
      await dispatch(toggleSubscription({
        subscriberId: currentUser.id,
        authorId: post.author_id,
        isFollowing
      })).unwrap();
    } finally {
      setIsTogglingFollow(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-lato text-muted-foreground animate-pulse">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Icon name="FileX" size={48} className="text-muted-foreground opacity-40 mb-4" />
        <h2 className="text-2xl font-heading font-black mb-2">Post Not Found</h2>
        <p className="text-muted-foreground mb-6">This post may have been moved or removed.</p>
        <button onClick={() => navigate('/discover')} className="text-stone-900 underline font-lato">
          Browse all posts
        </button>
      </div>
    );
  }

  const authorAvatar = post.author_avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author_display_name || post.author_username)}&background=e7e5e4&color=44403c&size=80`;
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1C1917]">
      {/* Minimal Top Masthead */}
      <header className="sticky top-0 z-40 bg-[#F8F5F0]/95 backdrop-blur-md border-b border-[#E0D9CE] py-3.5">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="font-heading text-xl font-normal text-[#1C1917] hover:opacity-80 transition-opacity">
            The Longform<span className="text-[#9C6B3C]">.</span>
          </Link>
          <div className="flex items-center gap-3">
            {/* Typewriter Mode Button */}
            <button
              onClick={() => {
                const next = !typewriterMode;
                setTypewriterMode(next);
                if (next) {
                  playBell();
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-mono tracking-wider transition-colors duration-200 ${
                typewriterMode
                  ? 'bg-[#1C1917] border-[#1C1917] text-[#F8F5F0]'
                  : 'border-[#E0D9CE] text-[#78716C] hover:border-[#1C1917] hover:text-[#1C1917]'
              }`}
              title="Toggle vintage typewriter manuscript format"
            >
              <span>⌨ {typewriterMode ? 'Typewriter: ON' : 'Typewriter Mode'}</span>
            </button>

            <BookmarkButton postId={post.id} userId={currentUser?.id} />
            {currentUser ? (
              <Link to={`/@${currentUser.username}`} className="flex items-center gap-2">
                <img
                  src={currentUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.display_name || currentUser.username)}&background=EDE8E0&color=1C1917`}
                  alt="Profile"
                  className="w-7 h-7 border border-[#E0D9CE] object-cover"
                />
              </Link>
            ) : (
              <Link to="/auth/login" className="font-mono text-xs uppercase tracking-wider text-[#78716C] hover:text-[#1C1917]">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className={`max-w-3xl mx-auto px-6 py-12 md:py-20 transition-all duration-300 ${
        typewriterMode ? 'typewriter-paper my-8 md:my-14 p-8 sm:p-14 border border-[#E0D9CE]' : ''
      }`}>

        {/* Vintage Stamped Manuscript Folio when in Typewriter Mode */}
        {typewriterMode && (
          <div className="flex items-center justify-between border-b border-[#E0D9CE]/70 pb-4 mb-8 font-mono text-[11px] text-[#78716C]">
            <span className="uppercase tracking-[0.25em] text-[#9C6B3C]">
              // MANUSCRIPT ARCHIVE · ISSUE IV NOCTURNES
            </span>
            <span className="uppercase tracking-widest text-[#78716C]">
              RIBBON: INKED
            </span>
          </div>
        )}

        {/* Category + Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {post.category && (
            <span className={`font-mono text-[10px] tracking-[0.22em] uppercase ${typewriterMode ? 'text-[#9C6B3C] font-bold' : 'text-[#9C6B3C] font-semibold'}`}>
              {post.category}
            </span>
          )}
          {post.tags?.map(tag => (
            <span key={tag} className="font-mono text-[10px] tracking-wider uppercase text-[#78716C] border border-[#E0D9CE] px-2 py-0.5">
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className={`${
          typewriterMode 
            ? 'font-typewriter text-3xl sm:text-4xl leading-[1.25] tracking-wide typewriter-ink text-[#1C1917]' 
            : 'font-heading text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.2] tracking-tight text-[#1C1917]'
        } mb-8`}>
          {post.title}
        </h1>

        {/* Author Row */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-12 pb-8 border-b border-[#E0D9CE]">
          <Link to={`/@${post.author_username}`} className="flex items-center gap-3.5 group">
            <img src={authorAvatar} alt={post.author_display_name} className="w-11 h-11 border border-[#E0D9CE] object-cover" />
            <div>
              <p className={`text-base font-normal text-[#1C1917] group-hover:text-[#9C6B3C] transition-colors ${typewriterMode ? 'font-typewriter' : 'font-heading'}`}>
                {post.author_display_name || post.author_username}
              </p>
              <p className="font-mono text-[11px] text-[#78716C] tracking-wide">
                {publishedDate} · {post.reading_time || 1} min read
              </p>
            </div>
          </Link>
          {currentUser && currentUser.id !== post.author_id && (
            <button
              onClick={handleFollowAuthor}
              disabled={isTogglingFollow}
              className={`px-4 py-2 font-mono text-xs uppercase tracking-widest border transition-all duration-200 ${
                isFollowing
                  ? 'border-[#E0D9CE] text-[#78716C] hover:border-[#991B1B] hover:text-[#991B1B]'
                  : 'border-[#1C1917] bg-[#1C1917] text-[#F8F5F0] hover:bg-[#44372A]'
              }`}
            >
              {isFollowing ? 'Subscribed' : 'Subscribe'}
            </button>
          )}
        </div>

        {/* Reading Body */}
        <div className={`${typewriterMode ? 'font-typewriter typewriter-ink text-base sm:text-lg leading-[2.1] tracking-wide' : 'prose prose-editorial'}`}>
          <MarkdownRenderer content={post.content || ''} />
        </div>

        {/* Engagement Bar */}
        <div className="flex items-center gap-3 mt-14 pt-8 border-t border-[#E0D9CE] flex-wrap">
          <LikeButton postId={post.id} userId={currentUser?.id} />
          <BookmarkButton postId={post.id} userId={currentUser?.id} />
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard');
            }}
            className="flex items-center gap-2 px-4 py-2 border border-[#E0D9CE] font-mono text-xs uppercase tracking-wider text-[#1C1917] hover:border-[#1C1917] transition-all"
          >
            <Icon name="Share2" size={14} />
            Share
          </button>
        </div>

        {/* Author Bio Box */}
        <div className="mt-14 p-8 border border-[#E0D9CE] bg-[#FDFCF9] flex flex-col sm:flex-row items-start gap-6">
          <img src={authorAvatar} alt={post.author_display_name} className="w-14 h-14 border border-[#E0D9CE] object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#9C6B3C] block">
              WRITER & ESSAYIST
            </span>
            <Link to={`/@${post.author_username}`} className="font-heading text-xl font-normal text-[#1C1917] hover:text-[#9C6B3C] transition-colors block">
              {post.author_display_name || post.author_username}
            </Link>
            <p className="font-body text-xs text-[#78716C] leading-relaxed">
              {post.author_bio || 'Independent contributor writing for The Longform.'}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-14 pt-10 border-t border-[#E0D9CE]">
          <CommentsSection postId={post.id} currentUser={currentUser} />
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
