import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const digestItems = [
    {
      id: 1,
      num: "01",
      slug: "architecture-of-silence",
      title: "The Architecture of Deep Silence",
      category: "ESSAY",
      author: "Ismail Ismail",
      time: "6 min read",
      date: "Jan 18, 2025"
    },
    {
      id: 2,
      num: "02",
      slug: "reclaiming-attention",
      title: "On Reclaiming Attention in an Economy of Noise",
      category: "CULTURE",
      author: "Marcus Vance",
      time: "12 min read",
      date: "Jan 16, 2025"
    },
    {
      id: 3,
      num: "03",
      slug: "midnight-musings-on-love",
      title: "Midnight Musings on Love and Temporality",
      category: "PHILOSOPHY",
      author: "Elena Rostova",
      time: "5 min read",
      date: "Jan 14, 2025"
    }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <section className="pt-6 pb-16 border-b border-[#E0D9CE] bg-[#F8F5F0]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Top Publication Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-[#E0D9CE] mb-10 text-[11px] font-mono uppercase tracking-[0.2em] text-[#78716C]">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9C6B3C]" />
            <span>THE LONGFORM JOURNAL · ISSUE NO. 42</span>
          </div>
          <div className="hidden sm:block">WEEKLY EDITORIAL FOR MINDFUL READERS</div>
        </div>

        {/* Asymmetric 2-Column Grid (Editorial Broadside) */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Main Cover Story (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <Link to="/post/art-of-solitude" className="block group">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#EDE8E0] border border-[#E0D9CE]">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=750&fit=crop&crop=center"
                  alt="Lead Story Cover"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-[#1C1917] text-[#F8F5F0] font-mono text-[10px] tracking-[0.18em] uppercase">
                    COVER ESSAY
                  </span>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="pt-6 space-y-3">
                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-[#78716C]">
                  <span className="text-[#9C6B3C]">SOLITUDE & MIND</span>
                  <span>·</span>
                  <span>8 MIN READ</span>
                  <span>·</span>
                  <span>JAN 20, 2025</span>
                </div>

                <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1C1917] leading-[1.2] group-hover:text-[#9C6B3C] transition-colors">
                  The Art of Solitude: Finding Stillness in an Era of Perpetual Motion
                </h1>

                <p className="font-body text-[#44372A] text-base leading-relaxed line-clamp-3">
                  In a culture that equates constant connectivity with purpose, we have abandoned the deliberate quietude required for genuine introspection. Solitude is not exile from the world; it is the silent clearing where consciousness returns to itself.
                </p>
              </div>
            </Link>

            {/* Read action + Author line */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E0D9CE]">
              <Link
                to="/post/art-of-solitude"
                className="font-mono text-xs tracking-[0.16em] uppercase text-[#1C1917] hover:text-[#9C6B3C] inline-flex items-center gap-2 group transition-colors"
              >
                <span>Read Story</span>
                <Icon name="ArrowRight" size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="font-mono text-xs text-[#78716C]">
                Words by <span className="text-[#1C1917] font-medium">Ismail Ismail</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Digest & Curated Selection (5 Columns) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="border border-[#E0D9CE] bg-[#FDFCF9] p-6 lg:p-8">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#E0D9CE] mb-6">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#1C1917] font-medium">
                  Curated Dispatch
                </span>
                <span className="font-mono text-[10px] tracking-widest text-[#9C6B3C]">
                  TOP ESSAYS
                </span>
              </div>

              <div className="divide-y divide-[#EDE8E0]">
                {digestItems.map((item) => (
                  <Link
                    key={item.id}
                    to={`/post/${item.slug}`}
                    className="block py-5 first:pt-0 last:pb-0 group"
                  >
                    <div className="flex items-start gap-4">
                      <span className="font-mono text-xs tracking-wider text-[#C4A882] pt-0.5">
                        {item.num}
                      </span>
                      <div className="space-y-1.5 flex-1">
                        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#78716C] block">
                          {item.category}
                        </span>
                        <h3 className="font-heading text-base font-normal text-[#1C1917] group-hover:text-[#9C6B3C] transition-colors leading-snug">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-[#78716C]">
                          <span>{item.author}</span>
                          <span>·</span>
                          <span>{item.time}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Minimalist Newsletter Box */}
              <div className="mt-8 pt-6 border-t border-[#E0D9CE]">
                <div className="space-y-2 mb-4">
                  <h4 className="font-heading text-lg font-normal text-[#1C1917]">
                    Dispatches from The Longform
                  </h4>
                  <p className="font-body text-xs text-[#78716C] leading-relaxed">
                    Uninterrupted weekly essays delivered directly to your inbox every Sunday morning. No ads, no noise.
                  </p>
                </div>

                {subscribed ? (
                  <div className="p-3 bg-[#5C6B4A]/10 border border-[#5C6B4A]/30 text-[#5C6B4A] font-mono text-xs">
                    Thank you for subscribing to our weekly dispatch.
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-2">
                    <div className="flex gap-0 border border-[#1C1917]">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="reader@example.com"
                        required
                        className="w-full px-3 py-2 bg-transparent font-mono text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#1C1917] text-[#F8F5F0] font-mono text-[11px] tracking-widest uppercase hover:bg-[#44372A] transition-colors whitespace-nowrap"
                      >
                        Join
                      </button>
                    </div>
                    <div className="text-[10px] font-mono text-[#A8A29E]">
                      Free weekly release. Unsubscribe anytime.
                    </div>
                  </form>
                )}
              </div>

            </div>

            {/* Quote of the Issue */}
            <div className="p-6 border-l-2 border-[#9C6B3C] bg-[#F3EFE8]/70">
              <blockquote className="font-serif italic text-sm text-[#44372A] leading-relaxed mb-3">
                “To write is to create an island of quiet in a world deafened by its own hurry.”
              </blockquote>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#78716C]">
                — The Longform Editors
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;