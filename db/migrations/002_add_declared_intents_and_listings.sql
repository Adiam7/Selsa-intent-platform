-- ============================================================
-- Intent Platform — Add Consumer Intents & Listings
-- Run:  psql $DATABASE_URL -f db/migrations/002_add_declared_intents_and_listings.sql
-- ============================================================
-- ── Add declared_intents to users ─────────────────────────────
ALTER TABLE users
ADD COLUMN IF NOT EXISTS declared_intents TEXT [] DEFAULT '{}';
CREATE INDEX IF NOT EXISTS idx_users_declared_intents ON users USING GIN (declared_intents);
-- ── Listings ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    intent_type TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings (user_id);
CREATE INDEX IF NOT EXISTS idx_listings_intent_type ON listings (intent_type);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings (category);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings (status);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings (created_at DESC);
-- ── Updated-at trigger for listings ───────────────────────────
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_listings_updated_at'
) THEN CREATE TRIGGER trg_listings_updated_at BEFORE
UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
END IF;
END;
$$;