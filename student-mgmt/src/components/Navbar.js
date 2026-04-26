import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const NAV_ITEMS = [
  { to: '/dashboard', icon: '◈', label: 'Dashboard' },
  { to: '/student-details', icon: '◉', label: 'Student Details' },
  { to: '/scholarship', icon: '✦', label: 'Scholarship' },
  { to: '/payment', icon: '⬡', label: 'Payment' },
  { to: '/cgpa-calculator', icon: '◆', label: 'CGPA Calculator' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-top">
        <div className="brand">
          <span className="brand-icon">⬡</span>
          {!collapsed && <span className="brand-name">EduVault</span>}
        </div>
        <button className="collapse-btn" onClick={() => setCollapsed(c => !c)}>
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      {!collapsed && user && (
        <div className="user-pill">
          <div className="avatar">{user.name[0]}</div>
          <div>
            <div className="u-name">{user.name}</div>
            <div className="u-id">{user.id}</div>
          </div>
        </div>
      )}

      <div className="nav-links">
        {NAV_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        <span>⏻</span>
        {!collapsed && <span>Logout</span>}
      </button>
    </nav>
  );
}
