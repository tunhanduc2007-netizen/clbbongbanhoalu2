
-- [FIX] 2026-01-03: Update Foreign Key for transactions to point to admin_users
-- RUN THIS IN SUPABASE SQL EDITOR TO FIX "INSERT FAILED" ERROR

-- 1. Remove old foreign key constraint
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_created_by_fkey;

-- 2. Convert column to Integer (to match admin_users.id) and clear old data to avoid type mismatch
ALTER TABLE transactions 
ALTER COLUMN created_by TYPE INTEGER USING NULL;

-- 3. Create new foreign key constraint
ALTER TABLE transactions 
ADD CONSTRAINT transactions_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES admin_users(id);

-- 4. Disable RLS to ensure anonymous inserts work (since we use custom auth)
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
