import React from 'react';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PostCard = ({ post }) => {
  return (
    <article className="bg-card border border-border rounded-lg overflow-hidden shadow-gentle hover:shadow-warm transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <Image
          src={post?.image}
          alt={post?.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="text-xs font-caption text-white bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
            {post?.category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Icon name="Calendar" size={14} />
            <time dateTime={post?.publishedAt}>
              {new Date(post.publishedAt)?.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Clock" size={14} />
            <span>{post?.readingTime} min read</span>
          </div>
        </div>

        <h3 className="font-heading text-xl font-semibold text-card-foreground mb-3 leading-tight group-hover:text-primary transition-colors duration-200">
          {post?.title}
        </h3>

        <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
          {post?.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            iconName="ArrowRight"
            iconPosition="right"
            className="text-primary hover:text-accent"
          >
            Continue Reading
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Icon name="Heart" size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Icon name="Bookmark" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;