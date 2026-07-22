import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const EditorPreview = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [isSaved, setIsSaved] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState('reflection');

  useEffect(() => {
    // Word count calculation
    const words = content.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
    // Average reading speed 200wpm
    setReadingTime(Math.ceil(words.length / 200));
  }, [content]);

  // Simulate autosave
  useEffect(() => {
    if (!title && !content) return;
    setIsSaved(false);
    const handler = setTimeout(() => {
      setIsSaved(true);
    }, 1500);

    return () => clearTimeout(handler);
  }, [title, content]);

  const handleAddTag = (e) => {
    e.preventDefault();
    const cleanTag = tagInput.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const insertMarkdown = (syntax) => {
    const textarea = document.getElementById('editor-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    switch (syntax) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        break;
      case 'heading':
        replacement = `\n## ${selectedText || 'Heading'}\n`;
        break;
      case 'quote':
        replacement = `\n> ${selectedText || 'Blockquote'}\n`;
        break;
      case 'link':
        replacement = `[${selectedText || 'link text'}](https://example.com)`;
        break;
      case 'code':
        replacement = `\`${selectedText || 'code'}\``;
        break;
      default:
        return;
    }

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);
    
    // Focus back and set selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body selection:bg-primary selection:text-primary-foreground">
      {/* Editor Header */}
      <header className="border-b border-border bg-background py-3 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/preview/feed" className="p-1 hover:bg-card rounded-md text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="ArrowLeft" size={20} />
          </Link>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isSaved ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
            {isSaved ? 'Draft saved' : 'Saving...'}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            iconName="Settings" 
            onClick={() => setShowSettings(!showSettings)}
            className={showSettings ? 'text-primary bg-card' : ''}
          >
            Post Settings
          </Button>
          <Button 
            variant="default" 
            iconName="Send"
            iconPosition="right"
            onClick={() => alert("Simulating Publish! Status will change to published, notification emails will queue.")}
          >
            Publish
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Editor (Centered, large fonts) */}
        <main className="flex-1 overflow-y-auto px-4 py-16 flex justify-center">
          <div className="w-full max-w-[65ch] space-y-8 flex flex-col">
            
            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title your post..."
              className="w-full bg-transparent font-heading text-4xl lg:text-5xl font-black focus:outline-none placeholder:text-muted-foreground/30 border-none p-0 text-foreground resize-none"
            />

            {/* Markdown Helper Toolbar */}
            <div className="flex items-center space-x-1 border-y border-border/30 py-2 text-muted-foreground">
              <button onClick={() => insertMarkdown('bold')} className="p-2 hover:text-foreground hover:bg-card rounded transition-colors" title="Bold"><Icon name="Bold" size={16} /></button>
              <button onClick={() => insertMarkdown('italic')} className="p-2 hover:text-foreground hover:bg-card rounded transition-colors" title="Italic"><Icon name="Italic" size={16} /></button>
              <button onClick={() => insertMarkdown('heading')} className="p-2 hover:text-foreground hover:bg-card rounded transition-colors" title="Heading"><Icon name="Heading" size={16} /></button>
              <button onClick={() => insertMarkdown('quote')} className="p-2 hover:text-foreground hover:bg-card rounded transition-colors" title="Blockquote"><Icon name="Quote" size={16} /></button>
              <button onClick={() => insertMarkdown('link')} className="p-2 hover:text-foreground hover:bg-card rounded transition-colors" title="Link"><Icon name="Link2" size={16} /></button>
              <button onClick={() => insertMarkdown('code')} className="p-2 hover:text-foreground hover:bg-card rounded transition-colors" title="Inline Code"><Icon name="Code" size={16} /></button>
            </div>

            {/* Content Textarea */}
            <textarea
              id="editor-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell your story..."
              className="flex-1 w-full bg-transparent font-serif text-lg leading-relaxed focus:outline-none placeholder:text-muted-foreground/20 border-none p-0 resize-none min-h-[50vh]"
            />
          </div>
        </main>

        {/* Post Settings Drawer (Slides in from right) */}
        <aside className={`w-80 border-l border-border bg-card p-6 overflow-y-auto transition-all duration-300 absolute lg:relative right-0 top-0 bottom-0 z-40 ${showSettings ? 'translate-x-0' : 'translate-x-full lg:hidden'}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-heading font-bold text-lg">Post Settings</h3>
            <button onClick={() => setShowSettings(false)} className="text-muted-foreground hover:text-foreground transition-colors lg:hidden">
              <Icon name="X" size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Category Select */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
              >
                <option value="poetry">Poetry</option>
                <option value="reflection">Reflection</option>
                <option value="personal">Personal Essay</option>
                <option value="writing">Writing Craft</option>
              </select>
            </div>

            {/* Excerpt Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Excerpt / Subtitle</label>
              <textarea 
                rows="3"
                placeholder="Write a brief teaser for the reader feed..."
                className="w-full bg-background border border-border rounded-md p-3 text-sm focus:outline-none focus:border-primary resize-none placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Tags Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tags</label>
              <form onSubmit={handleAddTag} className="flex gap-2">
                <input 
                  type="text" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="e.g. poetry" 
                  className="flex-1 bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
                />
                <Button type="submit" variant="outline" size="sm">Add</Button>
              </form>

              {/* Tag Chips */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {tags.map((tag, idx) => (
                  <span key={tag} className="text-xs bg-background border border-border px-2.5 py-1 rounded-full flex items-center gap-1 text-muted-foreground">
                    #{tag}
                    <button type="button" onClick={() => handleRemoveTag(idx)} className="hover:text-red-500 font-bold">×</button>
                  </span>
                ))}
                {tags.length === 0 && (
                  <p className="text-xs text-muted-foreground/60 italic">No tags added yet.</p>
                )}
              </div>
            </div>

            {/* SEO Preview Panel */}
            <div className="pt-6 border-t border-border space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Feed Preview Card</label>
              <div className="bg-background border border-border rounded-lg p-4 space-y-2">
                <span className="text-[10px] text-primary uppercase font-bold">{category}</span>
                <h4 className="text-sm font-bold truncate">{title || 'Untitled Post'}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {content ? content.substring(0, 100) : 'Write some content to generate a snippet...'}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Editor Status Bar */}
      <footer className="border-t border-border bg-background py-2 px-6 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex space-x-6">
          <span>Words: <strong>{wordCount}</strong></span>
          <span>Reading Time: <strong>{readingTime} min</strong></span>
        </div>
        <div>
          <span>Markdown supported</span>
        </div>
      </footer>
    </div>
  );
};

export default EditorPreview;
