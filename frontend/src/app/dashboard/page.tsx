"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
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
  Home,
  BarChart3,
  FileText,
  Star,
  Activity,
  ChevronRight,
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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ name?: string; email?: string; image?: string } | null>(null)
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  type Invite = {
    _id: string
    title: string
    clientId?: { name?: string }
    clientName?: string
  }

  const [invites, setInvites] = useState<Invite[]>([])

  const signOut = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    window.location.href = "/signin"
  }

  const fetchInvites = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/users/invites`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setInvites(data)
      }
    } catch (err) {
      console.error("Error fetching invites:", err)
    }
  }

  const handleInviteResponse = async (projectId: string, action: "accept" | "reject") => {
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/projects/${projectId}/respond-invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      })
      if (res.ok) {
        setInvites((prev) => prev.filter((invite) => invite._id !== projectId))
        fetchProjects()
      } else {
        console.error("Failed to respond to invite")
      }
    } catch (err) {
      console.error("Error responding to invite:", err)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    fetchInvites(token || "")
    const userName = localStorage.getItem("userName")
    const userEmail = localStorage.getItem("userEmail")
    if (!token) {
      router.push("/signin")
    } else {
      setIsAuthenticated(true)
      try {
        setUser({ name: userName || undefined, email: userEmail || undefined })
      } catch {
        setUser(null)
      }
      fetchProjects()
    }
  }, [router])

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/projects`, {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/projects`, {
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
        setIsCreateDialogOpen(false)
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
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "on-hold":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "active":
      default:
        return "bg-blue-50 text-blue-700 border-blue-200"
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-3 w-3" />
      case "on-hold":
        return <AlertCircle className="h-3 w-3" />
      case "active":
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "active").length,
    completedProjects: projects.filter((p) => p.status === "completed").length,
    onHoldProjects: projects.filter((p) => p.status === "on-hold").length,
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 group-hover:bg-gray-800 transition-colors">
                <span className="text-sm font-bold text-white">CA</span>
              </div>
              <span className="hidden font-semibold text-gray-900 sm:inline-block">ClientAlign</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-100 text-gray-900 font-medium text-sm"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/projects"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors text-sm"
              >
                <Folder className="h-4 w-4" />
                <span>Projects</span>
              </Link>
              <Link
                href="/analytics"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors text-sm"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {invites.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Invitations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {invites.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No new invitations</p>
                  </div>
                ) : (
                  invites.map((invite) => (
                    <div key={invite._id} className="px-3 py-3 border-b border-gray-100 last:border-0">
                      <div className="space-y-2">
                        <div className="font-medium text-sm">{invite.title}</div>
                        <div className="text-xs text-gray-500">Invited by: {invite.clientName || "Unknown"}</div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => handleInviteResponse(invite._id, "accept")}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 bg-transparent"
                            onClick={() => handleInviteResponse(invite._id, "reject")}
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                    <AvatarFallback className="bg-gray-100 text-gray-900 font-medium">
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
                    <p className="text-xs leading-none text-gray-500">{user?.email}</p>
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
      </header>

      <div className="container px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Good morning, {user?.name?.split(" ")[0]}</h1>
              <p className="text-gray-600">Here&#39;s what&#39;s happening with your projects today.</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Add a new project to your workspace. You can always edit the details later.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="project-title" className="text-sm font-medium">
                      Project Title
                    </label>
                    <Input
                      id="project-title"
                      placeholder="Enter project title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      disabled={isCreating}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="project-description" className="text-sm font-medium">
                      Description (Optional)
                    </label>
                    <Textarea
                      id="project-description"
                      placeholder="Brief description of the project"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={isCreating}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      disabled={isCreating}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isCreating || !title.trim()}>
                      {isCreating ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Project
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    <span>+12% from last month</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Folder className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
                  <div className="flex items-center text-xs text-blue-600 mt-1">
                    <Activity className="mr-1 h-3 w-3" />
                    <span>In progress</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedProjects}</p>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    <span>Successfully delivered</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">On Hold</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.onHoldProjects}</p>
                  <div className="flex items-center text-xs text-amber-600 mt-1">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    <span>Awaiting action</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-amber-50 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus:border-gray-300 focus:ring-gray-300/20"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px] border-gray-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-0 shadow-sm h-[280px]">
                <CardContent className="p-6 h-full">
                  <div className="animate-pulse space-y-4 h-full flex flex-col">
                    <div className="flex justify-between items-start">
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                        <div className="h-2 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="h-px bg-gray-200"></div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                <Folder className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {projects.length === 0 ? "No projects yet" : "No projects found"}
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mb-4">
                {projects.length === 0
                  ? "Create your first project to get started with ClientAlign."
                  : "Try adjusting your search or filter criteria."}
              </p>
              {projects.length === 0 && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Project
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card
                key={project._id}
                className="group border-0 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 h-[280px] bg-white relative overflow-hidden"
              >
                {/* Subtle accent line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    project.status === "completed"
                      ? "bg-green-500"
                      : project.status === "on-hold"
                        ? "bg-amber-500"
                        : "bg-blue-500"
                  }`}
                ></div>

                <CardContent className="p-6 h-full flex flex-col">
                  {/* Header Section */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <Link href={`/dashboard/${project._id}`}>
                        <h3 className="font-semibold text-lg mb-2 truncate group-hover:text-gray-700 transition-colors cursor-pointer leading-tight">
                          {project.title}
                        </h3>
                      </Link>
                      {project.clientName && (
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="flex items-center space-x-1 px-2 py-1 bg-gray-50 rounded-md">
                            <User className="h-3 w-3 text-gray-500" />
                            <span className="text-xs font-medium text-gray-600">{project.clientName}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-100 transition-opacity rounded-full hover:bg-gray-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Star className="mr-2 h-4 w-4" />
                          Add to Favorites
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete Project</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Description Section */}
                  <div className="flex-1 mb-4">
                    {project.description ? (
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{project.description}</p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No description provided</p>
                    )}
                  </div>

                  {/* Status and Progress Section */}
                  <div className="space-y-4 mt-auto">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className={`${getStatusColor(project.status)} font-medium px-3 py-1`}>
                        {getStatusIcon(project.status)}
                        <span className="ml-2 capitalize">{project.status || "active"}</span>
                      </Badge>
                      {project.progress !== undefined && (
                        <div className="flex items-center space-x-3">
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-semibold text-gray-700 mb-1">{project.progress}%</span>
                            <Progress value={project.progress} className="w-20 h-2" />
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator className="bg-gray-100" />

                    {/* Footer Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {project.dueDate && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>
                              Due{" "}
                              {new Date(project.dueDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                        {project.participants && project.participants.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <div className="flex -space-x-1">
                              <span className="text-xs text-gray-500">
                              {project.participants.length} participant{project.participants.length !== 1 && "s"}
                            </span>

                              {project.participants.length > 3 && (
                              <div
                                key="more-participants"
                                className="h-5 w-5 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center"
                              >
                                <span className="text-xs font-medium text-gray-600">
                                  +{project.participants.length - 3}
                                </span>
                              </div>
                            )}

                            </div>
                          </div>
                        )}
                      </div>
                      <Link
                        href={`/dashboard/${project._id}`}
                        className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors group/link"
                      >
                        <span>View</span>
                        <ChevronRight className="ml-1 h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
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
