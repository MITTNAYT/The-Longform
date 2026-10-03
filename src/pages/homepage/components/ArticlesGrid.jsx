import React from 'react';
import { Link } from 'react-router-dom';
import NotionIllustration from '../../../components/NotionIllustration';

const ArticlesGrid = ({ items, className = '' }) => {
  if (!items || items.length === 0) return null;

  // Split into left and right columns for true 2-column staggered masonry rhythm
  const leftCol = items.filter((_, i) => i % 2 === 0);
  const rightCol = items.filter((_, i) => i % 2 !== 0);

  const renderCard = (post, index) => (
    <article
      key={post.id || index}
      className="space-y-4 group mb-14 lg:mb-20"
    >
      {/* Article Image / Notion Illustration Container */}
      <Link
        to={`/post/${post.slug}`}
        className="block overflow-hidden bg-[#FDFCF9] border border-[#E0D9CE]"
      >
        <div className={`w-full overflow-hidden ${post.aspect || 'aspect-[4/3]'} transition-transform duration-700 ease-out group-hover:scale-[1.02]`}>
          {post.illustration ? (
            <NotionIllustration
              name={post.illustration}
              aspect={post.aspect || 'aspect-[4/3]'}
            />
          ) : (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>
      </Link>

      {/* Typewriter Timestamp / Dispatch Stamp */}
      <div className="flex items-center gap-2 font-typewriter text-[11px] text-[#9C6B3C] tracking-widest typewriter-ink">
        <span>[DISPATCH // #{String(index + 1).padStart(2, '0')}]</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#C4A882]/70 inline-block" />
        <span className="font-mono text-[10px] text-[#78716C] uppercase tracking-wider">Nocturne Folio</span>
      </div>

      {/* Article Title & Excerpt */}
      <div className="space-y-2">
        <Link to={`/post/${post.slug}`} className="block">
          <h2 className="font-heading text-2xl lg:text-3xl font-normal text-[#1C1917] leading-[1.25] group-hover:underline decoration-1 underline-offset-4">
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="font-sans text-sm sm:text-base text-[#44372A]/85 leading-relaxed font-light">
            {post.excerpt}
          </p>
        )}
      </div>

      {/* Topics Footer */}
      {post.topics && post.topics.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {post.topics.map((topic, i) => (
            <Link
              key={i}
              to={`/discover?tag=${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#78716C] hover:text-[#9C6B3C] transition-colors"
            >
              {topic}
            </Link>
          ))}
        </div>
      )}
    </article>
  );

  return (
    <div className={`max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12 py-12 lg:py-16 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 lg:gap-20 items-start">
        {/* Left Column */}
        <div className="space-y-4">
          {leftCol.map((post, i) => renderCard(post, i * 2))}
        </div>

        {/* Right Column (Staggered offset) */}
        <div className="space-y-4 md:pt-14">
          {rightCol.map((post, i) => renderCard(post, i * 2 + 1))}
        </div>
      </div>
    </div>
  );
};

export default ArticlesGrid;
