-- Temporary fix: Disable RLS on problematic tables to stop infinite recursion
-- This is a quick fix while we implement proper policies

-- Disable RLS temporarily (CAUTION: This removes security temporarily)
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_members DISABLE ROW LEVEL SECURITY;

-- OR if you prefer to keep RLS enabled but fix the policies:

-- Re-enable RLS with fixed policies
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- Drop problematic policies
-- DROP POLICY IF EXISTS "Project members can view projects." ON projects;
-- DROP POLICY IF EXISTS "Project owners can manage project members." ON project_members;

-- Simple, non-circular policies
-- CREATE POLICY "Allow authenticated users to view projects they own" ON projects 
--   FOR SELECT USING (auth.uid() = owner_id);

-- CREATE POLICY "Allow authenticated users to view their memberships" ON project_members 
--   FOR SELECT USING (auth.uid() = profile_id);

-- CREATE POLICY "Allow project owners to manage members" ON project_members 
--   FOR ALL USING (
--     EXISTS (
--       SELECT 1 FROM projects 
--       WHERE projects.id = project_members.project_id 
--       AND projects.owner_id = auth.uid()
--     )
--   );

-- Note: The commented policies above might still cause issues.
-- The safest approach for now is to disable RLS temporarily.
