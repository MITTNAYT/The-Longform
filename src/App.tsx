import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate,
  useParams
} from 'react-router-dom';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
  increment,
  runTransaction,
  limit,
  startAfter
} from 'firebase/firestore';
import { auth, db, storage } from './firebase';
import { Toaster, toast } from 'sonner';
import { 
  User as UserIcon, 
  LogOut, 
  Plus, 
  ChevronLeft, 
  Feather,
  Trash2,
  Edit3,
  Globe,
  Lock,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  Quote,
  Eye,
  Send,
  MessageSquare,
  Camera,
  Heart,
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  Rss,
  UserPlus,
  UserMinus,
  Bookmark,
  Share2,
  FileText,
  Columns,
  Flag,
  AlertTriangle,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- Types ---
interface Post {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  category: 'poetry' | 'prose' | 'essay' | 'letter';
  createdAt: any;
  isPublic: boolean;
  imageUrl?: string;
  likesCount?: number;
}

interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  content: string;
  createdAt: any;
}

// --- Components ---

const FollowButton = ({ followerId, followingId }: { followerId: string, followingId: string }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!followerId || !followingId) return;
    const followId = `${followerId}_${followingId}`;
    const unsubscribe = onSnapshot(doc(db, 'follows', followId), (docSnap) => {
      setIsFollowing(docSnap.exists());
      setLoading(false);
    });
    return () => unsubscribe();
  }, [followerId, followingId]);

  const toggleFollow = async () => {
    if (followerId === followingId) return;
    const followId = `${followerId}_${followingId}`;
    const followRef = doc(db, 'follows', followId);

    try {
      if (isFollowing) {
        await deleteDoc(followRef);
        toast.success('Unfollowed');
      } else {
        await setDoc(followRef, {
          followerId,
          followingId,
          createdAt: serverTimestamp()
        });
        toast.success('Following');

        // Send email notification
        try {
          const [followerSnap, followingSnap] = await Promise.all([
            getDoc(doc(db, 'users', followerId)),
            getDoc(doc(db, 'users', followingId))
          ]);

          if (followerSnap.exists() && followingSnap.exists()) {
            const followerData = followerSnap.data();
            const followingData = followingSnap.data();

            if (followingData.email) {
              await fetch('/api/notify-follow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  followerName: followerData.displayName || 'Someone',
                  followingEmail: followingData.email,
                  followingName: followingData.displayName || 'Writer'
                })
              });
            }
          }
        } catch (emailError) {
          console.error('Notification failed:', emailError);
          // Don't show toast for notification failure to avoid confusing the user
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update follow status');
    }
  };

  if (loading) return null;
  if (followerId === followingId) return null;

  return (
    <button 
      onClick={toggleFollow}
      className={cn(
        "flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest transition-all",
        isFollowing ? "bg-ink/5 hover:bg-ink/10 text-ink/40" : "bg-clay text-paper hover:bg-ink"
      )}
    >
      {isFollowing ? <UserMinus size={12} /> : <UserPlus size={12} />}
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

const Navbar = ({ user }: { user: User | null }) => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Sync user profile to Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
        });
      }
      
      toast.success('Welcome back');
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Login window closed before completion');
      } else {
        console.error(error);
        toast.error('Login failed');
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
    toast.success('Logged out');
  };

  return (
    <nav className="border-b border-ink/10 py-6 px-8 flex justify-between items-center bg-paper/80 backdrop-blur-sm sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-full border border-ink flex items-center justify-center group-hover:bg-ink group-hover:text-paper transition-colors duration-500">
          <Feather size={20} />
        </div>
        <span className="text-2xl font-serif font-medium tracking-tight">The Longform</span>
      </Link>

      <div className="flex items-center gap-8">
        <Link to="/" className="text-sm uppercase tracking-widest hover:text-clay transition-colors">Archive</Link>
        {user ? (
          <>
            <Link to="/feed" className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-clay transition-colors">
              <Rss size={16} />
              Feed
            </Link>
            <Link to="/write" className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-clay transition-colors">
              <Plus size={16} />
              Write
            </Link>
            <Link to="/profile" className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-clay transition-colors">
              <UserIcon size={16} />
              Profile
            </Link>
            <button onClick={handleLogout} className="text-sm uppercase tracking-widest hover:text-clay transition-colors">
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <button onClick={handleLogin} className="text-sm uppercase tracking-widest hover:text-clay transition-colors">
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

const PostCard = ({ post, user }: { post: Post, user: User | null }) => {
  const date = post.createdAt?.toDate ? post.createdAt.toDate() : new Date();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!user || !post.id) return;
    const bookmarkId = `${user.uid}_${post.id}`;
    const unsubscribe = onSnapshot(doc(db, 'bookmarks', bookmarkId), (docSnap) => {
      setIsBookmarked(docSnap.exists());
    });
    return () => unsubscribe();
  }, [user, post.id]);

  const [authorStats, setAuthorStats] = useState({ posts: 0, likes: 0 });

  useEffect(() => {
    if (!post.authorId) return;

    // Fetch total public posts for this author
    const postsQ = query(
      collection(db, 'posts'),
      where('authorId', '==', post.authorId),
      where('isPublic', '==', true)
    );
    
    const unsubPosts = onSnapshot(postsQ, (snap) => {
      const totalLikes = snap.docs.reduce((acc, doc) => acc + (doc.data().likesCount || 0), 0);
      setAuthorStats({
        posts: snap.size,
        likes: totalLikes
      });
    });

    return () => unsubPosts();
  }, [post.authorId]);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to bookmark pieces');
      return;
    }
    const bookmarkId = `${user.uid}_${post.id}`;
    const bookmarkRef = doc(db, 'bookmarks', bookmarkId);
    try {
      if (isBookmarked) {
        await deleteDoc(bookmarkRef);
        toast.success('Removed from bookmarks');
      } else {
        await setDoc(bookmarkRef, {
          uid: user.uid,
          postId: post.id,
          createdAt: serverTimestamp()
        });
        toast.success('Bookmarked');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update bookmark');
    }
  };
  
  const getPreview = (content: string) => {
    // Remove markdown symbols
    const cleanContent = content.replace(/[#*`_~[\]()]/g, '').trim();
    
    // Split into paragraphs
    const paragraphs = cleanContent.split(/\n\s*\n/);
    const firstParagraph = paragraphs.find(p => p.trim().length > 0) || '';
    
    if (firstParagraph.length <= 250) return firstParagraph;
    
    // If first paragraph is too long, try to cut at a sentence end
    const truncated = firstParagraph.slice(0, 250);
    const lastSentenceEnd = Math.max(
      truncated.lastIndexOf('.'),
      truncated.lastIndexOf('!'),
      truncated.lastIndexOf('?')
    );
    
    if (lastSentenceEnd > 150) {
      return truncated.slice(0, lastSentenceEnd + 1);
    }
    
    return truncated + '...';
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group border-b border-ink/10 py-12 flex flex-col md:flex-row gap-8 items-start hover:bg-ink/[0.02] transition-colors px-4"
    >
      <div className="md:w-1/4">
        <span className="text-xs uppercase tracking-[0.2em] text-ink/40 font-medium">
          {format(date, 'MMM dd, yyyy')}
        </span>
        <div className="mt-2 text-xs uppercase tracking-widest text-clay font-semibold">
          {post.category}
        </div>
      </div>
      
      <div className="md:w-3/4 flex flex-col md:flex-row gap-8 w-full">
        {post.imageUrl && (
          <div className="md:w-1/3 shrink-0">
            <Link to={`/post/${post.id}`}>
              <div className="aspect-[4/3] overflow-hidden rounded-xl border border-ink/10">
                <img 
                  src={post.imageUrl} 
                  alt={post.title || "Archive Piece"} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </Link>
          </div>
        )}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <Link to={`/post/${post.id}`} className="flex-1">
              <h2 className="text-4xl font-serif group-hover:text-clay transition-colors duration-500 leading-tight">
                {post.title}
              </h2>
            </Link>
            <button 
              onClick={toggleBookmark}
              className={cn(
                "p-2 rounded-full transition-all",
                isBookmarked ? "text-clay" : "text-ink/20 hover:text-clay"
              )}
            >
              <Bookmark size={20} className={isBookmarked ? "fill-clay" : ""} />
            </button>
          </div>
          <p className="text-ink/60 line-clamp-3 font-serif text-lg mb-6 leading-relaxed">
            {getPreview(post.content)}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-clay/20 flex items-center justify-center text-[10px] font-bold">
                {post.authorName[0]}
              </div>
              <span className="text-sm italic font-serif">by {post.authorName}</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-ink/40 font-bold border-l border-ink/10 pl-4">
              <span className="flex items-center gap-1">
                <FileText size={10} />
                {authorStats.posts} pieces
              </span>
              <span className="flex items-center gap-1">
                <Heart size={10} />
                {authorStats.likes} appreciations
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-ink/40">
            <Heart size={14} className={cn(post.likesCount ? "fill-clay text-clay" : "")} />
            <span className="text-xs font-serif italic">{post.likesCount || 0} appreciations</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Pages ---

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['poetry', 'prose', 'essay', 'letter'];

  const featuredPoems = [
    {
      title: "2,795 Miles",
      author: "Ismail",
      likes: 184,
      comments: [
        { user: "Elena", text: "The pixels line hit home. Beautifully written." },
        { user: "Marcus", text: "This distance feels so real." },
        { user: "Silas", text: "The geography of longing is captured so perfectly here." },
        { user: "Aria", text: "I've felt this exact number of miles before. It hurts." },
        { user: "Julian", text: "Hope wearing your face... what a line." }
      ],
      content: `We barely talk.
A few messages here and there.
A voice note that lingers longer than it should.
Your name lighting up my screen
like it knows what it’s doing to me.

And still…
I like you.
More than makes sense.
More than logic approves of.

You kind of know it too.
I hear it in the way you tease me.
In the pauses that feel intentional.
In the way you never shut it down completely…
just leave the door slightly open.

We are 2,795 miles apart.
I checked.
Then I checked again.
As if the number would shrink
if I stared at it long enough.

The chances of us ever meeting
feel like one in a million and one.
And somehow
my heart still chose you
like it didn’t read the odds.

I call it love sometimes.
Quietly.
In my head.
But I don’t really know what it is.
Maybe it’s hope wearing your face.
Maybe it’s loneliness romanticized.
Maybe it’s something real
that just happened to be born
in the wrong geography.

I imagine stupid things.
Airport reunions.
Long walks in a city that isn’t mine or yours.
The first time we realize
we’re not pixels anymore.

Then reality taps my shoulder.
Reminds me of borders.
Time zones.
Different lives moving at full speed
in opposite directions.

But still…
when you laugh
through a speaker
thousands of miles away,
it feels close.
Closer than some people
standing right next to me.

So here it is.
No big speech.
No dramatic promises.
Just this truth:

If distance were kinder,
if timing were braver,
if the world were smaller…
I would choose you
without hesitation.

Even now,
with 2,795 miles between us,
I kind of already have.`
    },
    {
      title: "Probability",
      author: "Ismail",
      likes: 156,
      comments: [
        { user: "Sarah", text: "Solving for us... what a powerful metaphor." },
        { user: "Julian", text: "The disappointed older brother part is too relatable." },
        { user: "Caleb", text: "The math of the heart is always the hardest to solve." },
        { user: "Lyra", text: "I love the way you describe hope sneaking in." },
        { user: "Will", text: "This resonates so much with my own experiences." }
      ],
      content: `It was the first time
her voice lived in my ears
for almost two hours…
and somehow
that was enough
for my mind to start building a life
it had no permission to imagine.

I knew…
I knew we couldn’t be together.
That part of me stayed sober,
sat in the corner,
counting reasons,
shaking its head like a disappointed older brother.

But another part of me
picked up a pen
and started doing maths anyway.

If timing softened…
If distance bent a little…
If we became braver, quieter, better…
If the universe blinked
at the right moment.

I was calculating futures
while she laughed about nothing,
while her pauses felt warm,
while her silence didn’t scare me.

Two hours…
and I had already pictured grocery lists,
late nights,
arguments that end in sleep,
her name fitting naturally
next to mine.

It’s embarrassing, I know.
How quickly I fall.
How easily hope sneaks in
even when the door is locked.

I knew we couldn’t be together…
and still,
I kept solving for us
like love was an equation
that only needed
one more miracle
to balance.

Maybe that’s what hurts the most…
not that it won’t happen,
but that for a moment,
my heart believed
it could.`
    },
    {
      title: "In a Way That Would Worry a Therapist",
      author: "Ismail",
      likes: 342,
      comments: [
        { user: "Nora", text: "Rare and reckless. Exactly." },
        { user: "David", text: "This is the best thing I've read all week." },
        { user: "Elena", text: "The distinction between attachment and devotion is profound." },
        { user: "Silas", text: "I feel seen by this poem. Thank you." },
        { user: "Aria", text: "Terrifying and beautiful... just like real love." },
        { user: "Marcus", text: "The therapist vs poet contrast is brilliant." }
      ],
      content: `I love you
in a way that would worry a therapist
and thrill a poet....

The kind of love that doesn’t knock.
It lets itself in
like it has always lived here.

I didn’t build boundaries around you.
I built rooms.
Gave you space in my thoughts
you never asked for
and somehow never left.

You exist in the small things.
In the silence between songs.
In the way I pause
before saying goodnight to anyone else.
In the way my day bends
around the idea of you.

It’s not healthy, I know.
There’s no balance here.
No careful distance.
No logic strong enough
to keep my heart in check.

I have memorized you
without permission.
The rhythm of your voice.
The weight of your absence.
The way my mind fills in your presence
even when you’re nowhere near me.

A therapist would call it attachment.
Would trace it back to old wounds.
Would ask me why I pour so much
into something uncertain.

A poet would call it devotion.
Would write you into eternity.
Would say love like this
is rare
and reckless
and worth the fall.

And me....
I stand somewhere in between.

Aware enough to know
this could ruin me.
Soft enough to let it happen anyway.

Because loving you feels like
standing at the edge of something infinite.
Terrifying.
Beautiful.
Impossible to step back from
once you’ve seen it.

I love you
in a way that doesn’t ask to be saved.

In a way that burns quietly
and completely
all at once.`
    },
    {
      title: "Letter 1",
      author: "Ismail",
      likes: 128,
      comments: [
        { user: "Mariana?", text: "Ismail... I'm speechless." },
        { user: "Leo", text: "Raw and powerful. The hurricane metaphor is perfect." },
        { user: "Julian", text: "The intensity here is palpable. I can feel the regret." },
        { user: "Sarah", text: "This is so raw. I love the honesty." }
      ],
      content: `Mariana,

I’ve been sitting here for hours, whispering your name like some lovesick idiot, like that’s gonna bring you back or make the silence less fucking loud. Your name sticks to my tongue like honey and regret, sweet but heavy, something I can’t swallow down no matter how hard I try. It’s like an unfinished song, a last text left on read, something begging to be completed but never will be.

The room feels too damn small tonight. The lamp’s flickering like it’s got a nervous twitch, and the window keeps rattling like even the wind is trying to get a word in. I swear, even the damn clock is ticking in time with your voice in my head—like it knows how much space you take up in me. Sleep? Yeah, right. That coward bails the second I close my eyes, leaving me alone with the reel of you—your voice, your laugh, that fucking look you gave me the last time. Like you knew. Like you were already halfway out the door.

I don’t do that halfway love shit, Mariana. I never have. I love like a goddamn hurricane—messy, loud, knocking shit over. I throw myself at the shore, over and over, hoping this time, you’ll stand there and take it instead of walking away before the tide even reaches your toes. But maybe I was always meant to break against you, to be that wave that crashes and disappears like it was never even there.

Tell me, Mariana—does the night ever whisper my name back to you? Do you ever hear me in the wind, or am I just screaming into the void? ‘Cause if I’m gonna be a ghost in your life, at least let me be the kind that fucks shit up—lights flickering, books falling off shelves—something you can’t ignore, no matter how hard you try.

Yours, in ink and whatever the hell this is,
Ismail`
    }
  ];

  useEffect(() => {
    let q = query(
      collection(db, 'posts'), 
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc')
    );

    if (selectedCategory) {
      q = query(
        collection(db, 'posts'),
        where('isPublic', '==', true),
        where('category', '==', selectedCategory),
        orderBy('createdAt', 'desc')
      );
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedCategory]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse font-serif italic text-2xl">Gathering ink...</div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-8 py-20">
      <header className="mb-20 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-7xl md:text-9xl font-serif mb-8 tracking-tighter"
        >
          The Archive
        </motion.h1>
        <p className="text-xl font-serif italic text-ink/60 max-w-2xl mx-auto">
          "A collection of whispers, letters, and stories from the heart of The Longform community."
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {featuredPoems.map((poem, idx) => (
          <div key={idx} className="bg-clay/5 rounded-3xl p-12 border border-clay/10 h-full flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.3em] text-clay font-bold mb-4 block">Featured Work</span>
            <h2 className="text-4xl font-serif mb-8">{poem.title}</h2>
            <div className="font-serif text-lg leading-relaxed text-ink/80 whitespace-pre-wrap mb-8 italic flex-1">
              {poem.content}
            </div>
            <div className="flex items-center gap-3 mt-auto pt-8 border-t border-ink/5">
              <div className="w-8 h-8 rounded-full bg-clay text-paper flex items-center justify-center font-bold text-xs">
                {poem.author[0]}
              </div>
              <span className="text-sm font-serif italic">by {poem.author}</span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-clay">
                <span className="flex items-center gap-1">
                  <Heart size={14} className="fill-clay" />
                  {poem.likes} appreciations
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  {poem.comments.length} thoughts
                </span>
              </div>
              
              <div className="space-y-3">
                {poem.comments.map((comment, cIdx) => (
                  <div key={cIdx} className="bg-ink/[0.03] p-4 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-widest text-ink/40 font-bold mb-1">{comment.user}</p>
                    <p className="text-sm font-serif italic text-ink/70 leading-relaxed">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-16">
        <button 
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all",
            !selectedCategory ? "bg-ink text-paper" : "bg-ink/5 hover:bg-ink/10"
          )}
        >
          All
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all",
              selectedCategory === cat ? "bg-ink text-paper" : "bg-ink/5 hover:bg-ink/10"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-0">
        {posts.length > 0 ? (
          posts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-20 border-y border-ink/10">
            <p className="font-serif italic text-xl text-ink/40">The silence is profound. No scribbles yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const PostDetail = ({ user }: { user: User | null }) => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [liking, setLiking] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id || !user) {
      setIsBookmarked(false);
      return;
    }
    const bookmarkId = `${user.uid}_${id}`;
    const unsubscribe = onSnapshot(doc(db, 'bookmarks', bookmarkId), (docSnap) => {
      setIsBookmarked(docSnap.exists());
    });
    return () => unsubscribe();
  }, [id, user]);

  const toggleBookmark = async () => {
    if (!user || !id) {
      toast.error('Please sign in to bookmark pieces');
      return;
    }
    const bookmarkId = `${user.uid}_${id}`;
    const bookmarkRef = doc(db, 'bookmarks', bookmarkId);
    try {
      if (isBookmarked) {
        await deleteDoc(bookmarkRef);
        toast.success('Removed from bookmarks');
      } else {
        await setDoc(bookmarkRef, {
          uid: user.uid,
          postId: id,
          createdAt: serverTimestamp()
        });
        toast.success('Bookmarked');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update bookmark');
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: `Check out this piece on The Longform: ${post?.title}`,
        url: url
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    }
  };

  const handleExportPDF = async () => {
    if (!post) return;
    const element = document.getElementById('post-content');
    if (!element) return;

    toast.loading('Preparing your PDF...');
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${post.title.replace(/\s+/g, '_')}.pdf`);
      toast.dismiss();
      toast.success('PDF exported');
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error('Failed to export PDF');
    }
  };

  useEffect(() => {
    if (!id) return;
    const docRef = doc(db, 'posts', id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() } as Post);
      } else {
        toast.error('Post not found');
        navigate('/');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id, navigate]);

  useEffect(() => {
    if (!id || !user) {
      setIsLiked(false);
      return;
    }
    const likeRef = doc(db, 'likes', `${user.uid}_${id}`);
    const unsubscribe = onSnapshot(likeRef, (docSnap) => {
      setIsLiked(docSnap.exists());
    });
    return () => unsubscribe();
  }, [id, user]);

  const handleLike = async () => {
    if (!user || !id || !post) {
      toast.error('Please sign in to appreciate this piece');
      return;
    }

    setLiking(true);
    const likeId = `${user.uid}_${id}`;
    const likeRef = doc(db, 'likes', likeId);
    const postRef = doc(db, 'posts', id);

    try {
      await runTransaction(db, async (transaction) => {
        const likeSnap = await transaction.get(likeRef);
        if (likeSnap.exists()) {
          transaction.delete(likeRef);
          transaction.update(postRef, {
            likesCount: increment(-1)
          });
        } else {
          transaction.set(likeRef, {
            uid: user.uid,
            postId: id,
            createdAt: serverTimestamp()
          });
          transaction.update(postRef, {
            likesCount: increment(1)
          });
        }
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to update appreciation');
    } finally {
      setLiking(false);
    }
  };

  const submitReport = async () => {
    if (!user || !id || !reportReason.trim()) {
      toast.error('Please provide a reason for reporting');
      return;
    }

    setSubmittingReport(true);
    try {
      await addDoc(collection(db, 'reports'), {
        postId: id,
        postTitle: post.title,
        authorId: post.authorId,
        reporterId: user.uid,
        reporterEmail: user.email,
        reason: reportReason.trim(),
        status: 'pending',
        createdAt: serverTimestamp()
      });
      toast.success('Report submitted. Thank you for helping keep our community safe.');
      setShowReportModal(false);
      setReportReason('');
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit report. Please try again later.');
    } finally {
      setSubmittingReport(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!post) return null;

  const date = post.createdAt?.toDate ? post.createdAt.toDate() : new Date();

  return (
    <div className="max-w-3xl mx-auto px-8 py-20">
      <Link to="/" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest mb-12 hover:text-clay transition-colors">
        <ChevronLeft size={16} />
        Back to Archive
      </Link>

      <article>
        {/* Report Modal */}
        <AnimatePresence>
          {showReportModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowReportModal(false)}
                className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-paper w-full max-w-md rounded-3xl p-8 shadow-2xl border border-ink/10"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3 text-destructive">
                    <AlertTriangle size={24} />
                    <h3 className="text-xl font-serif font-bold text-ink">Report Content</h3>
                  </div>
                  <button 
                    onClick={() => setShowReportModal(false)}
                    className="p-2 hover:bg-ink/5 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="text-ink/60 text-sm mb-6 leading-relaxed">
                  Help us maintain a safe and respectful community. Please describe why you are reporting this piece.
                </p>

                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Reason for reporting (e.g., harassment, hate speech, copyright violation...)"
                  className="w-full h-32 bg-ink/[0.03] border border-ink/10 rounded-2xl p-4 text-sm font-serif focus:outline-none focus:border-clay transition-colors mb-6 resize-none"
                />

                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 py-3 rounded-full border border-ink/10 text-xs uppercase tracking-widest font-bold hover:bg-ink/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={submitReport}
                    disabled={submittingReport || !reportReason.trim()}
                    className="flex-1 py-3 rounded-full bg-destructive text-paper text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {submittingReport ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs uppercase tracking-[0.2em] text-clay font-bold">{post.category}</span>
            <span className="w-1 h-1 rounded-full bg-ink/20"></span>
            <span className="text-xs uppercase tracking-[0.2em] text-ink/40">{format(date, 'MMMM dd, yyyy')}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif leading-tight mb-8">{post.title}</h1>
          {post.imageUrl && (
            <div className="mb-12 rounded-2xl overflow-hidden border border-ink/10">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full aspect-video object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          <div className="flex items-center gap-4 border-y border-ink/10 py-6">
            <div className="w-10 h-10 rounded-full bg-ink text-paper flex items-center justify-center font-bold">
              {post.authorName[0]}
            </div>
            <div>
              <Link to={`/profile/${post.authorId}`}>
                <p className="text-sm uppercase tracking-widest font-semibold hover:text-clay transition-colors">{post.authorName}</p>
              </Link>
              <p className="text-xs italic font-serif text-ink/40">Contributor</p>
            </div>
            {user && user.uid !== post.authorId && (
              <div className="ml-4">
                <FollowButton followerId={user.uid} followingId={post.authorId} />
              </div>
            )}
            <div className="ml-auto flex items-center gap-4">
              <button 
                onClick={toggleBookmark}
                className={cn(
                  "p-2 rounded-full border transition-all",
                  isBookmarked ? "border-clay text-clay" : "border-ink/10 hover:border-clay text-ink/40 hover:text-clay"
                )}
              >
                <Bookmark size={18} className={isBookmarked ? "fill-clay" : ""} />
              </button>
              <button 
                onClick={handleShare}
                className="p-2 rounded-full border border-ink/10 hover:border-clay text-ink/40 hover:text-clay transition-all"
              >
                <Share2 size={18} />
              </button>
              <button 
                onClick={handleExportPDF}
                className="p-2 rounded-full border border-ink/10 hover:border-clay text-ink/40 hover:text-clay transition-all"
                title="Export as PDF"
              >
                <FileText size={18} />
              </button>
              {user && user.uid !== post.authorId && (
                <button 
                  onClick={() => setShowReportModal(true)}
                  className="p-2 rounded-full border border-ink/10 hover:border-destructive text-ink/40 hover:text-destructive transition-all"
                  title="Report Post"
                >
                  <Flag size={18} />
                </button>
              )}
              <button 
                onClick={handleLike}
                disabled={liking}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-full border transition-all duration-500",
                  isLiked 
                    ? "bg-clay border-clay text-paper" 
                    : "border-ink/10 hover:border-clay text-ink/60 hover:text-clay"
                )}
              >
                <Heart size={18} className={cn(isLiked ? "fill-paper" : "")} />
                <span className="text-xs uppercase tracking-widest font-bold">
                  {post.likesCount || 0}
                </span>
              </button>
            </div>
          </div>
        </header>

        <div id="post-content" className="markdown-body prose prose-lg max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {user?.uid === post.authorId && (
          <div className="mt-20 pt-10 border-t border-ink/10 flex gap-4">
            <button 
              onClick={() => navigate(`/edit/${post.id}`)}
              className="flex items-center gap-2 px-6 py-3 border border-ink rounded-full hover:bg-ink hover:text-paper transition-all"
            >
              <Edit3 size={16} />
              Edit Piece
            </button>
            <button 
              onClick={async () => {
                if (confirm('Are you sure you want to delete this piece?')) {
                  await deleteDoc(doc(db, 'posts', post.id));
                  toast.success('Piece deleted');
                  navigate('/');
                }
              }}
              className="flex items-center gap-2 px-6 py-3 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        )}

        <CommentsSection postId={post.id} user={user} />
      </article>
    </div>
  );
};

const CommentsSection = ({ postId, user }: { postId: string, user: User | null }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(commentsData);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        postId,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorPhoto: user.photoURL || '',
        content: newComment.trim(),
        createdAt: serverTimestamp()
      });
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      console.error(error);
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await deleteDoc(doc(db, 'comments', commentId));
      toast.success('Comment removed');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete comment');
    }
  };

  return (
    <section className="mt-20 pt-20 border-t border-ink/10">
      <div className="flex items-center gap-3 mb-12">
        <MessageSquare size={24} className="text-clay" />
        <h3 className="text-3xl font-serif">Conversations</h3>
        <span className="text-sm font-serif italic text-ink/40">({comments.length})</span>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-16">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-clay/20 flex items-center justify-center text-xs font-bold shrink-0">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                (user.displayName || 'A')[0]
              )}
            </div>
            <div className="flex-1 space-y-4">
              <textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full bg-transparent border-b border-ink/10 focus:border-clay focus:ring-0 font-serif text-lg py-2 resize-none transition-colors"
                rows={2}
              />
              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="flex items-center gap-2 px-6 py-2 bg-ink text-paper rounded-full hover:bg-clay transition-all text-xs uppercase tracking-widest disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : (
                    <>
                      <Send size={14} />
                      Post Comment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-ink/[0.02] rounded-2xl p-8 text-center mb-16">
          <p className="font-serif italic text-ink/60 mb-4">Sign in to join the conversation.</p>
        </div>
      )}

      <div className="space-y-12">
        {loading ? (
          <div className="text-center py-10 font-serif italic text-ink/40">Loading comments...</div>
        ) : comments.length > 0 ? (
          comments.map((comment) => {
            const date = comment.createdAt?.toDate ? comment.createdAt.toDate() : new Date();
            return (
              <motion.div 
                key={comment.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-6 group"
              >
                <div className="w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                  {comment.authorPhoto ? (
                    <img src={comment.authorPhoto} alt={comment.authorName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    comment.authorName[0]
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-sm font-semibold uppercase tracking-widest mr-3">{comment.authorName}</span>
                      <span className="text-[10px] uppercase tracking-widest text-ink/40">{format(date, 'MMM dd, yyyy · HH:mm')}</span>
                    </div>
                    {(user?.uid === comment.authorId) && (
                      <button 
                        onClick={() => handleDelete(comment.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all p-1"
                        title="Delete comment"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <p className="font-serif text-lg leading-relaxed text-ink/80">{comment.content}</p>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-10 border-y border-ink/5">
            <p className="font-serif italic text-ink/20">The conversation hasn't started yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

const Editor = ({ user, isEditing = false }: { user: User | null, isEditing?: boolean }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<'poetry' | 'prose' | 'essay' | 'letter'>('poetry');
  const [isPublic, setIsPublic] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showHashtags, setShowHashtags] = useState(false);
  const [hashtagQuery, setHashtagQuery] = useState('');
  const [cursorPos, setCursorPos] = useState(0);
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('split');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [uploading, setUploading] = useState(false);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const trendingHashtags = ['poetry', 'life', 'musings', 'scribbles', 'archive', 'longform', 'storytelling'];

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    const pos = e.target.selectionStart;
    setCursorPos(pos);
    
    const textBeforeCursor = newContent.substring(0, pos);
    const lastHashIndex = textBeforeCursor.lastIndexOf('#');
    
    if (lastHashIndex !== -1 && !textBeforeCursor.substring(lastHashIndex).includes(' ')) {
      const query = textBeforeCursor.substring(lastHashIndex + 1);
      setHashtagQuery(query);
      setShowHashtags(true);
    } else {
      setShowHashtags(false);
    }
  };

  const selectHashtag = (tag: string) => {
    const textBeforeHash = content.substring(0, content.lastIndexOf('#', cursorPos));
    const textAfterCursor = content.substring(cursorPos);
    const newContent = textBeforeHash + '#' + tag + ' ' + textAfterCursor;
    setContent(newContent);
    setShowHashtags(false);
    
    setTimeout(() => {
      textareaRef.current?.focus();
      const newPos = textBeforeHash.length + tag.length + 2;
      textareaRef.current?.setSelectionRange(newPos, newPos);
    }, 0);
  };

  useEffect(() => {
    if (isEditing && id) {
      const fetchPost = async () => {
        const docSnap = await getDoc(doc(db, 'posts', id));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setContent(data.content);
          setImageUrl(data.imageUrl || '');
          setCategory(data.category);
          setIsPublic(data.isPublic);
        }
      };
      fetchPost();
    }
  }, [isEditing, id]);

  // Auto-save logic
  useEffect(() => {
    if (!user || !title || !content || isEditing) return;

    const timer = setTimeout(async () => {
      try {
        const draftId = `draft_${user.uid}`;
        await setDoc(doc(db, 'drafts', draftId), {
          title,
          content,
          category,
          authorId: user.uid,
          updatedAt: serverTimestamp()
        });
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [title, content, category, user, isEditing]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setImageUrl(url);
      toast.success('Image uploaded');
    } catch (error) {
      console.error(error);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const insertText = (before: string, after: string = '') => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    
    setContent(newText);
    
    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleSave = async () => {
    if (!user) return;
    if (!title || !content) {
      toast.error('Please fill in both title and content');
      return;
    }

    setSaving(true);
    try {
      const postData = {
        title,
        content,
        imageUrl: imageUrl.trim() || null,
        category,
        isPublic,
        updatedAt: serverTimestamp(),
      };

      if (isEditing && id) {
        await updateDoc(doc(db, 'posts', id), postData);
        toast.success('Piece updated');
      } else {
        await addDoc(collection(db, 'posts'), {
          ...postData,
          authorId: user.uid,
          authorName: user.displayName || 'Anonymous',
          createdAt: serverTimestamp(),
        });
        toast.success('Piece posted to archive');
      }
      navigate('/profile');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div className="p-20 text-center font-serif italic">Please sign in to write.</div>;

  return (
    <div className="max-w-7xl mx-auto px-8 py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-ink/5 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-4xl font-serif">{isEditing ? 'Refining the Piece' : 'A New Scribble'}</h1>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex bg-ink/5 p-1 rounded-full">
            <button 
              onClick={() => setViewMode('edit')}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest transition-all flex items-center gap-2",
                viewMode === 'edit' ? "bg-ink text-paper" : "hover:text-clay"
              )}
            >
              <Edit3 size={12} />
              Editor
            </button>
            <button 
              onClick={() => setViewMode('split')}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest transition-all flex items-center gap-2",
                viewMode === 'split' ? "bg-ink text-paper" : "hover:text-clay"
              )}
            >
              <Columns size={12} />
              Split
            </button>
            <button 
              onClick={() => setViewMode('preview')}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest transition-all flex items-center gap-2",
                viewMode === 'preview' ? "bg-ink text-paper" : "hover:text-clay"
              )}
            >
              <Eye size={12} />
              Preview
            </button>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-ink text-paper rounded-full hover:bg-clay transition-all text-sm uppercase tracking-widest disabled:opacity-50"
          >
            {saving ? 'Archiving...' : (isEditing ? 'Update Piece' : 'Publish to Archive')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className={cn(
          "space-y-8",
          viewMode === 'preview' ? "hidden" : "block",
          viewMode === 'edit' ? "lg:col-span-2 max-w-3xl mx-auto w-full" : ""
        )}>
          <div className="space-y-4">
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title of your piece..."
              className="w-full bg-transparent border-b border-ink/10 focus:border-clay focus:ring-0 text-5xl font-serif py-4 transition-colors"
            />
            <div className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <span className="text-ink/40">Category:</span>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="bg-transparent border-none focus:ring-0 font-bold text-clay p-0"
                >
                  <option value="poetry">Poetry</option>
                  <option value="prose">Prose</option>
                  <option value="essay">Essay</option>
                  <option value="letter">Letter</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsPublic(!isPublic)}
                  className="flex items-center gap-2 hover:text-clay transition-colors"
                >
                  {isPublic ? <Globe size={14} /> : <Lock size={14} />}
                  {isPublic ? 'Public' : 'Private'}
                </button>
              </div>
              <div className="flex items-center gap-2 ml-auto text-ink/40">
                <span className="font-mono">{wordCount} words</span>
                {lastSaved && (
                  <span className="italic ml-4">Saved at {format(lastSaved, 'HH:mm:ss')}</span>
                )}
              </div>
            </div>
          </div>

          <div className="relative group">
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            {imageUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-ink/10 aspect-video">
                <img src={imageUrl} alt="Header" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setImageUrl('')}
                  className="absolute top-4 right-4 p-2 bg-paper/80 backdrop-blur-sm rounded-full hover:bg-red-50 text-red-500 transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full aspect-video rounded-2xl border-2 border-dashed border-ink/10 hover:border-clay/40 hover:bg-clay/[0.02] transition-all flex flex-col items-center justify-center gap-4 text-ink/40"
              >
                <Camera size={48} strokeWidth={1} />
                <span className="text-sm uppercase tracking-widest">{uploading ? 'Uploading...' : 'Add a header image'}</span>
              </button>
            )}
          </div>

          <div className="border border-ink/10 rounded-2xl overflow-hidden bg-paper">
            <div className="flex items-center gap-1 p-2 border-b border-ink/10 bg-ink/[0.02] overflow-x-auto no-scrollbar">
              <ToolbarButton onClick={() => insertText('**', '**')} icon={<Bold size={16} />} label="Bold" />
              <ToolbarButton onClick={() => insertText('_', '_')} icon={<Italic size={16} />} label="Italic" />
              <ToolbarButton onClick={() => insertText('[', '](url)')} icon={<LinkIcon size={16} />} label="Link" />
              <div className="w-px h-4 bg-ink/10 mx-1" />
              <ToolbarButton onClick={() => insertText('# ', '')} icon={<Heading1 size={16} />} label="H1" />
              <ToolbarButton onClick={() => insertText('## ', '')} icon={<Heading2 size={16} />} label="H2" />
              <ToolbarButton onClick={() => insertText('### ', '')} icon={<Heading3 size={16} />} label="H3" />
              <div className="w-px h-4 bg-ink/10 mx-1" />
              <ToolbarButton onClick={() => insertText('> ', '')} icon={<Quote size={16} />} label="Quote" />
              <ToolbarButton onClick={() => insertText('- ', '')} icon={<List size={16} />} label="List" />
              <ToolbarButton onClick={() => insertText('1. ', '')} icon={<ListOrdered size={16} />} label="Ordered List" />
            </div>
            <div className="relative">
              <textarea 
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                placeholder="Begin your story here..."
                className="w-full h-[600px] bg-transparent border-none focus:ring-0 font-serif text-xl p-8 resize-none leading-relaxed"
                spellCheck="true"
              />
              {showHashtags && (
                <div className="absolute bg-paper border border-ink/10 rounded-xl shadow-xl p-2 z-50 w-48" style={{ top: '20px', left: '20px' }}>
                  <p className="text-[10px] uppercase tracking-widest text-ink/40 px-3 py-2 border-b border-ink/5 mb-2">Trending Tags</p>
                  {trendingHashtags.filter(t => t.includes(hashtagQuery.toLowerCase())).map(tag => (
                    <button 
                      key={tag}
                      onClick={() => selectHashtag(tag)}
                      className="w-full text-left px-3 py-2 hover:bg-clay/10 rounded-lg text-sm font-mono transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={cn(
            "border border-ink/10 rounded-2xl bg-paper overflow-y-auto max-h-[900px] p-12",
            viewMode === 'preview' ? "lg:col-span-2 max-w-3xl mx-auto w-full" : ""
          )}>
            <div className="max-w-none">
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs uppercase tracking-[0.2em] text-clay font-bold">{category}</span>
                  <span className="w-1 h-1 rounded-full bg-ink/20"></span>
                  <span className="text-xs uppercase tracking-[0.2em] text-ink/40">{format(new Date(), 'MMMM dd, yyyy')}</span>
                </div>
                <h1 className="text-5xl font-serif leading-tight mb-8">{title || 'Untitled Piece'}</h1>
                {imageUrl && (
                  <div className="mb-12 rounded-2xl overflow-hidden border border-ink/10">
                    <img src={imageUrl} alt="Preview" className="w-full aspect-video object-cover" />
                  </div>
                )}
              </div>
              <div className="markdown-body prose prose-lg max-w-none">
                <ReactMarkdown>{content || '*The page is waiting for your words...*'}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ToolbarButton = ({ onClick, icon, label }: { onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    title={label}
    className="p-2 hover:bg-ink/5 rounded-md transition-colors text-ink/60 hover:text-ink"
  >
    {icon}
  </button>
);

const SeedDataTool = ({ user }: { user: User | null }) => {
  const [isSeeding, setIsSeeding] = useState(false);

  // Only show for the developer
  if (user?.email !== 'mittnaytking@gmail.com') return null;

  const seedData = async () => {
    setIsSeeding(true);
    const toastId = toast.loading('Seeding realistic data...');
    
    try {
      const MOCK_NAMES = ["Elena Vance", "Julian Thorne", "Silas Vane", "Aria Night", "Caleb Frost", "Lyra Belacqua", "Will Parry"];
      const MOCK_COMMENTS = [
        "This piece resonates so deeply with me. The imagery is haunting.",
        "Beautifully written. The rhythm is perfect.",
        "I love the way you captured this feeling. It's so relatable.",
        "A masterpiece of modern poetry. Truly inspiring.",
        "The metaphors here are stunning. I keep coming back to read it again.",
        "Such a delicate touch. Thank you for sharing this.",
        "This is exactly what I needed to read today. Powerful.",
        "Your voice is so unique. I'm a fan!"
      ];

      // 1. Get all public posts
      const postsQ = query(collection(db, 'posts'), where('isPublic', '==', true));
      const postsSnap = await getDocs(postsQ);
      
      if (postsSnap.empty) {
        toast.error('No public posts found to seed data for.', { id: toastId });
        setIsSeeding(false);
        return;
      }

      let totalLikes = 0;
      let totalComments = 0;

      for (const postDoc of postsSnap.docs) {
        const postId = postDoc.id;
        
        // Add 3-8 random likes
        const likesToAdd = Math.floor(Math.random() * 6) + 3;
        await updateDoc(doc(db, 'posts', postId), {
          likesCount: increment(likesToAdd)
        });
        totalLikes += likesToAdd;

        // Add 2-4 random comments
        const commentsToAdd = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < commentsToAdd; i++) {
          const randomName = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];
          const randomComment = MOCK_COMMENTS[Math.floor(Math.random() * MOCK_COMMENTS.length)];
          
          await addDoc(collection(db, 'comments'), {
            postId,
            authorName: randomName,
            authorId: 'mock_user_' + Math.random().toString(36).substr(2, 9),
            text: randomComment,
            createdAt: serverTimestamp()
          });
          totalComments += 1;
        }
      }

      toast.success(`Successfully seeded ${totalLikes} likes and ${totalComments} comments!`, { id: toastId });
    } catch (error) {
      console.error('Seeding error:', error);
      toast.error('Failed to seed data.', { id: toastId });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="mt-12 p-8 border border-clay/20 bg-clay/5 rounded-3xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-clay/10 rounded-lg">
          <Globe size={20} className="text-clay" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-medium">Developer Tools</h3>
          <p className="text-sm text-ink/60 italic">Populate the site with realistic engagement data.</p>
        </div>
      </div>
      <button
        onClick={seedData}
        disabled={isSeeding}
        className="w-full py-4 bg-clay text-paper rounded-full text-xs uppercase tracking-widest hover:bg-clay/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSeeding ? (
          <>
            <div className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
            Seeding Whispers...
          </>
        ) : (
          'Seed Realistic Engagement Data'
        )}
      </button>
    </div>
  );
};

const Profile = ({ user }: { user: User | null }) => {
  const { uid: profileUid } = useParams();
  const effectiveUid = profileUid || user?.uid;
  const isOwnProfile = user?.uid === effectiveUid;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [savingBio, setSavingBio] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'public' | 'drafts' | 'bookmarks'>('public');
  const [stats, setStats] = useState({ followers: 0, following: 0, likes: 0, comments: 0 });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!effectiveUid) return;

    // Fetch followers count
    const followersQ = query(collection(db, 'follows'), where('followingId', '==', effectiveUid));
    const unsubFollowers = onSnapshot(followersQ, (snap) => setStats(prev => ({ ...prev, followers: snap.size })));

    // Fetch following count
    const followingQ = query(collection(db, 'follows'), where('followerId', '==', effectiveUid));
    const unsubFollowing = onSnapshot(followingQ, (snap) => setStats(prev => ({ ...prev, following: snap.size })));

    // Fetch total likes across all posts
    const postsQ = query(collection(db, 'posts'), where('authorId', '==', effectiveUid));
    const unsubLikes = onSnapshot(postsQ, (snap) => {
      const totalLikes = snap.docs.reduce((acc, doc) => acc + (doc.data().likesCount || 0), 0);
      setStats(prev => ({ ...prev, likes: totalLikes }));
    });

    // Fetch total comments received
    const unsubComments = onSnapshot(collection(db, 'comments'), (snap) => {
      // In a real app, we'd query by postId for all their posts
      // But for simplicity in this prototype:
      setStats(prev => ({ ...prev, comments: snap.size })); // Mocking for now
    });

    return () => {
      unsubFollowers();
      unsubFollowing();
      unsubLikes();
      unsubComments();
    };
  }, [effectiveUid]);

  useEffect(() => {
    if (!effectiveUid) return;
    
    // Fetch user profile data
    const userRef = doc(db, 'users', effectiveUid);
    const unsubProfile = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfileData(data);
        setBio(data.bio || '');
      }
    });

    const q = query(
      collection(db, 'posts'), 
      where('authorId', '==', effectiveUid),
      orderBy('createdAt', 'desc')
    );
    
    const unsubPosts = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    });

    return () => {
      unsubProfile();
      unsubPosts();
    };
  }, [effectiveUid]);

  const handleSaveBio = async () => {
    if (!user) return;
    setSavingBio(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        bio: bio.trim()
      });
      setIsEditingBio(false);
      toast.success('Bio updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update bio');
    } finally {
      setSavingBio(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `profiles/${user.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        photoURL: downloadURL
      });

      // Update Auth Profile
      await updateProfile(user, {
        photoURL: downloadURL
      });

      toast.success('Profile photo updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  if (!user) return <div className="p-20 text-center font-serif italic">Please sign in to view your profile.</div>;

  return (
    <div className="max-w-5xl mx-auto px-8 py-20">
      <header className="flex flex-col md:flex-row gap-12 items-center mb-20 pb-20 border-b border-ink/10">
        <div className="relative group shrink-0">
          <div className="w-40 h-40 rounded-full border-2 border-clay p-2">
            <img 
              src={profileData?.photoURL || user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`} 
              alt={user.displayName || ''} 
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 flex items-center justify-center bg-ink/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
          >
            <div className="bg-paper p-3 rounded-full text-ink shadow-lg">
              {uploading ? (
                <div className="w-5 h-5 border-2 border-ink border-t-transparent animate-spin rounded-full" />
              ) : (
                <Camera size={20} />
              )}
            </div>
          </button>
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            className="hidden"
            accept="image/*"
          />
        </div>
        <div className="text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-6xl font-serif">{profileData?.displayName || 'Archive Member'}</h1>
            {!isOwnProfile && user && effectiveUid && (
              <FollowButton followerId={user.uid} followingId={effectiveUid} />
            )}
          </div>
          <p className="text-ink/60 font-serif italic text-xl mb-6">{profileData?.email}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-8 mb-8">
            <div className="text-center md:text-left">
              <p className="text-2xl font-serif font-bold">{posts.filter(p => p.isPublic).length}</p>
              <p className="text-[10px] uppercase tracking-widest text-ink/40">Public Pieces</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-serif font-bold">{stats.followers}</p>
              <p className="text-[10px] uppercase tracking-widest text-ink/40">Followers</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-serif font-bold">{stats.following}</p>
              <p className="text-[10px] uppercase tracking-widest text-ink/40">Following</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-serif font-bold">{stats.likes}</p>
              <p className="text-[10px] uppercase tracking-widest text-ink/40">Appreciations</p>
            </div>
          </div>
          
          <div className="mb-8 max-w-xl">
            {isEditingBio ? (
              <div className="space-y-4">
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about your writing journey..."
                  className="w-full bg-transparent border border-ink/10 rounded-xl p-4 font-serif text-lg focus:border-clay focus:ring-0 resize-none"
                  rows={3}
                  maxLength={500}
                />
                <div className="flex gap-4 justify-center md:justify-start">
                  <button 
                    onClick={handleSaveBio}
                    disabled={savingBio}
                    className="px-6 py-2 bg-ink text-paper rounded-full text-xs uppercase tracking-widest hover:bg-clay transition-all disabled:opacity-50"
                  >
                    {savingBio ? 'Saving...' : 'Save Bio'}
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditingBio(false);
                      setBio(profileData?.bio || '');
                    }}
                    className="px-6 py-2 border border-ink/10 rounded-full text-xs uppercase tracking-widest hover:bg-ink/5 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="group relative">
                <p className="text-lg font-serif leading-relaxed text-ink/80 mb-4">
                  {bio || <span className="text-ink/20 italic">No biography shared yet.</span>}
                </p>
                {isOwnProfile && (
                  <button 
                    onClick={() => setIsEditingBio(true)}
                    className="text-[10px] uppercase tracking-widest text-clay font-bold hover:underline"
                  >
                    {bio ? 'Edit Biography' : 'Add Biography'}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-8 justify-center md:justify-start">
            <div>
              <span className="block text-3xl font-serif">{posts.filter(p => p.isPublic).length}</span>
              <span className="text-xs uppercase tracking-widest text-ink/40">Public</span>
            </div>
            <div>
              <span className="block text-3xl font-serif">{posts.filter(p => !p.isPublic).length}</span>
              <span className="text-xs uppercase tracking-widest text-ink/40">Drafts</span>
            </div>
          </div>
        </div>
      </header>

      {isOwnProfile && <SeedDataTool user={user} />}

      <section>
          <div className="flex items-center gap-8 mb-12 border-b border-ink/10">
            <button 
              onClick={() => setActiveTab('public')}
              className={cn(
                "pb-4 text-sm uppercase tracking-widest transition-all relative",
                activeTab === 'public' ? "text-ink font-bold" : "text-ink/40 hover:text-ink"
              )}
            >
              {isOwnProfile ? 'Public Collection' : 'Archive'}
              {activeTab === 'public' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-clay" />}
            </button>
            {isOwnProfile && (
              <>
                <button 
                  onClick={() => setActiveTab('drafts')}
                  className={cn(
                    "pb-4 text-sm uppercase tracking-widest transition-all relative",
                    activeTab === 'drafts' ? "text-ink font-bold" : "text-ink/40 hover:text-ink"
                  )}
                >
                  Private Drafts
                  {activeTab === 'drafts' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-clay" />}
                </button>
                <button 
                  onClick={() => setActiveTab('bookmarks')}
                  className={cn(
                    "pb-4 text-sm uppercase tracking-widest transition-all relative",
                    activeTab === 'bookmarks' ? "text-ink font-bold" : "text-ink/40 hover:text-ink"
                  )}
                >
                  Bookmarks
                  {activeTab === 'bookmarks' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-clay" />}
                </button>
              </>
            )}
          </div>

          <div className="grid gap-8">
            {activeTab === 'bookmarks' ? (
              <BookmarksList user={user} />
            ) : (
              <>
                {posts.filter(p => activeTab === 'public' ? p.isPublic : !p.isPublic).map(post => (
                  <div key={post.id} className="border border-ink/10 p-8 rounded-2xl hover:border-clay transition-all group flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] uppercase tracking-widest text-clay font-bold">{post.category}</span>
                        {!post.isPublic && <Lock size={12} className="text-ink/40" />}
                      </div>
                      <Link to={`/post/${post.id}`}>
                        <h3 className="text-2xl font-serif group-hover:text-clay transition-colors">{post.title}</h3>
                      </Link>
                      <p className="text-xs text-ink/40 mt-2">
                        {post.createdAt?.toDate ? format(post.createdAt.toDate(), 'MMM dd, yyyy') : 'Just now'}
                      </p>
                    </div>
                    {isOwnProfile && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => window.location.href = `/edit/${post.id}`}
                          className="p-2 hover:bg-clay/10 rounded-full transition-colors"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={async () => {
                            if (confirm('Delete this piece?')) {
                              await deleteDoc(doc(db, 'posts', post.id));
                              toast.success('Deleted');
                            }
                          }}
                          className="p-2 hover:bg-red-50 rounded-full text-red-400 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {posts.filter(p => activeTab === 'public' ? p.isPublic : !p.isPublic).length === 0 && !loading && (
                  <div className="text-center py-20 bg-ink/[0.02] rounded-3xl">
                    <p className="font-serif italic text-xl text-ink/40">
                      {activeTab === 'public' ? 'No public pieces yet.' : 'No private drafts yet.'}
                    </p>
                    {activeTab === 'drafts' && (
                      <Link to="/write" className="mt-6 inline-block px-8 py-3 bg-ink text-paper rounded-full text-sm uppercase tracking-widest">
                        Start a Draft
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
      </section>
    </div>
  );
};

const BookmarksList = ({ user }: { user: User | null }) => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'bookmarks'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const postIds = snapshot.docs.map(doc => doc.data().postId);
      if (postIds.length === 0) {
        setBookmarkedPosts([]);
        setLoading(false);
        return;
      }

      // Fetch actual posts
      const postsData: Post[] = [];
      for (const id of postIds) {
        const postSnap = await getDoc(doc(db, 'posts', id));
        if (postSnap.exists()) {
          postsData.push({ id: postSnap.id, ...postSnap.data() } as Post);
        }
      }
      setBookmarkedPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) return <div className="p-10 text-center font-serif italic">Recalling your favorites...</div>;
  if (bookmarkedPosts.length === 0) return <div className="p-10 text-center font-serif italic text-ink/40">No bookmarks yet.</div>;

  return (
    <div className="grid gap-8">
      {bookmarkedPosts.map(post => (
        <PostCard key={post.id} post={post} user={user} />
      ))}
    </div>
  );
};

const Feed = ({ user }: { user: User | null }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [lastVisibleDocs, setLastVisibleDocs] = useState<any[]>([]); // To track last doc for each author batch
  const [hasMore, setHasMore] = useState(true);

  // 1. Fetch following IDs in real-time
  useEffect(() => {
    if (!user) return;

    const followsQuery = query(
      collection(db, 'follows'),
      where('followerId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(followsQuery, (snapshot) => {
      const ids = snapshot.docs.map(doc => doc.data().followingId);
      setFollowingIds(ids);
      if (ids.length === 0) {
        setPosts([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const fetchInitialPosts = React.useCallback(async () => {
    setLoading(true);
    setLastVisibleDocs([]);
    setHasMore(true);

    try {
      // Split followingIds into batches of 30 (Firestore 'in' query limit)
      const batches = [];
      for (let i = 0; i < followingIds.length; i += 30) {
        batches.push(followingIds.slice(i, i + 30));
      }

      const allBatchPosts: Post[] = [];
      const newLastVisibles: any[] = [];

      // Fetch first 10 posts from each batch
      await Promise.all(batches.map(async (batchIds, index) => {
        const q = query(
          collection(db, 'posts'),
          where('authorId', 'in', batchIds),
          where('isPublic', '==', true),
          orderBy('createdAt', 'desc'),
          limit(10)
        );

        const snapshot = await getDocs(q);
        const batchPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];

        allBatchPosts.push(...batchPosts);
        if (snapshot.docs.length > 0) {
          newLastVisibles[index] = snapshot.docs[snapshot.docs.length - 1];
        }
      }));

      // Sort all fetched posts by createdAt and take top 15
      const sortedPosts = allBatchPosts.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });

      setPosts(sortedPosts.slice(0, 15));
      setLastVisibleDocs(newLastVisibles);
      setHasMore(allBatchPosts.length > 0);
    } catch (error) {
      console.error('Error fetching initial feed:', error);
      toast.error('Failed to load whispers');
    } finally {
      setLoading(false);
    }
  }, [followingIds]);

  // 2. Initial fetch when followingIds change
  useEffect(() => {
    if (followingIds.length > 0) {
      fetchInitialPosts();
    }
  }, [followingIds, fetchInitialPosts]);

  const loadMore = React.useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      const batches = [];
      for (let i = 0; i < followingIds.length; i += 30) {
        batches.push(followingIds.slice(i, i + 30));
      }

      const allBatchPosts: Post[] = [];
      const newLastVisibles = [...lastVisibleDocs];

      await Promise.all(batches.map(async (batchIds, index) => {
        const lastDoc = lastVisibleDocs[index];
        if (!lastDoc) return;

        const q = query(
          collection(db, 'posts'),
          where('authorId', 'in', batchIds),
          where('isPublic', '==', true),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(10)
        );

        const snapshot = await getDocs(q);
        const batchPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];

        allBatchPosts.push(...batchPosts);
        if (snapshot.docs.length > 0) {
          newLastVisibles[index] = snapshot.docs[snapshot.docs.length - 1];
        } else {
          newLastVisibles[index] = null; // No more for this batch
        }
      }));

      if (allBatchPosts.length === 0) {
        setHasMore(false);
        setLoadingMore(false);
        return;
      }

      const sortedPosts = [...posts, ...allBatchPosts].sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });

      // Keep unique posts (in case of overlap or race conditions)
      const uniquePosts = Array.from(new Map(sortedPosts.map(p => [p.id, p])).values());

      setPosts(uniquePosts);
      setLastVisibleDocs(newLastVisibles);
      setHasMore(newLastVisibles.some(doc => doc !== null));
    } catch (error) {
      console.error('Error loading more feed:', error);
      toast.error('Failed to load more whispers');
    } finally {
      setLoadingMore(false);
    }
  }, [followingIds, lastVisibleDocs, loadingMore, hasMore, posts]);

  if (!user) return <div className="p-20 text-center font-serif italic">Please sign in to view your feed.</div>;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse font-serif italic text-2xl">Gathering whispers...</div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-8 py-20">
      <header className="mb-20">
        <h1 className="text-7xl md:text-9xl font-serif mb-8 tracking-tighter">Your Feed</h1>
        <p className="text-xl font-serif italic text-ink/60 max-w-2xl">
          "The latest scribbles from the voices you follow."
        </p>
      </header>

      <div className="space-y-0">
        {posts.length > 0 ? (
          <>
            {posts.map(post => <PostCard key={post.id} post={post} />)}
            {hasMore && (
              <div className="mt-12 text-center">
                <button 
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-12 py-4 border border-ink/10 rounded-full text-xs uppercase tracking-widest hover:bg-ink hover:text-paper transition-all disabled:opacity-50"
                >
                  {loadingMore ? 'Gathering more...' : 'Load more whispers'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 border-y border-ink/10 bg-ink/[0.01] rounded-3xl">
            <p className="font-serif italic text-xl text-ink/40 mb-6">Your feed is quiet. Follow some authors to hear their stories.</p>
            <Link to="/" className="inline-block px-8 py-3 bg-ink text-paper rounded-full text-sm uppercase tracking-widest">
              Explore the Archive
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const AuthPage = ({ type }: { type: 'signin' | 'signup' }) => {
  const navigate = useNavigate();
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
        });
      }
      
      toast.success(type === 'signin' ? 'Welcome back' : 'Welcome to the Archive');
      navigate('/');
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error(error);
        toast.error('Authentication failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-8">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full border border-ink flex items-center justify-center mx-auto mb-8">
          <Feather size={40} />
        </div>
        <h1 className="text-4xl font-serif mb-4">{type === 'signin' ? 'Welcome Back' : 'Join the Archive'}</h1>
        <p className="text-ink/60 font-serif italic mb-12">
          {type === 'signin' ? 'Your scribbles are waiting for you.' : 'Start your journey into the world of longform.'}
        </p>
        
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-4 py-4 bg-ink text-paper rounded-full hover:bg-clay transition-all uppercase tracking-widest text-xs font-bold"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
          Continue with Google
        </button>
        
        <p className="mt-8 text-xs text-ink/40 uppercase tracking-widest">
          {type === 'signin' ? "Don't have an account?" : "Already have an account?"}
          <Link to={type === 'signin' ? '/signup' : '/signin'} className="ml-2 text-clay font-bold hover:underline">
            {type === 'signin' ? 'Sign Up' : 'Sign In'}
          </Link>
        </p>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  if (!authReady) return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <motion.div 
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="font-serif italic text-3xl"
      >
        The Longform
      </motion.div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen bg-paper selection:bg-clay selection:text-paper">
        <Navbar user={user} />
        
        <main>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/feed" element={<Feed user={user} />} />
              <Route path="/signin" element={<AuthPage type="signin" />} />
              <Route path="/signup" element={<AuthPage type="signup" />} />
              <Route path="/post/:id" element={<PostDetail user={user} />} />
              <Route path="/write" element={<Editor user={user} />} />
              <Route path="/edit/:id" element={<Editor user={user} isEditing />} />
              <Route path="/profile" element={<Profile user={user} />} />
              <Route path="/profile/:uid" element={<Profile user={user} />} />
            </Routes>
          </AnimatePresence>
        </main>

        <footer className="border-t border-ink/10 py-20 px-8 mt-20">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-serif mb-2">The Longform</h3>
              <p className="text-sm text-ink/40 font-serif italic">A sanctuary for the written word.</p>
            </div>
            <div className="flex gap-8 text-xs uppercase tracking-widest text-ink/40">
              <a href="#" className="hover:text-ink transition-colors">Privacy</a>
              <a href="#" className="hover:text-ink transition-colors">Terms</a>
              <a href="#" className="hover:text-ink transition-colors">Contact</a>
            </div>
            <div className="text-xs text-ink/20">
              © 2026 The Longform. All rights reserved.
            </div>
          </div>
        </footer>

        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#1A1A1A',
            color: '#F5F2ED',
            border: 'none',
            fontFamily: 'Inter, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontSize: '10px'
          }
        }} />
      </div>
    </Router>
  );
}
