import { useState } from 'react'
import Sidebar from '../../components/shared/Sidebar'

function EmployeeDashboard() {
  const [selectedDay, setSelectedDay] = useState(4) // Friday

  const weekDays = [
    { day: 'Mon', date: '27', tasks: 3, completed: true },
    { day: 'Tue', date: '28', tasks: 4, completed: true },
    { day: 'Wed', date: '29', tasks: 2, completed: true },
    { day: 'Thu', date: '30', tasks: 5, completed: true },
    { day: 'Fri', date: '31', tasks: 3, completed: false },
    { day: 'Sat', date: '01', tasks: 0, completed: false },
    { day: 'Sun', date: '02', tasks: 0, completed: false },
  ]

  const stats = [
    { icon: '📝', label: 'Total Tasks', value: '17', color: '#d4a017' },
    { icon: '✅', label: 'Completed', value: '14', color: '#38a169' },
    { icon: '⏳', label: 'Pending', value: '3', color: '#ecc94b' },
    { icon: '📤', label: 'Reports Sent', value: '12', color: '#5a8acd' },
  ]

  const recentTasks = [
    {
      id: 1,
      title: 'Update API documentation',
      description: 'Document the new REST API endpoints for user authentication module.',
      status: 'completed',
      dueDate: 'Jan 30, 2026',
      priority: 'High'
    },
    {
      id: 2,
      title: 'Review pull requests',
      description: 'Review and approve pending PRs for the frontend team.',
      status: 'pending',
      dueDate: 'Jan 31, 2026',
      priority: 'Medium'
    },
    {
      id: 3,
      title: 'Fix login bug',
      description: 'Investigate and fix the session timeout issue reported by QA.',
      status: 'pending',
      dueDate: 'Jan 31, 2026',
      priority: 'High'
    },
  ]

  const announcements = [
    {
      id: 1,
      title: 'Team Meeting Tomorrow',
      date: 'Jan 30, 2026',
      content: 'Monthly team sync-up at 10:00 AM in Conference Room A.'
    },
    {
      id: 2,
      title: 'New Report Format',
      date: 'Jan 28, 2026',
      content: 'Please use the updated weekly report template starting next week.'
    },
  ]

  return (
    <div className="app-layout">
      <Sidebar type="employee" />
      
      <main className="main-content texture-leather">
        {/* Page Header */}
        <div className="page-header">
          <h1>👋 Welcome back, John!</h1>
          <p>Here's your weekly overview</p>
        </div>

        {/* Stats Cards */}
        <div className="card-grid card-grid-4 animate-slide-up" style={{ marginBottom: '32px' }}>
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="card-leather"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="stat-card">
                <div 
                  className="stat-icon" 
                  style={{ background: `linear-gradient(145deg, ${stat.color}40 0%, ${stat.color}20 100%)` }}
                >
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <h3>{stat.label}</h3>
                  <span className="stat-value">{stat.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Week Overview */}
        <div className="panel-raised animate-slide-up" style={{ marginBottom: '32px', animationDelay: '0.2s' }}>
          <h2 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '1.25rem', 
            marginTop: 0,
            marginBottom: '20px' 
          }}>
            📅 Week Overview - January 2026
          </h2>
          
          <div className="week-days">
            {weekDays.map((day, index) => (
              <div 
                key={index}
                className={`week-day panel-inset ${selectedDay === index ? 'active' : ''} ${day.completed ? 'completed' : ''}`}
                onClick={() => setSelectedDay(index)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{day.day}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{day.date}</div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.7 }}>
                  {day.tasks} tasks
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.9rem' }}>Weekly Progress</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>82%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '82%' }}></div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="card-grid card-grid-2">
          {/* Recent Tasks */}
          <div className="panel-raised animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.25rem', 
                margin: 0
              }}>
                📝 Recent Tasks
              </h2>
              <a href="/employee/tasks" className="link-gold" style={{ fontSize: '0.9rem' }}>
                View All →
              </a>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentTasks.map((task) => (
                <div key={task.id} className="card-paper task-card">
                  <div className="task-card-header">
                    <h4 className="task-card-title">{task.title}</h4>
                    <span className={`task-status status-${task.status}`}>
                      {task.status === 'completed' ? '✓' : '○'} {task.status}
                    </span>
                  </div>
                  <p className="task-description">{task.description}</p>
                  <div className="task-meta">
                    <span className="task-meta-item">📅 {task.dueDate}</span>
                    <span className="task-meta-item">🔥 {task.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="panel-raised animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '1.25rem', 
              margin: '0 0 20px 0'
            }}>
              📢 Announcements
            </h2>
            
            <div className="memo-board" style={{ position: 'relative' }}>
              <div className="memo-pin"></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '8px' }}>
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="announcement-card panel-paper">
                    <h4 className="announcement-title">{announcement.title}</h4>
                    <p className="announcement-date">📅 {announcement.date}</p>
                    <p className="announcement-content">{announcement.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="panel-raised animate-slide-up" style={{ marginTop: '32px', animationDelay: '0.5s' }}>
          <h2 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '1.25rem', 
            margin: '0 0 20px 0'
          }}>
            ⚡ Quick Actions
          </h2>
          <div className="action-buttons">
            <a href="/employee/tasks" className="btn-skeu btn-primary">
              <span>➕</span>
              <span>Add New Task</span>
            </a>
            <a href="/employee/submit" className="btn-skeu btn-success">
              <span>📤</span>
              <span>Submit Weekly Report</span>
            </a>
            <button className="btn-skeu btn-secondary">
              <span>📎</span>
              <span>Attach Files</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default EmployeeDashboard
