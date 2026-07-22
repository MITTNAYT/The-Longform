import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectProfile, selectUser, updateProfile, selectAuthStatus } from '../../store/authSlice';

const Onboarding = () => {
  const profile = useSelector(selectProfile);
  const user = useSelector(selectUser);
  const authStatus = useSelector(selectAuthStatus);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');

  // Pre-fill if they somehow revisit, or if we have partial data
  useEffect(() => {
    if (profile) {
      if (profile.username) {
        // If they already have a username, they might not need onboarding
        // but we'll let them stay if they want, or maybe they just got here.
        setUsername(profile.username);
      }
      if (profile.display_name) setDisplayName(profile.display_name);
      if (profile.bio) setBio(profile.bio);
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !displayName.trim()) {
      setError('Username and Display Name are required.');
      return;
    }

    if (!user?.id) {
      setError('Not authenticated.');
      return;
    }

    // Basic username validation (alphanumeric and underscores only)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores.');
      return;
    }

    try {
      const resultAction = await dispatch(updateProfile({
        userId: user.id,
        updates: {
          username: username.trim(),
          display_name: displayName.trim(),
          bio: bio.trim()
        }
      }));

      if (updateProfile.fulfilled.match(resultAction)) {
        navigate('/preview/feed'); // Later this will just be '/' or '/feed'
      } else {
        // Most likely a unique constraint violation on username
        setError(resultAction.payload || 'Failed to update profile. Username might be taken.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F1] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-playfair font-bold text-stone-900">
          Complete your profile
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600 font-lato">
          Tell us a little bit about yourself before you start reading and writing.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-stone-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-sm text-red-700 font-lato">{error}</p>
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-stone-700 font-lato">
                Username
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-stone-300 bg-stone-50 text-stone-500 sm:text-sm font-lato">
                  @
                </span>
                <input
                  type="text"
                  name="username"
                  id="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-stone-300 focus:outline-none focus:ring-stone-500 focus:border-stone-500 sm:text-sm font-lato"
                  placeholder="reader123"
                />
              </div>
            </div>

            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-stone-700 font-lato">
                Display Name
              </label>
              <div className="mt-1">
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-stone-500 focus:border-stone-500 sm:text-sm font-lato"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-stone-700 font-lato">
                Bio (Optional)
              </label>
              <div className="mt-1">
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-stone-500 focus:border-stone-500 sm:text-sm font-lato"
                  placeholder="Avid reader and occasional writer..."
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={authStatus === 'loading'}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#F9F7F1] bg-stone-900 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900 disabled:opacity-50 transition-colors font-lato"
              >
                {authStatus === 'loading' ? 'Saving...' : 'Complete Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
