import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../store/authSlice';
import { selectIsFollowing, toggleSubscription } from '../../store/subscriptionsSlice';
import { fetchProfile, fetchAuthorPublishedPosts, fetchMyPosts, fetchFollowerStats } from '../../lib/queries';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  
  const [activeTab, setActiveTab] = useState('published');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);

  // We need the profile's user ID to check if following
  const isFollowing = useSelector(state => 
    profile ? selectIsFollowing(state, profile.id) : false
  );

  const isOwnProfile = currentUser && profile && currentUser.id === profile.id;

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Fetch Profile
        const { data: profileData, error: profileError } = await fetchProfile(username);
        if (profileError || !profileData) {
          throw new Error('Profile not found');
        }
        setProfile(profileData);

        // 2. Fetch Stats
        const statsData = await fetchFollowerStats(profileData.id);
        setStats(statsData);

        // 3. Fetch Posts
        let postsData = [];
        if (currentUser && currentUser.id === profileData.id) {
          // Own profile: fetch drafts + published
          const { data } = await fetchMyPosts(profileData.id);
          postsData = data || [];
        } else {
          // Other profile: fetch only published
          const { data } = await fetchAuthorPublishedPosts(profileData.id);
          postsData = data || [];
        }
        setPosts(postsData);

      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (username) {
      loadData();
    }
  }, [username, currentUser]);

  const handleToggleFollow = async () => {
    if (!currentUser) {
      navigate('/auth/login');
      return;
    }
    if (!profile) return;
    
    setIsTogglingFollow(true);
    try {
      await dispatch(toggleSubscription({
        subscriberId: currentUser.id,
        authorId: profile.id,
        isFollowing
      })).unwrap();
      
      // Optimistically update local follower count
      setStats(prev => ({
        ...prev,
        followers: isFollowing ? prev.followers - 1 : prev.followers + 1
      }));
    } catch (err) {
      console.error('Failed to toggle follow:', err);
    } finally {
      setIsTogglingFollow(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-lato text-muted-foreground animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Icon name="UserX" size={48} className="text-muted-foreground mb-4 opacity-50" />
        <h2 className="text-2xl font-heading font-black mb-2">Profile Not Found</h2>
        <p className="text-muted-foreground mb-6">The user @{username} doesn't exist or may have been removed.</p>
        <Button onClick={() => navigate('/feed')}>Return to Feed</Button>
      </div>
    );
  }

  const publishedPosts = posts.filter(p => p.status === 'published' || p.published_at);
  const draftPosts = posts.filter(p => p.status === 'draft' && !p.published_at);
  
  const displayedPosts = activeTab === 'published' ? publishedPosts : draftPosts;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border py-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <Link to={currentUser ? "/feed" : "/discover"} className="font-heading text-2xl font-black tracking-tight text-foreground hover:opacity-90">
            The <span className="text-primary">Longform</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/feed" className="font-medium text-muted-foreground hover:text-foreground transition-colors">Feed</Link>
            <Link to="/discover" className="font-medium text-muted-foreground hover:text-foreground transition-colors">Discover</Link>
            {currentUser && <Link to="/bookmarks" className="font-medium text-muted-foreground hover:text-foreground transition-colors">Bookmarks</Link>}
            {currentUser && (
              <Link to="/write" className="font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <Icon name="PenTool" size={16} /> Write
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <Link to={`/@${currentUser.username}`}>
                <img 
                  src={currentUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.display_name || currentUser.username)}&background=random`} 
                  alt="My profile" 
                  className="w-8 h-8 rounded-full border border-primary ring-2 ring-primary/20"
                />
              </Link>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate('/auth/login')}>Log In</Button>
            )}
          </div>
        </div>
      </header>

      {/* Profile Info Section */}
      <section className="bg-muted/10 border-b border-border/40 py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          <img 
            src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name || profile.username)}&background=random`} 
            alt={profile.display_name} 
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-border shadow"
          />
          <div className="flex-1 text-center md:text-left space-y-4 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-3xl font-black">{profile.display_name}</h1>
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
              </div>
              <div className="flex justify-center gap-2">
                {isOwnProfile ? (
                  <Button variant="outline" size="sm" iconName="Edit3" onClick={() => navigate('/settings')}>
                    Edit Profile
                  </Button>
                ) : (
                  <Button 
                    variant={isFollowing ? "outline" : "default"} 
                    size="sm" 
                    onClick={handleToggleFollow}
                    disabled={isTogglingFollow}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>
            </div>
            
            <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
              {profile.bio || 'This author has not added a bio yet.'}
            </p>

            <div className="flex justify-center md:justify-start space-x-6 text-sm text-muted-foreground">
              <span><strong className="text-foreground">{stats.followers}</strong> followers</span>
              <span><strong className="text-foreground">{stats.following}</strong> following</span>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Tabs & Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12 space-y-8">
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
            Published ({publishedPosts.length})
          </button>
          
          {isOwnProfile && (
            <button 
              onClick={() => setActiveTab('draft')}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'draft' 
                  ? 'border-primary text-foreground font-semibold' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="FileText" size={16} />
              Drafts ({draftPosts.length})
            </button>
          )}
        </div>

        {/* Tab Contents */}
        <div className="space-y-6">
          {displayedPosts.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border/50 rounded-xl">
              <Icon name="Inbox" size={36} className="text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No {activeTab} posts found.</p>
            </div>
          ) : (
            displayedPosts.map((post) => (
              <div key={post.id} className="bg-card border border-border/40 hover:border-border rounded-xl p-6 transition-all duration-300 relative group flex flex-col justify-between items-start gap-4">
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="px-2 py-0.5 bg-muted rounded text-[10px] uppercase font-bold text-muted-foreground">{post.category || 'Uncategorized'}</span>
                    <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}</span>
                  </div>

                  <Link 
                    to={post.status === 'draft' ? `/write/${post.id}` : `/post/${post.slug}`}
                    className="block hover:text-primary transition-colors"
                  >
                    <h3 className="font-heading text-lg lg:text-xl font-bold leading-tight">
                      {post.title || 'Untitled Draft'}
                    </h3>
                  </Link>

                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {post.excerpt || 'No excerpt provided.'}
                  </p>
                </div>

                <div className="w-full flex items-center justify-between pt-2 border-t border-border/20 text-xs text-muted-foreground">
                  <span>{post.reading_time || 1} min read</span>
                  
                  {post.status === 'published' ? (
                    <div className="flex items-center space-x-4">
                      {/* TODO: Add real like/comment counts once those tables are fully wired to the UI */}
                      <span className="flex items-center gap-1"><Icon name="Heart" size={12} /> Like</span>
                      <span className="flex items-center gap-1"><Icon name="MessageSquare" size={12} /> Comment</span>
                    </div>
                  ) : (
                    <Link to={`/write/${post.id}`} className="text-primary hover:underline font-semibold flex items-center gap-1">
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

export default Profile;
