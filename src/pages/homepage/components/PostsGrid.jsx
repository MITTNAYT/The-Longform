import React, { useState } from 'react';
import PostCard from './PostCard';
import Icon from '../../../components/AppIcon';

const PostsGrid = () => {
  const [visiblePosts, setVisiblePosts] = useState(6);

  const posts = [
    {
      id: 2,
      title: "Midnight Musings on Love",
      excerpt: "When the world sleeps, hearts speak their truest language. Tonight I write about the love that exists in silence, in stolen glances, in the space between words that say everything we cannot.",
      author: "Ismail Ismail",
      publishedAt: "2025-01-08",
      readingTime: 5,
      category: "Poetry",
      image: "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?w=600&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Letters to My Younger Self",
      excerpt: "If I could whisper across time to the boy I once was, sitting in his childhood bedroom dreaming of tomorrow, what would I say? Perhaps that the path isn't straight, but it's beautiful.",
      author: "Ismail Ismail",
      publishedAt: "2025-01-05",
      readingTime: 7,
      category: "Personal",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop"
    },
    {
      id: 4,
      title: "The Weight of Words",
      excerpt: "Every word carries the weight of intention, the gravity of meaning. In this digital age where words fly faster than thoughts, I pause to consider the responsibility we bear as wielders of language.",
      author: "Ismail Ismail",
      publishedAt: "2025-01-03",
      readingTime: 6,
      category: "Writing",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
    },
    {
      id: 5,
      title: "Dancing with Shadows",
      excerpt: "In darkness, we find our light. This poem explores the beauty of embracing our shadows, the parts of ourselves we often hide, and discovering that wholeness comes from accepting all facets of our being.",
      author: "Ismail Ismail",
      publishedAt: "2025-01-01",
      readingTime: 4,
      category: "Poetry",
      image: "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?w=600&h=400&fit=crop"
    },
    {
      id: 6,
      title: "The Quiet Revolution",
      excerpt: "Change begins in whispers, in the quiet moments when we decide to be different. This reflection on personal transformation explores how the most profound revolutions happen within.",
      author: "Ismail Ismail",
      publishedAt: "2024-12-28",
      readingTime: 8,
      category: "Reflection",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop"
    },
    {
      id: 7,
      title: "Conversations with the Moon",
      excerpt: "Each night, I find myself in dialogue with the moon, sharing secrets that daylight cannot hold. These nocturnal conversations have become my most honest form of prayer.",
      author: "Ismail Ismail",
      publishedAt: "2024-12-25",
      readingTime: 5,
      category: "Poetry",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
    },
    {
      id: 8,
      title: "The Art of Letting Go",
      excerpt: "Release is not abandonment; it's trust. In learning to let go, we discover that some things are meant to flow through our lives like water, leaving us changed but not empty.",
      author: "Ismail Ismail",
      publishedAt: "2024-12-22",
      readingTime: 6,
      category: "Personal",
      image: "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?w=600&h=400&fit=crop"
    },
    {
      id: 9,
      title: "Fragments of Memory",
      excerpt: "Memory is not a photograph but a painting, each recollection adding new brushstrokes to the canvas of our past. Tonight I explore how our memories shape and reshape themselves.",
      author: "Ismail Ismail",
      publishedAt: "2024-12-20",
      readingTime: 7,
      category: "Reflection",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop"
    }
  ];

  const loadMorePosts = () => {
    setVisiblePosts(prev => Math.min(prev + 3, posts.length));
  };

  return (
    <section className="py-14 lg:py-20">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-md bg-foreground/8 flex items-center justify-center">
              <Icon name="Feather" size={11} className="text-muted-foreground" />
            </div>
            <h2 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
              Latest Thoughts
            </h2>
          </div>
          <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors font-medium">
            <Icon name="Rss" size={13} />
            RSS Feed
          </button>
        </div>

        {/* Feed List */}
        <div className="space-y-4">
          {posts.slice(0, visiblePosts).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Load More */}
        {visiblePosts < posts.length && (
          <div className="text-center mt-12">
            <button
              onClick={loadMorePosts}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border/80 text-sm font-medium text-foreground hover:bg-muted/40 hover:border-accent/30 transition-all duration-200"
            >
              Load more posts
              <Icon name="ChevronDown" size={15} />
            </button>
          </div>
        )}

        {/* End state */}
        {visiblePosts >= posts.length && (
          <div className="text-center mt-14">
            <div className="divider-ornament text-xs text-muted-foreground/60">
              <span className="px-4 font-medium tracking-wider">You're all caught up</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Discover more in the{' '}
              <a href="/discover" className="text-accent hover:text-accent/80 font-medium transition-colors">
                explore section
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PostsGrid;