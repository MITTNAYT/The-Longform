import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const CategoryNavigation = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const topics = [
    { id: 'all', name: 'All Themes', count: 24 },
    { id: 'reflection', name: 'Reflections', count: 8 },
    { id: 'poetry', name: 'Nocturnal Poetry', count: 12 },
    { id: 'ecology', name: 'Deep Ecology', count: 7 },
    { id: 'craft', name: 'The Craft of Prose', count: 4 },
    { id: 'personal', name: 'Personal Histories', count: 6 }
  ];

  return (
    <div className="border border-[#E0D9CE] bg-[#FDFCF9] p-6 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#E0D9CE]">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#1C1917] font-medium">
          Editorial Themes
        </h3>
        <span className="font-mono text-[10px] text-[#9C6B3C]">INDEX</span>
      </div>

      <nav className="space-y-1">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setSelectedCategory(topic.id)}
            className={`w-full flex items-center justify-between py-2.5 px-3 font-mono text-xs tracking-wider uppercase transition-colors text-left ${
              selectedCategory === topic.id
                ? 'bg-[#EDE8E0] text-[#1C1917] font-semibold'
                : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#F3EFE8]'
            }`}
          >
            <span>{topic.name}</span>
            <span className="text-[10px] text-[#A8A29E] font-normal">{topic.count}</span>
          </button>
        ))}
      </nav>

      <div className="pt-3 border-t border-[#E0D9CE]">
        <Link
          to="/discover"
          className="font-mono text-[11px] tracking-widest uppercase text-[#9C6B3C] hover:text-[#1C1917] flex items-center justify-between transition-colors"
        >
          <span>Explore Full Index</span>
          <Icon name="ArrowRight" size={12} />
        </Link>
      </div>
    </div>
  );
};

export default CategoryNavigation;