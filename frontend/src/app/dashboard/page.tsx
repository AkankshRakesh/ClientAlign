"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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
} from "lucide-react";
import Link from "next/link";

type Project = {
  _id: string;
  title: string;
  description?: string;
  status?: "active" | "completed" | "on-hold";
  progress?: number;
  dueDate?: string;
  clientName?: string;
  createdAt?: string;
  participants?: { _id: string; name: string; image?: string }[];
};

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    image?: string;
  } | null>(null);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  type Invite = {
    _id: string;
    title: string;
    clientId?: { name?: string };
    clientName?: string;
  };

  const [invites, setInvites] = useState<Invite[]>([]);

  const signOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    window.location.href = "/signin";
  };

  const fetchInvites = async (token: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/users/invites`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setInvites(data);
      }
    } catch (err) {
      console.error("Error fetching invites:", err);
    }
  };

  const handleInviteResponse = async (
    projectId: string,
    action: "accept" | "reject",
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/projects/${projectId}/respond-invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action }),
        },
      );
      if (res.ok) {
        setInvites((prev) => prev.filter((invite) => invite._id !== projectId));
        fetchProjects();
      } else {
        console.error("Failed to respond to invite");
      }
    } catch (err) {
      console.error("Error responding to invite:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetchInvites(token || "");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    if (!token) {
      router.push("/signin");
    } else {
      setIsAuthenticated(true);
      try {
        setUser({ name: userName || undefined, email: userEmail || undefined });
      } catch {
        setUser(null);
      }
      fetchProjects();
    }
  }, [router]);

  useEffect(() => {
    let filtered = projects;
    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.clientName?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter((project) => project.status === filterStatus);
    }
    setFilteredProjects(filtered);
  }, [projects, searchQuery, filterStatus]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/projects`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else {
        console.error("Failed to fetch projects");
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsCreating(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/projects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ title, description }),
        },
      );
      if (res.ok) {
        const newProject = await res.json();
        setProjects((prev) => [newProject, ...prev]);
        setTitle("");
        setDescription("");
        setIsCreateDialogOpen(false);
      } else {
        console.error("Failed to create project");
      }
    } catch (err) {
      console.error("Error creating project:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "on-hold":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "active":
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      case "on-hold":
        return <AlertCircle className="h-3 w-3" />;
      case "active":
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "active").length,
    completedProjects: projects.filter((p) => p.status === "completed").length,
    onHoldProjects: projects.filter((p) => p.status === "on-hold").length,
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
          <p className="text-sm font-medium text-gray-600">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-8">
            <Link href="/" className="group flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 transition-colors group-hover:bg-gray-800">
                <span className="text-sm font-bold text-white">CA</span>
              </div>
              <span className="hidden font-semibold text-gray-900 sm:inline-block">
                ClientAlign
              </span>
            </Link>
            <nav className="hidden items-center space-x-1 md:flex">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/projects"
                className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                <Folder className="h-4 w-4" />
                <span>Projects</span>
              </Link>
              <Link
                href="/analytics"
                className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
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
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Invitations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {invites.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <Bell className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">No new invitations</p>
                  </div>
                ) : (
                  invites.map((invite) => (
                    <div
                      key={invite._id}
                      className="border-b border-gray-100 px-3 py-3 last:border-0"
                    >
                      <div className="space-y-2">
                        <div className="text-sm font-medium">
                          {invite.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          Invited by: {invite.clientName || "Unknown"}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() =>
                              handleInviteResponse(invite._id, "accept")
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 bg-transparent text-xs"
                            onClick={() =>
                              handleInviteResponse(invite._id, "reject")
                            }
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
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || ""}
                    />
                    <AvatarFallback className="bg-gray-100 font-medium text-gray-900">
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
                    <p className="text-sm leading-none font-medium">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-gray-500">
                      {user?.email}
                    </p>
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
              <h1 className="mb-1 text-2xl font-bold text-gray-900">
                Good morning, {user?.name?.split(" ")[0]}
              </h1>
              <p className="text-gray-600">
                Here&#39;s what&#39;s happening with your projects today.
              </p>
            </div>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-gray-900 text-white hover:bg-gray-800">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Add a new project to your workspace. You can always edit the
                    details later.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="project-title"
                      className="text-sm font-medium"
                    >
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
                    <label
                      htmlFor="project-description"
                      className="text-sm font-medium"
                    >
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
                    <Button
                      type="submit"
                      disabled={isCreating || !title.trim()}
                    >
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
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">
                    Total Projects
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalProjects}
                  </p>
                  <div className="mt-1 flex items-center text-xs text-green-600">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    <span>+12% from last month</span>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                  <Folder className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">
                    Active
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.activeProjects}
                  </p>
                  <div className="mt-1 flex items-center text-xs text-blue-600">
                    <Activity className="mr-1 h-3 w-3" />
                    <span>In progress</span>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.completedProjects}
                  </p>
                  <div className="mt-1 flex items-center text-xs text-green-600">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    <span>Successfully delivered</span>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">
                    On Hold
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.onHoldProjects}
                  </p>
                  <div className="mt-1 flex items-center text-xs text-amber-600">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    <span>Awaiting action</span>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-gray-200 pl-10 focus:border-gray-300 focus:ring-gray-300/20"
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
              <Card key={i} className="h-[280px] border-0 shadow-sm">
                <CardContent className="h-full p-6">
                  <div className="flex h-full animate-pulse flex-col space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="h-5 w-3/4 rounded bg-gray-200"></div>
                      <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                    </div>
                    <div className="h-3 w-1/2 rounded bg-gray-200"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 rounded bg-gray-200"></div>
                      <div className="h-3 w-2/3 rounded bg-gray-200"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <div className="h-6 w-20 rounded-full bg-gray-200"></div>
                        <div className="h-2 w-16 rounded bg-gray-200"></div>
                      </div>
                      <div className="h-px bg-gray-200"></div>
                      <div className="flex justify-between">
                        <div className="h-4 w-24 rounded bg-gray-200"></div>
                        <div className="h-4 w-20 rounded bg-gray-200"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Folder className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {projects.length === 0
                  ? "No projects yet"
                  : "No projects found"}
              </h3>
              <p className="mb-4 max-w-sm text-sm text-gray-500">
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
                className="group relative h-[280px] overflow-hidden border-0 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Subtle accent line */}
                <div
                  className={`absolute top-0 right-0 left-0 h-1 ${
                    project.status === "completed"
                      ? "bg-green-500"
                      : project.status === "on-hold"
                        ? "bg-amber-500"
                        : "bg-blue-500"
                  }`}
                ></div>

                <CardContent className="flex h-full flex-col p-6">
                  {/* Header Section */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <Link href={`/dashboard/${project._id}`}>
                        <h3 className="mb-2 cursor-pointer truncate text-lg leading-tight font-semibold transition-colors group-hover:text-gray-700">
                          {project.title}
                        </h3>
                      </Link>
                      {project.clientName && (
                        <div className="mb-3 flex items-center space-x-2">
                          <div className="flex items-center space-x-1 rounded-md bg-gray-50 px-2 py-1">
                            <User className="h-3 w-3 text-gray-500" />
                            <span className="text-xs font-medium text-gray-600">
                              {project.clientName}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 rounded-full p-0 opacity-100 transition-opacity hover:bg-gray-100"
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
                        <DropdownMenuItem className="text-red-600">
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Description Section */}
                  <div className="mb-4 flex-1">
                    {project.description ? (
                      <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
                        {project.description}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        No description provided
                      </p>
                    )}
                  </div>

                  {/* Status and Progress Section */}
                  <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className={`${getStatusColor(project.status)} px-3 py-1 font-medium`}
                      >
                        {getStatusIcon(project.status)}
                        <span className="ml-2 capitalize">
                          {project.status || "active"}
                        </span>
                      </Badge>
                      {project.progress !== undefined && (
                        <div className="flex items-center space-x-3">
                          <div className="flex flex-col items-end">
                            <span className="mb-1 text-xs font-semibold text-gray-700">
                              {project.progress}%
                            </span>
                            <Progress
                              value={project.progress}
                              className="h-2 w-20"
                            />
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
                              {new Date(project.dueDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        )}
                        {project.participants &&
                          project.participants.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <div className="flex -space-x-1">
                                <span className="text-xs text-gray-500">
                                  {project.participants.length} participant
                                  {project.participants.length !== 1 && "s"}
                                </span>

                                {project.participants.length > 3 && (
                                  <div
                                    key="more-participants"
                                    className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gray-100"
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
                        className="group/link inline-flex items-center text-sm font-medium text-gray-900 transition-colors hover:text-gray-700"
                      >
                        <span>View</span>
                        <ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
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
  );
}
