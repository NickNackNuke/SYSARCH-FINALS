const mongoose = require("mongoose");
const fs = require("fs");
const multer = require("multer");
const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const User = require("../models/User"); // Import your User model
const router = express.Router();

// Registration Route
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, smoking_history, health_details } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword, // Store hashed password
      smoking_history,
      health_details,
      notifications: "Stay on track with your goals!",
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update User Details
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  let updates = req.body;

  try {
    console.log("Received ID:", id); // Log the ID for debugging

    // Validate ObjectId strictly
    if (!mongoose.Types.ObjectId.isValid(id.trim())) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Trim input data
    for (let key in updates) {
      if (typeof updates[key] === "string") {
        updates[key] = updates[key].trim();
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id.trim(),
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully!", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ error: "Failed to update user" });
  }
});



// Ensure the uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Route to update user details and profile image
router.post("/update/:id", upload.single("profileImage"), async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const updates = {};

    // If a profile image is uploaded
    if (req.file) {
      const filePath = `uploads/${req.file.filename}`;
      const fullUrl = `${req.protocol}://${req.get("host")}/${filePath}`;
      updates.profileImage = fullUrl;
    }

    const { first_name, last_name, smoking_history, bmi, medical_conditions } =
      req.body;

    if (first_name) updates.first_name = first_name;
    if (last_name) updates.last_name = last_name;
    if (smoking_history) updates.smoking_history = smoking_history;

    // Update health_details safely
    if (bmi || medical_conditions) {
      const user = await User.findById(userId);
      updates["health_details"] = {
        ...user.health_details, // Keep existing data
        ...(bmi && { bmi }),
        ...(medical_conditions && { medical_conditions }),
      };
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully!", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Get User by ID Route
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    console.log("Fetched Users:", users); // Debugging line
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Daily Check-In Route
router.post("/checkin/:id", async (req, res) => {
  try {
    const { mood, cigarettes_smoked } = req.body;
    const userId = req.params.id;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Validate cigarettes_smoked to be a number
    const parsedCigarettesSmoked = parseInt(cigarettes_smoked, 10);
    if (isNaN(parsedCigarettesSmoked)) {
      return res
        .status(400)
        .json({ error: "Cigarettes smoked must be a valid number" });
    }

    const newLog = {
      mood: mood || "No data yet",
      cigarettes_smoked: parsedCigarettesSmoked,
      date: new Date(),
    };

    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { daily_logs: newLog } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Daily Check-In updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating Daily Check-In:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// DELETE route to remove a user by ID
router.delete("/:id", async (req, res) => {
  let { id } = req.params;

  // Trim and ensure the ID is clean
  id = id.trim();

  console.log("Received ID after clean-up:", id);
  console.log("IsValid:", mongoose.isValidObjectId(id));

  try {
    if (!mongoose.isValidObjectId(id)) {
      console.log("Invalid Object ID");
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      console.log("User not found with ID:", id);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User deleted successfully:", user);
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Failed to delete user" });
  }
});



module.exports = router;
