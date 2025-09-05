import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CategoryNavigation = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts', count: 24, icon: 'BookOpen' },
    { id: 'reflection', name: 'Reflection', count: 8, icon: 'Lightbulb' },
    { id: 'poetry', name: 'Poetry', count: 12, icon: 'Feather' },
    { id: 'personal', name: 'Personal', count: 6, icon: 'Heart' },
    { id: 'writing', name: 'Writing', count: 4, icon: 'PenTool' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-heading font-semibold text-lg text-card-foreground mb-4 flex items-center gap-2">
        <Icon name="FolderOpen" size={20} />
        Categories
      </h3>
      <nav className="space-y-2">
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => setSelectedCategory(category?.id)}
            className={`w-full flex items-center justify-between p-3 rounded-md text-left transition-all duration-200 ${
              selectedCategory === category?.id
                ? 'bg-accent/10 text-accent-foreground border border-accent/20'
                : 'hover:bg-muted/50 text-muted-foreground hover:text-card-foreground'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon name={category?.icon} size={16} />
              <span className="font-medium">{category?.name}</span>
            </div>
            <span className="text-sm bg-muted/50 px-2 py-1 rounded-full">
              {category?.count}
            </span>
          </button>
        ))}
      </nav>
      <div className="mt-6 pt-6 border-t border-border">
        <Button variant="ghost" size="sm" className="w-full justify-start" iconName="Archive">
          View All Archives
        </Button>
      </div>
    </div>
  );
};

export default CategoryNavigation;