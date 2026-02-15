-- Update a user's role to 'admin' for testing
-- Replace 'your-email@example.com' with your actual email

UPDATE user_profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';

-- Verify the update
SELECT id, email, role FROM user_profiles WHERE role = 'admin';
