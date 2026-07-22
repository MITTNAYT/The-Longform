import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SearchInterface from '../../components/ui/SearchInterface';

const FeedPreview = () => {
  const [likes, setLikes] = useState({});
  const [bookmarks, setBookmarks] = useState({});

  const samplePosts = [
    {
      id: '1',
      title: "The Solitude of Quiet Hours",
      excerpt: "In the depth of night, the noise of the day fades away. We are left with our own reflections, the creak of the floorboards, and the raw, unfiltered truth of who we are when no one is watching.",
      author: {
        name: "Julian Sterling",
        username: "jsterling",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150"
      },
      publishedAt: "2 hours ago",
      readingTime: "4 min read",
      tags: ["reflection", "solitude", "midnight"],
      progress: 45 // 45% read (continue reading feature)
    },
    {
      id: '2',
      title: "Nocturne in Black and Gold",
      excerpt: "A poem about the city streets after rain, reflecting the neon signs and headlights like a broken mirror on wet asphalt. How beautiful the decay looks under the golden streetlights.",
      author: {
        name: "Ismail Ismail",
        username: "ismail_ismail",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150"
      },
      publishedAt: "1 day ago",
      readingTime: "2 min read",
      tags: ["poetry", "nocturne", "city-life"],
      progress: 0
    },
    {
      id: '3',
      title: "The Architecture of a Sentence: On Craft",
      excerpt: "We often talk about what we want to say, but rarely how we construct the vessel for it. Let's dissect the simple sentence and analyze how punctuation alters the emotional resonance of a thought.",
      author: {
        name: "Marcus Vance",
        username: "marcusv",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150"
      },
      publishedAt: "3 days ago",
      readingTime: "8 min read",
      tags: ["writing", "craft", "essay"],
      progress: 80
    }
  ];

  const handleLike = (id) => {
    setLikes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBookmark = (id) => {
    setBookmarks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border py-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <Link to="/preview/feed" className="font-heading text-2xl font-black tracking-tight text-foreground hover:opacity-90">
            The <span className="text-primary">Longform</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/preview/feed" className="font-medium text-foreground border-b-2 border-primary pb-1">Feed</Link>
            <Link to="/preview/discover" className="font-medium text-muted-foreground hover:text-foreground transition-colors">Discover</Link>
            <Link to="/preview/bookmarks" className="font-medium text-muted-foreground hover:text-foreground transition-colors">Bookmarks</Link>
            <Link to="/preview/editor" className="font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Icon name="PenTool" size={16} /> Write
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <SearchInterface />
            <Button variant="ghost" size="icon" iconName="Bell" />
            <Link to="/preview/profile">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80" 
                alt="User profile" 
                className="w-8 h-8 rounded-full border border-border"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Feed Stream */}
        <main className="lg:col-span-2 space-y-12">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h1 className="font-heading text-2xl font-bold">Your Feed</h1>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="text-foreground font-semibold cursor-pointer">Latest</span>
              <span className="hover:text-foreground cursor-pointer">Trending</span>
            </div>
          </div>

          <div className="space-y-10">
            {samplePosts.map((post) => (
              <article key={post.id} className="group relative bg-card border border-border/40 hover:border-border rounded-xl p-6 lg:p-8 transition-all duration-300 shadow-sm hover:shadow-md">
                
                {/* Author Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name} 
                      className="w-10 h-10 rounded-full object-cover filter brightness-95 border border-border"
                    />
                    <div>
                      <h4 className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer">{post.author.name}</h4>
                      <p className="text-xs text-muted-foreground">@{post.author.username} • {post.publishedAt}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="xs" className="text-xs hover:text-primary font-medium">Follow</Button>
                </div>

                {/* Post Content */}
                <Link to="/preview/post" className="block group-hover:opacity-95 transition-opacity">
                  <h2 className="font-heading text-xl lg:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm lg:text-base leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </Link>

                {/* Progress bar for "Continue Reading" */}
                {post.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-xs text-primary mb-1">
                      <span className="flex items-center gap-1"><Icon name="Play" size={10} /> In progress</span>
                      <span>{post.progress}% read</span>
                    </div>
                    <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${post.progress}%` }}></div>
                    </div>
                  </div>
                )}

                {/* Tags and Metadata */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 bg-muted/60 text-muted-foreground rounded-full hover:bg-muted cursor-pointer transition-colors">
                      #{tag}
                    </span>
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
                      <span>{likes[post.id] ? 13 : 12}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                      <Icon name="MessageSquare" size={16} />
                      <span>4</span>
                    </button>
                    <span className="text-xs">{post.readingTime}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleBookmark(post.id)}
                      className={`hover:text-foreground p-1 transition-colors ${bookmarks[post.id] ? 'text-primary' : ''}`}
                    >
                      <Icon name="Bookmark" size={16} fill={bookmarks[post.id] ? "currentColor" : "none"} />
                    </button>
                    <button className="hover:text-foreground p-1 transition-colors">
                      <Icon name="Share2" size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="space-y-8">
          {/* Welcome/Discovery card */}
          <div className="bg-card border border-border/50 rounded-xl p-6">
            <h3 className="font-heading text-lg font-bold mb-3">Welcome to The Longform</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              A distraction-free zone for immersive reading and independent publishing. Find voices that resonate with you, and write your own stories.
            </p>
            <Link to="/preview/editor">
              <Button fullWidth iconName="PenTool" iconPosition="left">
                Start Writing
              </Button>
            </Link>
          </div>

          {/* Who to follow */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Writers to discover</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80" alt="Sarah Jenkins" className="w-8 h-8 rounded-full object-cover"/>
                  <div>
                    <h4 className="text-sm font-medium">Sarah Jenkins</h4>
                    <p className="text-xs text-muted-foreground">Poetry & Literary criticism</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-7 px-3 text-xs">Follow</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&h=80" alt="Arthur Pendelton" className="w-8 h-8 rounded-full object-cover"/>
                  <div>
                    <h4 className="text-sm font-medium">Arthur Pendelton</h4>
                    <p className="text-xs text-muted-foreground">Historical essays</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-7 px-3 text-xs">Follow</Button>
              </div>
            </div>
          </div>

          {/* Popular tags */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Popular tags</h3>
            <div className="flex flex-wrap gap-2">
              {["writing", "creativity", "poetry", "philosophy", "memoirs", "essays", "culture", "nature"].map((tag) => (
                <span key={tag} className="text-xs px-3 py-1 bg-card border border-border/60 text-foreground rounded-full hover:bg-muted hover:border-primary/30 transition-all cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FeedPreview;
