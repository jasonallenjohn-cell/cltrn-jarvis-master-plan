# Supabase Integration Setup

This document provides instructions for setting up the Supabase integration for K0RE.

## Prerequisites

1. Access to all 3 Supabase projects:
   - **Command Center**: `lwnyvbibdjskbchexwra`
   - **Trillium**: `qbxtimjhsvqsxoemheqc`
   - **Arterial**: `ckrsbstgxzhplxgsciwq`

2. Supabase CLI installed: `npm install -g supabase`

## Setup Steps

### 1. Run Database Migration

Apply the user_profiles table migration to Command Center:

```bash
# Navigate to project root
cd /Users/jasonallenjohn/.gemini/antigravity/scratch/kore

# Run migration (you'll need to connect to Command Center project)
supabase db push --project-ref lwnyvbibdjskbchexwra
```

### 2. Configure Auth Providers

In the Supabase dashboard for Command Center:

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider with magic link
3. Enable **Google** provider:
   - Add your Google OAuth client ID and secret
   - Add redirect URLs:
     - Development: `http://localhost:3000/auth/callback`
     - Production: `https://kore.app/auth/callback`

### 3. Set Up ops_config Table

Create the `ops_config` table in Command Center to store cross-project credentials:

```sql
CREATE TABLE ops_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert cross-project credentials
INSERT INTO ops_config (key, value) VALUES
  ('tr_supabase_url', 'https://qbxtimjhsvqsxoemheqc.supabase.co'),
  ('tr_service_role_key', 'your_trillium_service_role_key'),
  ('art_supabase_url', 'https://ckrsbstgxzhplxgsciwq.supabase.co'),
  ('art_service_role_key', 'your_arterial_service_role_key'),
  ('service_role_key', 'your_command_center_service_role_key');
```

### 4. Generate TypeScript Types

Generate types from all 3 Supabase projects:

```bash
# Command Center
npx supabase gen types typescript --project-id lwnyvbibdjskbchexwra > packages/api/src/types/command-center.ts

# Trillium
npx supabase gen types typescript --project-id qbxtimjhsvqsxoemheqc > packages/api/src/types/trillium.ts

# Arterial
npx supabase gen types typescript --project-id ckrsbstgxzhplxgsciwq > packages/api/src/types/arterial.ts
```

### 5. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your actual keys:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual Supabase keys from each project's settings.

### 6. Install Dependencies

```bash
npm install
```

## Usage Examples

### Authentication

```typescript
import { signInWithMagicLink, signInWithGoogle, getCurrentUser } from '@kore/api';

// Magic link sign in
await signInWithMagicLink('user@example.com');

// Google OAuth sign in
await signInWithGoogle();

// Get current user
const user = await getCurrentUser();
```

### User Profiles

```typescript
import { getUserProfile, updateUserProfile, completeOnboarding } from '@kore/api';

// Get user profile
const profile = await getUserProfile(userId);

// Update K0RE score
await updateUserProfile(userId, { kore_score: 850 });

// Complete onboarding
await completeOnboarding(userId, { dreamData: {...} });
```

### Cross-Project Access

```typescript
import { createTrilliumClient, createArterialClient } from '@kore/api';

// Access Trillium (financial data)
const trilliumClient = await createTrilliumClient(true); // service role
const { data } = await trilliumClient.from('transactions').select('*');

// Access Arterial (health data)
const arterialClient = await createArterialClient(true);
const { data: healthData } = await arterialClient.from('vitals').select('*');
```

## Testing

1. **Test Magic Link Flow**:
   - Sign in with email
   - Check email for magic link
   - Click link and verify redirect

2. **Test Google OAuth**:
   - Click "Sign in with Google"
   - Authorize app
   - Verify redirect and session

3. **Test User Profile Creation**:
   - Sign up new user
   - Verify profile is auto-created
   - Check referral code is generated

4. **Test RLS Policies**:
   - Try to access another user's profile (should fail)
   - Update own profile (should succeed)

## Files Created

- `supabase/migrations/20260214_create_user_profiles.sql` — Database migration
- `packages/api/src/supabase/client.ts` — Client factory functions
- `packages/api/src/supabase/auth.ts` — Auth helpers
- `packages/api/src/types/command-center.ts` — Command Center types
- `packages/api/src/types/trillium.ts` — Trillium types
- `packages/api/src/types/arterial.ts` — Arterial types
- `.env.example` — Environment variable template
