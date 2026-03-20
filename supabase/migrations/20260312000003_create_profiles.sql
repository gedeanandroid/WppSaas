CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'agent',
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  is_online BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
