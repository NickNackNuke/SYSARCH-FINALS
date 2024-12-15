import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../design/Profile.css';

const AdminProfile = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    smoking_history: '',
    bmi: '',
    medical_conditions: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get('http://localhost:3000/api/users')
      .then((response) => setUsers(response.data))
      .catch((error) => console.error('Error fetching users:', error));
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios
        .delete(`http://localhost:3000/api/users/${id}`)
        .then(() => {
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
          setMessage('User deleted successfully!');
        })
        .catch((error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user. Please try again.');
        });
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    axios
      .put(`http://localhost:3000/api/users/update/${editingUser._id}`, editingUser)
      .then(() => {
        setMessage('User updated successfully!');
        fetchUsers();
        setIsEditing(false);
      })
      .catch((error) => console.error('Error updating user:', error));
  };

  const handleAddUser = () => {
    axios
      .post("http://localhost:3000/api/users/register", {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        password: newUser.password,
        smoking_history: newUser.smoking_history,
        health_details: {
          bmi: newUser.bmi,
          medical_conditions: newUser.medical_conditions,
        },
      })
      .then(() => {
        setMessage("New user added successfully!");
        fetchUsers();
        setNewUser({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          smoking_history: "",
          bmi: "",
          medical_conditions: "",
        });
      })
      .catch((error) => console.error("Error adding user:", error));
  };
  

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo">
            BreathEasy
          </Link>
          <ul className="nav-links">
            <li>
              <Link to="/admin/products">Products</Link>
            </li>
            <li>
              <Link to="/admin/profile">Profile</Link>
            </li>
            <li>
              <Link to="/">Logout</Link>
            </li>
          </ul>
        </div>
      </nav>

      <section className="products-hero">
        <h1>Admin User Management</h1>

        {message && <p className="success-message">{message}</p>}

        {/* Add User Form */}
        <div className="add-product-section">
          <h2>Add New User</h2>
          <div className="add-product-form">
            <input
              type="text"
              placeholder="First Name"
              value={newUser.first_name}
              onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={newUser.last_name}
              onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <select
              value={newUser.smoking_history}
              onChange={(e) => setNewUser({ ...newUser, smoking_history: e.target.value })}
            >
              <option value="">Select Smoking History</option>
              <option value="Less than a year">Less than a year</option>
              <option value="1 - 5 years">1 - 5 years</option>
              <option value="More than 5 years">More than 5 years</option>
            </select>
            <select
              value={newUser.bmi}
              onChange={(e) => setNewUser({ ...newUser, bmi: e.target.value })}
            >
              <option value="">Select BMI</option>
              <option value="Underweight">Underweight</option>
              <option value="Normal">Normal</option>
              <option value="Overweight">Overweight</option>
              <option value="Obese">Obese</option>
            </select>
            <input
              type="text"
              placeholder="Medical Conditions"
              value={newUser.medical_conditions}
              onChange={(e) => setNewUser({ ...newUser, medical_conditions: e.target.value })}
            />
            <button className="add-button" onClick={handleAddUser}>
              Add User
            </button>
          </div>
        </div>

        {/* User List */}
        <div className="products-list">
          {users.map((user) => (
            <div className="product-card" key={user._id}>
              <h2>
                {user.first_name} {user.last_name}
              </h2>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Smoking History:</strong> {user.smoking_history || 'N/A'}</p>
              <p><strong>BMI:</strong> {user.health_details?.bmi || 'N/A'}</p>
              <p><strong>Medical Conditions:</strong> {user.health_details?.medical_conditions || 'N/A'}</p>
              <div className="button-group">
                <button className="edit-button" onClick={() => handleEditUser(user)}>
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDeleteUser(user._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Edit User Modal */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h2>Edit User</h2>
            <input
              type="text"
              placeholder="First Name"
              value={editingUser.first_name}
              onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={editingUser.last_name}
              onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })}
            />
            <select
              value={editingUser.smoking_history}
              onChange={(e) => setEditingUser({ ...editingUser, smoking_history: e.target.value })}
            >
              <option value="Less than a year">Less than a year</option>
              <option value="1 - 5 years">1 - 5 years</option>
              <option value="More than 5 years">More than 5 years</option>
            </select>
            <select
              value={editingUser.health_details?.bmi || ''}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  health_details: { ...editingUser.health_details, bmi: e.target.value },
                })
              }
            >
              <option value="Underweight">Underweight</option>
              <option value="Normal">Normal</option>
              <option value="Overweight">Overweight</option>
              <option value="Obese">Obese</option>
            </select>
            <input
              type="text"
              placeholder="Medical Conditions"
              value={editingUser.health_details?.medical_conditions || ''}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  health_details: { ...editingUser.health_details, medical_conditions: e.target.value },
                })
              }
            />
            <button className="save-button" onClick={handleSaveEdit}>
              Save Changes
            </button>
            <button className="cancel-button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
