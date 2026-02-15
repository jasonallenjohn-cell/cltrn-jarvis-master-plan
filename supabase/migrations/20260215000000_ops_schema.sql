
-- K0RE Agent Orchestration Schema
-- Based on CLAUDE.md architecture

-- 1. Configuration
CREATE TABLE IF NOT EXISTS ops_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Proposals (Intake)
CREATE TABLE IF NOT EXISTS ops_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    source TEXT NOT NULL CHECK (source IN ('user', 'api', 'reaction', 'schedule')),
    status TEXT NOT NULL CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'processing', 'completed', 'failed')),
    priority INTEGER DEFAULT 1, -- 1=Normal, 2=High, 3=Critical
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Missions (Units of Work)
CREATE TABLE IF NOT EXISTS ops_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES ops_proposals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('queued', 'in_progress', 'completed', 'failed', 'cancelled')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    result_summary TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Mission Steps (Individual Tasks)
CREATE TABLE IF NOT EXISTS ops_mission_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id UUID REFERENCES ops_missions(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    agent_slug TEXT NOT NULL, -- e.g., 'agent-broker'
    action TEXT NOT NULL, -- e.g., 'analyze_deal'
    payload JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL CHECK (status IN ('pending', 'queued', 'running', 'completed', 'failed', 'skipped')),
    result JSONB,
    error TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient polling
CREATE INDEX IF NOT EXISTS idx_ops_mission_steps_status ON ops_mission_steps(status);
CREATE INDEX IF NOT EXISTS idx_ops_mission_steps_agent ON ops_mission_steps(agent_slug);

-- 5. Events (Audit Trail & Reaction Triggers)
CREATE TABLE IF NOT EXISTS ops_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id UUID REFERENCES ops_missions(id) ON DELETE SET NULL,
    step_id UUID REFERENCES ops_mission_steps(id) ON DELETE SET NULL,
    agent_slug TEXT NOT NULL,
    event_type TEXT NOT NULL, -- e.g., 'deal_qualified'
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ops_events_type ON ops_events(event_type);

-- 6. Reactions (Event Chaining)
CREATE TABLE IF NOT EXISTS ops_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trigger_event TEXT NOT NULL, -- e.g., 'broker.deal_qualified'
    target_agent TEXT NOT NULL,
    target_action TEXT NOT NULL,
    payload_template JSONB, -- JSON with variable placeholders
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE ops_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops_mission_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops_reactions ENABLE ROW LEVEL SECURITY;

-- Admins can do everything (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins full access to ops' AND tablename = 'ops_config') THEN
    CREATE POLICY "Admins full access to ops" ON ops_config FOR ALL USING (
      EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins full access to proposals' AND tablename = 'ops_proposals') THEN
    CREATE POLICY "Admins full access to proposals" ON ops_proposals FOR ALL USING (
      EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins full access to missions' AND tablename = 'ops_missions') THEN
    CREATE POLICY "Admins full access to missions" ON ops_missions FOR ALL USING (
      EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins full access to steps' AND tablename = 'ops_mission_steps') THEN
    CREATE POLICY "Admins full access to steps" ON ops_mission_steps FOR ALL USING (
      EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins full access to events' AND tablename = 'ops_events') THEN
    CREATE POLICY "Admins full access to events" ON ops_events FOR ALL USING (
      EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins full access to reactions' AND tablename = 'ops_reactions') THEN
    CREATE POLICY "Admins full access to reactions" ON ops_reactions FOR ALL USING (
      EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

-- Service Role (Agents) Access
-- Note: Service role bypasses RLS, but if needed we can add specific policies.
