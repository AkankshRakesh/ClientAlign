import { Feedback } from "./Feedback";

// lib/models/Task.ts
export interface Task {
  _id: string;
  title: string;
  status: "todo" | "doing" | "done";
  assignedTo: string;
  comments: Feedback[];
}
