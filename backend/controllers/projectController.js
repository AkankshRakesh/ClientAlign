import Project from '../models/Project.js';
import User from "../models/User.js";
import mongoose from "mongoose";

export const createProject = async (req, res) => {
  const { title, description, participants = [] } = req.body;

  try {
    const creatorId = req.user._id;
    const creatorName = req.user.name || 'Unknown Creator';

    const project = await Project.create({
      title,
      description,
      creator: creatorId,
      clientName: creatorName,
      participants: [...new Set([creatorId, ...participants])], // ensures creator is included
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const inviteUserToProject = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  try {
    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ message: "Project not found" });

    // Already a participant?
    if (project.participants.includes(userId)) {
      return res.status(400).json({ message: "User already in project" });
    }

    // Already invited?
    const existingInvite = project.invites.find((inv) => inv.user.toString() === userId);
    if (existingInvite) {
      return res.status(400).json({ message: "User already invited" });
    }

    // Push new invite
    project.invites.push({ user: userId });
    await project.save();

    res.status(200).json({ message: "Invite sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending invite" });
  }
};

export const respondToInvite = async (req, res) => {
  const { projectId } = req.params;
  const { action } = req.body; // 'accept' or 'reject'
  const userId = req.user.id;

  try {
    const project = await Project.findById(projectId);

    const invite = project.invites.find((inv) => inv.user.toString() === userId);

    if (!invite || invite.status !== "pending") {
      return res.status(400).json({ message: "No pending invite found" });
    }
    const inviteIndex = project.invites.findIndex((inv) => inv.user.toString() === userId);
    if (action === "accept") {
      project.participants.push(userId);
      project.invites.splice(inviteIndex, 1); 
    } else if (action === "reject") {
      invite.status = "rejected";
      project.invites.splice(inviteIndex, 1); 
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await project.save();

    res.status(200).json({ message: `Invite ${action}ed successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating invite" });
  }
};

// controllers/projectController.js
export const getUserProjects = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({
      participants: userId,
    });

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("participants", "name email image")
    if (!project) return res.status(404).json({ message: "Project not found" })
    res.json(project)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}