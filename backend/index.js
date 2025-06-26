import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import User from "./models/User.js";
import { generateToken } from "./utils/generateToken.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // adjust for prod
  credentials: true,
}));

app.use(express.json());
app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/api/auth/github/callback",
  scope: ["user:email"]
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: profile.displayName || profile.username,
        email: email || `${profile.username}@github.temp`, // fallback
        password: Date.now().toString(), // dummy password for schema
        role: "client"
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error(err));
