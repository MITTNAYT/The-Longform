-- ============================================================
-- The Longform — Initial Schema
-- Migration: 001_initial_schema.sql
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID extension (already enabled in Supabase by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES
-- Extends Supabase auth.users. One row per user, created on signup.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE NOT NULL,
  display_name  TEXT NOT NULL,
  bio           TEXT DEFAULT '',
  avatar_url    TEXT DEFAULT '',
  website_url   TEXT DEFAULT '',
  is_admin      BOOLEAN NOT NULL DEFAULT FALSE,
  -- stripe_customer_id TEXT, -- placeholder for future paid subscriptions
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: auto-create profile row when a new auth.users row is inserted
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    -- Default username from email prefix; user can change on onboarding
    LOWER(SPLIT_PART(NEW.email, '@', 1)) || '_' || SUBSTR(NEW.id::TEXT, 1, 6),
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.posts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title         TEXT NOT NULL DEFAULT '',
  slug          TEXT UNIQUE,               -- set on publish, null while draft
  excerpt       TEXT DEFAULT '',
  content       TEXT NOT NULL DEFAULT '',  -- raw markdown
  content_html  TEXT DEFAULT '',           -- rendered HTML (set server-side on publish)
  category      TEXT NOT NULL DEFAULT 'reflection'
                  CHECK (category IN ('poetry', 'reflection', 'personal', 'writing')),
  tags          TEXT[] NOT NULL DEFAULT '{}',
  status        TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'published', 'archived')),
  word_count    INTEGER NOT NULL DEFAULT 0,
  reading_time  INTEGER NOT NULL DEFAULT 0, -- minutes, ceil(word_count / 200)
  published_at  TIMESTAMPTZ,               -- null until published
  -- series_id  UUID,                      -- placeholder for Phase 3 series feature
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for feed query performance
CREATE INDEX IF NOT EXISTS idx_posts_author_status_published
  ON public.posts (author_id, status, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_posts_status_published
  ON public.posts (status, published_at DESC)
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_posts_tags
  ON public.posts USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_posts_category
  ON public.posts (category)
  WHERE status = 'published';

-- ============================================================
-- 3. SUBSCRIPTIONS (follows)
-- subscriber follows author
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscriber_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (subscriber_id, author_id),
  CHECK (subscriber_id != author_id)    -- can't follow yourself
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_subscriber
  ON public.subscriptions (subscriber_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_author
  ON public.subscriptions (author_id);

-- ============================================================
-- 4. LIKES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.likes (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id   UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_post ON public.likes (post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON public.likes (user_id);

-- ============================================================
-- 5. BOOKMARKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id   UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks (user_id);

-- ============================================================
-- 6. COMMENTS (threaded — one level deep)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.comments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id     UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id   UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- null = top-level
  content     TEXT NOT NULL CHECK (LENGTH(TRIM(content)) > 0),
  is_removed  BOOLEAN NOT NULL DEFAULT FALSE,  -- soft-delete for moderation
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_comments_post    ON public.comments (post_id, created_at);
CREATE INDEX IF NOT EXISTS idx_comments_parent  ON public.comments (parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_user    ON public.comments (user_id);

-- ============================================================
-- 7. REPORTS (user-submitted content reports)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reports (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id      UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id   UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  reason       TEXT NOT NULL
                 CHECK (reason IN ('spam', 'harassment', 'misinformation', 'explicit', 'other')),
  notes        TEXT DEFAULT '',
  status       TEXT NOT NULL DEFAULT 'open'
                 CHECK (status IN ('open', 'dismissed', 'actioned')),
  reviewed_by  UUID REFERENCES public.profiles(id),
  reviewed_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports (status, created_at DESC);

-- ============================================================
-- 8. NOTIFICATION QUEUE
-- Populated by the Edge Function; tracks sent emails to avoid dupes
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notification_queue (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id      UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  type         TEXT NOT NULL DEFAULT 'new_post'
                 CHECK (type IN ('new_post', 'weekly_digest')),
  sent_at      TIMESTAMPTZ,
  error        TEXT,                         -- if send failed, store error here
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (recipient_id, post_id, type)       -- idempotency guard
);

CREATE INDEX IF NOT EXISTS idx_notification_queue_recipient
  ON public.notification_queue (recipient_id, created_at DESC);

-- ============================================================
-- READING PROGRESS (bonus feature: "Continue reading")
-- Stored in localStorage client-side but also optionally server-side
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reading_progress (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id     UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  progress    SMALLINT NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, post_id)
);

CREATE TRIGGER reading_progress_updated_at
  BEFORE UPDATE ON public.reading_progress
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- HANDY VIEWS (optional but useful)
-- ============================================================

-- Published posts with author profile joined
CREATE OR REPLACE VIEW public.published_posts_view AS
  SELECT
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    p.category,
    p.tags,
    p.word_count,
    p.reading_time,
    p.published_at,
    p.created_at,
    pr.id          AS author_id,
    pr.username    AS author_username,
    pr.display_name AS author_display_name,
    pr.avatar_url  AS author_avatar_url,
    (SELECT COUNT(*) FROM public.likes    l WHERE l.post_id = p.id)::INT AS like_count,
    (SELECT COUNT(*) FROM public.bookmarks b WHERE b.post_id = p.id)::INT AS bookmark_count,
    (SELECT COUNT(*) FROM public.comments c WHERE c.post_id = p.id AND NOT c.is_removed)::INT AS comment_count
  FROM public.posts p
  JOIN public.profiles pr ON p.author_id = pr.id
  WHERE p.status = 'published';
