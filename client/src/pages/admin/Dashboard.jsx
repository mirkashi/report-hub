import { useState } from 'react'
import Sidebar from '../../components/shared/Sidebar'
import { useAuth } from '../../context/AuthContext'

function AdminDashboard() {
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState('overview')

  const stats = [
    { icon: '👥', label: 'Total Employees', value: '48', change: '+3', changeType: 'positive' },
    { icon: '📋', label: 'Reports This Week', value: '42', change: '+12', changeType: 'positive' },
    { icon: '⏳', label: 'Pending Reviews', value: '6', change: '-2', changeType: 'negative' },
    { icon: '✅', label: 'Approved', value: '36', change: '+14', changeType: 'positive' },
  ]

  const recentReports = [
    {
      id: 1,
      employee: 'John Smith',
      department: 'Engineering',
      week: 'Jan 27 - Feb 2',
      status: 'pending',
      tasksCompleted: 14,
      totalTasks: 17,
      submittedAt: 'Jan 31, 2026 • 4:32 PM'
    },
    {
      id: 2,
      employee: 'Sarah Johnson',
      department: 'Design',
      week: 'Jan 27 - Feb 2',
      status: 'approved',
      tasksCompleted: 8,
      totalTasks: 8,
      submittedAt: 'Jan 30, 2026 • 2:15 PM'
    },
    {
      id: 3,
      employee: 'Mike Davis',
      department: 'Marketing',
      week: 'Jan 27 - Feb 2',
      status: 'revision',
      tasksCompleted: 5,
      totalTasks: 10,
      submittedAt: 'Jan 31, 2026 • 11:45 AM'
    },
    {
      id: 4,
      employee: 'Emily Chen',
      department: 'Engineering',
      week: 'Jan 27 - Feb 2',
      status: 'approved',
      tasksCompleted: 12,
      totalTasks: 12,
      submittedAt: 'Jan 30, 2026 • 5:00 PM'
    },
  ]

  const departments = [
    { name: 'Engineering', employees: 18, reportsSubmitted: 16, completion: 89 },
    { name: 'Design', employees: 8, reportsSubmitted: 8, completion: 100 },
    { name: 'Marketing', employees: 10, reportsSubmitted: 8, completion: 80 },
    { name: 'Sales', employees: 7, reportsSubmitted: 6, completion: 86 },
    { name: 'HR', employees: 5, reportsSubmitted: 4, completion: 80 },
  ]

  const topPerformers = [
    { name: 'Emily Chen', department: 'Engineering', score: 98, avatar: '👩‍💻' },
    { name: 'Sarah Johnson', department: 'Design', score: 96, avatar: '👩‍🎨' },
    { name: 'Alex Thompson', department: 'Sales', score: 94, avatar: '👨‍💼' },
  ]

  return (
    <div className="app-layout">
      <Sidebar type="admin" />
      
      <main className="main-content texture-leather">
        {/* Page Header */}
        <div className="page-header">
          <h1>📊 Admin Dashboard - Welcome, {user?.name || 'Admin'}!</h1>
          <p>Monitor and manage weekly report submissions</p>
        </div>

        {/* Tabs */}
        <div className="tabs-skeu" style={{ marginBottom: '32px', display: 'inline-flex' }}>
          <button 
            className={`tab-skeu ${selectedTab === 'overview' ? 'active' : ''}`}
            onClick={() => setSelectedTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-skeu ${selectedTab === 'departments' ? 'active' : ''}`}
            onClick={() => setSelectedTab('departments')}
          >
            Departments
          </button>
          <button 
            className={`tab-skeu ${selectedTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setSelectedTab('analytics')}
          >
            Analytics
          </button>
        </div>

        {/* Stats Cards */}
        <div className="card-grid card-grid-4 animate-slide-up" style={{ marginBottom: '32px' }}>
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="card-metal"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="stat-card">
                <div 
                  className="stat-icon" 
                  style={{ 
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.1) 100%)',
                    fontSize: '1.75rem'
                  }}
                >
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <h3 style={{ color: 'rgba(255,255,255,0.7)' }}>{stat.label}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span className="stat-value" style={{ color: '#fff' }}>{stat.value}</span>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      color: stat.changeType === 'positive' ? '#48bb78' : '#fc8181',
                      fontWeight: 600
                    }}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card-grid card-grid-2" style={{ marginBottom: '32px' }}>
          {/* Recent Reports */}
          <div className="panel-raised animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.25rem', 
                margin: 0
              }}>
                📋 Recent Submissions
              </h2>
              <a href="/admin/reports" className="link-gold" style={{ fontSize: '0.9rem' }}>
                View All →
              </a>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentReports.map((report) => (
                <div 
                  key={report.id} 
                  className="card-paper"
                  style={{ padding: '16px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: '#3d2b1f', fontWeight: 600 }}>
                        {report.employee}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#8a7a6a' }}>
                        {report.department} • {report.week}
                      </p>
                    </div>
                    <span className={`task-status status-${report.status === 'approved' ? 'completed' : report.status === 'revision' ? 'overdue' : 'pending'}`}>
                      {report.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="progress-bar" style={{ width: '80px', height: '6px' }}>
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(report.tasksCompleted / report.totalTasks) * 100}%` }}
                        ></div>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#5a4a3a' }}>
                        {report.tasksCompleted}/{report.totalTasks} tasks
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#8a7a6a' }}>
                      {report.submittedAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Overview */}
          <div className="panel-raised animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '1.25rem', 
              margin: '0 0 20px 0'
            }}>
              🏢 Department Overview
            </h2>
            
            <table className="table-skeu">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Employees</th>
                  <th>Reports</th>
                  <th>Completion</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept, index) => (
                  <tr key={index}>
                    <td><strong>{dept.name}</strong></td>
                    <td>{dept.employees}</td>
                    <td>{dept.reportsSubmitted}/{dept.employees}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="progress-bar" style={{ width: '60px', height: '6px' }}>
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${dept.completion}%`,
                              background: dept.completion === 100 
                                ? 'linear-gradient(90deg, #38a169, #48bb78)'
                                : 'linear-gradient(90deg, #d4a017, #f0c420)'
                            }}
                          ></div>
                        </div>
                        <span style={{ 
                          fontSize: '0.85rem', 
                          fontWeight: 600,
                          color: dept.completion === 100 ? '#38a169' : '#d4a017'
                        }}>
                          {dept.completion}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="card-grid card-grid-2">
          {/* Top Performers */}
          <div className="panel-raised animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '1.25rem', 
              margin: '0 0 20px 0'
            }}>
              🏆 Top Performers This Week
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topPerformers.map((performer, index) => (
                <div 
                  key={index}
                  className="card-paper"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px',
                    padding: '16px'
                  }}
                >
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    background: index === 0 
                      ? 'linear-gradient(145deg, #d4a017, #8a6508)'
                      : index === 1 
                        ? 'linear-gradient(145deg, #a0aec0, #718096)'
                        : 'linear-gradient(145deg, #b7860b, #7a5a08)',
                    borderRadius: '50%',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }}>
                    {performer.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px 0', color: '#3d2b1f' }}>{performer.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#8a7a6a' }}>
                      {performer.department}
                    </p>
                  </div>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 700,
                    color: '#38a169'
                  }}>
                    {performer.score}%
                  </div>
                  <div style={{ fontSize: '1.5rem' }}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="panel-raised animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '1.25rem', 
              margin: '0 0 20px 0'
            }}>
              ⚡ Quick Actions
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <a href="/admin/reports" className="card-metal" style={{ textDecoration: 'none', textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📋</div>
                <div style={{ fontWeight: 600 }}>Review Reports</div>
              </a>
              <a href="/admin/announcements" className="card-metal" style={{ textDecoration: 'none', textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📢</div>
                <div style={{ fontWeight: 600 }}>Announcements</div>
              </a>
              <div className="card-metal" style={{ textAlign: 'center', padding: '24px 16px', cursor: 'pointer' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📊</div>
                <div style={{ fontWeight: 600 }}>Export Data</div>
              </div>
              <div className="card-metal" style={{ textAlign: 'center', padding: '24px 16px', cursor: 'pointer' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👥</div>
                <div style={{ fontWeight: 600 }}>Manage Users</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
