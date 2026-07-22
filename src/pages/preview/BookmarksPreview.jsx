import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SearchInterface from '../../components/ui/SearchInterface';

const BookmarksPreview = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([
    {
      id: '1',
      title: "The Solitude of Quiet Hours",
      excerpt: "In the depth of night, the noise of the day fades away. We are left with our own reflections, the creak of the floorboards, and the raw, unfiltered truth of who we are when no one is watching.",
      author: {
        name: "Julian Sterling",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150"
      },
      publishedAt: "Jan 18, 2026",
      readingTime: "4 min read",
      category: "Poetry"
    },
    {
      id: '3',
      title: "The Architecture of a Sentence: On Craft",
      excerpt: "We often talk about what we want to say, but rarely how we construct the vessel for it. Let's dissect the simple sentence and analyze how punctuation alters the emotional resonance of a thought.",
      author: {
        name: "Marcus Vance",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150"
      },
      publishedAt: "Jan 16, 2026",
      readingTime: "8 min read",
      category: "Writing"
    }
  ]);

  const handleRemoveBookmark = (id) => {
    setBookmarkedPosts(prev => prev.filter(post => post.id !== id));
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border py-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <Link to="/preview/feed" className="font-heading text-2xl font-black tracking-tight text-foreground hover:opacity-90">
            The <span className="text-primary">Longform</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/preview/feed" className="font-medium text-muted-foreground hover:text-foreground transition-colors">Feed</Link>
            <Link to="/preview/discover" className="font-medium text-muted-foreground hover:text-foreground transition-colors">Discover</Link>
            <Link to="/preview/bookmarks" className="font-medium text-foreground border-b-2 border-primary pb-1">Bookmarks</Link>
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

      {/* Bookmarks Layout */}
      <main className="max-w-3xl mx-auto px-4 py-16 space-y-10">
        <div className="border-b border-border pb-4 flex items-center justify-between">
          <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
            <Icon name="Bookmark" size={28} className="text-primary" />
            Saved Bookmarks
          </h1>
          <span className="text-xs font-semibold px-2.5 py-1 bg-muted text-muted-foreground rounded-full">
            {bookmarkedPosts.length} post{bookmarkedPosts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {bookmarkedPosts.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border/50 rounded-xl p-8">
            <Icon name="Bookmark" size={48} className="text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-lg mb-1">No bookmarked posts</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Articles and essays you save will show up here. Browse the discover page to find writers you like!
            </p>
            <Link to="/preview/discover">
              <Button variant="default">Browse Discover</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookmarkedPosts.map((post) => (
              <div key={post.id} className="bg-card border border-border/40 hover:border-border rounded-xl p-6 transition-all duration-300 relative group flex flex-col md:flex-row gap-6 justify-between items-start">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full object-cover border border-border" />
                    <span className="font-medium text-foreground">{post.author.name}</span>
                    <span>•</span>
                    <span>{post.publishedAt}</span>
                  </div>
                  
                  <Link to="/preview/post" className="block hover:text-primary transition-colors">
                    <h3 className="font-heading text-lg lg:text-xl font-bold leading-tight">
                      {post.title}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-muted-foreground pt-2">
                    <span className="px-2 py-0.5 bg-muted rounded text-[10px] uppercase font-bold text-muted-foreground">{post.category}</span>
                    <span>{post.readingTime}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 md:self-stretch justify-end md:flex-col md:justify-start">
                  <button 
                    onClick={() => handleRemoveBookmark(post.id)}
                    className="p-2 text-primary hover:text-red-500 rounded-md hover:bg-muted/80 transition-colors"
                    title="Remove Bookmark"
                  >
                    <Icon name="BookmarkX" size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BookmarksPreview;
