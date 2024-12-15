import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../design/Register.css";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [smokingHistory, setSmokingHistory] = useState("");
  const [bmi, setBmi] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Send registration data to the backend
      await axios.post("http://localhost:3000/api/users/register", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        smoking_history: smokingHistory,
        health_details: {
          bmi,
          medical_conditions: medicalConditions,
        },
      });
      setMessage("Registration successful!");
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/"); // Redirect to the login page after 2 seconds
      }, 2000);
    } catch (err) {
      setMessage("Registration failed. Please try again.");
      setIsSuccess(false);
    }
  };

  return (
    <div className="card p-4">
      <h2>Register</h2>
      {message && (
        <div className={`alert ${isSuccess ? "alert-success" : "alert-danger"}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Smoking History</label>
          <select
            className="form-control"
            value={smokingHistory}
            onChange={(e) => setSmokingHistory(e.target.value)}
            required
          >
            <option value="">Smoking History</option>
            <option value="Less than a year">Smoked for less than a year</option>
            <option value="1 - 5 years">Smoked for 1 - 5 years</option>
            <option value="More than 5 years">Smoked for more than 5 years</option>
          </select>
        </div>
        <div className="mb-3">
          <label>BMI</label>
          <select
            className="form-control"
            value={bmi}
            onChange={(e) => setBmi(e.target.value)}
            required
          >
            <option value="">BMI</option>
            <option value="Underweight">Underweight</option>
            <option value="Normal">Normal</option>
            <option value="Overweight">Overweight</option>
            <option value="Obese">Obese</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Medical Conditions</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter any medical conditions"
            value={medicalConditions}
            onChange={(e) => setMedicalConditions(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
      <p className="mt-3">
        Already have an account? <Link to="/" className="login-link">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
