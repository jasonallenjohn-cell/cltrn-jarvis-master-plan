# Manual Database Setup for Portal Tables

Since the Supabase CLI migration history doesn't match between local and remote, we'll apply the SQL directly via the Supabase Dashboard.

## Step 1: Apply Portal Tables SQL

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project (Command Center)
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the SQL below
6. Click **Run** (or press Cmd+Enter)

```sql
-- Add role column to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin'));

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE POLICY "Users can view documents shared with them"
  ON documents FOR SELECT
  USING (auth.uid() = ANY(shared_with) OR auth.uid() = created_by);

CREATE POLICY "Admins can manage all documents"
  ON documents FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can mark messages as read"
  ON messages FOR UPDATE
  USING (auth.uid() = recipient_id);
```

## Step 2: Create Supabase Storage Bucket

1. In Supabase Dashboard, navigate to **Storage** in the left sidebar
2. Click **New bucket**
3. Configure:
   - **Name:** `documents`
   - **Public:** ❌ (unchecked - private bucket)
   - **File size limit:** 50 MB
   - **Allowed MIME types:** Leave empty (or specify: `application/pdf`, `application/vnd.*`, `image/*`, `text/*`)
4. Click **Create bucket**

## Step 3: Set Storage Policies

After creating the bucket, set up access policies:

1. Click on the `documents` bucket
2. Go to **Policies** tab
3. Click **New policy**

**Policy 1: Users can read shared documents**
```sql
CREATE POLICY "Users can read shared documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM documents
    WHERE file_url LIKE '%' || name
    AND (auth.uid() = ANY(shared_with) OR auth.uid() = created_by)
  )
);
```

**Policy 2: Admins can upload documents**
```sql
CREATE POLICY "Admins can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

## Step 4: Regenerate TypeScript Types

After applying the SQL, regenerate types to fix TypeScript errors:

```bash
cd /Users/jasonallenjohn/.gemini/antigravity/scratch/kore
npm run generate:types
```

## Step 5: Verify Tables

In Supabase Dashboard, go to **Table Editor** and verify:
- ✅ `user_profiles` has `role` column
- ✅ `documents` table exists
- ✅ `messages` table exists
- ✅ `documents` storage bucket exists

## Next Steps

Once the tables are created and types are regenerated:
1. Test the portal at `http://localhost:3000/portal`
2. Create a test user with role 'customer'
3. Test real-time messaging
4. Upload a test document as admin
5. Verify document sharing works

---

**Note:** The migration history mismatch is because the remote Supabase project has migrations from previous work that aren't in the local `supabase/migrations` directory. This is common when working with an existing project. The manual SQL approach ensures the schema is applied correctly without migration conflicts.
