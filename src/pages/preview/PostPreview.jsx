import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SearchInterface from '../../components/ui/SearchInterface';

const PostPreview = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    {
      id: '1',
      author: {
        name: "Claire Bennett",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80"
      },
      content: "This is deeply moving. The line about the streetlights reflecting neon like a broken mirror is gorgeous. It captures that exact late-night city feeling perfectly.",
      createdAt: "3 hours ago",
      replies: [
        {
          id: '1-1',
          author: {
            name: "Julian Sterling",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80"
          },
          content: "Thank you, Claire. I wrote that right after the midnight storm cleared. It felt like the city was holding its breath.",
          createdAt: "2 hours ago"
        }
      ]
    },
    {
      id: '2',
      author: {
        name: "David Vance",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&h=80"
      },
      content: "Excellent formatting. The serif font choice here is perfect for readability. I find myself lingering on every stanza.",
      createdAt: "5 hours ago",
      replies: []
    }
  ]);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: String(comments.length + 1),
      author: {
        name: "Reader Guest",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80"
      },
      content: commentText,
      createdAt: "Just now",
      replies: []
    };

    setComments([newComment, ...comments]);
    setCommentText('');
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
            <Link to="/preview/feed" className="font-medium text-muted-foreground hover:text-foreground transition-colors">Feed</Link>
            <Link to="/preview/discover" className="font-medium text-muted-foreground hover:text-foreground transition-colors">Discover</Link>
            <Link to="/preview/bookmarks" className="font-medium text-muted-foreground hover:text-foreground transition-colors">Bookmarks</Link>
            <Link to="/preview/editor" className="font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Icon name="PenTool" size={16} /> Write
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <SearchInterface />
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

      {/* Main Layout */}
      <article className="max-w-3xl mx-auto px-4 py-16">
        
        {/* Navigation Breadcrumb */}
        <Link to="/preview/feed" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-12 gap-1.5 group transition-colors">
          <Icon name="ArrowLeft" size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to feed</span>
        </Link>

        {/* Post Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider">
              Poetry
            </span>
            <span className="text-xs text-muted-foreground">4 min read</span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-8">
            The Solitude of Quiet Hours
          </h1>

          {/* Author info & Follow option */}
          <div className="flex items-center justify-between border-y border-border/40 py-6">
            <div className="flex items-center space-x-4">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150" 
                alt="Julian Sterling" 
                className="w-12 h-12 rounded-full object-cover border border-border"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground text-base">Julian Sterling</h3>
                  <button className="text-xs text-primary font-semibold hover:underline">Follow</button>
                </div>
                <p className="text-xs text-muted-foreground">Published in <span className="font-medium text-foreground">The Night Musings</span> • Jan 18, 2026</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button 
                variant={isLiked ? "default" : "outline"} 
                size="sm" 
                onClick={handleLike}
                iconName="Heart"
              >
                {isLiked ? "Liked" : "Like"}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBookmark}
                iconName="Bookmark"
                className={isBookmarked ? "text-primary" : ""}
              />
              <Button variant="ghost" size="icon" iconName="Share2" />
            </div>
          </div>
        </header>

        {/* Post Content (Elegant Serif Typography) */}
        <section className="prose max-w-none mb-16">
          <p>
            There is a distinct weight to the silence of two in the morning. The buzz of appliances, the distant murmur of traffic, even the rustle of leaves outside—they all resolve into a singular, thick hush. 
          </p>

          <p>
            It is in this space that the mind stops performing. We are no longer employees, partners, neighbors, or friends. We are merely observers of the passing night, watching the hours slide past like shadows on the wall.
          </p>

          <blockquote className="border-l-4 border-primary pl-6 my-8 italic text-lg text-muted-foreground font-heading">
            "We build houses of logic during the daytime, only to watch them dissolve in the midnight dew."
          </blockquote>

          <p>
            I find that my writing changes during these hours. The defensive editing that usually filters every sentence is asleep. What remains is a raw, slightly desperate urge to communicate—to put ink on paper, to etch a message into the void in the hope that another night-thinker might find it.
          </p>
          
          <h2 className="text-2xl font-bold font-heading text-foreground mt-12 mb-6">The Echoes of Silence</h2>
          
          <p>
            When we write, we create a record of our vulnerability. To write in the dark is to speak without checking if anyone is listening. It is an act of faith, perhaps the only genuine one left.
          </p>

          <p>
            Tomorrow, the sun will rise, the screens will light up, and the noise will return. But for now, the candle burns low, the tea cools, and the page remains open.
          </p>
        </section>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-12 border-b border-border/40 pb-8">
          {["reflection", "solitude", "midnight", "essays", "creativity"].map((tag) => (
            <span key={tag} className="text-xs px-3 py-1 bg-card border border-border/60 text-muted-foreground rounded-full hover:text-foreground cursor-pointer transition-colors">
              #{tag}
            </span>
          ))}
        </div>

        {/* Newsletter CTA at bottom */}
        <section className="bg-card border border-border rounded-xl p-8 text-center my-16">
          <Icon name="Mail" size={36} className="text-primary mx-auto mb-4" />
          <h3 className="font-heading text-xl font-bold mb-2">Subscribe to Julian Sterling</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            Get email notifications whenever Julian publishes a new longform essay or poetry collection. No spam, ever.
          </p>
          <div className="flex max-w-md mx-auto gap-3">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 bg-background border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:border-primary"
            />
            <Button variant="default">Subscribe</Button>
          </div>
        </section>

        {/* Comment Section */}
        <section className="border-t border-border/40 pt-12">
          <h3 className="font-heading text-xl font-bold mb-8">Responses ({comments.length + 1})</h3>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="mb-10">
            <textarea
              rows="4"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Join the conversation..."
              className="w-full bg-card border border-border rounded-lg p-4 text-sm focus:outline-none focus:border-primary resize-none placeholder:text-muted-foreground mb-3"
            />
            <div className="flex justify-end">
              <Button type="submit" variant="default" size="sm">
                Publish Response
              </Button>
            </div>
          </form>

          {/* Comment list */}
          <div className="space-y-8">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-4">
                <div className="bg-card/40 border border-border/30 rounded-lg p-5">
                  <div className="flex items-center space-x-3 mb-3">
                    <img src={comment.author.avatar} alt={comment.author.name} className="w-8 h-8 rounded-full object-cover border border-border" />
                    <div>
                      <h5 className="text-sm font-semibold">{comment.author.name}</h5>
                      <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {comment.content}
                  </p>
                  <div className="flex items-center space-x-4 mt-3 text-xs text-muted-foreground">
                    <button className="hover:text-foreground flex items-center gap-1"><Icon name="Heart" size={12} /> Like</button>
                    <button className="hover:text-foreground flex items-center gap-1"><Icon name="Reply" size={12} /> Reply</button>
                  </div>
                </div>

                {/* Replies Thread */}
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="ml-8 border-l-2 border-border/30 pl-6 space-y-4">
                    <div className="bg-card/20 border border-border/10 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <img src={reply.author.avatar} alt={reply.author.name} className="w-7 h-7 rounded-full object-cover border border-border" />
                        <div>
                          <h5 className="text-xs font-semibold">{reply.author.name}</h5>
                          <span className="text-[10px] text-muted-foreground">{reply.createdAt}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
};

export default PostPreview;
