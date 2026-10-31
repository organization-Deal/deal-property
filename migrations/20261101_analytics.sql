CREATE TABLE IF NOT EXISTS analytics_events_v2 (
 id TEXT PRIMARY KEY, session TEXT NOT NULL, page_id TEXT NOT NULL, kind TEXT NOT NULL, path TEXT NOT NULL, target TEXT NOT NULL,
 source TEXT NOT NULL, medium TEXT NOT NULL DEFAULT '', campaign TEXT NOT NULL DEFAULT '', device TEXT NOT NULL,
 country TEXT NOT NULL DEFAULT '', region TEXT NOT NULL DEFAULT '', city TEXT NOT NULL DEFAULT '',
 value REAL NOT NULL DEFAULT 0, created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS analytics_v2_time ON analytics_events_v2(created_at);
CREATE INDEX IF NOT EXISTS analytics_v2_session ON analytics_events_v2(session,created_at);
