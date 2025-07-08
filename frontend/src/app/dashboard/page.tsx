"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
interface Project {
  _id: string;
  title: string;
  description?: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setProjects(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-12">
      <div className="container mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
            Welcome to Your Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            View and manage your projects below
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center text-gray-500">
            You haven&#39;t created any projects yet.
            <Link href="/get-started">
              <Button className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Create Your First Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: Project) => (
              <Card
                key={project._id}
                className="bg-white shadow-md hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {project.description || "No description provided."}
                  </p>
                  <Link href={`/dashboard/${project._id}`}>
                    <Button variant="outline">View Project</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
