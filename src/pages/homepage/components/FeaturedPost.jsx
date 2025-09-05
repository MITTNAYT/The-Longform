import React from 'react';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FeaturedPost = () => {
  const featuredPost = {
    id: 1,
    title: "The Art of Solitude: Finding Peace in Quiet Moments",
    excerpt: `In a world that never stops talking, we've forgotten the profound beauty of silence. This evening, as I sit by my window watching the city lights flicker like distant stars, I'm reminded of how solitude isn't loneliness—it's a conversation with our deepest selves.\n\nThere's something magical about the hours between midnight and dawn, when the world holds its breath and allows us to hear our own thoughts clearly. In these moments, we discover truths that daylight often obscures...`,
    author: "Elena Rodriguez",
    publishedAt: "2025-01-10",
    readingTime: 8,
    category: "Reflection",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=center",
    isPinned: true
  };

  return (
    <section className="py-12 lg:py-16 bg-card border-y border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Icon name="Pin" size={20} className="text-accent" />
          <span className="text-sm font-caption text-accent uppercase tracking-wide">Featured Post</span>
        </div>

        <article className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-caption text-accent bg-accent/10 px-3 py-1 rounded-full">
                {featuredPost?.category}
              </span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="Calendar" size={14} />
                <time dateTime={featuredPost?.publishedAt}>
                  {new Date(featuredPost.publishedAt)?.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={14} />
                <span>{featuredPost?.readingTime} min read</span>
              </div>
            </div>

            <h2 className="font-heading text-2xl lg:text-3xl font-bold text-card-foreground mb-4 leading-tight">
              {featuredPost?.title}
            </h2>

            <div className="prose prose-lg text-muted-foreground mb-6 leading-relaxed">
              {featuredPost?.excerpt?.split('\n\n')?.map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <Button 
                variant="default"
                iconName="ArrowRight"
                iconPosition="right"
              >
                Continue Reading
              </Button>

              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon">
                  <Icon name="Heart" size={18} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="Bookmark" size={18} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="Share2" size={18} />
                </Button>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-lg shadow-warm">
              <Image
                src={featuredPost?.image}
                alt={featuredPost?.title}
                className="w-full h-64 lg:h-80 object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default FeaturedPost;