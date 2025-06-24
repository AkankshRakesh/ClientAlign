// lib/models/User.ts
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "client" | "creator";
  invitedProjects: string[];
}
