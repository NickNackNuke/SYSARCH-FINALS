import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import UserProducts from './pages/UserProducts';
import AdminProducts from './pages/Products';
import AdminProfile from './pages/AdminProfile';

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<UserProducts />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/profile" element={<AdminProfile />} />  
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
