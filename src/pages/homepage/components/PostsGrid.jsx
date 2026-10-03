import React, { useState } from 'react';
import PostCard from './PostCard';
import Icon from '../../../components/AppIcon';

const PostsGrid = () => {
  const [visiblePosts, setVisiblePosts] = useState(6);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const posts = [
    {
      id: 2,
      slug: "midnight-musings-on-love",
      title: "Midnight Musings on Love and Temporality",
      excerpt: "When the world sleeps, hearts speak their truest language. Tonight I write about the love that exists in silence, in stolen glances, in the space between words that say everything we cannot.",
      author: "Elena Rostova",
      publishedAt: "2025-01-08",
      readingTime: 5,
      category: "Poetry",
      image: "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?w=600&h=400&fit=crop"
    },
    {
      id: 3,
      slug: "letters-to-my-younger-self",
      title: "Letters to My Younger Self: On The Craft of Patience",
      excerpt: "If I could whisper across time to the boy I once was, sitting in his childhood bedroom dreaming of tomorrow, what would I say? Perhaps that the path isn't straight, but it's beautiful.",
      author: "Ismail Ismail",
      publishedAt: "2025-01-05",
      readingTime: 7,
      category: "Personal",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop"
    },
    {
      id: 4,
      slug: "the-weight-of-words",
      title: "The Weight of Words in a Fragmented Epoch",
      excerpt: "Every word carries the weight of intention, the gravity of meaning. In this digital age where words fly faster than thoughts, I pause to consider the responsibility we bear as wielders of language.",
      author: "Marcus Vance",
      publishedAt: "2025-01-03",
      readingTime: 6,
      category: "Writing",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
    },
    {
      id: 5,
      slug: "dancing-with-shadows",
      title: "Dancing with Shadows: The Architecture of Winter",
      excerpt: "In darkness, we find our light. This poem explores the beauty of embracing our shadows, the parts of ourselves we often hide, and discovering that wholeness comes from accepting all facets of our being.",
      author: "Ismail Ismail",
      publishedAt: "2025-01-01",
      readingTime: 4,
      category: "Poetry",
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=400&fit=crop"
    },
    {
      id: 6,
      slug: "the-quiet-revolution",
      title: "The Quiet Revolution of Unhurried Thought",
      excerpt: "Change begins in whispers, in the quiet moments when we decide to be different. This reflection on personal transformation explores how the most profound revolutions happen within.",
      author: "Claire Sterling",
      publishedAt: "2024-12-28",
      readingTime: 8,
      category: "Reflection",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop"
    },
    {
      id: 7,
      slug: "conversations-with-the-moon",
      title: "Nocturnes: Conversations with the Moon",
      excerpt: "Each night, I find myself in dialogue with the moon, sharing secrets that daylight cannot hold. These nocturnal conversations have become my most honest form of prayer.",
      author: "Ismail Ismail",
      publishedAt: "2024-12-25",
      readingTime: 5,
      category: "Poetry",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
    },
    {
      id: 8,
      slug: "the-art-of-letting-go",
      title: "The Art of Letting Go: An Archaeology of Loss",
      excerpt: "Release is not abandonment; it's trust. In learning to let go, we discover that some things are meant to flow through our lives like water, leaving us changed but not empty.",
      author: "Ismail Ismail",
      publishedAt: "2024-12-22",
      readingTime: 6,
      category: "Reflection",
      image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&h=400&fit=crop"
    },
    {
      id: 9,
      slug: "fragments-of-memory",
      title: "Fragments of Memory in the High Desert",
      excerpt: "Memory is not a photograph but a painting, each recollection adding new brushstrokes to the canvas of our past. Tonight I explore how our memories shape and reshape themselves.",
      author: "Julian Thorne",
      publishedAt: "2024-12-20",
      readingTime: 7,
      category: "Essays",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop"
    }
  ];

  const filterTabs = ['ALL', 'ESSAYS', 'POETRY', 'REFLECTION', 'PERSONAL'];

  const filteredPosts = activeFilter === 'ALL'
    ? posts
    : posts.filter(p => p.category.toUpperCase() === activeFilter);

  const loadMorePosts = () => {
    setVisiblePosts(prev => Math.min(prev + 3, filteredPosts.length));
  };

  return (
    <div className="space-y-6">
      {/* Section Header with Atmos-style filter navigation */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E0D9CE]">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9C6B3C] block mb-1">
            INDEXED CHRONOLOGY
          </span>
          <h2 className="font-heading text-2xl lg:text-3xl font-normal text-[#1C1917]">
            Recent Stories & Dispatches
          </h2>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveFilter(tab);
                setVisiblePosts(6);
              }}
              className={`font-mono text-[11px] tracking-[0.16em] uppercase whitespace-nowrap pb-1 border-b transition-colors ${
                activeFilter === tab
                  ? 'border-[#1C1917] text-[#1C1917] font-medium'
                  : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Feed List */}
      <div className="divide-y divide-transparent">
        {filteredPosts.slice(0, visiblePosts).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Load More */}
      {visiblePosts < filteredPosts.length && (
        <div className="text-center pt-8">
          <button
            onClick={loadMorePosts}
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#1C1917] font-mono text-xs uppercase tracking-[0.18em] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#F8F5F0] transition-all duration-200"
          >
            <span>Load More Dispatches</span>
            <Icon name="ArrowDown" size={13} />
          </button>
        </div>
      )}

      {/* End state */}
      {visiblePosts >= filteredPosts.length && (
        <div className="text-center pt-10 pb-4">
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#78716C]">
            — End of Current Archive —
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsGrid;