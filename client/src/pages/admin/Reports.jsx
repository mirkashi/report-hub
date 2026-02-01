import { useState, useEffect } from 'react'
import Sidebar from '../../components/shared/Sidebar'
import { reportAPI } from '../../services/api'

function AdminReports() {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedReport, setSelectedReport] = useState(null)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await reportAPI.getAllReports()
      const reportsData = response.data?.reports || []
      const formattedReports = reportsData.map(report => ({
        id: report._id,
        employee: report.user?.name || 'Unknown',
        avatar: '📄',
        email: report.user?.email || '',
        department: report.user?.department || 'N/A',
        week: new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: report.status || 'draft',
        tasksCompleted: report.tasks?.filter(t => t.status === 'completed').length || 0,
        totalTasks: report.tasks?.length || 0,
        hoursWorked: report.tasks?.reduce((sum, t) => sum + (t.duration || 0), 0) || 0,
        submittedAt: report.submittedAt ? new Date(report.submittedAt).toLocaleDateString() : 'Not submitted',
        summary: report.notes || report.tasks?.map(t => t.description).join('; ') || '',
        attachments: report.attachments || []
      }))
      setReports(formattedReports)
      setError(null)
    } catch (err) {
      console.error('Error fetching reports:', err)
      setError('Failed to load reports')
      setReports([])
    } finally {
      setLoading(false)
    }
  }

  const filteredReports = reports.filter(report => {
    if (selectedStatus !== 'all' && report.status !== selectedStatus) return false
    if (selectedDepartment !== 'all' && report.department !== selectedDepartment) return false
    return true
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'completed'
      case 'revision': return 'overdue'
      default: return 'pending'
    }
  }

  return (
    <div className="app-layout">
      <Sidebar type="admin" />
      
      <main className="main-content texture-leather">
        {/* Page Header */}
        <div className="page-header">
          <h1>📋 Weekly Reports</h1>
          <p>Review and manage employee weekly report submissions</p>
        </div>

        {/* Filters */}
        <div className="panel-raised animate-slide-up" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ margin: 0, minWidth: '200px' }}>
              <label className="form-label" style={{ marginBottom: '8px' }}>Status</label>
              <select
                className="input-skeu"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="revision">Needs Revision</option>
              </select>
            </div>
            
            <div className="form-group" style={{ margin: 0, minWidth: '200px' }}>
              <label className="form-label" style={{ marginBottom: '8px' }}>Department</label>
              <select
                className="input-skeu"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0, flex: 1, minWidth: '250px' }}>
              <label className="form-label" style={{ marginBottom: '8px' }}>Search</label>
              <input
                type="text"
                className="input-skeu"
                placeholder="Search by employee name..."
              />
            </div>

            <button className="btn-skeu btn-primary" style={{ height: 'fit-content' }}>
              <span>🔍</span>
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Loading/Error State */}
        {loading && (
          <div className="panel-raised" style={{ textAlign: 'center', padding: '40px', color: '#8a7a6a' }}>
            <p>⏳ Loading reports...</p>
          </div>
        )}

        {error && (
          <div className="panel-raised" style={{ textAlign: 'center', padding: '40px', color: '#e53e3e' }}>
            <p>❌ {error}</p>
            <button className="btn-skeu btn-primary" onClick={fetchReports} style={{ marginTop: '16px' }}>
              <span>🔄</span>
              <span>Retry</span>
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
        {/* Reports Grid */}
        <div className="card-grid card-grid-2">
          {/* Report List */}
          <div className="panel-raised animate-slide-up scrollbar-skeu" style={{ 
            animationDelay: '0.1s',
            maxHeight: '70vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.25rem', 
                margin: 0
              }}>
                Submissions ({filteredReports.length})
              </h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-skeu btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                  <span>📥</span>
                  <span>Export</span>
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredReports.map((report) => (
                <div 
                  key={report.id} 
                  className={`card-paper ${selectedReport?.id === report.id ? 'selected' : ''}`}
                  style={{ 
                    padding: '16px',
                    cursor: 'pointer',
                    border: selectedReport?.id === report.id ? '2px solid #d4a017' : '2px solid transparent',
                    transition: 'border 0.2s ease'
                  }}
                  onClick={() => setSelectedReport(report)}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      background: 'linear-gradient(145deg, #5a6a7d, #4a5a6d)',
                      borderRadius: '50%',
                      flexShrink: 0
                    }}>
                      {report.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <h4 style={{ margin: 0, color: '#3d2b1f', fontWeight: 600 }}>
                          {report.employee}
                        </h4>
                        <span className={`task-status status-${getStatusColor(report.status)}`} style={{ fontSize: '0.7rem' }}>
                          {report.status}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#8a7a6a' }}>
                        {report.department}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#a89a8a' }}>
                        📅 {report.week}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report Detail */}
          <div className="panel-raised animate-slide-up scrollbar-skeu" style={{ 
            animationDelay: '0.2s',
            maxHeight: '70vh',
            overflowY: 'auto'
          }}>
            {selectedReport ? (
              <>
                {/* Report Header */}
                <div style={{ 
                  background: 'linear-gradient(145deg, #4a3728 0%, #3d2b1f 100%)',
                  padding: '24px',
                  margin: '-24px -24px 24px -24px',
                  borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                  borderBottom: '3px solid rgba(212, 160, 23, 0.3)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ 
                        width: '64px', 
                        height: '64px', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        background: 'linear-gradient(145deg, #5a6a7d, #4a5a6d)',
                        borderRadius: '50%',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                      }}>
                        {selectedReport.avatar}
                      </div>
                      <div>
                        <h2 style={{ 
                          margin: '0 0 6px 0', 
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.5rem',
                          color: '#f0c420',
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                        }}>
                          {selectedReport.employee}
                        </h2>
                        <p style={{ margin: '0 0 4px 0', opacity: 0.8, fontSize: '0.95rem' }}>
                          ✉️ {selectedReport.email}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>
                          🏢 {selectedReport.department} • 📅 {selectedReport.week}
                        </p>
                      </div>
                    </div>
                    <span className={`task-status status-${getStatusColor(selectedReport.status)}`} style={{
                      fontSize: '0.85rem',
                      padding: '8px 16px',
                      textTransform: 'uppercase',
                      fontWeight: 700
                    }}>
                      {selectedReport.status}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="card-grid card-grid-3" style={{ marginBottom: '24px' }}>
                  <div className="panel-inset" style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    background: 'linear-gradient(145deg, #2d1b0f 0%, #3d2b1f 100%)',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid rgba(212, 160, 23, 0.2)'
                  }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#d4a017', marginBottom: '8px' }}>
                      {selectedReport.tasksCompleted}/{selectedReport.totalTasks}
                    </div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.7, fontWeight: 600 }}>Tasks Completed</div>
                  </div>
                  <div className="panel-inset" style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    background: 'linear-gradient(145deg, #2d1b0f 0%, #3d2b1f 100%)',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid rgba(212, 160, 23, 0.2)'
                  }}>
                    <div style={{ 
                      fontSize: '2rem', 
                      fontWeight: 700, 
                      color: selectedReport.tasksCompleted === selectedReport.totalTasks ? '#38a169' : '#ecc94b',
                      marginBottom: '8px'
                    }}>
                      {selectedReport.totalTasks > 0 ? Math.round((selectedReport.tasksCompleted / selectedReport.totalTasks) * 100) : 0}%
                    </div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.7, fontWeight: 600 }}>Completion Rate</div>
                  </div>
                  <div className="panel-inset" style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    background: 'linear-gradient(145deg, #2d1b0f 0%, #3d2b1f 100%)',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid rgba(212, 160, 23, 0.2)'
                  }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#5a8acd', marginBottom: '8px' }}>
                      {selectedReport.hoursWorked}h
                    </div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.7, fontWeight: 600 }}>Hours Worked</div>
                  </div>
                </div>

                {/* Report Summary */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ 
                    margin: '0 0 16px 0', 
                    fontSize: '1.1rem',
                    fontFamily: 'var(--font-display)',
                    color: '#f0c420',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>📝</span> Report Summary
                  </h3>
                  <div className="panel-inset" style={{ 
                    padding: '20px',
                    background: 'linear-gradient(180deg, #fdfbf7 0%, #f8f4eb 100%)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    <p style={{ 
                      margin: 0, 
                      lineHeight: 1.8, 
                      color: '#2d2d2d',
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'var(--font-body)'
                    }}>
                      {selectedReport.summary || 'No summary provided'}
                    </p>
                  </div>
                </div>

                {/* Tasks Breakdown */}
                {selectedReport.totalTasks > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ 
                      margin: '0 0 16px 0', 
                      fontSize: '1.1rem',
                      fontFamily: 'var(--font-display)',
                      color: '#f0c420',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>✅</span> Tasks Overview ({selectedReport.totalTasks} total)
                    </h3>
                    <div style={{ 
                      marginBottom: '16px',
                      background: 'linear-gradient(145deg, #2d1b0f 0%, #3d2b1f 100%)',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                        <span>Progress</span>
                        <span style={{ fontWeight: 600 }}>
                          {selectedReport.tasksCompleted} of {selectedReport.totalTasks} completed
                        </span>
                      </div>
                      <div className="progress-bar" style={{ height: '8px' }}>
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${selectedReport.totalTasks > 0 ? (selectedReport.tasksCompleted / selectedReport.totalTasks) * 100 : 0}%`,
                            background: selectedReport.tasksCompleted === selectedReport.totalTasks 
                              ? 'linear-gradient(90deg, #38a169, #48bb78)' 
                              : 'linear-gradient(90deg, #ecc94b, #f6e05e)'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {selectedReport.attachments && selectedReport.attachments.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ 
                      margin: '0 0 12px 0', 
                      fontSize: '1.1rem',
                      fontFamily: 'var(--font-display)',
                      color: '#f0c420',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>📎</span> Attachments ({selectedReport.attachments.length})
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {selectedReport.attachments.map((file, index) => (
                        <div 
                          key={index}
                          className="file-clip"
                        >
                          {file}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div style={{ 
                  padding: '16px',
                  background: 'linear-gradient(145deg, #2d1b0f 0%, #3d2b1f 100%)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '24px',
                  border: '1px solid rgba(212, 160, 23, 0.2)'
                }}>
                  <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: 0 }}>
                    📤 <strong>Submitted:</strong> {selectedReport.submittedAt}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ 
                  borderTop: '2px solid rgba(212, 160, 23, 0.3)',
                  paddingTop: '20px'
                }}>
                  <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                    {selectedReport.status === 'pending' && (
                      <>
                        <button className="btn-skeu btn-danger">
                          <span>↩️</span>
                          <span>Request Revision</span>
                        </button>
                        <button className="btn-skeu btn-success">
                          <span>✓</span>
                          <span>Approve Report</span>
                        </button>
                      </>
                    )}
                    {selectedReport.status === 'approved' && (
                      <button className="btn-skeu btn-secondary">
                        <span>📥</span>
                        <span>Download Report</span>
                      </button>
                    )}
                    {selectedReport.status === 'revision' && (
                      <button className="btn-skeu btn-primary">
                        <span>📧</span>
                        <span>Send Reminder</span>
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                height: '400px',
                opacity: 0.5
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📄</div>
                <p style={{ margin: 0 }}>Select a report to view details</p>
              </div>
            )}
          </div>
        </div>
          </>
        )}
      </main>
    </div>
  )
}

export default AdminReports
