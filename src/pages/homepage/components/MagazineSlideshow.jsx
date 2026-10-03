import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NotionIllustration from '../../../components/NotionIllustration';

const MagazineSlideshow = () => {
  const [activeCover, setActiveCover] = useState(0);

  const editions = [
    {
      title: "Nocturnes & Solitude",
      subtitle: "Edition IV · Winter Compendium",
      illustration: "solitude-window",
      theme: "Quiet Introspection"
    },
    {
      title: "The Geography of Love",
      subtitle: "Edition III · Autumn Compendium",
      illustration: "midnight-love",
      theme: "Intimate Poems"
    },
    {
      title: "The Architecture of Silence",
      subtitle: "Edition II · Summer Compendium",
      illustration: "architecture-silence",
      theme: "Meditative Essays"
    },
    {
      title: "The Art of Letting Go",
      subtitle: "Edition I · Spring Compendium",
      illustration: "letting-go",
      theme: "Personal Histories"
    }
  ];

  return (
    <section className="border-y border-[#E0D9CE] bg-[#F3EFE8]/60 py-16 lg:py-24">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text Column (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#9C6B3C] block">
              PRINT COMPENDIUM
            </span>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1C1917] leading-tight">
              Edition IV: Nocturnes
            </h2>

            <p className="font-sans text-sm sm:text-base text-[#44372A]/85 leading-relaxed font-light">
              A curated collection of late-night poetry, intimate memoirs, and thoughtful essays. Printed on archival Mohawk paper with hand-bound linen spines. Created for readers who savor the sensory weight of tangible prose.
            </p>

            <div className="pt-2">
              <Link
                to="/subscription-management"
                className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[#1C1917] hover:text-[#9C6B3C] border-b border-[#1C1917] pb-1 transition-colors group"
              >
                <span>Order Print Edition</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* Book / Magazine Display (7 cols) */}
          <div className="md:col-span-7 flex flex-col items-center sm:items-end">
            <div className="w-full max-w-md">
              {/* Active Cover Display with Notion illustration */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#FDFCF9] shadow-[0_20px_45px_rgba(28,25,23,0.09)] border border-[#E0D9CE]">
                <div className="w-full h-full p-6 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#9C6B3C] block">
                      {editions[activeCover].subtitle}
                    </span>
                    <h3 className="font-heading text-2xl font-normal text-[#1C1917] mt-1">
                      {editions[activeCover].title}
                    </h3>
                  </div>

                  <div className="my-auto w-full aspect-square max-w-[240px] mx-auto border border-[#E0D9CE]">
                    <NotionIllustration
                      name={editions[activeCover].illustration}
                      aspect="w-full h-full"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-[#E0D9CE] pt-3 font-mono text-[9px] uppercase tracking-wider text-[#78716C]">
                    <span>The Longform Press</span>
                    <span>{editions[activeCover].theme}</span>
                  </div>
                </div>
              </div>

              {/* Cover selector tabs */}
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-6">
                {editions.map((ed, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCover(i)}
                    className={`font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 border transition-all ${
                      activeCover === i
                        ? 'border-[#1C1917] bg-[#1C1917] text-[#F8F5F0]'
                        : 'border-[#E0D9CE] text-[#78716C] hover:border-[#1C1917]'
                    }`}
                  >
                    Edition {4 - i}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MagazineSlideshow;
