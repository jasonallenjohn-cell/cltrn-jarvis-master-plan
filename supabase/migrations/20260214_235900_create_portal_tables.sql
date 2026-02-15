-- Add role column to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin'));

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  shared_with UUID[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted'))
);

-- Create indexes for documents
CREATE INDEX IF NOT EXISTS idx_documents_created_by ON documents(created_by);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_shared_with ON documents USING GIN(shared_with);

-- Enable RLS on documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documents
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view documents shared with them' AND tablename = 'documents') THEN
    CREATE POLICY "Users can view documents shared with them"
      ON documents FOR SELECT
      USING (auth.uid() = ANY(shared_with) OR auth.uid() = created_by);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage all documents' AND tablename = 'documents') THEN
    CREATE POLICY "Admins can manage all documents"
      ON documents FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  recipient_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(recipient_id, read_at) WHERE read_at IS NULL;

-- Enable RLS on messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their messages' AND tablename = 'messages') THEN
    CREATE POLICY "Users can view their messages"
      ON messages FOR SELECT
      USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can send messages' AND tablename = 'messages') THEN
    CREATE POLICY "Users can send messages"
      ON messages FOR INSERT
      WITH CHECK (auth.uid() = sender_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Recipients can mark messages as read' AND tablename = 'messages') THEN
    CREATE POLICY "Recipients can mark messages as read"
      ON messages FOR UPDATE
      USING (auth.uid() = recipient_id);
  END IF;
END $$;
