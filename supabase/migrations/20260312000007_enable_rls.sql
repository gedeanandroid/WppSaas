ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Standard policy: users can only see and modify data connected to their organization.
-- We use a function or subquery to get the current user's organization_id from the profiles table.

CREATE POLICY "Allow access to own organization" ON organizations
  FOR ALL
  TO authenticated
  USING (id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Allow access to org departments" ON departments
  FOR ALL
  TO authenticated
  USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Allow access to org profiles" ON profiles
  FOR ALL
  TO authenticated
  USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Allow access to org channels" ON channels
  FOR ALL
  TO authenticated
  USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Allow access to org conversations" ON conversations
  FOR ALL
  TO authenticated
  USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Allow access to org messages" ON messages
  FOR ALL
  TO authenticated
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE organization_id = (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- Bypassing RLS for service_role during webhook/system events automatically applies since service_role bypasses RLS by default.
