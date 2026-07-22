-- ==============================================================================
-- Migration 004: Patch published_posts_view to include author_bio and content
-- Run this in: Supabase Dashboard → SQL Editor
-- ==============================================================================

-- Replace the view to add author bio and full post content
CREATE OR REPLACE VIEW public.published_posts_view AS
  SELECT
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    p.content,               -- full markdown content (needed for PostDetail)
    p.category,
    p.tags,
    p.word_count,
    p.reading_time,
    p.published_at,
    p.created_at,
    p.author_id,
    pr.username    AS author_username,
    pr.display_name AS author_display_name,
    pr.avatar_url  AS author_avatar_url,
    pr.bio         AS author_bio,             -- needed for author card on PostDetail
    (SELECT COUNT(*) FROM public.likes    l WHERE l.post_id = p.id)::INT AS like_count,
    (SELECT COUNT(*) FROM public.bookmarks b WHERE b.post_id = p.id)::INT AS bookmark_count,
    (SELECT COUNT(*) FROM public.comments c WHERE c.post_id = p.id AND NOT c.is_removed)::INT AS comment_count
  FROM public.posts p
  JOIN public.profiles pr ON p.author_id = pr.id
  WHERE p.status = 'published';
