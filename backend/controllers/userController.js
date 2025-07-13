import User from "../models/User.js";
import Project from "../models/Project.js";
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    })
      .select("_id name email image") // Don't return password or sensitive data
      .limit(10);

    res.status(200).json(users);
  } catch (err) {
    console.error("User search error:", err);
    res.status(500).json({ message: "Server error while searching users" });
  }
};

export const getUserInvites = async (req, res) => {
  const userId = req.user.id;

  try {
    const invites = await Project.find({ "invites.user": userId, "invites.status": "pending" })
      .select("title _id")
      .populate("clientName", "name email");

    res.status(200).json(invites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching invites" });
  }
};
