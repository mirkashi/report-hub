import { useState, useEffect } from 'react'
import Sidebar from '../../components/shared/Sidebar'
import { reportAPI } from '../../services/api'

function DailyTaskInput() {
  const [selectedDay, setSelectedDay] = useState(4) // Friday
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    duration: 1
  })

  useEffect(() => {
    fetchTodaysTasks()
  }, [selectedDay])

  const fetchTodaysTasks = async () => {
    try {
      setLoading(true)
      const today = new Date()
      const response = await reportAPI.getByDate(today.toISOString().split('T')[0])
      // API returns { data: { success: true, reports: [...] } }
      if (response.data && response.data.reports && response.data.reports.length > 0) {
        const report = response.data.reports[0]
        if (report.tasks) {
          setTasks(report.tasks.map((task, idx) => ({
            id: task._id || idx,
            title: task.description,
            description: `Priority: ${task.priority}`,
            completed: task.status === 'completed',
            priority: task.priority,
            duration: task.duration || 1,
            attachments: task.attachments || []
          })))
        } else {
          setTasks([])
        }
      } else {
        setTasks([])
      }
      setError(null)
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setTasks([])
      setError(null) // Don't show error for missing report
    } finally {
      setLoading(false)
    }
  }

  const weekDays = [
    { day: 'Mon', date: '27', month: 'Jan' },
    { day: 'Tue', date: '28', month: 'Jan' },
    { day: 'Wed', date: '29', month: 'Jan' },
    { day: 'Thu', date: '30', month: 'Jan' },
    { day: 'Fri', date: '31', month: 'Jan' },
    { day: 'Sat', date: '01', month: 'Feb' },
    { day: 'Sun', date: '02', month: 'Feb' },
  ]

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const addTask = async (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) return
    
    try {
      const today = new Date()
      const todayStr = today.toISOString().split('T')[0]
      
      // Check if a report exists for today
      const response = await reportAPI.getByDate(todayStr)
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
        // Create new report
        const taskData = {
          type: 'daily',
          date: today.toISOString(),
          tasks: [newTaskData]
        }
        await reportAPI.create(taskData)
      }
      
      // Refresh tasks from server
      await fetchTodaysTasks()
      setNewTask({ title: '', description: '', priority: 'medium', duration: 1 })
    } catch (err) {
      console.error('Error adding task:', err)
      setError('Failed to add task')
    }
  }

  const deleteTask = async (id) => {
    try {
      await reportAPI.deleteTask(id)
      setTasks(tasks.filter(task => task.id !== id))
    } catch (err) {
      console.error('Error deleting task:', err)
      setError('Failed to delete task')
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
    </div>
  )
}

export default DailyTaskInput
