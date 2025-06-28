import express from "express";
import passport from "passport";
import { loginUser, registerUser } from "../controllers/authController.js";
import { generateToken } from "../utils/generateToken.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Local auth
router.post("/login", loginUser);
router.post("/register", registerUser);

// GitHub OAuth start
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

// GitHub OAuth callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "http://localhost:3000/signin",
  }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.redirect(`http://localhost:3000/get-started?token=${token}`);
  },
);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:3000/signin",
  }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.redirect(`http://localhost:3000/get-started?token=${token}`);
  },
);

router.get("/verify", protect, (req, res) => {
  res.json({ valid: true, user: req.user });
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // if you're using cookies for sessions
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

export default router;
