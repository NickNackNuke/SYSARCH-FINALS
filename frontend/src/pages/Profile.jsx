import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../design/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [profileImage, setProfileImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User not logged in. Please log in again.");
        }

        const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
        setUser(response.data);
        setProfileImage(response.data.profileImage);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedUser({
      first_name: user.first_name,
      last_name: user.last_name,
      smoking_history: user.smoking_history,
      bmi: user.health_details?.bmi || "",
      medical_conditions: user.health_details?.medical_conditions || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      Object.keys(editedUser).forEach((key) => {
        formData.append(key, editedUser[key]);
      });

      const response = await axios.post(
        `http://localhost:3000/api/users/update/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Profile updated successfully!");
      setUser(response.data.user);
      setProfileImage(response.data.user.profileImage);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again later.");
    }
  };

  if (loading) {
    return <div className="profile-page"><p>Loading...</p></div>;
  }

  if (error) {
    return (
      <div className="profile-page">
        <nav className="navbar">
          <div className="container">
            <a href="#" className="logo">BreathEasy</a>
            <ul className="nav-links">
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
            </ul>
          </div>
        </nav>
        <div className="hero">
          <p className="error-text">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <a href="#" className="logo">BreathEasy</a>
          <ul className="nav-links">
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
          </ul>
        </div>
      </nav>

      <section className="profile-section">
        <div className="profile-header">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #3cc8a3",
              }}
            />
          ) : (
            <div
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                backgroundColor: "#f0f0f0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "14px",
                color: "#888",
              }}
            >
              No Image
            </div>
          )}
          <h1>Your Profile</h1>
        </div>

        {!isEditing ? (
          <div className="profile-content">
            <h3>Personal Information</h3>
            <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
            <p><strong>Email:</strong> {user.email}</p>

            <h3>Health Information</h3>
            <p><strong>Smoking History:</strong> {user.smoking_history}</p>
            <p><strong>BMI:</strong> {user.health_details?.bmi || "N/A"}</p>
            <p><strong>Medical Conditions:</strong> {user.health_details?.medical_conditions || "None"}</p>

            <button onClick={handleEditToggle} className="btn edit-profile">Edit Profile</button>
          </div>
        ) : (
          <div className="profile-edit">
            <h3>Edit Your Profile</h3>
            <div className="edit-fields">
              <label>
                First Name:
                <input
                  type="text"
                  name="first_name"
                  value={editedUser.first_name}
                  onChange={handleInputChange}
                  placeholder="First Name"
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="last_name"
                  value={editedUser.last_name}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                />
              </label>
              <label>
                Smoking History:
                <select
                  name="smoking_history"
                  value={editedUser.smoking_history}
                  onChange={handleInputChange}
                >
                  <option value="">Select Smoking History</option>
                  <option value="Haven't smoked since I quit">Haven't smoked since I quit</option>
                  <option value="Smoked for less than a year">Smoked for less than a year</option>
                  <option value="Smoked for 1-5 years">Smoked for 1-5 years</option>
                  <option value="Smoked for more than 5 years">Smoked for more than 5 years</option>
                </select>
              </label>
              <label>
                BMI:
                <select
                  name="bmi"
                  value={editedUser.bmi}
                  onChange={handleInputChange}
                >
                  <option value="">Select BMI</option>
                  <option value="Underweight">Underweight</option>
                  <option value="Normal">Normal</option>
                  <option value="Overweight">Overweight</option>
                  <option value="Obese">Obese</option>
                </select>
              </label>
              <label>
                Medical Conditions:
                <input
                  type="text"
                  name="medical_conditions"
                  value={editedUser.medical_conditions}
                  onChange={handleInputChange}
                  placeholder="Medical Conditions"
                />
              </label>
              <label>
                Profile Image:
                <input type="file" onChange={handleFileChange} />
              </label>
            </div>
            <div className="edit-buttons">
              <button onClick={handleSave} className="btn btn-primary">Save Changes</button>
              <button onClick={handleEditToggle} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
