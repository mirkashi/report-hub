import { useState, useEffect } from 'react'
import Sidebar from '../../components/shared/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { reportAPI, announcementAPI } from '../../services/api'

function EmployeeDashboard() {
  const { user } = useAuth()
  const [selectedDay, setSelectedDay] = useState(4) // Friday
  const [stats, setStats] = useState({
    totalTasks: 0,
    completed: 0,
    pending: 0,
    reportsSent: 0
  })
  const [recentTasks, setRecentTasks] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [weeklyReports, setWeeklyReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch stats
      const statsResponse = await reportAPI.getStats()
      if (statsResponse.data?.success) {
        const data = statsResponse.data
        setStats({
          totalTasks: data.taskStats?.total || 0,
          completed: data.taskStats?.completed || 0,
          pending: data.taskStats?.pending || 0,
          reportsSent: data.totalReports || 0
        })
        setWeeklyReports(data.weeklyReports || [])
      }

      // Fetch recent reports for recent tasks
      const reportsResponse = await reportAPI.getAllReports({ limit: 5, type: 'daily' })
      if (reportsResponse.data?.success && reportsResponse.data.reports) {
        const allTasks = []
        reportsResponse.data.reports.forEach(report => {
          if (report.tasks) {
            report.tasks.forEach((task, idx) => {
              allTasks.push({
                id: task._id || `${report._id}-${idx}`,
                title: task.description,
                description: `Duration: ${task.duration || 1}h`,
                status: task.status,
                dueDate: new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                priority: task.priority || 'medium'
              })
            })
          }
        })
        setRecentTasks(allTasks.slice(0, 3))
      }

      // Fetch announcements
      const announcementsResponse = await announcementAPI.getAll({ limit: 2 })
      if (announcementsResponse.data?.success && announcementsResponse.data.announcements) {
        setAnnouncements(announcementsResponse.data.announcements.map(a => ({
          id: a._id,
          title: a.title,
          date: new Date(a.publishedAt || a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          content: a.content
        })))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statsData = [
    { icon: '📝', label: 'Total Tasks', value: stats.totalTasks.toString(), color: '#d4a017' },
    { icon: '✅', label: 'Completed', value: stats.completed.toString(), color: '#38a169' },
    { icon: '⏳', label: 'Pending', value: stats.pending.toString(), color: '#ecc94b' },
    { icon: '📤', label: 'Reports Sent', value: stats.reportsSent.toString(), color: '#5a8acd' },
  ]

  // Generate week days dynamically
  const getWeekDays = () => {
    const today = new Date()
    const monday = new Date(today)
    // Handle Sunday (0) by treating it as 7
    const dayOfWeek = today.getDay() || 7
    monday.setDate(today.getDate() - dayOfWeek + 1) // Get Monday of current week
    
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday)
      day.setDate(monday.getDate() + i)
      
      // Find report for this day
      const dayStr = day.toISOString().split('T')[0]
      const dayReport = weeklyReports.find(r => r.date?.split('T')[0] === dayStr)
      const taskCount = dayReport?.tasks?.length || 0
      const completedCount = dayReport?.tasks?.filter(t => t.status === 'completed').length || 0
      
      days.push({
        day: day.toLocaleDateString('en-US', { weekday: 'short' }),
        date: day.getDate().toString(),
        tasks: taskCount,
        completed: taskCount > 0 && completedCount === taskCount
      })
    }
    return days
  }

  const weekDays = getWeekDays()
  const progressPercent = stats.totalTasks > 0 ? Math.round((stats.completed / stats.totalTasks) * 100) : 0

  return (
    <div className="app-layout">
      <Sidebar type="employee" />
      
      <main className="main-content texture-leather">
        {/* Page Header */}
        <div className="page-header">
          <h1>👋 Welcome back, {user?.name || 'User'}!</h1>
          <p>Here's your weekly overview</p>
        </div>

        {loading ? (
          <div className="panel-raised" style={{ textAlign: 'center', padding: '40px' }}>
            <p>⏳ Loading your dashboard...</p>
          </div>
        ) : (
        <>
        {/* Stats Cards */}
        <div className="card-grid card-grid-4 animate-slide-up" style={{ marginBottom: '32px' }}>
          {statsData.map((stat, index) => (
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
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{progressPercent}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
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
              {recentTasks.length > 0 ? recentTasks.map((task) => (
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
              )) : (
                <div className="panel-inset" style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ margin: 0, opacity: 0.7 }}>No recent tasks. Add your first task!</p>
                </div>
              )}
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
                {announcements.length > 0 ? announcements.map((announcement) => (
                  <div key={announcement.id} className="announcement-card panel-paper">
                    <h4 className="announcement-title">{announcement.title}</h4>
                    <p className="announcement-date">📅 {announcement.date}</p>
                    <p className="announcement-content">{announcement.content}</p>
                  </div>
                )) : (
                  <div className="panel-inset" style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ margin: 0, opacity: 0.7 }}>No announcements at this time</p>
                  </div>
                )}
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
        </>
        )}
      </main>
    </div>
  )
}

export default EmployeeDashboard
