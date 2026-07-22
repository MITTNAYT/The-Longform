import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';

// ─────────────────────────────────────────────────────────────
// Async thunks
// ─────────────────────────────────────────────────────────────

/**
 * Boot the auth system: fetch current session from Supabase.
 * Call this once in App.jsx on mount.
 */
export const initializeAuth = createAsyncThunk('auth/initialize', async (_, { rejectWithValue }) => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) return rejectWithValue(error.message);

  if (!session?.user) return { session: null, profile: null };

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (profileError) return rejectWithValue(profileError.message);
  return { session, profile };
});

/**
 * Sign up with email + password.
 */
export const signUp = createAsyncThunk('auth/signUp', async ({ email, password }, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return rejectWithValue(error.message);
  return data;
});

/**
 * Sign in with email + password.
 */
export const signIn = createAsyncThunk('auth/signIn', async ({ email, password }, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return rejectWithValue(error.message);

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError) return rejectWithValue(profileError.message);
  return { session: data.session, profile };
});

/**
 * Sign out.
 */
export const signOut = createAsyncThunk('auth/signOut', async (_, { rejectWithValue }) => {
  const { error } = await supabase.auth.signOut();
  if (error) return rejectWithValue(error.message);
});

/**
 * Update profile (display name, bio, avatar_url, username, website_url).
 */
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ userId, updates }, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) return rejectWithValue(error.message);
    return data;
  }
);

// ─────────────────────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    session: null,
    profile: null,
    status: 'idle',    // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    initialized: false,
  },
  reducers: {
    // Called from the auth state change listener in App.jsx
    setSession(state, action) {
      state.session = action.payload;
    },
    setProfile(state, action) {
      state.profile = action.payload;
    },
    clearAuth(state) {
      state.session = null;
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── initializeAuth ──────────────────────────────────────
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.session = action.payload.session;
        state.profile = action.payload.profile;
        state.initialized = true;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.initialized = true;
      });

    // ── signUp ─────────────────────────────────────────────
    builder
      .addCase(signUp.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(signUp.fulfilled, (state) => { state.status = 'succeeded'; })
      .addCase(signUp.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; });

    // ── signIn ─────────────────────────────────────────────
    builder
      .addCase(signIn.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.session = action.payload.session;
        state.profile = action.payload.profile;
      })
      .addCase(signIn.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; });

    // ── signOut ────────────────────────────────────────────
    builder
      .addCase(signOut.fulfilled, (state) => {
        state.session = null;
        state.profile = null;
        state.status = 'idle';
        state.error = null;
      });

    // ── updateProfile ──────────────────────────────────────
    builder
      .addCase(updateProfile.pending, (state) => { state.status = 'loading'; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; });
  },
});

// ─────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────
export const selectSession = (state) => state.auth.session;
export const selectProfile = (state) => state.auth.profile;
export const selectUser = (state) => state.auth.session?.user ?? null;
export const selectIsAuthenticated = (state) => !!state.auth.session;
export const selectIsAdmin = (state) => state.auth.profile?.is_admin ?? false;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthInitialized = (state) => state.auth.initialized;

export const { setSession, setProfile, clearAuth } = authSlice.actions;
export default authSlice.reducer;
