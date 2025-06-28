// lib/models/Goal.ts
import { Task } from "./Task";

export interface Goal {
  _id: string;
  title: string;
  status: "not-started" | "in-progress" | "done";
  dueDate: Date;
  tasks: Task[];
}
