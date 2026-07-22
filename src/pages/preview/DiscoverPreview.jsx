import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SearchInterface from '../../components/ui/SearchInterface';

const DiscoverPreview = () => {
  const trendingWriters = [
    {
      id: '1',
      name: "Julian Sterling",
      username: "jsterling",
      bio: "Writing essays on midnight solitude, philosophy, and the human condition.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150",
      followers: "2.8k"
    },
    {
      id: '2',
      name: "Ismail Ismail",
      username: "ismail_ismail",
      bio: "Poet and nocturne explorer. Capturing the city streets in quiet verses.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150",
      followers: "1.4k"
    },
    {
      id: '3',
      name: "Marcus Vance",
      username: "marcusv",
      bio: "Grammarian and essayist. Dissecting sentence structures and editorial craft.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150",
      followers: "920"
    }
  ];

  const categories = [
    { name: "Poetry", icon: "Feather", desc: "Syllables from the quiet hours" },
    { name: "Reflection", icon: "Lightbulb", desc: "Introspective thought pieces" },
    { name: "Personal Essay", icon: "Heart", desc: "Honest stories of lived experience" },
    { name: "Writing Craft", icon: "PenTool", desc: "Tips and essays on the act of writing" }
  ];

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
            <Link to="/preview/discover" className="font-medium text-foreground border-b-2 border-primary pb-1">Discover</Link>
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

      {/* Hero Section */}
      <section className="bg-muted/10 py-16 border-b border-border/40 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-black mb-4">Discover The Longform</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Find independent writers, insightful essays, deep reflections, and evocative poetry. Expand your circle.
          </p>
        </div>
      </section>

      {/* Main Discover Layout */}
      <main className="max-w-5xl mx-auto px-4 py-16 space-y-16">
        
        {/* Categories Grid */}
        <section className="space-y-6">
          <h2 className="font-heading text-xl lg:text-2xl font-bold">Browse by Topic</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div key={cat.name} className="bg-card border border-border/50 hover:border-primary/30 rounded-xl p-6 transition-all duration-300 group cursor-pointer">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Icon name={cat.icon} size={20} />
                </div>
                <h3 className="font-heading font-bold text-base mb-1">{cat.name}</h3>
                <p className="text-xs text-muted-foreground">{cat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
          {/* Trending columns / Featured */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="font-heading text-xl lg:text-2xl font-bold">Featured Essays</h2>
            
            <div className="space-y-8">
              {[
                {
                  id: '1',
                  title: "The Architecture of a Sentence: On Craft",
                  excerpt: "We talk about what we want to say, but rarely how we construct the vessel for it. Let's dissect the simple sentence and analyze punctuation's emotional resonance.",
                  author: "Marcus Vance",
                  date: "3 days ago",
                  time: "8 min read"
                },
                {
                  id: '2',
                  title: "Dancing with Shadows",
                  excerpt: "In darkness, we find our light. This poem explores the beauty of embracing our shadows, the parts of ourselves we hide, and accepting all facets of our being.",
                  author: "Ismail Ismail",
                  date: "1 week ago",
                  time: "4 min read"
                }
              ].map((essay) => (
                <div key={essay.id} className="bg-card border border-border/30 rounded-xl p-6 flex flex-col md:flex-row justify-between gap-6 hover:border-border transition-all">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{essay.author}</span>
                      <span>•</span>
                      <span>{essay.date}</span>
                    </div>
                    <Link to="/preview/post" className="block hover:text-primary transition-colors">
                      <h3 className="font-heading text-lg lg:text-xl font-bold">{essay.title}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {essay.excerpt}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground pt-2">
                      <span>{essay.time}</span>
                      <span>•</span>
                      <button className="hover:text-foreground flex items-center gap-1"><Icon name="Heart" size={12} /> 24</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Writers Panel */}
          <div className="space-y-6">
            <h2 className="font-heading text-xl font-bold">Writers to Follow</h2>
            
            <div className="space-y-6">
              {trendingWriters.map((writer) => (
                <div key={writer.id} className="bg-card border border-border/40 rounded-xl p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={writer.avatar} 
                        alt={writer.name} 
                        className="w-10 h-10 rounded-full object-cover border border-border"
                      />
                      <div>
                        <h4 className="font-medium text-sm text-foreground">{writer.name}</h4>
                        <p className="text-xs text-muted-foreground">@{writer.username}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 px-3 text-xs">Follow</Button>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {writer.bio}
                  </p>
                  <div className="text-[10px] text-muted-foreground pt-1 flex items-center gap-1">
                    <Icon name="Users" size={12} />
                    <span>{writer.followers} followers</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DiscoverPreview;
