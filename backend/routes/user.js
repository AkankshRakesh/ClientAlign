import express from "express";
const router = express.Router();
import { searchUsers, getUserInvites } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

router.get("/search", protect, searchUsers);
router.get("/invites", protect, getUserInvites);
export default router;