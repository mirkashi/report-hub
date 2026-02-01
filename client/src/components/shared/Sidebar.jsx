import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import './Sidebar.css'

function Sidebar({ type = 'employee' }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const employeeLinks = [
    { path: '/employee/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/employee/tasks', icon: '📝', label: 'Daily Tasks' },
    { path: '/employee/drafts', icon: '💾', label: 'Draft Reports' },
    { path: '/employee/submitted', icon: '📋', label: 'My Reports' },
    { path: '/employee/submit', icon: '📤', label: 'Submit Report' },
  ]

  const adminLinks = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/reports', icon: '📋', label: 'Reports' },
    { path: '/admin/announcements', icon: '📢', label: 'Announcements' },
    { path: '/admin/employees', icon: '👥', label: 'Employees' },
  ]

  const links = type === 'admin' ? adminLinks : employeeLinks

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth <= 768) {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span className="menu-icon">{isOpen ? '✕' : '☰'}</span>
      </button>

      {/* Mobile Overlay */}
      {isOpen && <div className="mobile-overlay" onClick={() => setIsOpen(false)} />}

      <aside className={`sidebar texture-wood ${isOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <span>📊</span>
        </div>
        <div className="sidebar-logo-text">
          <span className="logo-title">ReportHub</span>
          <span className="logo-subtitle">{type === 'admin' ? 'Admin Panel' : 'Employee Portal'}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-section-title">Main Menu</span>
          <ul className="nav-list">
            {links.map((link) => (
              <li key={link.path}>
                <NavLink 
                  to={link.path} 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span className="nav-label">{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-section">
          <span className="nav-section-title">Quick Links</span>
          <ul className="nav-list">
            <li>
              <a href="#" className="nav-link">
                <span className="nav-icon">⚙️</span>
                <span className="nav-label">Settings</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* User Profile */}
      <div className="sidebar-user">
        <div className="user-avatar">
          <span>👤</span>
        </div>
        <div className="user-info">
          <span className="user-name">{user?.name || 'User'}</span>
          <span className="user-role">{user?.department || 'Department'}</span>
        </div>
      </div>

      {/* Logout Button */}
      <button className="sidebar-logout btn-skeu btn-secondary" onClick={handleLogout}>
        <span>🚪</span>
        <span>Sign Out</span>
      </button>
    </aside>
    </>
  )
}

export default Sidebar
