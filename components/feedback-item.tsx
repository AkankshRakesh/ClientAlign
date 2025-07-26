import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface FeedbackItemProps {
  feedback: {
    id: string;
    content: string;
    is_resolved: boolean;
    created_at: string;
    from_profile_id: string;
    profiles: {
      full_name: string | null;
      email: string;
    } | null;
  };
}

export function FeedbackItem({ feedback }: FeedbackItemProps) {
  const senderName =
    feedback.profiles?.full_name || feedback.profiles?.email || "Unknown User";
  const createdAt = new Date(feedback.created_at);

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{senderName}</span>
          <span className="text-sm text-muted-foreground">
            {format(createdAt, "MMM dd, yyyy HH:mm")}
          </span>
        </div>
        <Badge variant={feedback.is_resolved ? "secondary" : "default"}>
          {feedback.is_resolved ? "Resolved" : "Open"}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{feedback.content}</p>
      </CardContent>
    </Card>
  );
}
