import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { reportAPI, userAPI } from '../../services/api'

function AdminDashboard() {
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState('overview')
  const [stats, setStats] = useState({
    totalEmployees: 0,
    reportsThisWeek: 0,
    pendingReviews: 0,
    approved: 0
  })
  const [recentReports, setRecentReports] = useState([])
  const [departments, setDepartments] = useState([])
  const [topPerformers, setTopPerformers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch employees
      const usersResponse = await userAPI.getUsers({ role: 'employee', limit: 100 })
      const employees = usersResponse.data?.users || []
      
      // Fetch all reports
      const reportsResponse = await reportAPI.getAllReports({ limit: 100 })
      const allReports = reportsResponse.data?.reports || []
      
      // Calculate stats
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      
      const reportsThisWeek = allReports.filter(r => 
        new Date(r.date) >= oneWeekAgo
      )
      
      const pendingReports = allReports.filter(r => r.status === 'submitted' || r.status === 'pending')
      const approvedReports = allReports.filter(r => r.status === 'approved')
      
      setStats({
        totalEmployees: employees.length,
        reportsThisWeek: reportsThisWeek.length,
        pendingReviews: pendingReports.length,
        approved: approvedReports.length
      })
      
      // Format recent reports (last 4)
      const reportsWithDates = allReports.map(report => ({
        ...report,
        parsedSubmittedAt: new Date(report.submittedAt || report.date)
      }))
      
      const formatted = reportsWithDates
        .sort((a, b) => b.parsedSubmittedAt - a.parsedSubmittedAt)
        .slice(0, 4)
        .map(report => ({
          id: report._id,
          employee: report.user?.name || 'Unknown',
          department: report.user?.department || 'N/A',
          week: new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: report.status === 'submitted' ? 'pending' : report.status,
          tasksCompleted: report.tasks?.filter(t => t.status === 'completed').length || 0,
          totalTasks: report.tasks?.length || 0,
          submittedAt: report.submittedAt 
            ? new Date(report.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + new Date(report.submittedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            : 'Not submitted'
        }))
      
      setRecentReports(formatted)
      
      // Calculate department stats
      const deptMap = new Map()
      employees.forEach(emp => {
        const dept = emp.department || 'N/A'
        if (!deptMap.has(dept)) {
          deptMap.set(dept, { name: dept, employees: 0, reportsSubmitted: 0 })
        }
        deptMap.get(dept).employees++
      })
      
      allReports.forEach(report => {
        const dept = report.user?.department || 'N/A'
        if (deptMap.has(dept) && (report.status === 'submitted' || report.status === 'approved')) {
          deptMap.get(dept).reportsSubmitted++
        }
      })
      
      const deptStats = Array.from(deptMap.values()).map(dept => ({
        ...dept,
        completion: dept.employees > 0 ? Math.round((dept.reportsSubmitted / dept.employees) * 100) : 0
      }))
      
      setDepartments(deptStats)
      
      // Calculate top performers (employees with most completed tasks)
      const employeeTaskMap = new Map()
      allReports.forEach(report => {
        const empId = report.user?._id
        const empName = report.user?.name
        const empDept = report.user?.department
        if (empId && empName) {
          if (!employeeTaskMap.has(empId)) {
            employeeTaskMap.set(empId, {
              name: empName,
              department: empDept || 'N/A',
              completed: 0,
              total: 0
            })
          }
          const empData = employeeTaskMap.get(empId)
          empData.completed += report.tasks?.filter(t => t.status === 'completed').length || 0
          empData.total += report.tasks?.length || 0
        }
      })
      
      const performers = Array.from(employeeTaskMap.values())
        .map(emp => ({
          ...emp,
          score: emp.total > 0 ? Math.round((emp.completed / emp.total) * 100) : 0,
          avatar: '👤'
        }))
        .filter(emp => emp.total > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
      
      setTopPerformers(performers)
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statsData = [
    { icon: '👥', label: 'Total Employees', value: stats.totalEmployees.toString(), change: '', changeType: 'positive' },
    { icon: '📋', label: 'Reports This Week', value: stats.reportsThisWeek.toString(), change: '', changeType: 'positive' },
    { icon: '⏳', label: 'Pending Reviews', value: stats.pendingReviews.toString(), change: '', changeType: 'negative' },
    { icon: '✅', label: 'Approved', value: stats.approved.toString(), change: '', changeType: 'positive' },
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

        {loading ? (
          <div className="panel-raised" style={{ textAlign: 'center', padding: '40px' }}>
            <p>⏳ Loading dashboard data...</p>
          </div>
        ) : (
        <>
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
                    {stat.change && (
                      <span style={{ 
                        fontSize: '0.85rem', 
                        color: stat.changeType === 'positive' ? '#48bb78' : '#fc8181',
                        fontWeight: 600
                      }}>
                        {stat.change}
                      </span>
                    )}
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
              <Link to="/admin/reports" className="link-gold" style={{ fontSize: '0.9rem' }}>
                View All →
              </Link>
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
              <Link to="/admin/reports" className="card-metal" style={{ textDecoration: 'none', textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📋</div>
                <div style={{ fontWeight: 600 }}>Review Reports</div>
              </Link>
              <Link to="/admin/announcements" className="card-metal" style={{ textDecoration: 'none', textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📢</div>
                <div style={{ fontWeight: 600 }}>Announcements</div>
              </Link>
              <div className="card-metal" style={{ textAlign: 'center', padding: '24px 16px', cursor: 'pointer' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📊</div>
                <div style={{ fontWeight: 600 }}>Export Data</div>
              </div>
              <Link to="/admin/employees" className="card-metal" style={{ textDecoration: 'none', textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👥</div>
                <div style={{ fontWeight: 600 }}>Manage Employees</div>
              </Link>
            </div>
          </div>
        </div>
        </>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
