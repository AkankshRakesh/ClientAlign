import Project from '../models/Project.js';

export const createProject = async (req, res) => {
  const { title, description, participants = [] } = req.body;

  try {
    const creatorId = req.user._id;

    const project = await Project.create({
      title,
      description,
      creator: creatorId,
      participants: [...new Set([creatorId, ...participants])], // ensures creator is included
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
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