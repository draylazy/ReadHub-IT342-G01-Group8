import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BookOpen, LogOut, Bell, CheckCircle2, XCircle, Clock, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.scss';

const DashboardLayout = ({ children }) => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // --- 1. CLOCK STATE ---
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const notificationRef = useRef(null);

  // --- 2. CLOCK TIMER ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. Fetch Notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) { console.error(err); }
    };
    if (token) fetchNotifications();
  }, [token]);

  // 4. Mark as Read
  const markAsRead = useCallback(async () => {
    const hasUnread = notifications.some(n => !n.isRead);
    if (!hasUnread) return;

    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

    try {
      await fetch('http://localhost:8080/api/notifications/read', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) { console.error("Failed to mark read", err); }
  }, [notifications, token]);

  // 5. Handle Click Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        if (showNotifications) {
          setShowNotifications(false);
          markAsRead(); 
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationRef, showNotifications, markAsRead]); 

  // Toggle Logic
  const toggleNotifications = (e) => {
    e.stopPropagation(); 
    if (showNotifications) {
      setShowNotifications(false);
      markAsRead();
    } else {
      setShowNotifications(true);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  // Helper: Dynamic Icon
  const getNotificationStyle = (msg) => {
    const lower = msg.toLowerCase();
    if (lower.includes('approved') || lower.includes('successfully')) {
      return { icon: <CheckCircle2 size={18} />, type: 'success' };
    }
    if (lower.includes('rejected') || lower.includes('overdue')) {
      return { icon: <XCircle size={18} />, type: 'error' };
    }
    if (lower.includes('new request')) {
      return { icon: <Clock size={18} />, type: 'pending' };
    }
    return { icon: <Info size={18} />, type: 'info' };
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // --- CLOCK FORMATTERS ---
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  const formatDate = (date) => {
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          
          {/* BRAND LOGO */}
          <div 
            className="brand-section" 
            onClick={() => navigate(user?.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/student/dashboard')} 
            style={{ cursor: 'pointer' }}
          >
            <div className="brand-logo-box"><BookOpen size={24} strokeWidth={2} /></div>
            <div className="brand-info">
              <h1>ReadHub</h1>
              <p>Book Management</p>
            </div>
          </div>

          <div className="user-menu">
            
            {/* --- SYSTEM CLOCK RENDERED HERE --- */}
            <div className="system-clock">
              <span className="clock-time">{formatTime(currentTime)}</span>
              <span className="clock-date">{formatDate(currentTime)}</span>
            </div>

            <div className="menu-divider"></div>

            {/* NOTIFICATION CENTER */}
            <div className="notification-wrapper" ref={notificationRef}>
              <button 
                className={`notification-btn ${showNotifications ? 'active' : ''}`} 
                onClick={toggleNotifications}
              >
                <Bell size={20} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="dropdown-header">
                    <h3>Notifications</h3>
                    <span className="badge-count">{notifications.length} New</span>
                  </div>
                  
                  <div className="notification-list">
                    {notifications.length > 0 ? (
                      notifications.map(note => {
                        const style = getNotificationStyle(note.message);
                        return (
                          <div key={note.notificationId} className={`notif-item ${style.type} ${!note.isRead ? 'unread-item' : ''}`}>
                            <div className="notif-icon-box">
                              {style.icon}
                            </div>
                            <div className="notif-content">
                              <p className="notif-msg">{note.message}</p>
                              <span className="notif-date">{new Date(note.sentDate).toLocaleDateString()} • {new Date(note.sentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            {!note.isRead && <div className="dot-unread"></div>}
                          </div>
                        );
                      })
                    ) : (
                      <div className="empty-notif">
                        <Bell size={32} style={{ opacity: 0.2, marginBottom: 8 }}/>
                        <p>No new notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="menu-divider"></div>

            {/* PROFILE BUTTON */}
            <button 
              className="user-profile-btn" 
              onClick={() => navigate('/profile')} 
              title="View Profile"
            >
               <div className="user-avatar" style={user?.avatarUrl ? { backgroundImage: `url(${user.avatarUrl})`, backgroundSize: 'cover' } : {}}>
                  {!user?.avatarUrl && (user?.firstName?.charAt(0) || 'U')}
               </div>
               <div className="user-info">
                 <span className="user-name">{user?.firstName || 'User'}</span>
                 <span className="user-role">{user?.role === 'ROLE_ADMIN' ? 'Admin' : 'Student'}</span>
               </div>
            </button>
            
            <button onClick={handleLogout} className="logout-btn" title="Logout"><LogOut size={16} /></button>
          </div>
        </div>
      </nav>
      <main className="container" style={{ paddingBottom: '60px' }}>{children}</main>
    </div>
  );
};

export default DashboardLayout;