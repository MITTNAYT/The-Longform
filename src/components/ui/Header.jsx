import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectProfile, signOut } from '../../store/authSlice';
import Icon from '../AppIcon';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const profile = useSelector(selectProfile);

  const mainNavigation = [
    { label: 'Feed', path: '/feed' },
    { label: 'Discover', path: '/discover' },
  ];

  const authNavigation = [
    { label: 'Bookmarks', path: '/bookmarks' },
    { label: 'Write', path: '/write', highlight: true },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const isActivePath = (path) => location?.pathname === path;

  const handleSignOut = () => {
    dispatch(signOut());
    closeMobileMenu();
  };

  const navItems = isAuthenticated
    ? [...mainNavigation, ...authNavigation]
    : mainNavigation;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-card/95 backdrop-blur-xl border-b border-border shadow-sm py-3'
          : 'bg-card/80 backdrop-blur-md border-b border-border/50 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between">
          {/* Left: Brand + Edition Tag */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2.5 group"
              onClick={closeMobileMenu}
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Icon name="Feather" size={16} className="text-primary-foreground" />
              </div>
              <span className="font-heading font-extrabold text-2xl text-foreground tracking-tight leading-none">
                The Longform<span className="text-accent">.</span>
              </span>
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-muted text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
              Issue #42
            </span>
          </div>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-muted/60 p-1 rounded-full border border-border/60">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                  item.highlight
                    ? 'bg-accent text-accent-foreground shadow-sm ml-1'
                    : isActivePath(item.path)
                    ? 'text-foreground bg-card shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.highlight && (
                  <Icon name="PenTool" size={12} className="inline mr-1.5 -mt-0.5" />
                )}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              className="w-9 h-9 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
              aria-label="Search"
            >
              <Icon name="Search" size={15} />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/preview/profile"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-muted overflow-hidden flex items-center justify-center border border-border group-hover:border-accent transition-colors shadow-sm">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-foreground">
                        {(profile?.username || 'U')[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full hover:bg-muted transition-all"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth/login"
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground px-3.5 py-2 rounded-full hover:bg-muted transition-all"
                >
                  Sign in
                </Link>
                <Link
                  to="/auth/signup"
                  className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-full hover:opacity-90 transition-all shadow-sm"
                >
                  Subscribe
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
            onClick={() => setIsMobileMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-border/60 bg-background/98 backdrop-blur-xl">
          <nav className="px-4 py-3 space-y-0.5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                  isActivePath(item.path)
                    ? 'text-foreground bg-muted'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="px-4 pb-4 pt-2 border-t border-border/40">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/preview/profile" onClick={closeMobileMenu} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-semibold">
                    {(profile?.username || 'U')[0].toUpperCase()}
                  </div>
                  <span>{profile?.username}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="ml-auto text-sm text-red-500 hover:text-red-600 font-medium px-3 py-1.5"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/auth/login" onClick={closeMobileMenu} className="flex-1 text-center py-2.5 text-sm font-medium border border-border rounded-xl text-foreground hover:bg-muted/50 transition-colors">
                  Sign in
                </Link>
                <Link to="/auth/signup" onClick={closeMobileMenu} className="flex-1 text-center py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity">
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;