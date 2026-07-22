import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SearchInterface from '../../components/ui/SearchInterface';

const ProfilePreview = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('published');
  
  const user = {
    name: "Ismail Ismail",
    username: "ismail_ismail",
    bio: "Essayist, poet, and nocturnal observer. Crafting reflections from the quiet hours of midnight. Author of the 'Night Musings' series.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150",
    followers: 1242,
    following: 184
  };

  const userPosts = [
    {
      id: '1',
      title: "Nocturne in Black and Gold",
      excerpt: "A poem about the city streets after rain, reflecting the neon signs and headlights like a broken mirror on wet asphalt. How beautiful the decay looks.",
      publishedAt: "Jan 17, 2026",
      readingTime: "2 min read",
      category: "Poetry",
      status: "published"
    },
    {
      id: '2',
      title: "Dancing with Shadows",
      excerpt: "In darkness, we find our light. This poem explores the beauty of embracing our shadows, the parts of ourselves we hide, and accepting all facets.",
      publishedAt: "Jan 01, 2026",
      readingTime: "4 min read",
      category: "Poetry",
      status: "published"
    },
    {
      id: '3',
      title: "Autosaved Midnight Sketch",
      excerpt: "Draft exploring the silence after the rain stops. Why does the night carry such clear clarity compared to the noise of the day?...",
      publishedAt: "Draft (Last saved 5 mins ago)",
      readingTime: "3 min read",
      category: "Reflection",
      status: "draft"
    }
  ];

  const handleEditProfile = () => {
    alert("Simulating edit profile settings!");
  };

  const filteredPosts = userPosts.filter(post => post.status === activeTab);

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
                src={user.avatar} 
                alt="User profile" 
                className="w-8 h-8 rounded-full border border-primary ring-2 ring-primary/20"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Profile Info Section */}
      <section className="bg-muted/10 border-b border-border/40 py-16">
        <div className="max-w-3xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-start gap-8">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-border shadow"
          />
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-3xl font-black">{user.name}</h1>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" iconName="Edit3" onClick={handleEditProfile}>
                  Edit Profile
                </Button>
                <Button variant="ghost" size="icon" iconName="Settings" onClick={() => alert("Settings toggled.")} />
              </div>
            </div>
            
            <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
              {user.bio}
            </p>

            <div className="flex justify-center md:justify-start space-x-6 text-sm text-muted-foreground">
              <span><strong>{user.followers}</strong> followers</span>
              <span><strong>{user.following}</strong> following</span>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Tabs & Content */}
      <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {/* Tab Buttons */}
        <div className="flex border-b border-border">
          <button 
            onClick={() => setActiveTab('published')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-all duration-200 ${
              activeTab === 'published' 
                ? 'border-primary text-foreground font-semibold' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="BookOpen" size={16} />
            Published Posts ({userPosts.filter(p => p.status === 'published').length})
          </button>
          <button 
            onClick={() => setActiveTab('draft')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-all duration-200 ${
              activeTab === 'draft' 
                ? 'border-primary text-foreground font-semibold' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="FileText" size={16} />
            Drafts ({userPosts.filter(p => p.status === 'draft').length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border/50 rounded-xl">
              <Icon name="Inbox" size={36} className="text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No {activeTab} posts found.</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-card border border-border/40 hover:border-border rounded-xl p-6 transition-all duration-300 relative group flex flex-col justify-between items-start gap-4">
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="px-2 py-0.5 bg-muted rounded text-[10px] uppercase font-bold text-muted-foreground">{post.category}</span>
                    <span>{post.publishedAt}</span>
                  </div>

                  <Link 
                    to={post.status === 'draft' ? '/preview/editor' : '/preview/post'}
                    className="block hover:text-primary transition-colors"
                  >
                    <h3 className="font-heading text-lg lg:text-xl font-bold leading-tight">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="w-full flex items-center justify-between pt-2 border-t border-border/20 text-xs text-muted-foreground">
                  <span>{post.readingTime}</span>
                  
                  {post.status === 'published' ? (
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center gap-1"><Icon name="Heart" size={12} /> 48 likes</span>
                      <span className="flex items-center gap-1"><Icon name="MessageSquare" size={12} /> 12 comments</span>
                    </div>
                  ) : (
                    <Link to="/preview/editor" className="text-primary hover:underline font-semibold flex items-center gap-1">
                      <Icon name="Edit" size={12} />
                      Resume Draft
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePreview;
