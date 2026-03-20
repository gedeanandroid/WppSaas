-- Adicionar campos de licenciamento
ALTER TABLE organizations
  ADD COLUMN max_instances INT DEFAULT 1,
  ADD COLUMN max_api_keys INT DEFAULT 0;

-- Remover campo 'plan' (substituído por quantidades)
ALTER TABLE organizations DROP COLUMN IF EXISTS plan;
