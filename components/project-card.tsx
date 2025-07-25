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

export function ProjectCard({ project, progress }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center gap-4">
          <LayoutDashboard className="w-8 h-8 text-muted-foreground" />
          <div className="grid gap-1">
            <CardTitle>{project.name}</CardTitle>
            <CardDescription className="line-clamp-2">{project.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-2">
          <div className="text-sm font-medium">Progress</div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground">{progress}% Completed</div>
        </CardContent>
      </Card>
    </Link>
  )
}
