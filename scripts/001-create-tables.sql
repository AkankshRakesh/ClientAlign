-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Roles for project members
CREATE TYPE project_role AS ENUM ('client', 'creator', 'admin');

-- Profiles table
CREATE TABLE profiles (
id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
email text UNIQUE NOT NULL,
full_name text,
avatar_url text,
created_at timestamp with time zone DEFAULT now()
);

-- Projects table
CREATE TABLE projects (
id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
name text NOT NULL,
description text,
status text DEFAULT 'active', -- e.g., 'active', 'completed', 'archived'
created_at timestamp with time zone DEFAULT now(),
owner_id uuid REFERENCES profiles(id) ON DELETE SET NULL -- The user who created the project
);

-- Project Members table (linking profiles to projects with roles)
CREATE TABLE project_members (
id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
role project_role NOT NULL,
joined_at timestamp with time zone DEFAULT now(),
UNIQUE (project_id, profile_id) -- A user can only be a member of a project once
);

-- Goals table
CREATE TABLE goals (
id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
title text NOT NULL,
description text,
due_date date,
completed boolean DEFAULT FALSE,
created_at timestamp with time zone DEFAULT now()
);

-- Milestones table
CREATE TABLE milestones (
id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
title text NOT NULL,
description text,
due_date date,
completed boolean DEFAULT FALSE,
created_at timestamp with time zone DEFAULT now()
);

-- Tasks table
CREATE TABLE tasks (
id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
goal_id uuid REFERENCES goals(id) ON DELETE SET NULL,
milestone_id uuid REFERENCES milestones(id) ON DELETE SET NULL,
assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
title text NOT NULL,
description text,
status text DEFAULT 'to-do', -- e.g., 'to-do', 'in progress', 'done'
due_date date,
created_at timestamp with time zone DEFAULT now()
);

-- Feedback table
CREATE TABLE feedback (
id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
task_id uuid REFERENCES tasks(id) ON DELETE SET NULL, -- Feedback can be tied to a task
from_profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
content text NOT NULL,
is_resolved boolean DEFAULT FALSE,
created_at timestamp with time zone DEFAULT now()
);

-- RLS Policies

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by authenticated users." ON profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project members can view projects." ON projects FOR SELECT USING (
EXISTS (SELECT 1 FROM project_members WHERE project_id = projects.id AND profile_id = auth.uid())
);
CREATE POLICY "Project owners can create projects." ON projects FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Project owners can update projects." ON projects FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Project owners can delete projects." ON projects FOR DELETE USING (auth.uid() = owner_id);

-- Project Members
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project members can view their own memberships." ON project_members FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Project owners can manage project members." ON project_members FOR ALL USING (
EXISTS (SELECT 1 FROM projects WHERE id = project_members.project_id AND owner_id = auth.uid())
);

-- Goals
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project members can view goals." ON goals FOR SELECT USING (
EXISTS (SELECT 1 FROM project_members WHERE project_id = goals.project_id AND profile_id = auth.uid())
);
CREATE POLICY "Creators can manage goals." ON goals FOR ALL USING (
EXISTS (SELECT 1 FROM project_members WHERE project_id = goals.project_id AND profile_id = auth.uid() AND role = 'creator')
);

-- Milestones
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project members can view milestones." ON milestones FOR SELECT USING (
EXISTS (SELECT 1 FROM project_members WHERE project_id = milestones.project_id AND profile_id = auth.uid())
);
CREATE POLICY "Creators can manage milestones." ON milestones FOR ALL USING (
EXISTS (SELECT 1 FROM project_members WHERE project_id = milestones.project_id AND profile_id = auth.uid() AND role = 'creator')
);

-- Tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project members can view tasks." ON tasks FOR SELECT USING (
EXISTS (SELECT 1 FROM project_members WHERE project_id = tasks.project_id AND profile_id = auth.uid())
);
CREATE POLICY "Creators can manage tasks." ON tasks FOR ALL USING (
EXISTS (SELECT 1 FROM project_members WHERE project_id = tasks.project_id AND profile_id = auth.uid() AND role = 'creator')
);

-- Feedback
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project members can view feedback." ON feedback FOR SELECT USING (
EXISTS (SELECT 1 FROM project_members WHERE project_id = feedback.project_id AND profile_id = auth.uid())
);
CREATE POLICY "Authenticated users can insert feedback." ON feedback FOR INSERT WITH CHECK (auth.uid() = from_profile_id);
CREATE POLICY "Creators can update feedback." ON feedback FOR UPDATE USING (
EXISTS (SELECT 1 FROM project_members WHERE project_id = feedback.project_id AND profile_id = auth.uid() AND role = 'creator')
);
