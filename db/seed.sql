-- Demo seed data
-- Run:  psql $DATABASE_URL -f db/seed.sql
BEGIN;
-- Seed users
INSERT INTO users (id, email, password_hash, display_name)
VALUES (
        'a0000000-0000-0000-0000-000000000001',
        'alice@example.com',
        '$2b$12$placeholder',
        'Alice Demo'
    ),
    (
        'a0000000-0000-0000-0000-000000000002',
        'bob@example.com',
        '$2b$12$placeholder',
        'Bob Demo'
    ),
    (
        'a0000000-0000-0000-0000-000000000003',
        'carol@example.com',
        '$2b$12$placeholder',
        'Carol Demo'
    ) ON CONFLICT DO NOTHING;
-- Seed sessions
INSERT INTO sessions (id, user_id, start_time, page_views, event_count)
VALUES (
        'b0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        NOW() - INTERVAL '1 hour',
        5,
        12
    ),
    (
        'b0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000002',
        NOW() - INTERVAL '30 min',
        2,
        4
    ) ON CONFLICT DO NOTHING;
-- Seed intent scores
INSERT INTO intent_scores (user_id, score, intent_type, confidence, signals)
VALUES (
        'a0000000-0000-0000-0000-000000000001',
        82,
        'high_purchase',
        0.85,
        '[{"name":"add_to_cart","value":3,"weight":25}]'
    ),
    (
        'a0000000-0000-0000-0000-000000000002',
        55,
        'research',
        0.70,
        '[{"name":"search_count","value":4,"weight":10}]'
    ),
    (
        'a0000000-0000-0000-0000-000000000003',
        20,
        'churn_risk',
        0.60,
        '[{"name":"remove_from_cart","value":1,"weight":25}]'
    ) ON CONFLICT (user_id) DO
UPDATE
SET score = EXCLUDED.score,
    intent_type = EXCLUDED.intent_type,
    updated_at = NOW();
-- Seed segments
INSERT INTO segments (id, name, description, rules_json, operator)
VALUES (
        'c0000000-0000-0000-0000-000000000001',
        'High Purchase Intent',
        'Users with score ≥ 70',
        '[{"field":"score","operator":"gte","value":70}]',
        'AND'
    ),
    (
        'c0000000-0000-0000-0000-000000000002',
        'Churn Risk',
        'Users likely to disengage',
        '[{"field":"intent_type","operator":"eq","value":"churn_risk"}]',
        'AND'
    ) ON CONFLICT DO NOTHING;
COMMIT;