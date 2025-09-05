import React from 'react';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const RecentComments = () => {
  const recentComments = [
    {
      id: 1,
      author: "Sarah Chen",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      comment: "Your words about solitude really resonated with me. Thank you for sharing such intimate thoughts.",
      postTitle: "The Art of Solitude",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      author: "Michael Rodriguez",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      comment: "This poem brought tears to my eyes. The imagery of dancing with shadows is so powerful.",
      postTitle: "Dancing with Shadows",
      timestamp: "5 hours ago"
    },
    {
      id: 3,
      author: "Emma Thompson",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      comment: "I\'ve been following your writing for months now. Each piece feels like a conversation with a dear friend.",
      postTitle: "Letters to My Younger Self",
      timestamp: "1 day ago"
    },
    {
      id: 4,
      author: "David Park",
      avatar: "https://randomuser.me/api/portraits/men/33.jpg",
      comment: "Your perspective on letting go has helped me through a difficult time. Thank you.",
      postTitle: "The Art of Letting Go",
      timestamp: "2 days ago"
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-heading font-semibold text-lg text-card-foreground mb-4 flex items-center gap-2">
        <Icon name="MessageCircle" size={20} />
        Recent Comments
      </h3>
      <div className="space-y-4">
        {recentComments?.map((comment) => (
          <div key={comment?.id} className="flex gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors duration-200">
            <div className="flex-shrink-0">
              <Image
                src={comment?.avatar}
                alt={comment?.author}
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm text-card-foreground truncate">
                  {comment?.author}
                </span>
                <span className="text-xs text-muted-foreground">
                  {comment?.timestamp}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {comment?.comment}
              </p>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-auto p-1 text-accent hover:text-accent-foreground"
              >
                on "{comment?.postTitle}"
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <Button variant="ghost" size="sm" className="w-full justify-start" iconName="MessageSquare">
          View All Comments
        </Button>
      </div>
    </div>
  );
};

export default RecentComments;