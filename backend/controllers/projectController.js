import Project from '../models/Project.js';

export const createProject = async (req, res) => {
  const { title, description, clients } = req.body;

  try {
    const project = await Project.create({
      title,
      description,
      creator: req.user.id, // assuming this is set by your auth middleware
      clients
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
