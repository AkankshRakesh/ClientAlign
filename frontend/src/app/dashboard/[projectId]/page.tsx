"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Calendar,
  ArrowLeft,
  MoreVertical,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  FileText,
  Activity,
  Settings,
  Edit3,
  Trash2,
  Share2,
  Download,
  Upload,
  Star,
  Target,
  TrendingUp,
  CalendarIcon,
  User,
} from "lucide-react";

type Project = {
  _id: string;
  title: string;
  description?: string;
  status?: "active" | "completed" | "on-hold";
  progress?: number;
  dueDate?: string;
  createdAt?: string;
  clientName?: string;
  participants?: {
    _id: string;
    name: string;
    email: string;
    image?: string;
    role?: string;
  }[];
  invites?: { user: string }[];
};

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  assignee?: string;
  dueDate?: string;
  createdAt: string;
};

type ActivityItem = {
  _id: string;
  type: "task_created" | "task_completed" | "comment_added" | "file_uploaded";
  description: string;
  user: string;
  timestamp: string;
};

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");

        // Fetch project details
        const projectRes = await fetch(
          `http://localhost:5000/api/projects/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!projectRes.ok) throw new Error("Failed to fetch project");
        const projectData = await projectRes.json();
        setProject(projectData);

        // Mock tasks data - replace with actual API call
        setTasks([
          {
            _id: "1",
            title: "Design wireframes",
            description: "Create initial wireframes for the project",
            status: "completed",
            priority: "high",
            assignee: "John Doe",
            dueDate: "2024-01-15",
            createdAt: "2024-01-01",
          },
          {
            _id: "2",
            title: "Implement authentication",
            description: "Set up user authentication system",
            status: "in-progress",
            priority: "high",
            assignee: "Jane Smith",
            dueDate: "2024-01-20",
            createdAt: "2024-01-05",
          },
          {
            _id: "3",
            title: "Write documentation",
            description: "Create comprehensive project documentation",
            status: "todo",
            priority: "medium",
            dueDate: "2024-01-25",
            createdAt: "2024-01-10",
          },
        ]);

        // Mock activity data - replace with actual API call
        setActivities([
          {
            _id: "1",
            type: "task_completed",
            description: "completed task 'Design wireframes'",
            user: "John Doe",
            timestamp: "2024-01-15T10:30:00Z",
          },
          {
            _id: "2",
            type: "comment_added",
            description: "added a comment to 'Implement authentication'",
            user: "Jane Smith",
            timestamp: "2024-01-14T15:45:00Z",
          },
          {
            _id: "3",
            type: "task_created",
            description: "created task 'Write documentation'",
            user: "John Doe",
            timestamp: "2024-01-10T09:15:00Z",
          },
        ]);
      } catch (err) {
        console.error(err);
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProjectData();
    }
  }, [projectId, router]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { _id: string; name: string; email: string; image?: string }[]
  >([]);
  const handleInvite = async (user: { _id: string }) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `http://localhost:5000/api/projects/${projectId}/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: user._id }),
        },
      );

      const result = await res.json();

      if (res.ok) {
        window.location.reload();
      } else {
        alert(result.message || "Invite failed");
      }
    } catch (err) {
      console.error("Invite error", err);
      alert("Invite failed due to network/server issue.");
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchUsers = async () => {
        if (!searchQuery.trim()) return setSearchResults([]);
        try {
          const token = localStorage.getItem("authToken");
          const res = await fetch(
            `http://localhost:5000/api/users/search?query=${searchQuery}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          const data = await res.json();
          setSearchResults(data);
        } catch (err) {
          console.error("User search failed", err);
        }
      };
      fetchUsers();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsAddingTask(true);
    try {
      // Mock task creation - replace with actual API call
      const newTask: Task = {
        _id: Date.now().toString(),
        title: newTaskTitle,
        status: "todo",
        priority: "medium",
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
      setNewTaskTitle("");
    } catch (err) {
      console.error("Failed to create task:", err);
    } finally {
      setIsAddingTask(false);
    }
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId
          ? {
              ...task,
              status:
                task.status === "completed"
                  ? "todo"
                  : ("completed" as Task["status"]),
            }
          : task,
      ),
    );
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
        return <CheckCircle className="h-4 w-4" />;
      case "on-hold":
        return <AlertCircle className="h-4 w-4" />;
      case "active":
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const completedTasks = tasks.filter(
    (task) => task.status === "completed",
  ).length;
  const totalTasks = tasks.length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-muted-foreground text-sm">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold">Project not found</h2>
          <p className="text-muted-foreground mb-4">
            The project you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{project.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="mr-2 h-4 w-4" />
                  Add to Favorites
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Project Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container px-6 py-8">
        {/* Project Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <h1 className="mb-2 text-3xl font-bold tracking-tight">
                {project.title}
              </h1>
              {project.description && (
                <p className="text-muted-foreground text-lg">
                  {project.description}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant="secondary"
                className={getStatusColor(project.status)}
              >
                {getStatusIcon(project.status)}
                <span className="ml-1 capitalize">
                  {project.status || "active"}
                </span>
              </Badge>
            </div>
          </div>

          {/* Project Stats */}
          <div className="mb-6 grid gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Progress
                    </p>
                    <p className="text-2xl font-bold">{progressPercentage}%</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
                <Progress value={progressPercentage} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Tasks
                    </p>
                    <p className="text-2xl font-bold">
                      {completedTasks}/{totalTasks}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Team
                    </p>
                    <p className="text-2xl font-bold">
                      {project.participants?.length || 0}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Due Date
                    </p>
                    <p className="text-sm font-medium">
                      {project.dueDate
                        ? new Date(project.dueDate).toLocaleDateString()
                        : "Not set"}
                    </p>
                  </div>
                  <CalendarIcon className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Project Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      Client
                    </label>
                    <p className="text-sm">
                      {project.clientName || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      Created
                    </label>
                    <p className="text-sm">
                      {project.createdAt
                        ? new Date(project.createdAt).toLocaleDateString()
                        : "Unknown"}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      Status
                    </label>
                    <div className="mt-1">
                      <Badge
                        variant="secondary"
                        className={getStatusColor(project.status)}
                      >
                        {getStatusIcon(project.status)}
                        <span className="ml-1 capitalize">
                          {project.status || "active"}
                        </span>
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activities.slice(0, 3).map((activity) => (
                      <div
                        key={activity._id}
                        className="flex items-start space-x-3"
                      >
                        <div className="mt-2 h-2 w-2 rounded-full bg-blue-500"></div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span>{" "}
                            {activity.description}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Tasks ({completedTasks}/{totalTasks})
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Task</DialogTitle>
                        <DialogDescription>
                          Add a new task to this project.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddTask} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">
                            Task Title
                          </label>
                          <Input
                            placeholder="Enter task title"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            type="submit"
                            disabled={isAddingTask || !newTaskTitle.trim()}
                          >
                            {isAddingTask ? "Creating..." : "Create Task"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task._id}
                      className="hover:bg-muted/50 flex items-center space-x-3 rounded-lg border p-3 transition-colors"
                    >
                      <Checkbox
                        checked={task.status === "completed"}
                        onCheckedChange={() => toggleTaskStatus(task._id)}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <p
                            className={`text-sm font-medium ${
                              task.status === "completed"
                                ? "text-muted-foreground line-through"
                                : ""
                            }`}
                          >
                            {task.title}
                          </p>
                          <Badge
                            variant="outline"
                            className={getPriorityColor(task.priority)}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-muted-foreground mt-1 text-xs">
                            {task.description}
                          </p>
                        )}
                        <div className="text-muted-foreground mt-2 flex items-center space-x-4 text-xs">
                          {task.assignee && (
                            <span className="flex items-center">
                              <User className="mr-1 h-3 w-3" />
                              {task.assignee}
                            </span>
                          )}
                          {task.dueDate && (
                            <span className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Task</DropdownMenuItem>
                          <DropdownMenuItem>Assign to</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete Task
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Team Members ({project.participants?.length || 0})
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Invite Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite a Member</DialogTitle>
                        <DialogDescription>
                          Search for a user by name to invite them to this
                          project.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <Input
                          placeholder="Search by username"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="max-h-60 space-y-2 overflow-y-auto">
                          {searchResults
                            .filter((user) => {
                              const isParticipant = project.participants?.some(
                                (p) => p._id === user._id,
                              );
                              const isInvited = project.invites?.some(
                                (inv) => inv.user === user._id,
                              );
                              return !isParticipant && !isInvited;
                            })
                            .map((user) => (
                              <div
                                key={user._id}
                                className="hover:bg-muted flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2"
                                onClick={() => handleInvite(user)}
                              >
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.image || ""} />
                                    <AvatarFallback>
                                      {user.name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {user.name}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                                <Button size="sm">Invite</Button>
                              </div>
                            ))}
                          {searchQuery && searchResults.length === 0 && (
                            <p className="text-muted-foreground text-sm">
                              No users found.
                            </p>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {project.participants?.map((user, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-3 rounded-lg border p-3"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image || ""} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {user.email}
                        </p>
                        {user.role && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {user.role}
                          </Badge>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Remove from Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Project Files
                  </CardTitle>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center">
                  <FileText className="text-muted-foreground mx-auto h-12 w-12" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No files uploaded
                  </h3>
                  <p className="text-muted-foreground">
                    Upload files to share with your team.
                  </p>
                  <Button className="mt-4">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Your First File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Project Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div
                      key={activity._id}
                      className="flex items-start space-x-3 border-b pb-4 last:border-b-0"
                    >
                      <div className="mt-2 h-2 w-2 rounded-full bg-blue-500"></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>{" "}
                          {activity.description}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
