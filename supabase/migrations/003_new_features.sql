-- ==============================================================================
-- Migration 003: New Features (Snippets, Tips, Collections)
-- ==============================================================================

-- 1. Snippets Table
CREATE TABLE snippets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookup by author
CREATE INDEX idx_snippets_author ON snippets(author_id);

-- 2. Tips Table (Tip Jar)
CREATE TABLE tips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Can be null if anonymous? We'll enforce logged in for now.
    to_author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- Stored in cents
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tips_author ON tips(to_author_id);

-- 3. Collections Table (Paid Collections)
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL, -- Stored in cents
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Collection Posts (Join table: which posts belong to a collection)
CREATE TABLE collection_posts (
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (collection_id, post_id)
);

-- 5. Collection Purchases (Who bought what)
CREATE TABLE collection_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(buyer_id, collection_id)
);

-- ==============================================================================
-- RLS POLICIES FOR NEW TABLES
-- ==============================================================================

-- Enable RLS
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_purchases ENABLE ROW LEVEL SECURITY;

-- Snippets: Only the author can see and edit their own snippets
CREATE POLICY "Snippets are visible to author" ON snippets FOR SELECT USING (author_id = auth.uid());
CREATE POLICY "Snippets are editable by author" ON snippets FOR ALL USING (author_id = auth.uid());

-- Collections: Public read, author write
CREATE POLICY "Collections are publicly viewable" ON collections FOR SELECT USING (true);
CREATE POLICY "Collections are editable by author" ON collections FOR ALL USING (author_id = auth.uid());

-- Collection Posts: Public read, author write
CREATE POLICY "Collection posts are publicly viewable" ON collection_posts FOR SELECT USING (true);
CREATE POLICY "Collection posts are editable by author" ON collection_posts FOR ALL USING (
    EXISTS (SELECT 1 FROM collections c WHERE c.id = collection_id AND c.author_id = auth.uid())
);

-- Collection Purchases: Buyer can see their own purchases
CREATE POLICY "Purchases are visible to buyer" ON collection_purchases FOR SELECT USING (buyer_id = auth.uid());
-- Note: INSERTS will be handled by a secure backend hook (e.g. Supabase Edge Function handling Stripe Webhook), 
-- but for local dev we might allow inserting by the buyer directly if testing client-side.
CREATE POLICY "Purchases can be inserted by authenticated (for dev)" ON collection_purchases FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Tips: Sender and receiver can view
CREATE POLICY "Tips are visible to sender" ON tips FOR SELECT USING (from_user_id = auth.uid());
CREATE POLICY "Tips are visible to receiver" ON tips FOR SELECT USING (to_author_id = auth.uid());
CREATE POLICY "Tips can be inserted by sender" ON tips FOR INSERT WITH CHECK (from_user_id = auth.uid());
