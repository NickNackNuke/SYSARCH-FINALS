import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../design/Home.css";
import doctorImage from "../assets/home_page.jpeg";

const Home = () => {
  const [mood, setMood] = useState("");
  const [cigarettes, setCigarettes] = useState("");
  const [showCheckIn, setShowCheckIn] = useState(true);
  const [userData, setUserData] = useState({});
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
        const logs = response.data.daily_logs;
        setUserData(response.data);

        if (logs && logs.length > 0) {
          const today = new Date().toDateString();
          const latestLog = new Date(logs[logs.length - 1].date).toDateString();
          if (today === latestLog) {
            setShowCheckIn(false);
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        `http://localhost:3000/api/users/checkin/${userId}`,
        {
          mood,
          cigarettes_smoked: cigarettes,
        }
      );
  
      alert("Daily Check-In submitted successfully!");
      setShowCheckIn(false);
  
      // Update userData with the new daily log
      const updatedUserData = response.data.user; // Backend response returns the updated user
      setUserData(updatedUserData);
  
      // Clear form fields
      setMood("");
      setCigarettes("");
    } catch (error) {
      console.error("Error submitting Daily Check-In:", error);
      alert("Failed to submit Check-In. Please try again.");
    }
  };
  
  return (
    <div className="main">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <a href="#" className="logo">BreathEasy</a>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/">Logout</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <h1>Ready to Quit Smoking?</h1>
        <p>We will help you with your journey!</p>
        <img src={doctorImage} alt="Doctor holding cigarette" />

        {/* Daily Check-In */}
        {showCheckIn && (
          <div className="daily-checkin">
            <h3>Daily Check-In</h3>
            <form onSubmit={handleSubmit}>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                required
              >
                <option value="">Select Mood</option>
                <option value="Happy">Happy</option>
                <option value="Neutral">Neutral</option>
                <option value="Sad">Sad</option>
                <option value="Stressed">Stressed</option>
              </select>
              <select
                value={cigarettes}
                onChange={(e) => setCigarettes(e.target.value)}
                required
              >
                <option value="">Cigarettes Smoked</option>
                <option value="0">0</option>
                <option value="1-5">1-5</option>
                <option value="5+">5+</option>
              </select>
              <button type="submit">Submit Check-In</button>
            </form>
          </div>
        )}

        {/* Progress Tracker */}
        <div className="section">
          <h3>Progress Tracker</h3>
          <p><strong>Smoking History:</strong> {userData.smoking_history || "N/A"}</p>
        </div>

        {/* Cravings & Trigger Log */}
        <div className="section">
          <h3>Daily Checkin Log</h3>
          {userData.daily_logs && userData.daily_logs.length > 0 ? (
            <>
              <p><strong>Mood:</strong> {userData.daily_logs[userData.daily_logs.length - 1].mood}</p>
              <p><strong>Cigarettes Smoked:</strong> {userData.daily_logs[userData.daily_logs.length - 1].cigarettes_smoked}</p>
            </>
          ) : (
            <p>No logs available yet. Submit your daily check-in!</p>
          )}
        </div>

        {/* Health Stats */}
        <div className="section">
          <h3>Health Stats</h3>
          <p><strong>BMI:</strong> {userData.health_details?.bmi || "N/A"}</p>
          <p><strong>Medical Conditions:</strong> {userData.health_details?.medical_conditions || "None"}</p>
        </div>

        {/* Support Links */}
        <div className="section support-links">
  <h3>Support Links</h3>
  <ul>
    <li>
      <a 
        href="https://ncroffice.doh.gov.ph/LatestNews/Details/30" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        Republic of the Philippines DOH
      </a>
    </li>
    <li>
      <a 
        href="https://www.who.int/news-room/fact-sheets/detail/tobacco" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        WHO Tobacco Information
      </a>
    </li>
    <li>
      <a 
        href="https://www.cdc.gov/tobacco" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        CDC Tobacco Control
      </a>
    </li>
  </ul>
</div>

      </div>
    </div>
  );
};

export default Home;
