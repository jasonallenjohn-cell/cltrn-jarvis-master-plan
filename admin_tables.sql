-- Admin Backend Tables

-- 1. Document Tracking
CREATE TABLE IF NOT EXISTS document_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_document_views_document_id ON document_views(document_id);
CREATE INDEX IF NOT EXISTS idx_document_views_user_id ON document_views(user_id);

ALTER TABLE document_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all document views"
  ON document_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can insert their own views"
  ON document_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 2. Content & Learning
CREATE TABLE IF NOT EXISTS learning_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('study_material', 'assessment')),
  content JSONB NOT NULL,
  description TEXT,
  assigned_to UUID[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_materials_assigned_to ON learning_materials USING GIN(assigned_to);

ALTER TABLE learning_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage learning materials"
  ON learning_materials FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view assigned materials"
  ON learning_materials FOR SELECT
  USING (auth.uid() = ANY(assigned_to));

CREATE TABLE IF NOT EXISTS learning_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID REFERENCES learning_materials(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  score INTEGER,
  feedback TEXT,
  UNIQUE(material_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_learning_completions_user_id ON learning_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_completions_material_id ON learning_completions(material_id);

ALTER TABLE learning_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all completions"
  ON learning_completions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can manage their own completions"
  ON learning_completions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Agent Monitoring
CREATE TABLE IF NOT EXISTS agent_statuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('active', 'idle', 'error', 'offline')),
  active_mission TEXT,
  last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

ALTER TABLE agent_statuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view agent statuses"
  ON agent_statuses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Service role can manage agent statuses"
  ON agent_statuses FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE TABLE IF NOT EXISTS agent_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name TEXT NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('manual', 'scheduled', 'reaction')),
  triggered_by UUID REFERENCES auth.users(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
  result JSONB
);

CREATE INDEX IF NOT EXISTS idx_agent_runs_agent_name ON agent_runs(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_runs_started_at ON agent_runs(started_at DESC);

ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view agent runs"
  ON agent_runs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert manual runs"
  ON agent_runs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Service role can manage agent runs"
  ON agent_runs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
