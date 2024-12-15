import React, { useState } from "react";
import axios from "axios";

const DailyCheckin = ({ userId, onCheckinSuccess }) => {
  const [mood, setMood] = useState("");
  const [cigarettes, setCigarettes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/api/users/daily-checkin/${userId}`,
        { mood, cigarettes_smoked: cigarettes }
      );
      alert("Daily check-in saved successfully!");
      onCheckinSuccess(response.data.user);
      setMood("");
      setCigarettes("");
    } catch (err) {
      console.error("Error saving check-in:", err);
      alert("Failed to save check-in.");
    }
  };

  return (
    <div className="daily-checkin">
      <h3>Daily Check-In</h3>
      <form onSubmit={handleSubmit}>
        <label>
          How do you feel today?
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Your mood"
            required
          />
        </label>
        <label>
          Cigarettes Smoked:
          <input
            type="number"
            value={cigarettes}
            onChange={(e) => setCigarettes(e.target.value)}
            placeholder="0"
            required
          />
        </label>
        <button type="submit" className="btn btn-primary">
          Submit Check-In
        </button>
      </form>
    </div>
  );
};

export default DailyCheckin;
