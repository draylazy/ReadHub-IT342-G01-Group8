import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import OverdueAlert from "../components/OverdueAlert";
import StatCard from "../components/StatCard";
import ActionCard from "../components/ActionCard";
import LoanCard from "../components/LoanCard";
import RequestCard from "../components/RequestCard";
import BookChip from "../components/BookChip";
import { useAuth } from "../context/AuthContext";
import "../styles/DashboardPage.css";

export default function DashboardPage({ setPage, onLogout }) {
  const { user } = useAuth();

  const firstName = user?.firstName || "Reader";

  // Ensure all arrays exist to prevent runtime errors
  const dashboard = user?.dashboard || {};
  const statCards = dashboard.statCards || [];
  const myLoans = dashboard.myLoans || [];
  const myRequests = dashboard.myRequests || [];
  const readingList = dashboard.readingList || [
    { title: "Atomic Habits", author: "James Clear", tag: "Self-Help" },
    { title: "Sapiens", author: "Yuval Noah Harari", tag: "History" }
  ];

  // Extract overdue count for OverdueAlert
  const overdueCard = statCards.find(card => card.title.toLowerCase().includes("overdue"));
  const overdueCount = overdueCard ? overdueCard.value : 0;

  return (
    <div className="dashboard-page">
      <Header user={user} setPage={setPage} onLogout={onLogout} />

      <main className="dashboard-main">
        {/* Welcome Banner */}
        <section className="welcome-banner">
          <h1>Welcome back, {firstName}!</h1>
          <p>Here's what's happening with your library activity</p>
        </section>

        {/* Stat Cards */}
        <section className="stat-grid">
          {statCards.map((card, idx) => (
            <StatCard key={idx} value={card.value} label={card.title} />
          ))}
        </section>

        {/* Overdue Alert */}
        <OverdueAlert count={overdueCount} />

        {/* Action Cards */}
        <section className="action-grid">
          <ActionCard title="Search & Request" subtitle="Browse the library catalog" />
          <ActionCard title="Create Request" subtitle="Request an unlisted item" />
          <ActionCard title="Reading List" subtitle="View saved items" />
        </section>

        {/* Main Lists */}
<section className="two-col">
  {/* My Loans */}
  <div className="main-card">
    <h3>My Loans ({myLoans.length})</h3>
    {myLoans.map((loan, idx) => (
      <LoanCard
        key={idx}
        title={loan.title}
        author={loan.author}
        lender={loan.lender}
        dueDate={loan.dueDate}
        status={loan.status}
        showRenew={loan.status !== "Overdue"}
      />
    ))}
  </div>

  {/* My Requests */}
  <div className="main-card">
    <h3>My Requests ({myRequests.length})</h3>
    {myRequests.map((req, idx) => (
      <RequestCard
        key={idx}
        title={req.title}
        author={req.author}
        source={req.source}
        estDate={req.estDate}
        status={req.status}
      />
    ))}
  </div>
</section>

{/* Reading List */}
<section className="main-card reading-list">
  <h3>Reading List ({readingList.length})</h3>
  <div className="reading-list-grid">
    {readingList.map((book, idx) => (
      <BookChip key={idx} title={book.title} author={book.author} tag={book.tag} />
    ))}
  </div>
</section>
      </main>

      <Footer setPage={setPage} onLogout={onLogout} />
    </div>
  );
}
