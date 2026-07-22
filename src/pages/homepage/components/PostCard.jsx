import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const PostCard = ({ post }) => {
  return (
    <article className="group bg-card border border-border/80 hover:border-accent/40 rounded-2xl p-6 transition-all duration-200 shadow-sm hover:shadow-card">
      <div className="flex flex-col sm:flex-row gap-6 items-start justify-between">
        {/* Content Column */}
        <div className="flex-1 min-w-0">
          {/* Author & Publication Info */}
          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground font-medium">
            <img
              src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
              alt={post?.author || 'Ismail Ismail'}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="font-semibold text-foreground">{post?.author || 'Ismail Ismail'}</span>
            <span>·</span>
            <time dateTime={post?.publishedAt}>
              {new Date(post?.publishedAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric'
              })}
            </time>
          </div>

          {/* Title */}
          <Link to={post?.slug ? `/post/${post.slug}` : `/post/${post?.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'post'}`}>
            <h3 className="font-heading text-xl font-bold text-foreground leading-snug mb-2 group-hover:text-accent transition-colors">
              {post?.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
            {post?.excerpt}
          </p>

          {/* Footer Metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-3">
              <Link to="/discover" className="px-2.5 py-0.5 rounded-full bg-muted font-medium text-[11px] text-foreground hover:bg-accent/10 hover:text-accent transition-colors">
                {post?.category}
              </Link>
              <span>{post?.readingTime} min read</span>
            </div>

            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg hover:text-rose-500 hover:bg-rose-500/10 transition-colors" aria-label="Like">
                <Icon name="Heart" size={14} />
              </button>
              <button className="p-1.5 rounded-lg hover:text-accent hover:bg-accent/10 transition-colors" aria-label="Bookmark">
                <Icon name="Bookmark" size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnail Image */}
        {post?.image && (
          <Link to={post?.slug ? `/post/${post.slug}` : `/post/${post?.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'post'}`} className="w-full sm:w-36 h-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-muted border border-border/50 block">
            <Image
              src={post?.image}
              alt={post?.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        )}
      </div>
    </article>
  );
};

export default PostCard;