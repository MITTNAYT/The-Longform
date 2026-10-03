import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  const topics = [
    { label: 'Nocturnal Poetry', path: '/discover?tag=poetry' },
    { label: 'The Craft of Writing', path: '/discover?tag=writing' },
    { label: 'Personal Reflections', path: '/discover?tag=reflection' },
    { label: 'Solitude & Silence', path: '/discover?tag=solitude' },
    { label: 'Meditative Essays', path: '/discover?tag=essays' },
    { label: 'Letters & Epistles', path: '/discover?tag=personal' },
  ];

  return (
    <footer className="border-t border-[#E0D9CE] bg-[#1C1917] text-[#F8F5F0] pt-20 pb-12">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12 space-y-16">
        
        {/* Newsletter Bar (Atmos exact prompt) */}
        <div className="max-w-xl mx-auto text-center space-y-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C4A882] block">
            WEEKLY DISPATCH
          </span>
          <h3 className="font-heading text-3xl sm:text-4xl font-normal text-white">
            Never Miss a Story
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#A8A29E] font-light leading-relaxed">
            Weekly meditations, essays, and cultural critiques delivered straight to your inbox.
          </p>

          {subscribed ? (
            <div className="p-3 border border-[#5C6B4A] bg-[#5C6B4A]/20 font-mono text-xs text-[#8A9E82]">
              You are now subscribed to The Longform dispatch.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="pt-2 flex flex-col sm:flex-row gap-0 max-w-md mx-auto border border-[#E0D9CE]/40">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 bg-transparent font-mono text-xs text-white placeholder:text-[#78716C] focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#F8F5F0] text-[#1C1917] font-mono text-xs uppercase tracking-[0.2em] hover:bg-[#C4A882] transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Center Giant Atmos Brand Wordmark */}
        <div className="text-center pt-8 border-t border-[#44372A]/70 space-y-2">
          <Link to="/" className="inline-block group">
            <span className="font-sans text-3xl sm:text-5xl font-extrabold uppercase tracking-[0.3em] text-white group-hover:opacity-85 transition-opacity">
              The Longform
            </span>
            <span className="block font-mono text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#C4A882] mt-1">
              Thought and Culture
            </span>
          </Link>
        </div>

        {/* Topics List Bar (Atmos exact horizontal nav) */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-[0.18em] text-[#D6C9B6] border-y border-[#44372A]/70 py-6">
          {topics.map((t, idx) => (
            <Link
              key={idx}
              to={t.path}
              className="hover:text-white transition-colors"
            >
              {t.label}
            </Link>
          ))}
        </div>

        {/* Secondary Links & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-[10px] uppercase tracking-wider text-[#78716C]">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link to="/subscription-management" className="hover:text-white transition-colors">Shop</Link>
            <Link to="/subscription-management" className="hover:text-white transition-colors">Biome</Link>
            <Link to="/about-contact" className="hover:text-white transition-colors">About</Link>
            <Link to="/write" className="hover:text-white transition-colors">Submissions</Link>
            <Link to="/about-contact" className="hover:text-white transition-colors">Privacy</Link>
          </div>

          <div>
            © {currentYear} THE LONGFORM PUBLISHING. ALL RIGHTS RESERVED.
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;