import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import { reportAPI } from '../../services/api'

function WeeklySubmission() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [summary, setSummary] = useState('')
  const [challenges, setChallenges] = useState('')
  const [nextWeekPlan, setNextWeekPlan] = useState('')
  const [weekSummary, setWeekSummary] = useState({
    startDate: 'January 27, 2026',
    endDate: 'February 2, 2026',
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    hoursWorked: 0
  })
  const [dailySummary, setDailySummary] = useState([])
  const [completedTasks, setCompletedTasks] = useState([])
  const [selectedTasks, setSelectedTasks] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [attachedFiles, setAttachedFiles] = useState([])

  useEffect(() => {
    fetchWeeklyData()
  }, [])

  const fetchWeeklyData = async () => {
    try {
      setLoading(true)
      
      // Get the current week's start and end dates
      const today = new Date()
      const monday = new Date(today)
      const dayOfWeek = today.getDay() || 7 // Sunday = 0, convert to 7
      monday.setDate(today.getDate() - dayOfWeek + 1)
      
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)
      
      // Format dates for display
      const startDate = monday.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      const endDate = sunday.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      
      // Fetch all daily reports for the current week
      const response = await reportAPI.getAllReports({ type: 'daily' })
      const reports = response.data?.reports || []
      
      // Filter reports for current week
      const weekReports = reports.filter(report => {
        const reportDate = new Date(report.date)
        return reportDate >= monday && reportDate <= sunday
      })
      
      // Collect all tasks and stats
      let totalTasks = 0
      let completedCount = 0
      let totalHours = 0
      const allCompletedTasks = []
      const dailyBreakdown = []
      
      weekReports.forEach(report => {
        const reportTasks = report.tasks || []
        const reportDate = new Date(report.date)
        const dayName = reportDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        
        let dayCompleted = 0
        let dayHours = 0
        
        reportTasks.forEach(task => {
          totalTasks++
          dayHours += task.duration || 0
          
          if (task.status === 'completed') {
            completedCount++
            dayCompleted++
            allCompletedTasks.push({
              id: task._id || `${report._id}-${task.description}`,
              description: task.description,
              priority: task.priority || 'medium',
              duration: task.duration || 1,
              date: dayName,
              reportId: report._id
            })
          }
        })
        
        totalHours += dayHours
        dailyBreakdown.push({
          day: dayName,
          tasks: reportTasks.length,
          completed: dayCompleted,
          hours: dayHours
        })
      })
      
      setWeekSummary({
        startDate,
        endDate,
        totalTasks,
        completedTasks: completedCount,
        pendingTasks: totalTasks - completedCount,
        hoursWorked: totalHours
      })
      
      setDailySummary(dailyBreakdown)
      setCompletedTasks(allCompletedTasks)
      // Auto-select all completed tasks
      setSelectedTasks(allCompletedTasks.map(t => t.id))
      
      setLoading(false)
      setError(null)
    } catch (err) {
      console.error('Error fetching weekly data:', err)
      setLoading(false)
      setError('Failed to load weekly data')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!summary.trim()) {
      setError('Please provide a weekly summary')
      return
    }

    try {
      setIsSubmitting(true)
      const today = new Date()
      
      // Prepare tasks from selected completed tasks
      const tasksToInclude = completedTasks
        .filter(task => selectedTasks.includes(task.id))
        .map(task => ({
          description: task.description,
          priority: task.priority,
          duration: task.duration,
          status: 'completed'
        }))
      
      // Combine notes
      const notes = `${summary}\n\nChallenges: ${challenges}\n\nNext Week: ${nextWeekPlan}`
      
      await reportAPI.create({
        type: 'weekly',
        date: today.toISOString(),
        tasks: tasksToInclude,
        notes: notes.trim(),
        status: 'submitted',
        submittedAt: new Date()
      })
      setIsSubmitting(false)
      setShowSuccess(true)
    } catch (err) {
      console.error('Error submitting report:', err)
      setIsSubmitting(false)
      setError('Failed to submit report')
    }
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

        {/* Loading State */}
        {loading && (
          <div className="panel-raised" style={{ textAlign: 'center', padding: '40px', color: '#8a7a6a' }}>
            <p>⏳ Loading weekly data...</p>
          </div>
        )}

        {error && (
          <div className="panel-raised" style={{ textAlign: 'center', padding: '40px', color: '#e53e3e' }}>
            <p>❌ {error}</p>
            <button className="btn-skeu btn-primary" onClick={fetchWeeklyData} style={{ marginTop: '16px' }}>
              <span>🔄</span>
              <span>Retry</span>
            </button>
          </div>
        )}

        {!loading && (
        <>

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

        {/* Completed Tasks Section */}
        <div className="panel-raised animate-slide-up" style={{ marginBottom: '32px', animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '1.25rem', 
              margin: 0
            }}>
              ✅ Completed Tasks This Week ({selectedTasks.length}/{completedTasks.length} selected)
            </h2>
            <div className="action-buttons" style={{ gap: '8px' }}>
              <button 
                type="button"
                className="btn-skeu btn-secondary"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                onClick={() => setSelectedTasks(completedTasks.map(t => t.id))}
              >
                Select All
              </button>
              <button 
                type="button"
                className="btn-skeu btn-secondary"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                onClick={() => setSelectedTasks([])}
              >
                Clear All
              </button>
            </div>
          </div>
          
          {completedTasks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {completedTasks.map((task) => (
                <div 
                  key={task.id}
                  className="card-paper"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px',
                    padding: '12px 16px',
                    opacity: selectedTasks.includes(task.id) ? 1 : 0.5
                  }}
                >
                  <label className="checkbox-skeu" style={{ marginTop: 0 }}>
                    <input 
                      type="checkbox" 
                      checked={selectedTasks.includes(task.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTasks([...selectedTasks, task.id])
                        } else {
                          setSelectedTasks(selectedTasks.filter(id => id !== task.id))
                        }
                      }}
                    />
                    <span className="checkmark"></span>
                  </label>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, color: '#3d2b1f', marginBottom: '4px' }}>
                      {task.description}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#8a7a6a' }}>
                      📅 {task.date} • ⏱️ {task.duration}h • 🔥 {task.priority}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="panel-inset" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ margin: 0, opacity: 0.7 }}>No completed tasks this week. Complete some tasks to include them in your report.</p>
            </div>
          )}
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
        </>
        )}
      </main>
    </div>
  )
}

export default WeeklySubmission
