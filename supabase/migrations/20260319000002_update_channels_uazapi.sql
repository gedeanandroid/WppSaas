ALTER TABLE channels
  ADD COLUMN instance_url TEXT,
  ADD COLUMN instance_token TEXT,
  ADD COLUMN qr_code TEXT,
  ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
