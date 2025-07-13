import express from 'express';
import { createProject, getUserProjects, getProjectById, inviteUserToProject, respondToInvite } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route("/")
  .post(protect, createProject)
  .get(protect, getUserProjects);
router.get("/:id", protect, getProjectById);
router.post("/:projectId/invite", protect, inviteUserToProject);
router.post("/:projectId/respond-invite", protect, respondToInvite);
export default router;
