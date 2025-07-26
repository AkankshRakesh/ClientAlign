import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LayoutDashboard } from "lucide-react"

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description: string | null
    status: string
  }
  progress: number
}

// Function to get gradient colors based on project ID
const getProjectGradient = (projectId: string) => {
  const gradients = [
    "from-purple-400 to-pink-400",
    "from-blue-400 to-cyan-400", 
    "from-green-400 to-emerald-400",
    "from-orange-400 to-red-400",
    "from-indigo-400 to-purple-400",
    "from-pink-400 to-rose-400",
    "from-cyan-400 to-blue-400",
    "from-emerald-400 to-green-400"
  ]
  
  let hash = 0
  for (let i = 0; i < projectId.length; i++) {
    hash = projectId.charCodeAt(i) + ((hash << 5) - hash)
  }
  return gradients[Math.abs(hash) % gradients.length]
}

export function ProjectCard({ project, progress }: ProjectCardProps) {
  const gradientClass = getProjectGradient(project.id)
  
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105 border border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/80 to-purple-50/30 dark:from-gray-900/80 dark:to-purple-900/20 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientClass} shadow-lg`}>
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div className="grid gap-1 flex-1">
            <CardTitle className="text-gray-800 dark:text-gray-100">{project.name}</CardTitle>
            <CardDescription className="line-clamp-2 text-gray-600 dark:text-gray-300">{project.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200">Progress</div>
            <div className="text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-700 dark:text-purple-300">
              {progress}% Complete
            </div>
          </div>
          <Progress 
            value={progress} 
            className="h-2 bg-gray-200/50 dark:bg-gray-700/50" 
          />
        </CardContent>
      </Card>
    </Link>
  )
}
