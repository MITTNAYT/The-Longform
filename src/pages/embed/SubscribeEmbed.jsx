import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const SubscribeEmbed = () => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const accentColor = searchParams.get('color') || '#000000'; // Default black

  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase
        .from('profiles')
        .select('id, display_name, username')
        .eq('username', username)
        .single();
      
      if (data) {
        setProfile(data);
      }
    }
    if (username) {
      loadProfile();
    }
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !profile) return;

    setStatus('loading');
    try {
      // In a real app with magic link signup, we'd trigger a signup email here.
      // For now, since they might not have an account, we could just log it or simulate it.
      // Substack embed creates a new account for the user and subscribes them.
      // For this prototype, we'll just simulate a successful subscription response.
      await new Promise(resolve => setTimeout(resolve, 800));
      setStatus('success');
      setMessage('Thanks for subscribing!');
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (!profile) {
    return (
      <div className="w-full h-full flex items-center justify-center font-lato text-sm text-stone-500 p-4">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-transparent font-lato p-2">
      <div className="max-w-md mx-auto bg-white border border-stone-200 rounded-lg p-5 shadow-sm">
        <h3 className="font-playfair font-bold text-xl text-stone-900 mb-2">
          Subscribe to {profile.display_name}
        </h3>
        <p className="text-sm text-stone-600 mb-4 leading-relaxed">
          Get the latest posts delivered right to your inbox.
        </p>
        
        {status === 'success' ? (
          <div className="p-3 bg-stone-50 border border-stone-200 rounded text-stone-800 text-sm font-medium text-center">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Type your email..."
              required
              disabled={status === 'loading'}
              className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 text-sm"
              style={{ focusRingColor: accentColor }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full px-4 py-2 text-white font-medium rounded text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: accentColor }}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
            {status === 'error' && (
              <p className="text-xs text-red-500 mt-1">{message}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default SubscribeEmbed;
