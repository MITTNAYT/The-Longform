import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const FeaturedPost = () => {
  const featuredPost = {
    id: 1,
    title: "The Art of Solitude: Finding Peace in Quiet Moments",
    excerpt: `In a world that never stops talking, we've forgotten the profound beauty of silence. This evening, as I sit by my window watching the city lights flicker like distant stars, I'm reminded of how solitude isn't loneliness—it's a conversation with our deepest selves.`,
    author: "Ismail Ismail",
    authorAvatar: "II",
    publishedAt: "2025-01-10",
    readingTime: 8,
    category: "Reflection",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&h=600&fit=crop&crop=center",
  };

  return (
    <section className="py-14 lg:py-20 border-y border-border/50">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-5 h-5 rounded-md bg-accent/15 flex items-center justify-center">
            <Icon name="Pin" size={11} className="text-accent" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Featured Essay</span>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        <article className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-center">
          {/* Text column */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span className="badge-accent">{featuredPost.category}</span>
              <span className="text-muted-foreground/40 text-xs">·</span>
              <span className="text-xs text-muted-foreground font-medium">
                {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
              <span className="text-muted-foreground/40 text-xs">·</span>
              <span className="text-xs text-muted-foreground font-medium">{featuredPost.readingTime} min read</span>
            </div>

            {/* Title */}
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-5">
              {featuredPost.title}
            </h2>

            {/* Excerpt */}
            <p className="text-base text-muted-foreground leading-[1.8] mb-8 font-body">
              {featuredPost.excerpt}
            </p>

            {/* Author + CTA */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary/80 flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {featuredPost.authorAvatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-none mb-0.5">{featuredPost.author}</p>
                  <p className="text-xs text-muted-foreground">Author</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="btn-ghost-sm" aria-label="Like">
                  <Icon name="Heart" size={15} />
                </button>
                <button className="btn-ghost-sm" aria-label="Bookmark">
                  <Icon name="Bookmark" size={15} />
                </button>
                <Link
                  to="/discover"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all duration-200 ml-1"
                >
                  Read essay
                  <Icon name="ArrowRight" size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Image column */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-2xl aspect-[4/5] lg:aspect-[3/4]"
              style={{ boxShadow: '0 8px 40px -8px rgba(28,20,16,0.2)' }}>
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              {/* Category badge on image */}
              <div className="absolute top-4 left-4">
                <span className="badge-dark text-[10px]">{featuredPost.category}</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default FeaturedPost;