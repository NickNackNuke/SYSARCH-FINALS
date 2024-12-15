const mongoose = require("mongoose");

const dailyLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  mood: { type: String, required: true },
  cigarettes_smoked: { type: Number, required: true },
});

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  smoking_history: { type: String },
  health_details: {
    bmi: { type: String },
    medical_conditions: { type: String },
  },
  profileImage: { type: String },
  daily_logs: [dailyLogSchema], // Add daily logs
});

module.exports = mongoose.model("User", userSchema);
