import React, { useState } from 'react';
import PostCard from './PostCard';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PostsGrid = () => {
  const [visiblePosts, setVisiblePosts] = useState(6);

  const posts = [
    {
      id: 2,
      title: "Midnight Musings on Love",
      excerpt: "When the world sleeps, hearts speak their truest language. Tonight I write about the love that exists in silence, in stolen glances, in the space between words that say everything we cannot.",
      author: "Elena Rodriguez",
      publishedAt: "2025-01-08",
      readingTime: 5,
      category: "Poetry",
      image: "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Letters to My Younger Self",
      excerpt: "If I could whisper across time to the girl I once was, sitting in her childhood bedroom dreaming of tomorrow, what would I say? Perhaps that the path isn't straight, but it's beautiful.",
      author: "Elena Rodriguez",
      publishedAt: "2025-01-05",
      readingTime: 7,
      category: "Personal",
      image: "https://images.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_1280.jpg?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      title: "The Weight of Words",
      excerpt: "Every word carries the weight of intention, the gravity of meaning. In this digital age where words fly faster than thoughts, I pause to consider the responsibility we bear as wielders of language.",
      author: "Elena Rodriguez",
      publishedAt: "2025-01-03",
      readingTime: 6,
      category: "Writing",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      title: "Dancing with Shadows",
      excerpt: "In darkness, we find our light. This poem explores the beauty of embracing our shadows, the parts of ourselves we often hide, and discovering that wholeness comes from accepting all facets of our being.",
      author: "Elena Rodriguez",
      publishedAt: "2025-01-01",
      readingTime: 4,
      category: "Poetry",
      image: "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?w=400&h=300&fit=crop"
    },
    {
      id: 6,
      title: "The Quiet Revolution",
      excerpt: "Change begins in whispers, in the quiet moments when we decide to be different. This reflection on personal transformation explores how the most profound revolutions happen within.",
      author: "Elena Rodriguez",
      publishedAt: "2024-12-28",
      readingTime: 8,
      category: "Reflection",
      image: "https://images.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_1280.jpg?w=400&h=300&fit=crop"
    },
    {
      id: 7,
      title: "Conversations with the Moon",
      excerpt: "Each night, I find myself in dialogue with the moon, sharing secrets that daylight cannot hold. These nocturnal conversations have become my most honest form of prayer.",
      author: "Elena Rodriguez",
      publishedAt: "2024-12-25",
      readingTime: 5,
      category: "Poetry",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
    },
    {
      id: 8,
      title: "The Art of Letting Go",
      excerpt: "Release is not abandonment; it's trust. In learning to let go, we discover that some things are meant to flow through our lives like water, leaving us changed but not empty.",
      author: "Elena Rodriguez",
      publishedAt: "2024-12-22",
      readingTime: 6,
      category: "Personal",
      image: "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?w=400&h=300&fit=crop"
    },
    {
      id: 9,
      title: "Fragments of Memory",
      excerpt: "Memory is not a photograph but a painting, each recollection adding new brushstrokes to the canvas of our past. Tonight I explore how our memories shape and reshape themselves.",
      author: "Elena Rodriguez",
      publishedAt: "2024-12-20",
      readingTime: 7,
      category: "Reflection",
      image: "https://images.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_1280.jpg?w=400&h=300&fit=crop"
    }
  ];

  const loadMorePosts = () => {
    setVisiblePosts(prev => Math.min(prev + 3, posts?.length));
  };

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
            Latest Thoughts
          </h2>
          <Button variant="ghost" iconName="Rss" iconPosition="left">
            RSS Feed
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {posts?.slice(0, visiblePosts)?.map((post) => (
            <PostCard key={post?.id} post={post} />
          ))}
        </div>

        {visiblePosts < posts?.length && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              onClick={loadMorePosts}
              iconName="ChevronDown"
              iconPosition="right"
            >
              Load More Posts
            </Button>
          </div>
        )}

        {visiblePosts >= posts?.length && (
          <div className="text-center mt-12 p-8 bg-muted/30 rounded-lg">
            <Icon name="BookOpen" size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              You've reached the end of our latest thoughts. 
              <Button variant="link" className="ml-1">
                Browse the archives
              </Button>
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PostsGrid;