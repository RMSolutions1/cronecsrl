CREATE TABLE IF NOT EXISTS password_reset_tokens (
  token VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_reset_email ON password_reset_tokens(email);
