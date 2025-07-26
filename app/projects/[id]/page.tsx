import { Badge } from "@/components/ui/badge";
import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TaskItem } from "@/components/task-item";
import { FeedbackItem } from "@/components/feedback-item";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { revalidatePath } from "next/cache";

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const projectId = params.id;
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] text-center">
        <h2 className="text-2xl font-bold">
          Please log in to view project details.
        </h2>
        <p className="text-muted-foreground mt-2">
          You can set up authentication in your Supabase project.
        </p>
      </div>
    );
  }

  // Fetch project details and check user's role
  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_members(role),
      goals(*),
      milestones(*),
      tasks(*),
      feedback(
        *,
        profiles(full_name, email)
      )
    `,
    )
    .eq("id", projectId)
    .single();

  if (projectError || !projectData) {
    console.error("Error fetching project:", projectError);
    notFound();
  }

  const userRole = projectData.project_members.find(
    (member) => member.profile_id === user.id,
  )?.role;

  if (!userRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] text-center">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground mt-2">
          You are not a member of this project.
        </p>
      </div>
    );
  }

  const isCreator = userRole === "creator" || userRole === "admin";

  // Calculate overall project progress (dummy for now)
  const totalTasks = projectData.tasks.length;
  const completedTasks = projectData.tasks.filter(
    (task) => task.status === "done",
  ).length;
  const projectProgress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Server Actions
  const toggleTaskStatus = async (taskId: string, newStatus: string) => {
    "use server";
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated.");
    }

    // Verify user is a creator/admin for this project
    const { data: member, error: memberError } = await supabase
      .from("project_members")
      .select("role")
      .eq("project_id", projectId)
      .eq("profile_id", user.id)
      .single();

    if (
      memberError ||
      !member ||
      (member.role !== "creator" && member.role !== "admin")
    ) {
      throw new Error(
        "Permission denied. Only creators/admins can update tasks.",
      );
    }

    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task status:", error);
      throw new Error("Failed to update task status.");
    }
    revalidatePath(`/projects/${projectId}`);
  };

  const deleteTask = async (taskId: string) => {
    "use server";
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated.");
    }

    // Verify user is a creator/admin for this project
    const { data: member, error: memberError } = await supabase
      .from("project_members")
      .select("role")
      .eq("project_id", projectId)
      .eq("profile_id", user.id)
      .single();

    if (
      memberError ||
      !member ||
      (member.role !== "creator" && member.role !== "admin")
    ) {
      throw new Error(
        "Permission denied. Only creators/admins can delete tasks.",
      );
    }

    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      console.error("Error deleting task:", error);
      throw new Error("Failed to delete task.");
    }
    revalidatePath(`/projects/${projectId}`);
  };

  const addFeedback = async (formData: FormData) => {
    "use server";
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated.");
    }

    const content = formData.get("feedbackContent") as string;
    if (!content) {
      throw new Error("Feedback content cannot be empty.");
    }

    const { error } = await supabase.from("feedback").insert({
      project_id: projectId,
      from_profile_id: user.id,
      content: content,
    });

    if (error) {
      console.error("Error adding feedback:", error);
      throw new Error("Failed to add feedback.");
    }
    revalidatePath(`/projects/${projectId}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-2">{projectData.name}</h1>
      <p className="text-muted-foreground mb-6">{projectData.description}</p>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Project Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>
              Current status and progress of the project.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <div className="text-sm font-medium mb-2">Overall Progress</div>
              <Progress value={projectProgress} className="h-3" />
              <div className="text-xs text-muted-foreground mt-1">
                {projectProgress}% Completed
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Goals</h3>
                {projectData.goals.length > 0 ? (
                  projectData.goals.map((goal) => (
                    <div
                      key={goal.id}
                      className="flex items-center justify-between text-sm py-1"
                    >
                      <span>{goal.title}</span>
                      <Badge variant={goal.completed ? "secondary" : "outline"}>
                        {goal.completed ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No goals defined.
                  </p>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Milestones</h3>
                {projectData.milestones.length > 0 ? (
                  projectData.milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="flex items-center justify-between text-sm py-1"
                    >
                      <span>{milestone.title}</span>
                      <Badge
                        variant={milestone.completed ? "secondary" : "outline"}
                      >
                        {milestone.completed ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No milestones defined.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Manage project tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            {projectData.tasks.length > 0 ? (
              <div className="space-y-3">
                {projectData.tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    status={task.status}
                    onToggleStatus={toggleTaskStatus}
                    onDelete={deleteTask}
                    isCreator={isCreator}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No tasks for this project.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Feedback */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
            <CardDescription>
              Client and creator feedback on the project.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
              {projectData.feedback.length > 0 ? (
                projectData.feedback.map((feedback) => (
                  <FeedbackItem key={feedback.id} feedback={feedback} />
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  No feedback yet. Be the first to leave one!
                </p>
              )}
            </div>
            <form action={addFeedback} className="flex flex-col gap-3">
              <Textarea
                name="feedbackContent"
                placeholder="Leave your feedback here..."
                rows={3}
                required
              />
              <Button type="submit" className="self-end">
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
