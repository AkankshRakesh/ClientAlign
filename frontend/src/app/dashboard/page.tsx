"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  LogOut,
  Settings,
  Bell,
  Folder,
} from "lucide-react"
import Link from "next/link"

type Project = {
  _id: string
  title: string
  description?: string
  status?: "active" | "completed" | "on-hold"
  progress?: number
  dueDate?: string
  clientName?: string
  createdAt?: string
  participants?: { _id: string; name: string; image?: string }[]
}


export default function DashboardPage() {
  // const [participants, setParticipants] = useState<string[]>([]) // will be user IDs
  const [isAuthenticated, setIsAuthenticated] = useState(false);
const [user, setUser] = useState<{ name?: string; email?: string; image?: string } | null>(null);
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const signOut = () => {
    localStorage.removeItem("authToken"); // or cookies if you store it there
    window.location.href = "/signin"; // redirect to login page
  };
  // Redirect if not authenticated
  useEffect(() => {
  const token = localStorage.getItem("authToken");
  const storedUser = localStorage.getItem("user");

  if (!token) {
    router.push("/signin");
  } else {
    setIsAuthenticated(true);
    try {
      setUser(JSON.parse(storedUser || "{}"));
    } catch {
      setUser(null);
    }
    fetchProjects();
  }
}, [router]);


  // Filter projects based on search and status
  useEffect(() => {
    let filtered = projects

    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.clientName?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((project) => project.status === filterStatus)
    }

    setFilteredProjects(filtered)
  }, [projects, searchQuery, filterStatus])

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("authToken")
      const res = await fetch("http://localhost:5000/api/projects", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      } else {
        console.error("Failed to fetch projects")
      }
    } catch (err) {
      console.error("Error fetching projects:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsCreating(true)
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ title, description }),
      })

      if (res.ok) {
        const newProject = await res.json()
        setProjects((prev) => [newProject, ...prev])
        setTitle("")
        setDescription("")
      } else {
        console.error("Failed to create project")
      }
    } catch (err) {
      console.error("Error creating project:", err)
    } finally {
      setIsCreating(false)
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 hover:bg-green-200"
      case "on-hold":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
      case "active":
      default:
        return "bg-blue-100 text-blue-700 hover:bg-blue-200"
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "on-hold":
        return <AlertCircle className="h-4 w-4" />
      case "active":
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  // Mock stats - replace with real data
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "active").length,
    completedProjects: projects.filter((p) => p.status === "completed").length,
    onHoldProjects: projects.filter((p) => p.status === "on-hold").length,
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CA</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ClientAlign
                </span>
              </Link>
              <div className="hidden md:flex items-center space-x-1 text-sm text-gray-500">
                <span>/</span>
                <span>Dashboard</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                      <AvatarFallback>
                        {user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-gray-600">Here&#39;s what&#39;s happening with your projects today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Folder className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeProjects}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.completedProjects}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">On Hold</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.onHoldProjects}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Project Section */}
        <Card className="mb-8 border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Create New Project</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Project Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isCreating}
                />
                <div className="md:col-span-1">
                  <Button type="submit" disabled={isCreating || !title.trim()} className="w-full md:w-auto">
                    {isCreating ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Project
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <Textarea
                placeholder="Project Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isCreating}
                rows={3}
              />
            </form>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Folder className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {projects.length === 0 ? "No projects yet" : "No projects found"}
              </h3>
              <p className="text-gray-600 mb-4">
                {projects.length === 0
                  ? "Create your first project to get started with ClientAlign."
                  : "Try adjusting your search or filter criteria."}
              </p>
              {projects.length === 0 && (
                <Button onClick={() => document.getElementById("project-title")?.focus()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project._id}
                className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>
                      {project.clientName && <p className="text-sm text-gray-500 mb-2">Client: {project.clientName}</p>}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Project</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getStatusColor(project.status)}>
                      {getStatusIcon(project.status)}
                      <span className="ml-1 capitalize">{project.status || "active"}</span>
                    </Badge>
                    {project.progress !== undefined && (
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{project.progress}%</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    {project.dueDate && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    <Link
                      href={`/dashboard/${project._id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                    >
                      View Project →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
