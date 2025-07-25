import { createServerClient } from "@/lib/supabase/server"
import { ProjectCard } from "@/components/project-card"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function ProjectsPage() {
  const { supabase } = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div className="text-red-500">Please log in to view projects.</div>
  }

  // Simple approach: get user's own projects and projects where they're members
  // This avoids the circular RLS issue by separating the queries completely
  
  let userProjects: Project[] = []
  
  try {
    // Strategy 1: Get all projects (if RLS is disabled) and filter client-side
    const { data: allProjects, error: allError } = await supabase
      .from('projects')
      .select('id, name, description, status, created_at, owner_id')

    const { data: memberships, error: memberError } = await supabase
      .from('project_members')
      .select('project_id')
      .eq('profile_id', user.id)

    if (!allError && allProjects && !memberError) {
      // Filter projects where user is owner or member
      const memberProjectIds = memberships?.map(m => m.project_id) || []
      
      userProjects = allProjects.filter(project => 
        project.owner_id === user.id || memberProjectIds.includes(project.id)
      )
    } else {
      // Strategy 2: If RLS is still enabled, use the separate queries approach
      // First, get projects where user is the owner
      const { data: ownedProjects, error: ownedError } = await supabase
        .from('projects')
        .select('id, name, description, status, created_at, owner_id')
        .eq('owner_id', user.id)

      if (!ownedError && ownedProjects) {
        userProjects = [...ownedProjects]
      }

      // Then get project memberships
      if (!memberError && memberships && memberships.length > 0) {
        const memberProjectIds = memberships.map(m => m.project_id)
        
        // Filter out projects we already have from ownership
        const ownedIds = userProjects.map(p => p.id)
        const newProjectIds = memberProjectIds.filter(id => !ownedIds.includes(id))
        
        if (newProjectIds.length > 0) {
          // Try to fetch member projects one by one to avoid RLS conflicts
          for (const projectId of newProjectIds) {
            try {
              const { data: memberProject, error: projectError } = await supabase
                .from('projects')
                .select('id, name, description, status, created_at, owner_id')
                .eq('id', projectId)
                .single()

              if (!projectError && memberProject) {
                userProjects.push(memberProject)
              }
            } catch (err) {
              console.log(`Skipping project ${projectId} due to RLS restrictions`)
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching projects:", error)
    return <div className="text-red-500">Error loading projects. Please check the database configuration.</div>
  }
  
  interface Project {
    id: string
    name: string
    description: string | null
    status: string
    created_at: string
    owner_id: string
  }

  // For demonstration, calculate a dummy progress
  const getDummyProgress = (projectId: string) => {
    // Simple hash-based dummy progress
    let hash = 0
    for (let i = 0; i < projectId.length; i++) {
      hash = projectId.charCodeAt(i) + ((hash << 5) - hash)
    }
    return Math.abs(hash % 100) // Progress between 0 and 99
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Projects</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center p-6 border-2 border-dashed hover:border-primary transition-colors cursor-pointer">
          <Link href="#" className="flex flex-col items-center gap-2">
            <Plus className="w-8 h-8 text-muted-foreground" />
            <span className="text-lg font-medium text-muted-foreground">Create New Project</span>
          </Link>
        </Card>
        {userProjects.length > 0 ? (
          userProjects.map((project: Project) => (
            <ProjectCard key={project.id} project={project} progress={getDummyProgress(project.id)} />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">
            No projects found. Create one to get started!
          </p>
        )}
      </div>
    </div>
  )
}
