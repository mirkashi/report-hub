import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import Footer from '../../components/shared/Footer'
import { reportAPI } from '../../services/api'

// Constants
const DEFAULT_TASK_DURATION = 1

function SubmittedReports() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState(null)

  useEffect(() => {
    fetchSubmittedReports()
  }, [])

  const fetchSubmittedReports = async () => {
    try {
      setLoading(true)
      const response = await reportAPI.getAllReports()
      if (response.data?.success && response.data.reports) {
        // Get all non-draft reports (submitted, approved, rejected)
        const submittedReports = response.data.reports
          .filter(r => r.status !== 'draft')
          .map(report => ({
            id: report._id,
            type: report.type,
            date: new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            dateObj: new Date(report.date),
            status: report.status,
            tasks: report.tasks || [],
            tasksCompleted: report.tasks?.filter(t => t.status === 'completed').length || 0,
            totalTasks: report.tasks?.length || 0,
            notes: report.notes || '',
            reviewNotes: report.reviewNotes || '',
            reviewedBy: report.reviewedBy?.name || '',
            reviewedAt: report.reviewedAt ? new Date(report.reviewedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
            submittedAt: report.submittedAt ? new Date(report.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
            hoursWorked: report.tasks?.reduce((sum, t) => sum + (t.duration || 0), 0) || 0
          }))
          .sort((a, b) => b.dateObj - a.dateObj)
        setReports(submittedReports)
      }
    } catch (error) {
      console.error('Error fetching submitted reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'completed'
      case 'rejected': return 'overdue'
      case 'submitted': return 'pending'
      default: return 'pending'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return '✅'
      case 'rejected': return '❌'
      case 'submitted': return '⏳'
      default: return '📄'
    }
  }

  const calculateCompletionRate = (report) => {
    return report.totalTasks > 0 
      ? Math.round((report.tasksCompleted / report.totalTasks) * 100) 
      : 0
  }

  return (
    <div className="app-layout">
      <Sidebar type="employee" />
      
      <main className="main-content texture-leather">
        {/* Page Header */}
        <div className="page-header">
          <h1>📤 My Submitted Reports</h1>
          <p>View your submitted reports and admin feedback</p>
        </div>

        {loading ? (
          <div className="panel-raised" style={{ textAlign: 'center', padding: '40px' }}>
            <p>⏳ Loading reports...</p>
          </div>
        ) : (
          <>
            {reports.length === 0 ? (
              <div className="panel-raised animate-slide-up" style={{ textAlign: 'center', padding: '60px 40px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.5 }}>📄</div>
                <h3 style={{ margin: '0 0 12px 0' }}>No Submitted Reports</h3>
                <p style={{ margin: '0 0 24px 0', opacity: 0.7 }}>
                  You haven't submitted any reports yet.
                </p>
                <button 
                  className="btn-skeu btn-primary"
                  onClick={() => navigate('/employee/drafts')}
                >
                  <span>📝</span>
                  <span>Go to Drafts</span>
                </button>
              </div>
            ) : (
              <div className="card-grid card-grid-2">
                {/* Report List */}
                <div className="panel-raised animate-slide-up scrollbar-skeu" style={{ 
                  animationDelay: '0.1s',
                  maxHeight: '70vh',
                  overflowY: 'auto'
                }}>
                  <h2 style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontSize: '1.25rem', 
                    margin: '0 0 20px 0'
                  }}>
                    All Reports ({reports.length})
                  </h2>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {reports.map((report) => (
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <h4 style={{ margin: 0, color: '#3d2b1f', fontWeight: 600 }}>
                            {getStatusIcon(report.status)} {report.type === 'daily' ? 'Daily Report' : 'Weekly Report'}
                          </h4>
                          <span className={`task-status status-${getStatusColor(report.status)}`} style={{ fontSize: '0.7rem' }}>
                            {report.status}
                          </span>
                        </div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#8a7a6a' }}>
                          📅 {report.date}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#a89a8a' }}>
                          {report.totalTasks} tasks • {report.hoursWorked}h worked
                        </p>
                        {report.reviewNotes && (
                          <div style={{ 
                            marginTop: '8px', 
                            padding: '8px', 
                            background: 'rgba(212, 160, 23, 0.1)',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            color: '#8a6508'
                          }}>
                            💬 Admin feedback available
                          </div>
                        )}
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h2 style={{ 
                              margin: '0 0 6px 0', 
                              fontFamily: 'var(--font-display)',
                              fontSize: '1.5rem',
                              color: '#f0c420',
                              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                            }}>
                              {selectedReport.type === 'daily' ? '📅 Daily Report' : '📊 Weekly Report'}
                            </h2>
                            <p style={{ margin: '0 0 4px 0', opacity: 0.8, fontSize: '0.95rem' }}>
                              📅 {selectedReport.date}
                            </p>
                            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>
                              📤 Submitted: {selectedReport.submittedAt}
                            </p>
                          </div>
                          <span className={`task-status status-${getStatusColor(selectedReport.status)}`} style={{
                            fontSize: '0.85rem',
                            padding: '8px 16px',
                            textTransform: 'uppercase',
                            fontWeight: 700
                          }}>
                            {getStatusIcon(selectedReport.status)} {selectedReport.status}
                          </span>
                        </div>
                      </div>

                      {/* Admin Review Section - PROMINENT DISPLAY */}
                      {selectedReport.reviewNotes && (
                        <div style={{ marginBottom: '24px' }}>
                          <div style={{
                            background: selectedReport.status === 'approved' 
                              ? 'linear-gradient(145deg, #38a169, #2f855a)' 
                              : 'linear-gradient(145deg, #e53e3e, #c53030)',
                            padding: '20px',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                            border: `3px solid ${selectedReport.status === 'approved' ? '#2f855a' : '#c53030'}`
                          }}>
                            <h3 style={{ 
                              margin: '0 0 16px 0', 
                              fontSize: '1.2rem',
                              fontFamily: 'var(--font-display)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                            }}>
                              {selectedReport.status === 'approved' ? '✅ Report Approved!' : '❌ Report Needs Revision'}
                            </h3>
                            
                            <div style={{
                              background: 'rgba(255, 255, 255, 0.95)',
                              padding: '16px',
                              borderRadius: 'var(--radius-md)',
                              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                              marginBottom: '12px'
                            }}>
                              <h4 style={{
                                margin: '0 0 8px 0',
                                fontSize: '0.9rem',
                                color: '#3d2b1f',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                fontWeight: 600
                              }}>
                                Admin Feedback:
                              </h4>
                              <p style={{ 
                                margin: 0, 
                                lineHeight: 1.8, 
                                color: '#2d2d2d',
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'var(--font-body)',
                                fontSize: '1rem'
                              }}>
                                {selectedReport.reviewNotes}
                              </p>
                            </div>
                            
                            {selectedReport.reviewedBy && (
                              <p style={{ 
                                fontSize: '0.85rem', 
                                color: 'rgba(255, 255, 255, 0.9)', 
                                margin: 0,
                                fontStyle: 'italic'
                              }}>
                                Reviewed by {selectedReport.reviewedBy} on {selectedReport.reviewedAt}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

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
                            {calculateCompletionRate(selectedReport)}%
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
                      {selectedReport.notes && (
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
                              {selectedReport.notes}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Tasks Details */}
                      {selectedReport.tasks && selectedReport.tasks.length > 0 && (
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
                            <span>📋</span> Task Details
                          </h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {selectedReport.tasks.map((task, index) => (
                              <div 
                                key={index}
                                className="panel-inset"
                                style={{ 
                                  padding: '16px',
                                  background: 'linear-gradient(145deg, #2d1b0f 0%, #3d2b1f 100%)',
                                  borderRadius: 'var(--radius-md)',
                                  border: '1px solid rgba(212, 160, 23, 0.2)'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                  <h4 style={{ margin: 0, color: '#f0c420' }}>
                                    {task.description}
                                  </h4>
                                  <span className={`task-status status-${task.status === 'completed' ? 'completed' : 'pending'}`}>
                                    {task.status}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem', opacity: 0.8 }}>
                                  <span>⏱️ {task.duration || DEFAULT_TASK_DURATION}h</span>
                                  <span>🎯 {task.priority || 'medium'} priority</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default SubmittedReports
