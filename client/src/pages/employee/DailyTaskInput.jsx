import { useState, useEffect } from 'react'
import Sidebar from '../../components/shared/Sidebar'
import Footer from '../../components/shared/Footer'
import { reportAPI } from '../../services/api'

function DailyTaskInput() {
  // Initialize selectedDay to today's day of week
  const getTodayIndex = () => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    // Convert Sunday (0) to 6, Monday (1) to 0, etc.
    return dayOfWeek === 0 ? 6 : dayOfWeek - 1
  }
  
  const [selectedDay, setSelectedDay] = useState(getTodayIndex())
  const [tasks, setTasks] = useState([])
  const [reportId, setReportId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    duration: 1
  })
  
  // Generate week days dynamically based on current week
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
      
      days.push({
        day: day.toLocaleDateString('en-US', { weekday: 'short' }),
        date: day.getDate().toString().padStart(2, '0'),
        month: day.toLocaleDateString('en-US', { month: 'short' }),
        fullDate: day // Store full date for comparison
      })
    }
    return days
  }

  const weekDays = getWeekDays()

  useEffect(() => {
    fetchTasksForDay()
  }, [selectedDay])

  const fetchTasksForDay = async () => {
    try {
      setLoading(true)
      
      // Get the date for the selected day from weekDays
      const selectedDate = weekDays[selectedDay].fullDate
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
      const day = String(selectedDate.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`
      
      const response = await reportAPI.getByDate(dateStr)
      // API returns { data: { success: true, reports: [...] } }
      if (response.data && response.data.reports && response.data.reports.length > 0) {
        const report = response.data.reports[0]
        setReportId(report._id)
        if (report.tasks) {
          setTasks(report.tasks.map((task, idx) => ({
            id: task._id || idx,
            title: task.description,
            description: `Priority: ${task.priority}`,
            completed: task.status === 'completed',
            priority: task.priority,
            duration: task.duration || 1,
            status: task.status,
            attachments: task.attachments || []
          })))
        } else {
          setTasks([])
        }
      } else {
        setReportId(null)
        setTasks([])
      }
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setReportId(null)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const toggleTask = async (id) => {
    if (!reportId) return
    
    try {
      // Update UI immediately for better UX
      const updatedTasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
      setTasks(updatedTasks)
      
      // Prepare tasks for backend (convert completed boolean to status string)
      const backendTasks = updatedTasks.map(task => ({
        description: task.title,
        priority: task.priority,
        duration: task.duration,
        status: task.completed ? 'completed' : 'pending'
      }))
      
      // Update on backend
      await reportAPI.updateReport(reportId, { tasks: backendTasks })
    } catch (err) {
      console.error('Error toggling task:', err)
      // Revert on error
      await fetchTasksForDay()
      
    }
  }

  const addTask = async (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) return
    
    try {
      // Get the date for the selected day
      const selectedDate = weekDays[selectedDay].fullDate
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
      const day = String(selectedDate.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`
      
      // Check if a report exists for the selected day
      const response = await reportAPI.getByDate(dateStr)
      const existingReport = response.data?.reports?.[0]
      
      const newTaskData = {
        description: newTask.title,
        priority: newTask.priority,
        duration: newTask.duration || 1,
        status: 'pending'
      }
      
      if (existingReport) {
        // Update existing report
        const updatedTasks = [...(existingReport.tasks || []), newTaskData]
        await reportAPI.updateReport(existingReport._id, { tasks: updatedTasks })
      } else {
        // Create new report - use date string with UTC noon to avoid timezone date shifts
        // Setting time to 12:00 UTC ensures the date stays consistent across timezones
        // Example: 2024-01-15T12:00:00.000Z will be Jan 15 in UTC-12 through UTC+12
        const taskData = {
          type: 'daily',
          date: `${dateStr}T12:00:00.000Z`,
          tasks: [newTaskData]
        }
        await reportAPI.create(taskData)
      }
      
      // Refresh tasks from server
      await fetchTasksForDay()
      setNewTask({ title: '', description: '', priority: 'medium', duration: 1 })
    } catch (err) {
      console.error('Error adding task:', err)
      
    }
  }

  const deleteTask = async (id) => {
    try {
      await reportAPI.deleteTask(id)
      setTasks(tasks.filter(task => task.id !== id))
    } catch (err) {
      console.error('Error deleting task:', err)
      
    }
  }

  const completedCount = tasks.filter(t => t.completed).length
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0

  return (
    <div className="app-layout">
      <Sidebar type="employee" />
      
      <main className="main-content texture-leather">
        {/* Page Header */}
        <div className="page-header">
          <h1>📝 Daily Task Input</h1>
          <p>Log your daily work activities and tasks</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="panel-raised" style={{ textAlign: 'center', padding: '40px', color: '#8a7a6a' }}>
            <p>⏳ Loading tasks...</p>
          </div>
        )}

        {!loading && (
        <>
        {/* Week Day Selector */}
        <div className="panel-raised animate-slide-up" style={{ marginBottom: '32px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontFamily: 'var(--font-display)' }}>
            Select Day
          </h3>
          <div className="week-days">
            {weekDays.map((day, index) => (
              <div 
                key={index}
                className={`week-day panel-inset ${selectedDay === index ? 'active' : ''}`}
                onClick={() => setSelectedDay(index)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{day.day}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{day.date}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{day.month}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-grid card-grid-2">
          {/* Task List */}
          <div className="panel-raised animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.25rem', 
                margin: 0
              }}>
                📋 Tasks for {weekDays[selectedDay].day}, {weekDays[selectedDay].month} {weekDays[selectedDay].date}
              </h2>
              <span className="notification-badge">{tasks.length}</span>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.9rem' }}>
                  {completedCount} of {tasks.length} tasks completed
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{progressPercent}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>

            {/* Task Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="card-paper task-card"
                  style={{ opacity: task.completed ? 0.7 : 1 }}
                >
                  <div style={{ display: 'flex', gap: '16px' }}>
                    {/* Checkbox */}
                    <label className="checkbox-skeu" style={{ marginTop: '4px' }}>
                      <input 
                        type="checkbox" 
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                      />
                      <span className="checkmark"></span>
                    </label>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div className="task-card-header" style={{ marginBottom: '8px', paddingBottom: '8px' }}>
                        <h4 
                          className="task-card-title"
                          style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                        >
                          {task.title}
                        </h4>
                        <span className={`task-status ${task.priority === 'high' ? 'status-overdue' : 'status-pending'}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="task-description" style={{ marginBottom: '12px' }}>
                        {task.description}
                      </p>

                      {/* Attachments */}
                      {task.attachments.length > 0 && (
                        <div className="file-list">
                          {task.attachments.map((file, idx) => (
                            <div key={idx} className="file-item">
                              <span className="file-item-icon">📄</span>
                              <span>{file}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="action-buttons" style={{ marginTop: '12px' }}>
                        <button className="btn-skeu btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                          <span>📎</span>
                          <span>Attach</span>
                        </button>
                        <button className="btn-skeu btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                          <span>✏️</span>
                          <span>Edit</span>
                        </button>
                        <button 
                          className="btn-skeu btn-danger" 
                          style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                          onClick={() => deleteTask(task.id)}
                        >
                          <span>🗑️</span>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {tasks.length === 0 && (
                <div className="panel-inset" style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ margin: 0, opacity: 0.7 }}>No tasks for this day. Add your first task!</p>
                </div>
              )}
            </div>
          </div>

          {/* Add New Task */}
          <div className="panel-raised animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '1.25rem', 
              margin: '0 0 24px 0'
            }}>
              ➕ Add New Task
            </h2>

            <form onSubmit={addTask}>
              <div className="form-group">
                <label className="form-label">Task Title *</label>
                <input
                  type="text"
                  className="input-skeu"
                  placeholder="Enter task title..."
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="input-skeu"
                  placeholder="Describe the task in detail..."
                  rows={4}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  style={{ resize: 'vertical', minHeight: '100px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="input-skeu"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Attachments</label>
                <div 
                  className="file-clip"
                  style={{ width: '100%', justifyContent: 'center', padding: '20px' }}
                >
                  📎 Click to attach files or drag & drop
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
              </div>

              <button type="submit" className="btn-3d" style={{ width: '100%' }}>
                ✨ Add Task
              </button>
            </form>

            <div className="divider"></div>

            {/* Today's Tasks Quick Add */}
            <h3 style={{ fontSize: '1rem', margin: '0 0 12px 0' }}>Today's Tasks</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {tasks.length > 0 ? (
                tasks.slice(0, 5).map((task) => (
                  <button 
                    key={task.id}
                    type="button"
                    className="btn-skeu btn-secondary"
                    style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                    onClick={() => setNewTask({ 
                      ...newTask, 
                      title: task.title,
                      priority: task.priority 
                    })}
                    title={`Click to add: ${task.title}`}
                  >
                    {task.title.length > 20 ? task.title.substring(0, 20) + '...' : task.title}
                  </button>
                ))
              ) : (
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#8a7a6a', fontStyle: 'italic' }}>
                  Your tasks for today will appear here for quick re-adding
                </p>
              )}
            </div>
          </div>
        </div>
        </>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default DailyTaskInput
