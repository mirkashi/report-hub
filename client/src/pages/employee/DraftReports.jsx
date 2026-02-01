import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import { reportAPI } from '../../services/api'

function DraftReports() {
  const navigate = useNavigate()
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDrafts()
  }, [])

  const fetchDrafts = async () => {
    try {
      setLoading(true)
      const response = await reportAPI.getAllReports({ status: 'draft' })
      if (response.data?.success && response.data.reports) {
        const formattedDrafts = response.data.reports.map(draft => ({
          id: draft._id,
          type: draft.type,
          date: new Date(draft.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          dateObj: new Date(draft.date),
          tasks: draft.tasks || [],
          tasksCount: draft.tasks?.length || 0,
          notes: draft.notes || '',
          createdAt: new Date(draft.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          updatedAt: new Date(draft.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
        }))
        setDrafts(formattedDrafts.sort((a, b) => b.dateObj - a.dateObj))
      }
    } catch (error) {
      console.error('Error fetching drafts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (id) => {
    try {
      await reportAPI.submitReport(id)
      await fetchDrafts()
      alert('Report submitted successfully!')
    } catch (error) {
      console.error('Error submitting report:', error)
      alert('Failed to submit report')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this draft?')) return
    
    try {
      await reportAPI.deleteReport(id)
      await fetchDrafts()
    } catch (error) {
      console.error('Error deleting draft:', error)
      alert('Failed to delete draft')
    }
  }

  return (
    <div className="app-layout">
      <Sidebar type="employee" />
      
      <main className="main-content texture-leather">
        {/* Page Header */}
        <div className="page-header">
          <h1>📝 Draft Reports</h1>
          <p>Manage and submit your saved draft reports</p>
        </div>

        {loading ? (
          <div className="panel-raised" style={{ textAlign: 'center', padding: '40px' }}>
            <p>⏳ Loading drafts...</p>
          </div>
        ) : (
          <>
            {drafts.length === 0 ? (
              <div className="panel-raised animate-slide-up" style={{ textAlign: 'center', padding: '60px 40px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.5 }}>📄</div>
                <h3 style={{ margin: '0 0 12px 0' }}>No Draft Reports</h3>
                <p style={{ margin: '0 0 24px 0', opacity: 0.7 }}>
                  You don't have any saved drafts at the moment.
                </p>
                <button 
                  className="btn-skeu btn-primary"
                  onClick={() => navigate('/employee/tasks')}
                >
                  <span>➕</span>
                  <span>Create New Task</span>
                </button>
              </div>
            ) : (
              <div className="card-grid card-grid-2">
                {drafts.map((draft) => (
                  <div key={draft.id} className="panel-raised animate-slide-up">
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <h3 style={{ 
                            margin: '0 0 8px 0', 
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.3rem',
                            color: '#f0c420'
                          }}>
                            {draft.type === 'daily' ? '📅 Daily Report' : '📊 Weekly Report'}
                          </h3>
                          <p style={{ margin: 0, opacity: 0.7 }}>
                            {draft.date}
                          </p>
                        </div>
                        <span className="task-status status-pending">
                          Draft
                        </span>
                      </div>
                    </div>

                    <div className="panel-inset" style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>Tasks</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f0c420' }}>
                          {draft.tasksCount}
                        </span>
                      </div>
                      
                      {draft.tasks.length > 0 && (
                        <div style={{ 
                          marginTop: '12px',
                          paddingTop: '12px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                          {draft.tasks.slice(0, 3).map((task, idx) => (
                            <div key={idx} style={{ 
                              fontSize: '0.85rem', 
                              opacity: 0.8, 
                              marginBottom: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <span style={{ opacity: 0.5 }}>•</span>
                              <span style={{ 
                                flex: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {task.description}
                              </span>
                            </div>
                          ))}
                          {draft.tasks.length > 3 && (
                            <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '8px' }}>
                              +{draft.tasks.length - 3} more tasks
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {draft.notes && (
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ 
                          margin: '0 0 8px 0', 
                          fontSize: '0.9rem',
                          opacity: 0.7,
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>
                          Notes
                        </h4>
                        <p style={{ 
                          margin: 0, 
                          fontSize: '0.9rem',
                          opacity: 0.8,
                          lineHeight: 1.6,
                          maxHeight: '60px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {draft.notes}
                        </p>
                      </div>
                    )}

                    <div style={{ 
                      fontSize: '0.8rem', 
                      opacity: 0.6,
                      marginBottom: '20px',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div>📝 Created: {draft.createdAt}</div>
                      <div>🕐 Last modified: {draft.updatedAt}</div>
                    </div>

                    <div className="action-buttons">
                      <button 
                        className="btn-skeu btn-secondary"
                        onClick={() => navigate(`/employee/tasks?edit=${draft.id}`)}
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </button>
                      <button 
                        className="btn-skeu btn-danger"
                        onClick={() => handleDelete(draft.id)}
                      >
                        <span>🗑️</span>
                        <span>Delete</span>
                      </button>
                      <button 
                        className="btn-skeu btn-success"
                        onClick={() => handleSubmit(draft.id)}
                      >
                        <span>📤</span>
                        <span>Submit</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default DraftReports
