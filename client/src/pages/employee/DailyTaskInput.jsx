import { useState } from 'react'
import Sidebar from '../../components/shared/Sidebar'

function DailyTaskInput() {
  const [selectedDay, setSelectedDay] = useState(4) // Friday
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Review pull requests',
      description: 'Review and approve pending PRs for the frontend team.',
      completed: false,
      priority: 'medium',
      attachments: ['code_review_notes.pdf']
    },
    {
      id: 2,
      title: 'Fix login bug',
      description: 'Investigate and fix the session timeout issue reported by QA.',
      completed: false,
      priority: 'high',
      attachments: []
    },
    {
      id: 3,
      title: 'Update unit tests',
      description: 'Add test coverage for the new authentication module.',
      completed: true,
      priority: 'medium',
      attachments: ['test_results.png']
    },
  ])

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium'
  })

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

  const addTask = (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) return
    
    setTasks([...tasks, {
      id: Date.now(),
      ...newTask,
      completed: false,
      attachments: []
    }])
    setNewTask({ title: '', description: '', priority: 'medium' })
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
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

            {/* Quick Add Templates */}
            <h3 style={{ fontSize: '1rem', margin: '0 0 12px 0' }}>Quick Templates</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Code Review', 'Bug Fix', 'Meeting', 'Documentation', 'Testing'].map((template) => (
                <button 
                  key={template}
                  type="button"
                  className="btn-skeu btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                  onClick={() => setNewTask({ ...newTask, title: template })}
                >
                  {template}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DailyTaskInput
