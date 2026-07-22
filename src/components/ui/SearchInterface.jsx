import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Input from './Input';
import Icon from '../AppIcon';

const SearchInterface = ({ className = '' }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Mock search data
  const mockPosts = [
    { id: 1, title: 'The Art of Solitude', category: 'Reflection', excerpt: 'Finding peace in quiet moments...' },
    { id: 2, title: 'Midnight Musings on Love', category: 'Poetry', excerpt: 'When the world sleeps, hearts speak...' },
    { id: 3, title: 'Letters to My Younger Self', category: 'Personal', excerpt: 'What I wish I had known then...' },
    { id: 4, title: 'The Weight of Words', category: 'Writing', excerpt: 'How language shapes our reality...' },
    { id: 5, title: 'Dancing with Shadows', category: 'Poetry', excerpt: 'In darkness, we find our light...' },
    { id: 6, title: 'The Quiet Revolution', category: 'Reflection', excerpt: 'Change begins in whispers...' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setIsExpanded(false);
        setQuery('');
        setSuggestions([]);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query?.length > 1) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const filtered = mockPosts?.filter(post =>
          post?.title?.toLowerCase()?.includes(query?.toLowerCase()) ||
          post?.category?.toLowerCase()?.includes(query?.toLowerCase()) ||
          post?.excerpt?.toLowerCase()?.includes(query?.toLowerCase())
        );
        setSuggestions(filtered?.slice(0, 5));
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [query]);

  const handleExpand = () => {
    setIsExpanded(true);
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Escape') {
      setIsExpanded(false);
      setQuery('');
      setSuggestions([]);
      setSelectedIndex(-1);
    } else if (e?.key === 'ArrowDown') {
      e?.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions?.length - 1 ? prev + 1 : prev
      );
    } else if (e?.key === 'ArrowUp') {
      e?.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e?.key === 'Enter' && selectedIndex >= 0) {
      e?.preventDefault();
      handleSuggestionClick(suggestions?.[selectedIndex]);
    }
  };

  const handleSuggestionClick = (post) => {
    navigate('/preview/post');
    setIsExpanded(false);
    setQuery('');
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text?.split(regex);
    
    return parts?.map((part, index) => 
      regex?.test(part) ? (
        <mark key={index} className="bg-accent/20 text-accent-foreground">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Trigger Button */}
      {!isExpanded && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleExpand}
          className="relative"
        >
          <Icon name="Search" size={20} />
        </Button>
      )}
      {/* Expanded Search Interface */}
      {isExpanded && (
        <>
          {/* Mobile Overlay */}
          <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 md:hidden">
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(false)}
                >
                  <Icon name="ArrowLeft" size={20} />
                </Button>
                <h2 className="font-heading font-semibold text-lg">Search</h2>
              </div>
              
              <div className="relative">
                <Input
                  ref={inputRef}
                  type="search"
                  placeholder="Search posts, topics, or ideas..."
                  value={query}
                  onChange={(e) => setQuery(e?.target?.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isLoading ? (
                    <Icon name="Loader2" size={16} className="animate-spin text-muted-foreground" />
                  ) : (
                    <Icon name="Search" size={16} className="text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Dropdown */}
          <div className="hidden md:block absolute right-0 top-0 w-96 bg-popover border border-border rounded-lg shadow-warm z-50">
            <div className="p-4">
              <div className="relative">
                <Input
                  ref={inputRef}
                  type="search"
                  placeholder="Search posts, topics, or ideas..."
                  value={query}
                  onChange={(e) => setQuery(e?.target?.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isLoading ? (
                    <Icon name="Loader2" size={16} className="animate-spin text-muted-foreground" />
                  ) : (
                    <Icon name="Search" size={16} className="text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Search Suggestions */}
      {isExpanded && suggestions?.length > 0 && (
        <div className={`
          ${isExpanded ? 'fixed md:absolute' : 'hidden'}
          ${isExpanded ? 'inset-x-4 top-24 md:inset-x-auto md:top-16 md:right-0 md:w-96' : ''}
          bg-popover border border-border rounded-lg shadow-warm z-50 max-h-80 overflow-y-auto
        `}>
          <div className="p-2">
            <div className="text-xs font-caption text-muted-foreground px-3 py-2 border-b border-border">
              {suggestions?.length} result{suggestions?.length !== 1 ? 's' : ''} found
            </div>
            
            {suggestions?.map((post, index) => (
              <button
                key={post?.id}
                onClick={() => handleSuggestionClick(post)}
                className={`w-full text-left p-3 rounded-md transition-colors duration-150 ${
                  index === selectedIndex 
                    ? 'bg-accent/10 text-accent-foreground' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-popover-foreground truncate">
                      {highlightMatch(post?.title, query)}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {highlightMatch(post?.excerpt, query)}
                    </p>
                  </div>
                  <span className="text-xs font-caption text-accent bg-accent/10 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                    {post?.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* No Results */}
      {isExpanded && query?.length > 1 && suggestions?.length === 0 && !isLoading && (
        <div className={`
          ${isExpanded ? 'fixed md:absolute' : 'hidden'}
          ${isExpanded ? 'inset-x-4 top-24 md:inset-x-auto md:top-16 md:right-0 md:w-96' : ''}
          bg-popover border border-border rounded-lg shadow-warm z-50
        `}>
          <div className="p-6 text-center">
            <Icon name="Search" size={32} className="text-muted-foreground mx-auto mb-3" />
            <h4 className="font-medium text-popover-foreground mb-1">No results found</h4>
            <p className="text-sm text-muted-foreground">
              Try searching with different keywords or browse our latest posts.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInterface;