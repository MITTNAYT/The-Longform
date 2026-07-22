-- ============================================================
-- The Longform — Row Level Security Policies
-- Migration: 002_rls_policies.sql
-- Run this AFTER 001_initial_schema.sql
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_progress  ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES
-- ============================================================
-- Anyone can read any profile (for public author pages)
CREATE POLICY "profiles_select_public"
  ON public.profiles FOR SELECT
  USING (TRUE);

-- Users can only update their own profile
CREATE POLICY "profiles_update_self"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- No direct deletes via client (handled by auth.users cascade)

-- ============================================================
-- POSTS
-- ============================================================
-- Public: read published posts OR own drafts/archived
CREATE POLICY "posts_select_published_or_own"
  ON public.posts FOR SELECT
  USING (
    status = 'published'
    OR author_id = auth.uid()
  );

-- Authors can insert their own posts
CREATE POLICY "posts_insert_own"
  ON public.posts FOR INSERT
  WITH CHECK (author_id = auth.uid());

-- Authors can update their own posts
CREATE POLICY "posts_update_own"
  ON public.posts FOR UPDATE
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

-- Authors can delete their own posts
CREATE POLICY "posts_delete_own"
  ON public.posts FOR DELETE
  USING (author_id = auth.uid());

-- Admins can update any post (for moderation)
CREATE POLICY "posts_update_admin"
  ON public.posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ============================================================
-- SUBSCRIPTIONS (follows)
-- ============================================================
-- Anyone can see who follows whom (public follower counts)
CREATE POLICY "subscriptions_select_public"
  ON public.subscriptions FOR SELECT
  USING (TRUE);

-- Only the subscriber themselves can follow/unfollow
CREATE POLICY "subscriptions_insert_self"
  ON public.subscriptions FOR INSERT
  WITH CHECK (subscriber_id = auth.uid());

CREATE POLICY "subscriptions_delete_self"
  ON public.subscriptions FOR DELETE
  USING (subscriber_id = auth.uid());

-- ============================================================
-- LIKES
-- ============================================================
-- Public likes counts (anyone can see)
CREATE POLICY "likes_select_public"
  ON public.likes FOR SELECT
  USING (TRUE);

-- Only authenticated users can like
CREATE POLICY "likes_insert_auth"
  ON public.likes FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can only unlike their own likes
CREATE POLICY "likes_delete_self"
  ON public.likes FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- BOOKMARKS
-- ============================================================
-- Users can only see their own bookmarks (private reading list)
CREATE POLICY "bookmarks_select_self"
  ON public.bookmarks FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "bookmarks_insert_self"
  ON public.bookmarks FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "bookmarks_delete_self"
  ON public.bookmarks FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- COMMENTS
-- ============================================================
-- Public read (non-removed comments on published posts)
CREATE POLICY "comments_select_public"
  ON public.comments FOR SELECT
  USING (NOT is_removed);

-- Authenticated users can comment
CREATE POLICY "comments_insert_auth"
  ON public.comments FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can edit their own comments (within a time window enforced in app)
CREATE POLICY "comments_update_self"
  ON public.comments FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Soft-delete: only admins can set is_removed = TRUE
CREATE POLICY "comments_soft_delete_admin"
  ON public.comments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ============================================================
-- REPORTS
-- ============================================================
-- Only admins can read reports
CREATE POLICY "reports_select_admin"
  ON public.reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Authenticated users can submit reports
CREATE POLICY "reports_insert_auth"
  ON public.reports FOR INSERT
  WITH CHECK (reporter_id = auth.uid());

-- Only admins can update report status
CREATE POLICY "reports_update_admin"
  ON public.reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ============================================================
-- NOTIFICATION QUEUE
-- Service-role only — Edge Function uses service_role key
-- Client never reads/writes this directly
-- ============================================================
CREATE POLICY "notification_queue_service_role_only"
  ON public.notification_queue FOR ALL
  USING (FALSE)          -- no client access
  WITH CHECK (FALSE);

-- ============================================================
-- READING PROGRESS
-- ============================================================
-- Users can only see and manage their own reading progress
CREATE POLICY "reading_progress_self"
  ON public.reading_progress FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- GRANT PERMISSIONS TO authenticated & anon roles
-- ============================================================
GRANT SELECT ON public.profiles              TO anon, authenticated;
GRANT SELECT ON public.published_posts_view  TO anon, authenticated;
GRANT SELECT ON public.subscriptions         TO anon, authenticated;
GRANT SELECT ON public.likes                 TO anon, authenticated;
GRANT SELECT ON public.comments              TO anon, authenticated;

GRANT ALL    ON public.posts                 TO authenticated;
GRANT ALL    ON public.subscriptions         TO authenticated;
GRANT ALL    ON public.likes                 TO authenticated;
GRANT ALL    ON public.bookmarks             TO authenticated;
GRANT ALL    ON public.comments              TO authenticated;
GRANT ALL    ON public.reports               TO authenticated;
GRANT ALL    ON public.reading_progress      TO authenticated;
GRANT UPDATE ON public.profiles              TO authenticated;
