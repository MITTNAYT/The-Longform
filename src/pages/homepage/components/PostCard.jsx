import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const PostCard = ({ post }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const postSlug = post?.slug || post?.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'post';

  return (
    <article className="group py-8 first:pt-2 border-b border-[#E0D9CE] bg-transparent transition-all duration-300">
      <div className="flex flex-col-reverse sm:flex-row gap-6 lg:gap-8 items-start justify-between">
        
        {/* Content Column */}
        <div className="flex-1 min-w-0 space-y-3">
          
          {/* Metadata Top Bar */}
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#78716C]">
            <Link
              to={`/discover?tag=${post?.category?.toLowerCase() || 'essays'}`}
              className="text-[#9C6B3C] hover:underline"
            >
              {post?.category || 'ESSAY'}
            </Link>
            <span>·</span>
            <span>{post?.readingTime || 5} MIN READ</span>
            <span>·</span>
            <time dateTime={post?.publishedAt}>
              {post?.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'RECENT'}
            </time>
          </div>

          {/* Title */}
          <Link to={`/post/${postSlug}`} className="block">
            <h2 className="font-heading text-xl sm:text-2xl font-normal text-[#1C1917] leading-[1.3] group-hover:text-[#9C6B3C] transition-colors">
              {post?.title}
            </h2>
          </Link>

          {/* Excerpt */}
          <p className="font-body text-sm text-[#44372A] line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {post?.excerpt}
          </p>

          {/* Author and Action bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 font-mono text-xs text-[#78716C]">
              <span>By</span>
              <span className="text-[#1C1917] font-medium">{post?.author || 'Ismail Ismail'}</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsLiked(!isLiked);
                }}
                className={`font-mono text-xs flex items-center gap-1.5 transition-colors ${
                  isLiked ? 'text-[#991B1B]' : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
                aria-label="Applaud"
              >
                <Icon name="Heart" size={14} className={isLiked ? 'fill-current' : ''} />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsSaved(!isSaved);
                }}
                className={`font-mono text-xs flex items-center gap-1.5 transition-colors ${
                  isSaved ? 'text-[#9C6B3C]' : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
                aria-label="Bookmark"
              >
                <Icon name="Bookmark" size={14} className={isSaved ? 'fill-current' : ''} />
              </button>
            </div>
          </div>

        </div>

        {/* Thumbnail Image */}
        {post?.image && (
          <Link
            to={`/post/${postSlug}`}
            className="w-full sm:w-44 md:w-52 aspect-[16/10] sm:aspect-[4/3] flex-shrink-0 overflow-hidden border border-[#E0D9CE] bg-[#EDE8E0] block"
          >
            <Image
              src={post?.image}
              alt={post?.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </Link>
        )}

      </div>
    </article>
  );
};

export default PostCard;