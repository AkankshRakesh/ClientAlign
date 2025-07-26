"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { useTransition } from "react"
import { toast } from "@/hooks/use-toast"

interface TaskItemProps {
  id: string
  title: string
  status: string
  onToggleStatus: (id: string, newStatus: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  isCreator: boolean
}

export function TaskItem({
  id,
  title,
  status,
  onToggleStatus,
  onDelete,
  isCreator,
}: TaskItemProps) {
  const [isPending, startTransition] = useTransition()
  const isCompleted = status === "done"

  const handleToggle = () => {
    if (!isCreator) {
      toast({
        title: "Permission Denied",
        description: "Only creators can update task status.",
        variant: "destructive",
      })
      return
    }
    startTransition(async () => {
      await onToggleStatus(id, isCompleted ? "to-do" : "done")
      toast({
        title: "Task Updated",
        description: `Task "${title}" marked as ${isCompleted ? "to-do" : "done"}.`,
      })
    })
  }

  const handleDelete = () => {
    if (!isCreator) {
      toast({
        title: "Permission Denied",
        description: "Only creators can delete tasks.",
        variant: "destructive",
      })
      return
    }
    startTransition(async () => {
      await onDelete(id)
      toast({
        title: "Task Deleted",
        description: `Task "${title}" has been removed.`,
      })
    })
  }

  return (
    <div className="flex items-center justify-between rounded-lg bg-muted p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center space-x-3">
        <Checkbox
          id={`task-${id}`}
          checked={isCompleted}
          onCheckedChange={handleToggle}
          disabled={isPending || !isCreator}
        />
        <label
          htmlFor={`task-${id}`}
          className={`font-medium ${isCompleted ? "text-muted-foreground line-through" : ""}`}
        >
          {title}
        </label>
      </div>
      {isCreator && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isPending}
          aria-label="Remove task"
        >
          <Trash className="w-5 h-5" />
        </Button>
      )}
    </div>
  )
}
