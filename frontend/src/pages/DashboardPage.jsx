import React, { useState } from "react";
import { BookOpen, User, Search as SearchIcon, Calculator, FlaskConical } from "lucide-react";
import "../styles/DashboardPage.css";
import ProfilePage from "./ProfilePage";
import { useAuth } from "../context/AuthContext"; // <-- for real user info

export default function DashboardPage() {
  const { user, updateProfile } = useAuth(); // dynamic user
  const [activeTab, setActiveTab] = useState("browse");
  const [currentView, setCurrentView] = useState("dashboard"); // dashboard | profile
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [headerUser, setHeaderUser] = useState(user?.name || "Student User"); // sync header name

  const items = [
    { id: 1, title: "Scientific Calculator (Casio FX-991)", author: "Maria Santos", desc: "Advanced scientific calculator with 417 functions.", status: "Available", condition: "Excellent", type: "calculator" },
    { id: 2, title: "Data Structures and Algorithms in Java", author: "John Cruz", desc: "Comprehensive textbook covering fundamental DSA.", status: "Checked Out", condition: "Good", type: "book" },
    { id: 3, title: "Digital Multimeter", author: "Ana Reyes", desc: "Professional grade multimeter for electronics lab.", status: "Available", condition: "Excellent", type: "lab" },
    { id: 4, title: "Graphing Calculator (TI-84 Plus)", author: "Carlos Mendoza", desc: "Advanced graphing calculator ideal for statistics.", status: "Available", condition: "Good", type: "calculator" },
    { id: 5, title: "Physics for Scientists and Engineers", author: "Sofia Garcia", desc: "Complete physics textbook with modern physics.", status: "Checked Out", condition: "Good", type: "book" },
    { id: 6, title: "Arduino Starter Kit", author: "Maria Santos", desc: "Complete Arduino kit with sensors and LEDs.", status: "Available", condition: "Good", type: "lab" },
  ];

  const renderIcon = (type) => {
    if (type === "book") return <BookOpen size={20} strokeWidth={1.8} color="#d97706" />;
    if (type === "calculator") return <Calculator size={20} strokeWidth={1.8} color="#d97706" />;
    if (type === "lab") return <FlaskConical size={20} strokeWidth={1.8} color="#d97706" />;
    return null;
  };

  const filteredItems = items.filter(it => {
    const matchesQuery =
      query.trim() === "" ||
      `${it.title} ${it.author} ${it.desc}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory =
      category === "All" ||
      (category === "Books" && it.type === "book") ||
      (category === "Calculators" && it.type === "calculator") ||
      (category === "Lab Equipment" && it.type === "lab");

    return matchesQuery && matchesCategory;
  });

  // handle profile save and update header
  const handleProfileSave = async (updatedData) => {
    try {
      const updatedUser = await updateProfile(updatedData); // update via API & context
      setHeaderUser(updatedUser.name); // reflect in dashboard header immediately
      setCurrentView("dashboard"); // go back to dashboard
    } catch (err) {
      alert("Failed to update profile: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="dashboard-full">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <div className="dashboard-brand">
            <div className="dashboard-logo-box">
              <BookOpen size={22} color="#ffffff" />
            </div>
            <div className="dashboard-brand-text">
              <div className="dashboard-title">ReadHub Book Management</div>
              <div className="dashboard-subtitle">Welcome, {headerUser}</div>
            </div>
          </div>

          <div className="dashboard-header-actions">
            <button
              className="dashboard-profile-btn"
              onClick={() => setCurrentView("profile")}
            >
              <User size={18} /> Profile
            </button>
            <button
              className="dashboard-logout-btn"
              onClick={() => {
                console.log("logout clicked");
                window.location.href = "/logout";
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN VIEW SWITCH */}
      {currentView === "profile" && (
        <ProfilePage
          currentUser={user} // pass real user object
          onCancel={() => setCurrentView("dashboard")}
          onSave={handleProfileSave} // handle save from ProfilePage
        />
      )}

      {currentView === "dashboard" && (
        <main className="dashboard-content">
          {/* TABS + ACTIONS */}
          <div className="dashboard-nav-row">
            <nav className="dashboard-tabs">
              <button
                className={`dashboard-tab ${activeTab === "browse" ? "active" : ""}`}
                onClick={() => setActiveTab("browse")}
              >
                Browse Items
              </button>
              <button
                className={`dashboard-tab ${activeTab === "my-items" ? "active" : ""}`}
                onClick={() => setActiveTab("my-items")}
              >
                My Items
              </button>
              <button
                className={`dashboard-tab ${activeTab === "my-activity" ? "active" : ""}`}
                onClick={() => setActiveTab("my-activity")}
              >
                My Activity
              </button>
            </nav>

            <div className="dashboard-action">
              <button className="dashboard-add-btn">+ Add Book</button>
            </div>
          </div>

          {/* SEARCH BAR */}
          {activeTab === "browse" && (
            <div className="dashboard-search">
              <div className="dashboard-search-left">
                <SearchIcon size={18} />
                <input
                  placeholder="Search items..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="dashboard-search-input"
                />
              </div>

              <select className="dashboard-category" value={category} onChange={e => setCategory(e.target.value)}>
                <option>All</option>
                <option>Books</option>
                <option>Calculators</option>
                <option>Lab Equipment</option>
              </select>
            </div>
          )}

          {/* GRID */}
          {activeTab === "browse" && (
            <section className="dashboard-grid">
              {filteredItems.map(item => (
                <article key={item.id} className="dashboard-card">
                  <div className="dashboard-card-top">
                    <div className="dashboard-card-icon">{renderIcon(item.type)}</div>
                    <div className="dashboard-card-meta">
                      <h3 className="dashboard-card-title">{item.title}</h3>
                      <div className="dashboard-card-author">by {item.author}</div>
                    </div>
                  </div>

                  <div className="dashboard-card-desc">{item.desc}</div>

                  <div className="dashboard-card-badges">
                    <span className={`badge status ${item.status === "Available" ? "available" : "checkedout"}`}>
                      {item.status}
                    </span>
                    <span className="badge condition">{item.condition}</span>
                  </div>

                  <div className="dashboard-card-actions">
                    <button className="btn-outline">View Details</button>
                    {item.status === "Available" ? (
                      <button className="btn-primary">Request Book</button>
                    ) : (
                      <button className="btn-disabled" disabled>Unavailable</button>
                    )}
                  </div>
                </article>
              ))}
            </section>
          )}

          {activeTab === "my-items" && (
            <section className="dashboard-placeholder">
              <h2>My Items</h2>
              <p className="muted">You haven’t listed items yet.</p>
            </section>
          )}

          {activeTab === "my-activity" && (
            <section className="dashboard-placeholder">
              <h2>My Activity</h2>
              <p className="muted">No activity yet.</p>
            </section>
          )}
        </main>
      )}
    </div>
  );
}
