import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { label: 'Home', path: '/homepage', icon: 'Home' },
    { label: 'About', path: '/about-contact', icon: 'User' },
    { label: 'Subscribe', path: '/subscription-management', icon: 'Crown' }
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')?.matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldUseDark);
    document.documentElement?.setAttribute('data-theme', shouldUseDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement?.setAttribute('data-theme', newMode ? 'dark' : 'light');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-sm border-b border-border shadow-gentle' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/homepage" 
            className="flex items-center space-x-3 group transition-transform duration-200 hover:scale-105"
            onClick={closeMobileMenu}
          >
            <div className="relative">
              <Icon 
                name="Moon" 
                size={32} 
                className="text-primary group-hover:text-accent transition-colors duration-200" 
              />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full opacity-60"></div>
            </div>
            <span className="font-heading font-semibold text-xl lg:text-2xl text-foreground group-hover:text-primary transition-colors duration-200">
              Midnight Thoughts
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 group ${
                  isActivePath(item?.path)
                    ? 'text-primary' :'text-foreground hover:text-primary'
                }`}
              >
                <span className="relative z-10">{item?.label}</span>
                {isActivePath(item?.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full"></div>
                )}
                <div className="absolute inset-0 bg-accent/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200"></div>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="relative overflow-hidden"
            >
              <Icon 
                name={isDarkMode ? "Sun" : "Moon"} 
                size={20} 
                className="transition-transform duration-300"
              />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="relative overflow-hidden"
            >
              <Icon 
                name={isDarkMode ? "Sun" : "Moon"} 
                size={20} 
                className="transition-transform duration-300"
              />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="relative"
            >
              <Icon 
                name={isMobileMenuOpen ? "X" : "Menu"} 
                size={24} 
                className="transition-transform duration-200"
              />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-gentle ${
            isMobileMenuOpen 
              ? 'max-h-96 opacity-100 visible' :'max-h-0 opacity-0 invisible'
          }`}
        >
          <nav className="py-4 border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="space-y-2">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-3 px-4 py-3 text-base font-medium transition-all duration-200 ${
                    isActivePath(item?.path)
                      ? 'text-primary bg-accent/10 border-r-2 border-accent' :'text-foreground hover:text-primary hover:bg-muted/50'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span>{item?.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;