import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/authSlice';
import { 
  createDraft, 
  saveDraft, 
  fetchMyPosts, 
  publishPost,
  fetchSnippets,
  createSnippet,
  deleteSnippet
} from '../../lib/queries';
import { MarkdownRenderer } from '../../lib/markdown';
import Icon from '../../components/AppIcon';

// A simple debounce hook/utility
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const Editor = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  // Post State
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Publish flow state
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('reflection');
  const [tagsInput, setTagsInput] = useState('');

  // Snippets state
  const [snippets, setSnippets] = useState([]);
  const [isSnippetsModalOpen, setIsSnippetsModalOpen] = useState(false);
  const [newSnippetName, setNewSnippetName] = useState('');

  const debouncedTitle = useDebounce(title, 2000);
  const debouncedContent = useDebounce(content, 2000);
  const textareaRef = useRef(null);

  // 1. Load or Initialize Draft
  useEffect(() => {
    async function init() {
      if (!user) return;
      setIsLoading(true);
      setError(null);

      try {
        if (postId) {
          // Load existing post
          // fetchMyPosts returns all posts for author. Let's just find the one.
          // Ideally we have a fetchPostById query, but we can reuse fetchMyPosts
          const { data, error } = await fetchMyPosts(user.id);
          if (error) throw error;
          
          const existingPost = data?.find(p => p.id === postId);
          if (!existingPost) {
            throw new Error('Post not found');
          }
          
          setPost(existingPost);
          setTitle(existingPost.title || '');
          setContent(existingPost.content || '');
          setExcerpt(existingPost.excerpt || '');
          setCategory(existingPost.category || 'reflection');
          setTagsInput(existingPost.tags?.join(', ') || '');
        } else {
          // Create a new draft immediately so we have an ID to auto-save to
          const { data, error } = await createDraft({ authorId: user.id });
          if (error) throw error;
          
          setPost(data);
          // Redirect to the new draft URL without adding to history
          navigate(`/write/${data.id}`, { replace: true });
        }

        // Fetch snippets
        const { data: snippetsData } = await fetchSnippets(user.id);
        if (snippetsData) {
          setSnippets(snippetsData);
        }
      } catch (err) {
        setError(err.message || 'Failed to load editor');
      } finally {
        setIsLoading(false);
      }
    }
    
    // Only run if we don't already have a post loaded that matches the URL
    if (!post || (postId && post.id !== postId)) {
      init();
    }
  }, [postId, user, navigate, post]);

  // 2. Auto-save
  // We use a ref to track if we've actually made changes since load
  const isInitialLoad = useRef(true);
  
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    async function doAutoSave() {
      if (!post || post.status === 'published') return; // Don't autosave published posts this way
      
      setIsSaving(true);
      try {
        await saveDraft({
          id: post.id,
          title: debouncedTitle,
          content: debouncedContent,
          excerpt,
          category,
          tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean)
        });
        setLastSaved(new Date());
      } catch (err) {
        console.error('Autosave failed:', err);
      } finally {
        setIsSaving(false);
      }
    }

    doAutoSave();
  }, [debouncedTitle, debouncedContent, post, excerpt, category, tagsInput]);

  // 3. Stats calculation
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  // 4. Toolbar helpers
  const insertText = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setContent(newText);
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handlePublish = async () => {
    if (!post) return;
    setIsSaving(true);
    try {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      await publishPost({
        id: post.id,
        title: title || 'Untitled',
        excerpt,
        category,
        tags
      });
      // Navigate to the public post (we don't have the slug here trivially, so let's go to profile or feed)
      navigate('/preview/profile');
    } catch (err) {
      setError(err.message || 'Failed to publish');
      setIsSaving(false);
    }
  };

  const handleSaveSnippet = async () => {
    if (!newSnippetName.trim()) return;
    const textarea = textareaRef.current;
    let selectedText = '';
    if (textarea) {
      selectedText = content.substring(textarea.selectionStart, textarea.selectionEnd);
    }
    if (!selectedText) {
      alert('Please select some text in the editor to save as a snippet.');
      return;
    }
    
    try {
      const { data, error } = await createSnippet({
        authorId: user.id,
        name: newSnippetName.trim(),
        content: selectedText
      });
      if (error) throw error;
      setSnippets(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewSnippetName('');
    } catch (err) {
      alert('Failed to save snippet: ' + err.message);
    }
  };

  const handleDeleteSnippet = async (id) => {
    if (!confirm('Delete this snippet?')) return;
    try {
      await deleteSnippet(id);
      setSnippets(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleInsertSnippet = (snippetContent) => {
    insertText(snippetContent, '');
    setIsSnippetsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F7F1] flex items-center justify-center">
        <p className="font-lato text-stone-500 animate-pulse">Loading editor...</p>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="min-h-screen bg-[#F9F7F1] flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => navigate('/preview/profile')} className="text-stone-900 underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F1] flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 bg-[#F9F7F1]/90 backdrop-blur-sm border-b border-stone-200 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="text-stone-500 hover:text-stone-900 transition-colors">
            <Icon name="ArrowLeft" size={20} />
          </button>
          <div className="flex items-center text-sm font-lato text-stone-500">
            {isSaving ? (
              <span className="flex items-center"><Icon name="RefreshCw" size={14} className="mr-1 animate-spin" /> Saving...</span>
            ) : lastSaved ? (
              <span className="flex items-center"><Icon name="Check" size={14} className="mr-1" /> Saved {lastSaved.toLocaleTimeString()}</span>
            ) : (
              <span>Draft</span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="hidden md:inline text-sm font-lato text-stone-500">
            {words} words • {readingTime} min read
          </span>
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="px-3 py-1.5 text-sm font-medium font-lato text-stone-700 bg-white border border-stone-300 rounded hover:bg-stone-50 transition-colors flex items-center"
          >
            <Icon name={isPreview ? "Edit2" : "Eye"} size={16} className="mr-2" />
            {isPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="px-4 py-1.5 text-sm font-medium font-lato text-[#F9F7F1] bg-stone-900 rounded hover:bg-stone-800 transition-colors"
          >
            Publish
          </button>
        </div>
      </header>

      {/* Editor Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 lg:py-12 flex flex-col">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New Story Title..."
          readOnly={isPreview}
          className="text-4xl md:text-5xl font-playfair font-bold text-stone-900 bg-transparent border-none outline-none placeholder-stone-300 w-full mb-8 resize-none"
        />

        {!isPreview && (
          <div className="sticky top-16 z-10 flex flex-wrap items-center gap-1 p-2 bg-white border border-stone-200 rounded-lg shadow-sm mb-6">
            <button onClick={() => insertText('**', '**')} className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors" title="Bold"><Icon name="Bold" size={18} /></button>
            <button onClick={() => insertText('*', '*')} className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors" title="Italic"><Icon name="Italic" size={18} /></button>
            <div className="w-px h-6 bg-stone-200 mx-1"></div>
            <button onClick={() => insertText('## ')} className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors font-serif font-bold" title="Heading 2">H2</button>
            <button onClick={() => insertText('### ')} className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors font-serif font-bold" title="Heading 3">H3</button>
            <div className="w-px h-6 bg-stone-200 mx-1"></div>
            <button onClick={() => insertText('> ')} className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors" title="Quote"><Icon name="MessageSquare" size={18} /></button>
            <button onClick={() => insertText('- ')} className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors" title="Bullet List"><Icon name="List" size={18} /></button>
            <button onClick={() => insertText('1. ')} className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors" title="Numbered List"><Icon name="ListOrdered" size={18} /></button>
            <div className="w-px h-6 bg-stone-200 mx-1"></div>
            <button onClick={() => insertText('[', '](url)')} className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors" title="Link"><Icon name="Link" size={18} /></button>
            <button onClick={() => insertText('![alt text](image_url)')} className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors" title="Image"><Icon name="Image" size={18} /></button>
            <div className="w-px h-6 bg-stone-200 mx-1"></div>
            <button onClick={() => setIsSnippetsModalOpen(true)} className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors" title="Snippets"><Icon name="FileText" size={18} /></button>
          </div>
        )}

        {isPreview ? (
          <div className="flex-1">
            <MarkdownRenderer content={content || '*Nothing to preview yet...*'} />
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell your story..."
            className="flex-1 w-full bg-transparent border-none outline-none resize-none font-lato text-lg text-stone-800 leading-relaxed placeholder-stone-400 min-h-[500px]"
          />
        )}
      </main>

      {/* Publish Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 md:p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-playfair font-bold text-stone-900">Publish Post</h3>
              <button onClick={() => setIsPublishModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <Icon name="X" size={24} />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-stone-700 font-lato mb-1">Excerpt (Optional)</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A brief summary for the feed..."
                  rows={3}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-stone-500 focus:border-stone-500 font-lato text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 font-lato mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-stone-500 focus:border-stone-500 font-lato text-sm bg-white"
                >
                  <option value="reflection">Reflection</option>
                  <option value="poetry">Poetry</option>
                  <option value="personal">Personal Essay</option>
                  <option value="writing">Writing Craft</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 font-lato mb-1">Tags</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. mindfulness, morning-routine"
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-stone-500 focus:border-stone-500 font-lato text-sm"
                />
                <p className="mt-1 text-xs text-stone-500 font-lato">Separate tags with commas</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 rounded-md hover:bg-stone-50 font-lato"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-[#F9F7F1] bg-stone-900 rounded-md hover:bg-stone-800 font-lato disabled:opacity-50 flex items-center"
              >
                {isSaving ? <Icon name="RefreshCw" size={16} className="animate-spin mr-2" /> : null}
                Publish Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snippets Modal */}
      {isSnippetsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 md:p-8 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-playfair font-bold text-stone-900">Snippets</h3>
              <button onClick={() => setIsSnippetsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <Icon name="X" size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 mb-6 space-y-4">
              {snippets.length === 0 ? (
                <p className="text-stone-500 text-sm italic font-lato">No snippets saved yet.</p>
              ) : (
                snippets.map(snippet => (
                  <div key={snippet.id} className="flex flex-col border border-stone-200 rounded-md p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-stone-800 text-sm font-lato">{snippet.name}</span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleInsertSnippet(snippet.content)}
                          className="text-xs px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors"
                        >
                          Insert
                        </button>
                        <button 
                          onClick={() => handleDeleteSnippet(snippet.id)}
                          className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-stone-500 font-mono truncate bg-stone-50 p-1.5 rounded">
                      {snippet.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-stone-200 pt-6">
              <h4 className="text-sm font-medium text-stone-900 mb-2 font-lato">Save Selection as Snippet</h4>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSnippetName}
                  onChange={(e) => setNewSnippetName(e.target.value)}
                  placeholder="Snippet name..."
                  className="flex-1 px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-stone-500 focus:border-stone-500 font-lato text-sm"
                />
                <button
                  onClick={handleSaveSnippet}
                  disabled={!newSnippetName.trim()}
                  className="px-4 py-2 text-sm font-medium text-[#F9F7F1] bg-stone-900 rounded-md hover:bg-stone-800 font-lato disabled:opacity-50"
                >
                  Save
                </button>
              </div>
              <p className="text-xs text-stone-500 mt-2 font-lato">Highlight text in the editor before saving.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
