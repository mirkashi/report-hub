import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'

function WeeklySubmission() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [summary, setSummary] = useState('')
  const [challenges, setChallenges] = useState('')
  const [nextWeekPlan, setNextWeekPlan] = useState('')

  const weekSummary = {
    startDate: 'January 27, 2026',
    endDate: 'February 2, 2026',
    totalTasks: 17,
    completedTasks: 14,
    pendingTasks: 3,
    hoursWorked: 42
  }

  const dailySummary = [
    { day: 'Monday', tasks: 3, completed: 3, hours: 8 },
    { day: 'Tuesday', tasks: 4, completed: 4, hours: 9 },
    { day: 'Wednesday', tasks: 2, completed: 2, hours: 7 },
    { day: 'Thursday', tasks: 5, completed: 5, hours: 10 },
    { day: 'Friday', tasks: 3, completed: 0, hours: 8 },
  ]

  const attachedFiles = [
    { name: 'api_documentation_v2.pdf', size: '2.4 MB', type: 'pdf' },
    { name: 'test_results_screenshot.png', size: '856 KB', type: 'image' },
    { name: 'code_review_notes.docx', size: '128 KB', type: 'doc' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)
    }, 2000)
  }

  if (showSuccess) {
    return (
      <div className="app-layout">
        <Sidebar type="employee" />
        <main className="main-content texture-leather">
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center'
          }}>
            <div className="panel-raised animate-slide-up" style={{ maxWidth: '500px', padding: '48px' }}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                margin: '0 auto 24px',
                background: 'linear-gradient(145deg, #38a169 0%, #2f855a 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)'
              }}>
                ✓
              </div>
              <h1 style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '2rem', 
                marginBottom: '16px' 
              }}>
                Report Submitted!
              </h1>
              <p style={{ opacity: 0.8, marginBottom: '32px', lineHeight: 1.6 }}>
                Your weekly report for {weekSummary.startDate} - {weekSummary.endDate} has been 
                successfully submitted and is now awaiting review.
              </p>
              <div className="action-buttons" style={{ justifyContent: 'center' }}>
                <button 
                  className="btn-skeu btn-primary"
                  onClick={() => navigate('/employee/dashboard')}
                >
                  <span>🏠</span>
                  <span>Back to Dashboard</span>
                </button>
                <button 
                  className="btn-skeu btn-secondary"
                  onClick={() => setShowSuccess(false)}
                >
                  <span>📄</span>
                  <span>View Report</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <Sidebar type="employee" />
      
      <main className="main-content texture-leather">
        {/* Page Header */}
        <div className="page-header">
          <h1>📤 Weekly Report Submission</h1>
          <p>Review and submit your weekly work report</p>
        </div>

        {/* Week Summary Card */}
        <div className="panel-raised animate-slide-up" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '1.25rem', 
              margin: 0
            }}>
              📅 Week Summary: {weekSummary.startDate} - {weekSummary.endDate}
            </h2>
            <span className="task-status status-pending">Draft</span>
          </div>

          {/* Stats Row */}
          <div className="card-grid card-grid-4" style={{ marginBottom: '24px' }}>
            <div className="panel-inset" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#d4a017' }}>{weekSummary.totalTasks}</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Total Tasks</div>
            </div>
            <div className="panel-inset" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#38a169' }}>{weekSummary.completedTasks}</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Completed</div>
            </div>
            <div className="panel-inset" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ecc94b' }}>{weekSummary.pendingTasks}</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Pending</div>
            </div>
            <div className="panel-inset" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#5a8acd' }}>{weekSummary.hoursWorked}h</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Hours Worked</div>
            </div>
          </div>

          {/* Daily Breakdown Table */}
          <h3 style={{ fontSize: '1rem', margin: '0 0 16px 0' }}>Daily Breakdown</h3>
          <table className="table-skeu">
            <thead>
              <tr>
                <th>Day</th>
                <th>Tasks</th>
                <th>Completed</th>
                <th>Progress</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {dailySummary.map((day, index) => (
                <tr key={index}>
                  <td><strong>{day.day}</strong></td>
                  <td>{day.tasks}</td>
                  <td>
                    <span style={{ color: day.completed === day.tasks ? '#38a169' : '#ecc94b' }}>
                      {day.completed}
                    </span>
                  </td>
                  <td>
                    <div className="progress-bar" style={{ width: '100px', height: '6px' }}>
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${day.tasks > 0 ? (day.completed / day.tasks) * 100 : 0}%`,
                          background: day.completed === day.tasks 
                            ? 'linear-gradient(90deg, #38a169, #48bb78)' 
                            : 'linear-gradient(90deg, #ecc94b, #f6e05e)'
                        }}
                      ></div>
                    </div>
                  </td>
                  <td>{day.hours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-grid card-grid-2" style={{ marginBottom: '32px' }}>
            {/* Summary & Notes */}
            <div className="panel-raised animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h2 style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.25rem', 
                margin: '0 0 24px 0'
              }}>
                📝 Weekly Summary
              </h2>

              <div className="form-group">
                <label className="form-label">Summary of Accomplishments *</label>
                <textarea
                  className="input-skeu"
                  placeholder="Describe your key accomplishments this week..."
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  required
                  style={{ resize: 'vertical', minHeight: '100px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Challenges & Blockers</label>
                <textarea
                  className="input-skeu"
                  placeholder="Any challenges or blockers you faced..."
                  rows={3}
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  style={{ resize: 'vertical', minHeight: '80px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Next Week's Plan</label>
                <textarea
                  className="input-skeu"
                  placeholder="Outline your plans for next week..."
                  rows={3}
                  value={nextWeekPlan}
                  onChange={(e) => setNextWeekPlan(e.target.value)}
                  style={{ resize: 'vertical', minHeight: '80px' }}
                />
              </div>
            </div>

            {/* Attachments */}
            <div className="panel-raised animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h2 style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.25rem', 
                margin: '0 0 24px 0'
              }}>
                📎 Attachments
              </h2>

              {/* Upload Area */}
              <div 
                className="panel-inset"
                style={{ 
                  position: 'relative',
                  textAlign: 'center', 
                  padding: '32px',
                  marginBottom: '20px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📁</div>
                <p style={{ margin: 0, fontWeight: 500 }}>Drop files here or click to upload</p>
                <p style={{ margin: '8px 0 0', fontSize: '0.85rem', opacity: 0.6 }}>
                  Supports PDF, DOC, Images up to 10MB
                </p>
                <input 
                  type="file" 
                  multiple 
                  style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    opacity: 0, 
                    cursor: 'pointer' 
                  }}
                />
              </div>

              {/* Attached Files */}
              <h3 style={{ fontSize: '1rem', margin: '0 0 12px 0' }}>Attached Files ({attachedFiles.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {attachedFiles.map((file, index) => (
                  <div 
                    key={index}
                    className="card-paper"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      padding: '12px 16px'
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>
                      {file.type === 'pdf' ? '📄' : file.type === 'image' ? '🖼️' : '📝'}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, color: '#3d2b1f' }}>{file.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#8a7a6a' }}>{file.size}</div>
                    </div>
                    <button 
                      type="button"
                      className="btn-skeu btn-danger"
                      style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="panel-raised animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontFamily: 'var(--font-display)' }}>
                  Ready to Submit?
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>
                  Review your report before submitting. This action cannot be undone.
                </p>
              </div>
              <div className="action-buttons">
                <button type="button" className="btn-skeu btn-secondary">
                  <span>💾</span>
                  <span>Save Draft</span>
                </button>
                <button type="button" className="btn-skeu btn-secondary">
                  <span>👁️</span>
                  <span>Preview</span>
                </button>
                <button 
                  type="submit" 
                  className="btn-3d"
                  disabled={isSubmitting}
                  style={{ minWidth: '200px' }}
                >
                  {isSubmitting ? (
                    <>⏳ Submitting...</>
                  ) : (
                    <>📤 Submit Weekly Report</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

export default WeeklySubmission
