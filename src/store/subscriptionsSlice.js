import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';

// Fetch the list of author_ids the current user is following
export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchSubscriptions',
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('author_id')
        .eq('subscriber_id', userId);
      
      if (error) throw error;
      return data.map(sub => sub.author_id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleSubscription = createAsyncThunk(
  'subscriptions/toggleSubscription',
  async ({ subscriberId, authorId, isFollowing }, { rejectWithValue }) => {
    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('subscriptions')
          .delete()
          .eq('subscriber_id', subscriberId)
          .eq('author_id', authorId);
        if (error) throw error;
        return { authorId, action: 'unfollow' };
      } else {
        // Follow
        const { error } = await supabase
          .from('subscriptions')
          .insert({ subscriber_id: subscriberId, author_id: authorId });
        if (error) throw error;
        return { authorId, action: 'follow' };
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState: {
    followingIds: [], // Array of UUIDs
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.followingIds = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        const { authorId, action: type } = action.payload;
        if (type === 'follow') {
          if (!state.followingIds.includes(authorId)) {
            state.followingIds.push(authorId);
          }
        } else if (type === 'unfollow') {
          state.followingIds = state.followingIds.filter(id => id !== authorId);
        }
      });
  }
});

export const selectFollowingIds = (state) => state.subscriptions.followingIds;
export const selectIsFollowing = (state, authorId) => state.subscriptions.followingIds.includes(authorId);

export default subscriptionsSlice.reducer;
