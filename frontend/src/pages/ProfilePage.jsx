import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/ProfilePage.css";

export default function ProfilePage({ onCancel, onSave }) {
  const { user, updateProfile, deleteAccount } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  // Initialize form data once user is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await updateProfile(formData); // updates context
      if (onSave) onSave(updatedUser); // update header in Dashboard
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      await deleteAccount();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <h2 className="profile-title">Edit Profile</h2>

        <div className="profile-fields">
          <div className="profile-field">
            <label>First Name</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="profile-field">
            <label>Last Name</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="profile-field">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn-cancel" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <button className="btn-delete" onClick={handleDelete} disabled={loading}>
          Delete Account
        </button>
      </div>
    </div>
  );
}
