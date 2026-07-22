import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  const digestItems = [
    {
      id: 1,
      num: "01",
      slug: "architecture-of-silence",
      title: "The Architecture of Deep Silence",
      author: "Ismail Ismail",
      time: "6 min read",
      date: "Jan 18, 2025"
    },
    {
      id: 2,
      num: "02",
      slug: "reclaiming-attention",
      title: "On Reclaiming Attention in an Economy of Noise",
      author: "Marcus Vance",
      time: "12 min read",
      date: "Jan 16, 2025"
    },
    {
      id: 3,
      num: "03",
      slug: "midnight-musings-on-love",
      title: "Midnight Musings on Love",
      author: "Ismail Ismail",
      time: "5 min read",
      date: "Jan 14, 2025"
    }
  ];

  return (
    <section className="pt-8 pb-12 border-b border-border/80 bg-card/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Top Publication Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-border/60 mb-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Broadsheet Journal · Edition 42</span>
          </div>
          <div>Published Weekly for 2,847 Discerning Readers</div>
        </div>

        {/* Asymmetric 2-Column Grid */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Cover Story (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <Link to="/post/art-of-solitude" className="block relative aspect-[16/9] rounded-2xl overflow-hidden border border-border/60 shadow-card group">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=700&fit=crop&crop=center"
                alt="Lead Story Cover"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-[11px] font-extrabold uppercase tracking-wider mb-3 inline-block">
                  Cover Essay
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2 group-hover:underline">
                  The Art of Solitude: Finding Peace in Quiet Moments
                </h2>
                <div className="flex items-center gap-3 text-xs text-white/80 font-medium">
                  <span>By Ismail Ismail</span>
                  <span>·</span>
                  <span>8 min read</span>
                  <span>·</span>
                  <span>Jan 20, 2025</span>
                </div>
              </div>
            </Link>

            {/* Excerpt with Pull Quote styling */}
            <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm space-y-4">
              <p className="text-base text-foreground leading-relaxed font-body">
                <span className="float-left text-5xl font-heading font-extrabold text-accent leading-none mr-3 mt-1">I</span>
                n a world that never stops talking, we've forgotten the profound beauty of silence. Solitude isn't loneliness—it is an intimate, long-overdue conversation with our deepest selves.
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border/60">
                <Link
                  to="/post/art-of-solitude"
                  className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all shadow-sm flex items-center gap-2"
                >
                  Read Full Cover Story
                  <Icon name="ArrowRight" size={14} />
                </Link>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-rose-500 transition-colors">
                    <Icon name="Heart" size={16} />
                  </button>
                  <button className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-accent transition-colors">
                    <Icon name="Bookmark" size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Digest Column (5 Columns) */}
          <div className="lg:col-span-5 bg-card p-6 lg:p-8 rounded-2xl border border-border/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="font-heading text-lg font-bold text-foreground">
                The Longform Digest
              </h3>
              <span className="text-xs font-semibold text-accent">Top 3 Essays</span>
            </div>

            <div className="divide-y divide-border/60">
              {digestItems.map((item) => (
                <Link key={item.id} to={`/post/${item.slug}`} className="block py-4 first:pt-0 last:pb-0 group">
                  <div className="flex items-start gap-4">
                    <span className="font-heading font-extrabold text-2xl text-accent/40 group-hover:text-accent transition-colors">
                      {item.num}
                    </span>
                    <div className="space-y-1.5 flex-1">
                      <h4 className="font-heading text-base font-bold text-foreground group-hover:text-accent transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <span>{item.author}</span>
                        <span>·</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Newsletter Callout in Sidebar */}
            <div className="p-5 rounded-xl bg-accent/10 border border-accent/20 space-y-3 mt-6">
              <h4 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
                <Icon name="Mail" size={15} className="text-accent" />
                Get Weekly Editions
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Receive our best longform pieces directly in your inbox every Sunday morning.
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-3 py-2 bg-card rounded-lg border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none flex-1"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent text-accent-foreground text-xs font-bold rounded-lg hover:opacity-90 transition-all"
                >
                  Join
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;