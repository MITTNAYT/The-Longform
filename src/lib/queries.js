// ============================================================
// The Longform — Supabase Query Helpers
// src/lib/queries.js
// ============================================================
import { supabase } from './supabase';

// ─────────────────────────────────────────────────────────────
// FEED
// ─────────────────────────────────────────────────────────────

/**
 * Fetch the chronological feed for a reader:
 * Posts from authors the current user follows, published, newest first.
 * Uses keyset pagination via `cursor` (published_at of the last item).
 */
export async function fetchFeed({ followedAuthorIds = [], cursor = null, limit = 20 } = {}) {
  if (followedAuthorIds.length === 0) return { data: [], error: null };

  let query = supabase
    .from('published_posts_view')
    .select('*')
    .in('author_id', followedAuthorIds)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt('published_at', cursor);
  }

  return query;
}

/**
 * Fetch all published posts (for Discover / landing page), newest first.
 */
export async function fetchDiscoverPosts({ cursor = null, limit = 20, category = null, tag = null } = {}) {
  let query = supabase
    .from('published_posts_view')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (cursor) query = query.lt('published_at', cursor);
  if (category) query = query.eq('category', category);
  if (tag) query = query.contains('tags', [tag]);

  return query;
}

// ─────────────────────────────────────────────────────────────
// POSTS
// ─────────────────────────────────────────────────────────────

/**
 * Fetch a single published post by slug.
 */
export async function fetchPostBySlug(slug) {
  return supabase
    .from('published_posts_view')
    .select('*')
    .eq('slug', slug)
    .single();
}

/**
 * Fetch all drafts + published posts for the current author (for editor dashboard).
 */
export async function fetchMyPosts(authorId) {
  return supabase
    .from('posts')
    .select('id, title, slug, status, category, tags, word_count, reading_time, created_at, updated_at, published_at')
    .eq('author_id', authorId)
    .order('updated_at', { ascending: false });
}

/**
 * Create a new draft post.
 */
export async function createDraft({ authorId, title = '', content = '' }) {
  return supabase
    .from('posts')
    .insert({ author_id: authorId, title, content, status: 'draft' })
    .select()
    .single();
}

/**
 * Autosave a draft (upsert by id).
 */
export async function saveDraft({ id, title, content, excerpt, category, tags }) {
  const words = content.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return supabase
    .from('posts')
    .update({ title, content, excerpt, category, tags, word_count: wordCount, reading_time: readingTime })
    .eq('id', id)
    .select()
    .single();
}

/**
 * Publish a draft: set status, slug, published_at.
 * Slug is auto-generated from the title if not provided.
 */
export async function publishPost({ id, title, excerpt, category, tags }) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);

  const uniqueSlug = `${slug}-${id.slice(0, 8)}`;

  return supabase
    .from('posts')
    .update({
      status: 'published',
      slug: uniqueSlug,
      excerpt,
      category,
      tags,
      published_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
}

// ─────────────────────────────────────────────────────────────
// SUBSCRIPTIONS (follow / unfollow)
// ─────────────────────────────────────────────────────────────

/**
 * Get IDs of all authors a user follows.
 */
export async function fetchFollowedAuthorIds(subscriberId) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('author_id')
    .eq('subscriber_id', subscriberId);

  return { data: data?.map((s) => s.author_id) ?? [], error };
}

/**
 * Check if current user follows a specific author.
 */
export async function isFollowing(subscriberId, authorId) {
  const { data } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('subscriber_id', subscriberId)
    .eq('author_id', authorId)
    .maybeSingle();

  return !!data;
}

export async function followAuthor(subscriberId, authorId) {
  return supabase
    .from('subscriptions')
    .insert({ subscriber_id: subscriberId, author_id: authorId });
}

export async function unfollowAuthor(subscriberId, authorId) {
  return supabase
    .from('subscriptions')
    .delete()
    .eq('subscriber_id', subscriberId)
    .eq('author_id', authorId);
}

// ─────────────────────────────────────────────────────────────
// LIKES
// ─────────────────────────────────────────────────────────────

export async function likePost(userId, postId) {
  return supabase.from('likes').insert({ user_id: userId, post_id: postId });
}

export async function unlikePost(userId, postId) {
  return supabase.from('likes').delete().eq('user_id', userId).eq('post_id', postId);
}

export async function hasLiked(userId, postId) {
  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .maybeSingle();
  return !!data;
}

// ─────────────────────────────────────────────────────────────
// BOOKMARKS
// ─────────────────────────────────────────────────────────────

export async function bookmarkPost(userId, postId) {
  return supabase.from('bookmarks').insert({ user_id: userId, post_id: postId });
}

export async function unbookmarkPost(userId, postId) {
  return supabase.from('bookmarks').delete().eq('user_id', userId).eq('post_id', postId);
}

export async function fetchBookmarks(userId) {
  return supabase
    .from('bookmarks')
    .select('post_id, created_at, posts(id, title, slug, excerpt, category, reading_time, published_at, profiles(username, display_name, avatar_url))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}

// ─────────────────────────────────────────────────────────────
// COMMENTS
// ─────────────────────────────────────────────────────────────

export async function fetchComments(postId) {
  return supabase
    .from('comments')
    .select('id, content, parent_id, created_at, user_id, profiles(username, display_name, avatar_url)')
    .eq('post_id', postId)
    .eq('is_removed', false)
    .order('created_at', { ascending: true });
}

export async function addComment({ postId, userId, content, parentId = null }) {
  return supabase
    .from('comments')
    .insert({ post_id: postId, user_id: userId, content, parent_id: parentId })
    .select('id, content, parent_id, created_at, user_id')
    .single();
}

// ─────────────────────────────────────────────────────────────
// PROFILES
// ─────────────────────────────────────────────────────────────

export async function fetchProfile(username) {
  return supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();
}

export async function fetchAuthorPublishedPosts(authorId) {
  return supabase
    .from('published_posts_view')
    .select('*')
    .eq('author_id', authorId)
    .order('published_at', { ascending: false });
}

export async function fetchFollowerStats(authorId) {
  // To get followers (users following this author)
  const { count: followersCount } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', authorId);
    
  // To get following (authors this user is following)
  const { count: followingCount } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('subscriber_id', authorId);

  return { 
    followers: followersCount || 0, 
    following: followingCount || 0 
  };
}

export async function updateProfile(userId, updates) {
  return supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
}

// ─────────────────────────────────────────────────────────────
// READING PROGRESS
// ─────────────────────────────────────────────────────────────

export async function saveReadingProgress(userId, postId, progress) {
  return supabase
    .from('reading_progress')
    .upsert({ user_id: userId, post_id: postId, progress }, { onConflict: 'user_id,post_id' });
}

export async function fetchReadingProgress(userId, postIds) {
  return supabase
    .from('reading_progress')
    .select('post_id, progress')
    .eq('user_id', userId)
    .in('post_id', postIds);
}

// ─────────────────────────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────────────────────────

export async function reportPost({ reporterId, postId, reason, notes = '' }) {
  return supabase
    .from('reports')
    .insert({ reporter_id: reporterId, post_id: postId, reason, notes });
}

export async function reportComment({ reporterId, commentId, reason, notes = '' }) {
  return supabase
    .from('reports')
    .insert({ reporter_id: reporterId, comment_id: commentId, reason, notes });
}

// Admin only
export async function fetchOpenReports() {
  return supabase
    .from('reports')
    .select('*, reporter:profiles!reporter_id(username, display_name), post:posts(title, slug), comment:comments(content)')
    .eq('status', 'open')
    .order('created_at', { ascending: true });
}

export async function resolveReport(reportId, status, reviewerId) {
  return supabase
    .from('reports')
    .update({ status, reviewed_by: reviewerId, reviewed_at: new Date().toISOString() })
    .eq('id', reportId);
}

// ─────────────────────────────────────────────────────────────
// SNIPPETS (Phase 4.5)
// ─────────────────────────────────────────────────────────────

export async function fetchSnippets(authorId) {
  return supabase
    .from('snippets')
    .select('id, name, content, created_at')
    .eq('author_id', authorId)
    .order('name', { ascending: true });
}

export async function createSnippet({ authorId, name, content }) {
  return supabase
    .from('snippets')
    .insert({ author_id: authorId, name, content })
    .select()
    .single();
}

export async function deleteSnippet(snippetId) {
  return supabase
    .from('snippets')
    .delete()
    .eq('id', snippetId);
}
