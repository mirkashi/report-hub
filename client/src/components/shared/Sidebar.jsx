import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Sidebar.css'

function Sidebar({ type = 'employee' }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const employeeLinks = [
    { path: '/employee/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/employee/tasks', icon: '📝', label: 'Daily Tasks' },
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

  return (
    <aside className="sidebar texture-wood">
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
  )
}

export default Sidebar
