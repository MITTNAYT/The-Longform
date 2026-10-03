import React from 'react';
import { Link } from 'react-router-dom';
import NotionIllustration from '../../../components/NotionIllustration';
import TypewriterText from '../../../components/TypewriterText';

const HeroHome = () => {
  return (
    <div className="relative w-full h-[88vh] min-h-[620px] max-h-[920px] overflow-hidden bg-[#1C1917]">
      {/* Full-bleed Notion-style Nocturne Illustration */}
      <Link
        to="/post/art-of-solitude"
        className="absolute inset-0 block group"
        aria-label="The Art of Solitude: Finding Stillness in Quiet Moments"
      >
        <div className="w-full h-full transform group-hover:scale-[1.015] transition-transform duration-1000 ease-out">
          <NotionIllustration name="hero-solitude" aspect="h-full w-full" />
        </div>
        {/* Subtle cinematic gradient vignette for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-transparent to-black/30 pointer-events-none" />
      </Link>

      {/* Bottom Overlay Editorial Card (Exact Atmos style) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-14 sm:pb-20 pt-32 px-6 sm:px-12 lg:px-20 max-w-[1400px] mx-auto pointer-events-none">
        <div className="max-w-4xl space-y-4 pointer-events-auto">
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C4A882]">
              COVER ESSAY · NOCTURNES & SOLITUDE
            </span>
            <span className="hidden sm:inline text-[#C4A882]/40">/</span>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black/40 backdrop-blur-xs border border-[#C4A882]/30 text-xs text-[#E0D9CE] font-typewriter">
              <span className="text-[#C4A882] text-[10px] font-mono tracking-wider">02:40 AM //</span>
              <TypewriterText
                words={[
                  "“In the quiet hours after midnight, hearts speak their truest language.”",
                  "“Solitude is not absence, but the sudden presence of clarity.”",
                  "“To write at night is to strip language down to bone and breath.”",
                  "“Every sentence stamped in silence endures the light of day.”"
                ]}
                speed={40}
                deleteSpeed={18}
                pauseDelay={3600}
                cursorType="block"
                fontFamily="font-typewriter"
              />
            </div>
          </div>

          <Link
            to="/post/art-of-solitude"
            className="block group"
          >
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#F8F5F0] leading-[1.12] tracking-tight group-hover:underline decoration-1 underline-offset-8">
              The Art of Solitude: Finding Stillness in an Era of Perpetual Noise
            </h1>
          </Link>

          <p className="font-sans text-sm sm:text-base text-[#D6C9B6] max-w-2xl font-light leading-relaxed pt-1">
            Welcome to <span className="font-medium text-[#F8F5F0]">The Longform</span>, an independent sanctuary for reflections, poetry, and deep prose that emerge in the quiet hours when the world sleeps.
          </p>

          <div className="pt-2">
            <Link
              to="/post/art-of-solitude"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#C4A882] hover:text-white transition-colors"
            >
              <span>Read Cover Feature</span>
              <span>→</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroHome;
