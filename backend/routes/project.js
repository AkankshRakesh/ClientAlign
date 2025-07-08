import express from 'express';
import { createProject, getUserProjects, getProjectById } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route("/")
  .post(protect, createProject)
  .get(protect, getUserProjects);
router.get("/:id", protect, getProjectById);
export default router;
