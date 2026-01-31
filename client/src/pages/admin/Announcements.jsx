import { useState } from 'react'
import Sidebar from '../../components/shared/Sidebar'

function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'New Report Submission Deadline',
      content: 'Starting next month, all weekly reports must be submitted by Friday 5:00 PM. Late submissions will be flagged for review.',
      priority: 'high',
      author: 'Admin',
      createdAt: 'Jan 31, 2026',
      pinned: true
    },
    {
      id: 2,
      title: 'System Maintenance Scheduled',
      content: 'The report hub will undergo scheduled maintenance on Saturday, Feb 8, 2026 from 2:00 AM to 6:00 AM. Please save your work before this time.',
      priority: 'medium',
      author: 'IT Department',
      createdAt: 'Jan 30, 2026',
      pinned: false
    },
    {
      id: 3,
      title: 'New Feature: File Attachments',
      content: 'We\'ve added the ability to attach files directly to your daily tasks. Supported formats include PDF, DOC, and images up to 10MB.',
      priority: 'low',
      author: 'Product Team',
      createdAt: 'Jan 28, 2026',
      pinned: false
    },
    {
      id: 4,
      title: 'Q1 Performance Reviews',
      content: 'Q1 performance reviews will begin on March 1st. Please ensure all your weekly reports are complete and accurate before this date.',
      priority: 'high',
      author: 'HR Department',
      createdAt: 'Jan 25, 2026',
      pinned: true
    },
  ])

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) return

    setAnnouncements([
      {
        id: Date.now(),
        ...newAnnouncement,
        author: 'Admin',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        pinned: false
      },
      ...announcements
    ])
    setNewAnnouncement({ title: '', content: '', priority: 'medium' })
  }

  const togglePin = (id) => {
    setAnnouncements(announcements.map(a => 
      a.id === id ? { ...a, pinned: !a.pinned } : a
    ))
  }

  const deleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter(a => a.id !== id))
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e53e3e'
      case 'medium': return '#d4a017'
      default: return '#38a169'
    }
  }

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return 0
  })

  return (
    <div className="app-layout">
      <Sidebar type="admin" />
      
      <main className="main-content texture-leather">
        {/* Page Header */}
        <div className="page-header">
          <h1>📢 Announcements</h1>
          <p>Create and manage company announcements</p>
        </div>

        <div className="card-grid card-grid-2">
          {/* Announcement List - Memo Board Style */}
          <div className="panel-raised animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.25rem', 
                margin: 0
              }}>
                📌 Active Announcements
              </h2>
              <span className="notification-badge">{announcements.length}</span>
            </div>

            {/* Memo Board */}
            <div className="memo-board scrollbar-skeu" style={{ 
              position: 'relative',
              maxHeight: '60vh',
              overflowY: 'auto',
              padding: '32px 24px'
            }}>
              <div className="memo-pin"></div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
                {sortedAnnouncements.map((announcement, index) => (
                  <div 
                    key={announcement.id}
                    className="card-paper"
                    style={{ 
                      position: 'relative',
                      transform: `rotate(${(index % 2 === 0 ? 0.5 : -0.5)}deg)`,
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    {/* Pin indicator */}
                    {announcement.pinned && (
                      <div style={{ 
                        position: 'absolute',
                        top: '-10px',
                        right: '20px',
                        fontSize: '1.5rem'
                      }}>
                        📌
                      </div>
                    )}

                    {/* Priority indicator */}
                    <div style={{ 
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      background: getPriorityColor(announcement.priority),
                      borderRadius: '4px 0 0 4px'
                    }}></div>

                    <div style={{ paddingLeft: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h3 style={{ 
                          margin: 0, 
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.1rem',
                          color: '#3d2b1f'
                        }}>
                          {announcement.title}
                        </h3>
                        <span style={{ 
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          background: getPriorityColor(announcement.priority),
                          color: '#fff',
                          borderRadius: '4px',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}>
                          {announcement.priority}
                        </span>
                      </div>

                      <p style={{ 
                        margin: '0 0 12px 0',
                        color: '#5a4a3a',
                        lineHeight: 1.6,
                        fontSize: '0.95rem'
                      }}>
                        {announcement.content}
                      </p>

                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '12px',
                        borderTop: '1px solid rgba(0,0,0,0.1)'
                      }}>
                        <span style={{ fontSize: '0.8rem', color: '#8a7a6a' }}>
                          👤 {announcement.author} • 📅 {announcement.createdAt}
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button 
                            className="btn-skeu btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            onClick={() => togglePin(announcement.id)}
                          >
                            {announcement.pinned ? '📌' : '📍'}
                          </button>
                          <button 
                            className="btn-skeu btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            ✏️
                          </button>
                          <button 
                            className="btn-skeu btn-danger"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            onClick={() => deleteAnnouncement(announcement.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {announcements.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', opacity: 0.6 }}>
                    <p>No announcements yet. Create your first one!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Create New Announcement */}
          <div className="panel-raised animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '1.25rem', 
              margin: '0 0 24px 0'
            }}>
              ✍️ Create New Announcement
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="input-skeu"
                  placeholder="Announcement title..."
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  className="input-skeu"
                  placeholder="Write your announcement message..."
                  rows={6}
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  required
                  style={{ resize: 'vertical', minHeight: '150px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Priority Level</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['low', 'medium', 'high'].map((priority) => (
                    <label 
                      key={priority}
                      className="checkbox-skeu"
                      style={{ 
                        flex: 1,
                        padding: '12px 16px',
                        background: newAnnouncement.priority === priority 
                          ? `${getPriorityColor(priority)}20` 
                          : 'transparent',
                        borderRadius: '8px',
                        border: `2px solid ${newAnnouncement.priority === priority ? getPriorityColor(priority) : 'transparent'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input 
                        type="radio" 
                        name="priority"
                        value={priority}
                        checked={newAnnouncement.priority === priority}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                        style={{ display: 'none' }}
                      />
                      <span style={{ 
                        textTransform: 'capitalize',
                        fontWeight: 500,
                        color: getPriorityColor(priority)
                      }}>
                        {priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🟢'} {priority}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Target Audience</label>
                <select className="input-skeu">
                  <option value="all">All Employees</option>
                  <option value="engineering">Engineering Only</option>
                  <option value="design">Design Only</option>
                  <option value="marketing">Marketing Only</option>
                  <option value="sales">Sales Only</option>
                  <option value="hr">HR Only</option>
                </select>
              </div>

              <div className="divider"></div>

              <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn-skeu btn-secondary"
                  onClick={() => setNewAnnouncement({ title: '', content: '', priority: 'medium' })}
                >
                  <span>↩️</span>
                  <span>Clear</span>
                </button>
                <button type="submit" className="btn-3d">
                  <span>📢</span>
                  <span>Publish Announcement</span>
                </button>
              </div>
            </form>

            <div className="divider"></div>

            {/* Quick Templates */}
            <h3 style={{ fontSize: '1rem', margin: '0 0 12px 0' }}>📋 Quick Templates</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { label: 'Deadline Reminder', title: 'Report Deadline Reminder', content: 'This is a reminder that weekly reports are due by Friday 5:00 PM.' },
                { label: 'System Update', title: 'System Update Notice', content: 'We will be performing system updates. Please save your work.' },
                { label: 'Meeting Notice', title: 'Team Meeting Scheduled', content: 'A team meeting has been scheduled. Please check your calendar for details.' },
              ].map((template, index) => (
                <button 
                  key={index}
                  type="button"
                  className="btn-skeu btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                  onClick={() => setNewAnnouncement({ 
                    ...newAnnouncement, 
                    title: template.title, 
                    content: template.content 
                  })}
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminAnnouncements
