CREATE TABLE IF NOT EXISTS sleep_goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    bedtime_time TEXT NOT NULL,
    wakeup_time TEXT NOT NULL,
    target_sleep_quality INTEGER NOT NULL CHECK (target_sleep_quality BETWEEN 1 AND 5),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
); 