import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../design/Home.css'; // CSS file
import doctorImage from '../assets/home_page.jpeg'; // Import the image

const Home = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="container">
          <a href="#" className="logo">SQUIT</a>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li> {/* Link to Home Page */}
            <li><Link to="/products">Products</Link></li> {/* Link to Products Page */}
            <li><Link to="/profile">Profile</Link></li> {/* Placeholder for Profile */}
            <li><Link to="/">Logout</Link></li> {/* Placeholder for Logout */}
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Ready to<br /> Quit Smoking?</h1>
          <p>We will help you with your journey!</p>
          <a href="#" className="btn-primary">Quit Now!</a>
        </div>
        <div className="hero-image">
          <img src={doctorImage} alt="Doctor" />
        </div>
      </section>
    </div>
  );
};

export default Home;
