import React, { useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import "../styles/ProfilePage.css";

export default function ProfilePage() {
  const { user, updateProfile, deleteAccount } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    alert("Profile updated successfully!");
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      await deleteAccount();
      alert("Account deleted.");
    }
  };

  return (
    <>
      <Header />
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-card">
            <h1>My Profile</h1>

            <form className="profile-form" onSubmit={handleUpdate}>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
              />
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <button type="submit" className="btn">
                Update Profile
              </button>
            </form>

            <div className="danger-zone">
              <h2>Danger Zone</h2>
              <button className="delete-btn" onClick={handleDelete}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
