import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import HeroHome from './components/HeroHome';
import ArticlesGrid from './components/ArticlesGrid';
import MagazineSlideshow from './components/MagazineSlideshow';
import TypewriterDesk from './components/TypewriterDesk';
import PodcastBlock from './components/PodcastBlock';
import ThematicFeature from './components/ThematicFeature';
import BiomeBlock from './components/BiomeBlock';
import Footer from './components/Footer';

const Homepage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // First Batch: Intimate reflections, nocturnal poetry, and personal letters
  const firstBatchStories = [
    {
      id: 'story-1',
      slug: 'midnight-musings-on-love',
      title: 'Midnight Musings on Love and Temporality',
      excerpt: 'When the world sleeps, hearts speak their truest language. Tonight I write about the love that exists in silence, in stolen glances, in the space between words that say everything we cannot.',
      topics: ['Poetry', 'Nocturnes'],
      illustration: 'midnight-love',
      aspect: 'aspect-[4/5]'
    },
    {
      id: 'story-2',
      slug: 'letters-to-my-younger-self',
      title: 'Letters to My Younger Self: On The Craft of Patience',
      excerpt: 'If I could whisper across time to the boy I once was, sitting in his childhood bedroom dreaming of tomorrow, what would I say? Perhaps that the path isn’t straight, but it is deeply beautiful.',
      topics: ['Personal History', 'The Craft'],
      illustration: 'letters-desk',
      aspect: 'aspect-[4/3]'
    },
    {
      id: 'story-3',
      slug: 'the-weight-of-words',
      title: 'The Weight of Words in a Fragmented Epoch',
      excerpt: 'Every word carries the weight of intention, the gravity of meaning. In this digital age where words fly faster than thoughts, I pause to consider the responsibility we bear as wielders of language.',
      topics: ['Writing Craft', 'Philosophy'],
      illustration: 'typewriter-craft',
      aspect: 'aspect-[4/3]'
    },
    {
      id: 'story-4',
      slug: 'dancing-with-shadows',
      title: 'Dancing with Shadows: The Architecture of Winter',
      excerpt: 'In darkness, we find our light. This poem explores the beauty of embracing our shadows, the parts of ourselves we often hide, and discovering that wholeness comes from accepting all facets of our being.',
      topics: ['Poetry', 'Reflections'],
      illustration: 'dancing-shadows',
      aspect: 'aspect-[4/5]'
    }
  ];

  // Second Batch: Nocturnes, silence, and personal transformation
  const secondBatchStories = [
    {
      id: 'story-5',
      slug: 'the-quiet-revolution',
      title: 'The Quiet Revolution of Unhurried Thought',
      excerpt: 'Change begins in whispers, in the quiet moments when we decide to be different. This reflection on personal transformation explores how the most profound revolutions happen within.',
      topics: ['Reflections', 'Mindfulness'],
      illustration: 'quiet-revolution',
      aspect: 'aspect-[4/5]'
    },
    {
      id: 'story-6',
      slug: 'conversations-with-the-moon',
      title: 'Nocturnes: Conversations with the Moon',
      excerpt: 'Each night, I find myself in dialogue with the moon, sharing secrets that daylight cannot hold. These nocturnal conversations have become my most honest form of prayer.',
      topics: ['Poetry', 'Nocturnes'],
      illustration: 'conversations-moon',
      aspect: 'aspect-[4/3]'
    },
    {
      id: 'story-7',
      slug: 'architecture-of-silence',
      title: 'The Architecture of Deep Silence',
      excerpt: 'Silence is not merely the absence of sound; it is a physical space we construct through intentional design, quiet ritual, and sacred boundary-setting.',
      topics: ['Writing Craft', 'Philosophy'],
      illustration: 'architecture-silence',
      aspect: 'aspect-[4/3]'
    },
    {
      id: 'story-8',
      slug: 'the-art-of-letting-go',
      title: 'The Art of Letting Go: An Archaeology of Loss',
      excerpt: 'Release is not abandonment; it’s trust. In learning to let go, we discover that some things are meant to flow through our lives like water, leaving us changed but never empty.',
      topics: ['Personal History', 'Reflections'],
      illustration: 'letting-go',
      aspect: 'aspect-[4/5]'
    }
  ];

  return (
    <>
      <Helmet>
        <title>The Longform — Poetry, Essays, and Nocturnes</title>
        <meta 
          name="description" 
          content="A sanctuary for intimate reflections, nocturnal poetry, and essays that emerge in the quiet hours when the world sleeps and souls speak." 
        />
        <meta name="keywords" content="poetry, essays, reflections, writing craft, nocturnes, the longform, literature" />
        <meta property="og:title" content="The Longform — Poetry, Essays, and Nocturnes" />
        <meta property="og:description" content="A sanctuary for intimate reflections, poetry, and contemplative prose." />
      </Helmet>

      <div className="min-h-screen bg-[#F8F5F0] text-[#1C1917] selection:bg-[#9C6B3C]/20 selection:text-[#1C1917]">
        {/* Atmos Masthead (Menu + Brand + Search + Drawer) */}
        <Header />

        <main>
          {/* 1. Fullscreen Hero Cover Story with Notion Nocturne Illustration */}
          <HeroHome />

          {/* 2. Page Block 1: 2-Column Masonry Article Grid (Poetry & Craft) */}
          <ArticlesGrid items={firstBatchStories} />

          {/* 3. Interactive Typewriter Desk: Mid-Century Mechanical Stamping & Sound */}
          <TypewriterDesk />

          {/* 4. Page Block 2: Print Compendium Spotlight Slideshow */}
          <MagazineSlideshow />

          {/* 4. Page Block 3: 2-Column Masonry Article Grid (Nocturnes & Reflections) */}
          <ArticlesGrid items={secondBatchStories} />

          {/* 5. Page Block 4: Audio Dispatch / Podcast Feature */}
          <PodcastBlock />

          {/* 6. Page Block 5: Thematic Curated Feature (The Craft of Prose & Poetry) */}
          <ThematicFeature />

          {/* 7. Page Block 6: Reader Fellowship (Literary Patronage) */}
          <BiomeBlock />
        </main>

        {/* 8. Atmos Editorial Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Homepage;