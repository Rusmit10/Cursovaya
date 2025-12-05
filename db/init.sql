CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    token VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user (password: admin123)
-- Hash generated with bcrypt
INSERT INTO users (username, email, hashed_password, is_active)
VALUES ('admin', 'admin@example.com', '$2b$12$/eMLxw..09.Bd6M91Ef6L.04EGPg89LH9TYGVZI1SKySzLC0IJAvu', TRUE)
ON CONFLICT (username) DO NOTHING;
