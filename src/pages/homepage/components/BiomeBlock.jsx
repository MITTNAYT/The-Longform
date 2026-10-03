import React from 'react';
import { Link } from 'react-router-dom';
import NotionIllustration from '../../../components/NotionIllustration';

const BiomeBlock = () => {
  return (
    <section className="border-t border-[#E0D9CE] bg-[#F8F5F0] py-16 lg:py-24">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text Info (6 cols) */}
          <div className="md:col-span-6 space-y-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#5C6B4A] block">
              LITERARY PATRONAGE
            </span>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1C1917] leading-tight">
              The Reader Fellowship
            </h2>

            <p className="font-sans text-sm sm:text-base text-[#44372A]/85 leading-relaxed font-light">
              Join our membership circle. Support independent, uninterrupted essays and nocturnal poetry. Patrons receive hand-bound print compendiums, subscriber-only epistolary notes, and direct correspondence with our writers.
            </p>

            <div className="pt-2">
              <Link
                to="/subscription-management"
                className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[#1C1917] hover:text-[#5C6B4A] border-b border-[#1C1917] pb-1 transition-colors group"
              >
                <span>Join The Fellowship</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* Right Notion Artwork (6 cols) */}
          <div className="md:col-span-6 flex justify-center md:justify-end">
            <div className="w-full max-w-sm aspect-[4/5] overflow-hidden bg-[#FDFCF9] border border-[#E0D9CE] shadow-sm">
              <NotionIllustration name="quiet-revolution" aspect="w-full h-full" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BiomeBlock;
