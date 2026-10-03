import React from 'react';
import Icon from '../../../components/AppIcon';
import NotionIllustration from '../../../components/NotionIllustration';

const PodcastBlock = () => {
  return (
    <section className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12 py-14 lg:py-20">
      <div className="border border-[#E0D9CE] bg-[#FDFCF9] p-8 sm:p-12 lg:p-14">
        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-14">
          
          {/* Notion-style Episode Cover Art */}
          <div className="w-full sm:w-56 md:w-64 aspect-square flex-shrink-0 overflow-hidden border border-[#E0D9CE] bg-[#FDFCF9] shadow-sm">
            <NotionIllustration name="audio-dispatch" aspect="w-full h-full" />
          </div>

          {/* Episode Details */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#9C6B3C] block">
              AUDIO DISPATCH · EPISODE 30
            </span>

            <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1C1917] leading-tight">
              The Architecture of the Written Word
            </h3>

            <p className="font-sans text-sm text-[#44372A]/85 leading-relaxed max-w-xl font-light">
              A conversation on nocturnal poetry, the discipline of private journaling, and why unhurried prose serves as our deepest sanctuary against digital noise.
            </p>

            {/* Platform Streaming Links (Atmos exact styling) */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#1C1917]">
              <a
                href="https://spotify.com"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 border border-[#E0D9CE] hover:border-[#1C1917] transition-colors flex items-center gap-2"
              >
                <Icon name="Radio" size={13} className="text-[#5C6B4A]" />
                <span>Spotify</span>
              </a>

              <a
                href="https://podcasts.apple.com"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 border border-[#E0D9CE] hover:border-[#1C1917] transition-colors flex items-center gap-2"
              >
                <Icon name="Headphones" size={13} className="text-[#9C6B3C]" />
                <span>Apple</span>
              </a>

              <a
                href="#listen"
                className="px-3.5 py-1.5 text-[#78716C] hover:text-[#1C1917] transition-colors underline underline-offset-4"
              >
                Listen on All Platforms →
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default PodcastBlock;
