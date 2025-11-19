import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/LoanPage.css";

export default function LoanPage({ user, onLogout }) {
  return (
    <div className="loan-page-wrapper">
      {/* Header */}
      <Header user={user} onLogout={onLogout} />

      {/* Glass Panel */}
      <div className="loan-glass">

        {/* Floating Action Button */}
        <button className="add-item-btn">+ Add item to lend</button>

        <div className="loan-layout">

          {/* Sidebar */}
          <aside className="loan-sidebar">
            <div className="sidebar-item active">My Items</div>
            <div className="sidebar-item">My Activity</div>
            <div className="sidebar-item">Browse Items</div>
          </aside>

          {/* Main Content */}
          <main className="loan-content">
            <h2>My Listed Items</h2>

            {/* Empty State Box */}
            <div className="loan-empty-box">
              <div className="empty-icon">📦</div>
              <p className="empty-main">
                You haven't listed any items yet.
              </p>
              <p className="empty-sub">
                Click "+ Add item to lend" to start sharing your sources.
              </p>
            </div>
          </main>

        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
