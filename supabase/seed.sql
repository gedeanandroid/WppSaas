-- SEED DATA FOR MULTI-ATENDIMENTO
-- Create a default organization
INSERT INTO organizations (id, name, slug, plan, max_agents)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Acme Corp',
  'acme-corp',
  'pro',
  10
) ON CONFLICT (id) DO NOTHING;

-- Create default departments
INSERT INTO departments (id, organization_id, name)
VALUES 
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Vendas'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Suporte')
ON CONFLICT (id) DO NOTHING;

-- Create a default channel
INSERT INTO channels (id, organization_id, type, name, phone_number, status)
VALUES (
  '20000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'whatsapp',
  'WhatsApp Oficial',
  '+5511999999999',
  'connected'
) ON CONFLICT (id) DO NOTHING;

-- *Note*: We cannot easily seed auth.users in standard SQL without using Supabase Admin API.
-- Profiles should be created via triggers or application logic after user signup.
