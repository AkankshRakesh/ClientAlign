"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

type Project = {
  _id: string
  title: string
  description?: string
  status?: string
  dueDate?: string
  participants?: { name: string; email: string; image?: string }[]
}

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("authToken")

    fetch(`http://localhost:5000/api/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then((data) => setProject(data))
      .catch((err) => {
        console.error(err)
        router.push("/dashboard")
      })
  }, [projectId, router])

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {project.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{project.description}</p>

          <div className="flex items-center space-x-2 mb-2">
            <Badge>{project.status || "active"}</Badge>
            {project.dueDate && (
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Participants */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Participants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {project.participants?.map((user, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || ""} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tasks Section (placeholder for now) */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Tasks (Coming Soon)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">This section will display tasks for the project.</p>
        </CardContent>
      </Card>
    </div>
  )
}
