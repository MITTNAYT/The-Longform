import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectProfile, signOut } from '../../store/authSlice';
import Icon from '../AppIcon';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuTab, setActiveMenuTab] = useState('features'); // 'features' | 'volumes'

  const location = useLocation();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const profile = useSelector(selectProfile);

  const isHomePage = location.pathname === '/' || location.pathname === '/homepage';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu or search drawer is open
  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isSearchOpen]);

  const topics = [
    { label: 'Nocturnal Poetry', path: '/discover?tag=poetry' },
    { label: 'The Craft of Writing', path: '/discover?tag=writing' },
    { label: 'Personal Reflections', path: '/discover?tag=reflection' },
    { label: 'Solitude & Silence', path: '/discover?tag=solitude' },
    { label: 'Meditative Essays', path: '/discover?tag=essays' },
    { label: 'Letters & Epistles', path: '/discover?tag=personal' },
  ];

  const volumes = [
    {
      vol: 'Edition IV',
      title: 'Nocturnes',
      cover: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=500&h=700&fit=crop',
      desc: 'Quiet reflections and late-night poetry.'
    },
    {
      vol: 'Edition III',
      title: 'Midnight Musings',
      cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=700&fit=crop',
      desc: 'Intimate explorations of love and memory.'
    },
    {
      vol: 'Edition II',
      title: 'The Weight of Words',
      cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=700&fit=crop',
      desc: 'Essays on deliberate language and craft.'
    },
    {
      vol: 'Edition I',
      title: 'Solitude',
      cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&h=700&fit=crop',
      desc: 'Finding stillness in a restless world.'
    }
  ];

  const handleSignOut = () => {
    dispatch(signOut());
    setIsMenuOpen(false);
  };

  // On home page before scrolling: white text over hero image. Once scrolled: dark text on paper.
  const isLightText = isHomePage && !isScrolled;

  return (
    <>
      {/* ─── Atmos 3-Column Fixed Masthead ──────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F8F5F0]/95 backdrop-blur-md border-b border-[#E0D9CE] py-3 text-[#1C1917] shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
            : isHomePage
            ? 'bg-gradient-to-b from-black/70 via-black/30 to-transparent py-5 text-white'
            : 'bg-[#F8F5F0] border-b border-[#E0D9CE] py-4 text-[#1C1917]'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
          <div className="grid grid-cols-12 items-center">
            
            {/* Left Col (4 cols): Menu button */}
            <div className="col-span-4 flex items-center">
              <button
                onClick={() => setIsMenuOpen(true)}
                className={`font-mono text-xs uppercase tracking-[0.25em] transition-opacity hover:opacity-70 flex items-center gap-2 ${
                  isLightText ? 'text-white' : 'text-[#1C1917]'
                }`}
                aria-label="Open Menu Drawer"
              >
                <span className="w-3 h-0.5 bg-current block" />
                <span>Menu</span>
              </button>
            </div>

            {/* Center Col (4 cols): Atmos Centered Logo + Tagline */}
            <div className="col-span-4 text-center">
              <Link to="/" className="inline-block group">
                <span className={`block font-sans text-2xl sm:text-3xl font-extrabold uppercase tracking-[0.3em] transition-opacity group-hover:opacity-85 ${
                  isLightText ? 'text-white' : 'text-[#1C1917]'
                }`}>
                  The Longform
                </span>
                <span className={`block font-mono text-[9px] uppercase tracking-[0.35em] mt-0.5 ${
                  isLightText ? 'text-white/80' : 'text-[#78716C]'
                }`}>
                  Thought and Culture
                </span>
              </Link>
            </div>

            {/* Right Col (4 cols): Search + Auth / Subscribe */}
            <div className="col-span-4 flex items-center justify-end gap-5">
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`font-mono text-xs uppercase tracking-[0.2em] flex items-center gap-2 transition-opacity hover:opacity-70 ${
                  isLightText ? 'text-white' : 'text-[#1C1917]'
                }`}
                aria-label="Search"
              >
                <Icon name="Search" size={15} />
                <span className="hidden sm:inline">Search</span>
              </button>

              {isAuthenticated ? (
                <Link
                  to="/preview/profile"
                  className={`hidden md:inline-block font-mono text-xs uppercase tracking-wider ${
                    isLightText ? 'text-white/90 hover:text-white' : 'text-[#78716C] hover:text-[#1C1917]'
                  }`}
                >
                  {profile?.username || 'Account'}
                </Link>
              ) : (
                <Link
                  to="/subscription-management"
                  className={`hidden md:inline-block font-mono text-xs uppercase tracking-[0.2em] px-3.5 py-1.5 border transition-all ${
                    isLightText
                      ? 'border-white text-white hover:bg-white hover:text-black'
                      : 'border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#F8F5F0]'
                  }`}
                >
                  Join
                </Link>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* ─── Atmos Slide-Out Menu Drawer ────────────────────────── */}
      <div
        className={`fixed inset-0 z-50 transition-visibility duration-300 ${
          isMenuOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setIsMenuOpen(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Drawer Panel (Atmos multi-pane layout) */}
        <div
          className={`absolute top-0 left-0 bottom-0 w-full max-w-4xl bg-[#F8F5F0] text-[#1C1917] border-r border-[#E0D9CE] shadow-2xl transition-transform duration-500 ease-out flex flex-col ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Top Bar of Drawer */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-[#E0D9CE]">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="font-sans text-xl font-extrabold uppercase tracking-[0.25em] text-[#1C1917]"
            >
              The Longform
            </Link>

            <button
              onClick={() => setIsMenuOpen(false)}
              className="font-mono text-xs uppercase tracking-[0.2em] text-[#1C1917] hover:text-[#9C6B3C] flex items-center gap-2"
              aria-label="Close menu"
            >
              <span>Close</span>
              <Icon name="X" size={16} />
            </button>
          </div>

          {/* Drawer Content Body: Two Columns */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#E0D9CE]">
            
            {/* Left Side (7 cols): Topics & Sections */}
            <div className="md:col-span-7 p-8 sm:p-10 space-y-10">
              
              {/* Primary Navigation */}
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#9C6B3C] block mb-4">
                  FEATURES & TOPICS
                </span>
                <ul className="space-y-3">
                  {topics.map((t, idx) => (
                    <li key={idx}>
                      <Link
                        to={t.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="font-heading text-2xl sm:text-3xl font-normal text-[#1C1917] hover:text-[#9C6B3C] transition-colors block"
                      >
                        {t.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Editorial Tracks */}
              <div className="pt-6 border-t border-[#E0D9CE]">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#78716C] block mb-3">
                  EDITORIAL CHANNELS
                </span>
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/feed"
                    onClick={() => setIsMenuOpen(false)}
                    className="font-mono text-xs uppercase tracking-widest text-[#1C1917] hover:text-[#9C6B3C]"
                  >
                    Reader Feed
                  </Link>
                  <Link
                    to="/discover"
                    onClick={() => setIsMenuOpen(false)}
                    className="font-mono text-xs uppercase tracking-widest text-[#1C1917] hover:text-[#9C6B3C]"
                  >
                    The Digital Archive
                  </Link>
                  <Link
                    to="/write"
                    onClick={() => setIsMenuOpen(false)}
                    className="font-mono text-xs uppercase tracking-widest text-[#9C6B3C] hover:underline"
                  >
                    Write & Publish
                  </Link>
                </div>
              </div>

              {/* Secondary Navigation */}
              <div className="pt-6 border-t border-[#E0D9CE] flex flex-wrap gap-6 font-mono text-xs uppercase tracking-widest text-[#78716C]">
                <Link to="/subscription-management" onClick={() => setIsMenuOpen(false)} className="hover:text-[#1C1917]">
                  Print Compendium
                </Link>
                <Link to="/about-contact" onClick={() => setIsMenuOpen(false)} className="hover:text-[#1C1917]">
                  About The Journal
                </Link>
                <Link to="/about-contact" onClick={() => setIsMenuOpen(false)} className="hover:text-[#1C1917]">
                  Colophon
                </Link>
                {isAuthenticated ? (
                  <button onClick={handleSignOut} className="text-[#991B1B]">
                    Sign Out
                  </button>
                ) : (
                  <Link to="/auth/login" onClick={() => setIsMenuOpen(false)} className="text-[#1C1917] font-semibold">
                    Sign In
                  </Link>
                )}
              </div>

            </div>

            {/* Right Side (5 cols): Volume Spotlight / Covers */}
            <div className="md:col-span-5 p-8 bg-[#F3EFE8]/70 flex flex-col justify-between space-y-6">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#78716C] block mb-4">
                  RECENT EDITIONS
                </span>
                <div className="space-y-4">
                  {volumes.map((v, i) => (
                    <div key={i} className="flex gap-4 items-center group cursor-pointer">
                      <div className="w-16 h-20 overflow-hidden border border-[#E0D9CE] bg-[#EDE8E0] flex-shrink-0">
                        <img src={v.cover} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#9C6B3C] block">
                          {v.vol}
                        </span>
                        <h4 className="font-heading text-lg font-normal text-[#1C1917] group-hover:underline">
                          {v.title}
                        </h4>
                        <p className="font-body text-[11px] text-[#78716C] line-clamp-1">
                          {v.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border border-[#E0D9CE] bg-[#FDFCF9]">
                <h5 className="font-heading text-base font-normal text-[#1C1917] mb-1">
                  Volume 12: Pollinate
                </h5>
                <p className="font-body text-xs text-[#78716C] mb-3">
                  Now available in limited print compendium. Ships globally.
                </p>
                <Link
                  to="/subscription-management"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-block font-mono text-[11px] uppercase tracking-widest text-[#9C6B3C] underline"
                >
                  Order Edition 12 →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ─── Atmos Search Overlay ───────────────────────────────── */}
      <div
        className={`fixed inset-0 z-50 transition-visibility duration-300 ${
          isSearchOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
        }`}
      >
        <div
          onClick={() => setIsSearchOpen(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isSearchOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          className={`absolute top-0 left-0 right-0 bg-[#F8F5F0] border-b border-[#E0D9CE] shadow-xl p-8 sm:p-12 transition-transform duration-300 ease-out ${
            isSearchOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-[#1C1917]">
              <input
                type="text"
                autoFocus={isSearchOpen}
                placeholder="Type Anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent font-heading text-2xl sm:text-4xl text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="font-mono text-xs uppercase tracking-widest text-[#78716C] hover:text-[#1C1917] p-2"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#78716C]">
              <span>SUGGESTED:</span>
              {['Ecology', 'Silence', 'Attention', 'Poetry', 'Solitude', 'Regeneration'].map((term) => (
                <Link
                  key={term}
                  to={`/discover?tag=${term.toLowerCase()}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="px-2.5 py-1 border border-[#E0D9CE] text-[#1C1917] hover:border-[#1C1917] transition-colors"
                >
                  #{term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;