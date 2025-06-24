import { Goal } from "./Goal";

// lib/models/Project.ts
export interface Project {
  _id: string;
  name: string;
  description: string;
  creator: string; // user id
  clients: string[];
  members: string[]; // all users
  goals: Goal[];
}
