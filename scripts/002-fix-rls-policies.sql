-- Fix infinite recursion in RLS policies by updating both projects and project_members policies
-- to use a more direct approach that avoids circular dependencies

-- Drop the existing problematic policies
DROP POLICY IF EXISTS "Project members can view projects." ON projects;
DROP POLICY IF EXISTS "Project owners can manage project members." ON project_members;

-- Create security definer functions to avoid RLS recursion
-- These functions bypass RLS when checking membership and ownership

-- Function to check if user is project owner (bypasses RLS)
CREATE OR REPLACE FUNCTION is_project_owner(project_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM projects 
    WHERE id = project_uuid 
    AND owner_id = user_uuid
  );
$$;

-- Function to check if user is project member (bypasses RLS)
CREATE OR REPLACE FUNCTION is_project_member(project_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM project_members 
    WHERE project_id = project_uuid 
    AND profile_id = user_uuid
  );
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION is_project_owner(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION is_project_member(uuid, uuid) TO authenticated;

-- Create new non-circular policies for projects
CREATE POLICY "Project access policy" ON projects FOR SELECT USING (
  auth.uid() = owner_id 
  OR 
  is_project_member(id, auth.uid())
);

-- Create new non-circular policies for project_members
-- Users can view their own memberships
CREATE POLICY "Users can view their own memberships" ON project_members FOR SELECT USING (
  auth.uid() = profile_id
);

-- Project owners can manage members (using the security definer function)
CREATE POLICY "Project owners can manage members" ON project_members FOR ALL USING (
  is_project_owner(project_id, auth.uid())
);

-- Allow project owners to insert new members
CREATE POLICY "Project owners can add members" ON project_members FOR INSERT WITH CHECK (
  is_project_owner(project_id, auth.uid())
);

-- Create a helper function to get user projects safely
CREATE OR REPLACE FUNCTION get_user_projects(user_id uuid)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  status text,
  created_at timestamptz,
  owner_id uuid
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT DISTINCT p.id, p.name, p.description, p.status, p.created_at, p.owner_id
  FROM projects p
  LEFT JOIN project_members pm ON p.id = pm.project_id
  WHERE pm.profile_id = user_id
  OR p.owner_id = user_id;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_projects(uuid) TO authenticated;

-- Create an additional bypass function for emergency use
CREATE OR REPLACE FUNCTION get_user_projects_bypass_rls(user_id uuid)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  status text,
  created_at timestamptz,
  owner_id uuid
)
LANGUAGE sql
SECURITY DEFINER
SET row_security = off
AS $$
  SELECT DISTINCT p.id, p.name, p.description, p.status, p.created_at, p.owner_id
  FROM projects p
  LEFT JOIN project_members pm ON p.id = pm.project_id
  WHERE pm.profile_id = user_id
  OR p.owner_id = user_id;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_projects_bypass_rls(uuid) TO authenticated;
