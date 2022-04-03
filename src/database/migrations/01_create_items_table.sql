CREATE TABLE IF NOT EXISTS items (
   id INTEGER PRIMARY KEY,
   position INT(3) DEFAULT '0',
   label TEXT UNIQUE,
   created_at TIMESTAMP
)