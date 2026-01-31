import { useState } from 'react'
import Sidebar from '../../components/shared/Sidebar'

function AdminReports() {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedReport, setSelectedReport] = useState(null)

  const reports = [
    {
      id: 1,
      employee: 'John Smith',
      avatar: '👨‍💻',
      email: 'john.smith@company.com',
      department: 'Engineering',
      week: 'Jan 27 - Feb 2, 2026',
      status: 'pending',
      tasksCompleted: 14,
      totalTasks: 17,
      hoursWorked: 42,
      submittedAt: 'Jan 31, 2026 • 4:32 PM',
      summary: 'Completed API documentation updates and reviewed multiple pull requests. Made progress on the authentication module refactoring.',
      attachments: ['api_docs_v2.pdf', 'test_results.png']
    },
    {
      id: 2,
      employee: 'Sarah Johnson',
      avatar: '👩‍🎨',
      email: 'sarah.j@company.com',
      department: 'Design',
      week: 'Jan 27 - Feb 2, 2026',
      status: 'approved',
      tasksCompleted: 8,
      totalTasks: 8,
      hoursWorked: 40,
      submittedAt: 'Jan 30, 2026 • 2:15 PM',
      summary: 'Finalized all UI mockups for the new dashboard. Created design system documentation and component library updates.',
      attachments: ['design_mockups.fig', 'style_guide.pdf']
    },
    {
      id: 3,
      employee: 'Mike Davis',
      avatar: '👨‍💼',
      email: 'mike.d@company.com',
      department: 'Marketing',
      week: 'Jan 27 - Feb 2, 2026',
      status: 'revision',
      tasksCompleted: 5,
      totalTasks: 10,
      hoursWorked: 35,
      submittedAt: 'Jan 31, 2026 • 11:45 AM',
      summary: 'Worked on Q1 marketing campaign. Several tasks delayed due to pending approvals from external vendors.',
      attachments: ['campaign_draft.docx']
    },
    {
      id: 4,
      employee: 'Emily Chen',
      avatar: '👩‍💻',
      email: 'emily.c@company.com',
      department: 'Engineering',
      week: 'Jan 27 - Feb 2, 2026',
      status: 'approved',
      tasksCompleted: 12,
      totalTasks: 12,
      hoursWorked: 45,
      submittedAt: 'Jan 30, 2026 • 5:00 PM',
      summary: 'Successfully deployed the new payment integration. All unit tests passing with 95% coverage.',
      attachments: ['deployment_report.pdf', 'coverage_report.html']
    },
    {
      id: 5,
      employee: 'Alex Thompson',
      avatar: '👨‍💼',
      email: 'alex.t@company.com',
      department: 'Sales',
      week: 'Jan 27 - Feb 2, 2026',
      status: 'pending',
      tasksCompleted: 7,
      totalTasks: 8,
      hoursWorked: 38,
      submittedAt: 'Jan 31, 2026 • 3:20 PM',
      summary: 'Closed 3 new deals this week. One pending proposal awaiting client feedback.',
      attachments: ['sales_report.xlsx']
    },
  ]

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
          <div className="panel-raised animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {selectedReport ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ 
                      width: '64px', 
                      height: '64px', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem',
                      background: 'linear-gradient(145deg, #5a6a7d, #4a5a6d)',
                      borderRadius: '50%',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }}>
                      {selectedReport.avatar}
                    </div>
                    <div>
                      <h2 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-display)' }}>
                        {selectedReport.employee}
                      </h2>
                      <p style={{ margin: '0 0 4px 0', opacity: 0.7 }}>{selectedReport.email}</p>
                      <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.6 }}>
                        {selectedReport.department} • {selectedReport.week}
                      </p>
                    </div>
                  </div>
                  <span className={`task-status status-${getStatusColor(selectedReport.status)}`}>
                    {selectedReport.status}
                  </span>
                </div>

                {/* Stats */}
                <div className="card-grid card-grid-3" style={{ marginBottom: '24px' }}>
                  <div className="panel-inset" style={{ textAlign: 'center', padding: '16px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                      {selectedReport.tasksCompleted}/{selectedReport.totalTasks}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Tasks</div>
                  </div>
                  <div className="panel-inset" style={{ textAlign: 'center', padding: '16px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                      {Math.round((selectedReport.tasksCompleted / selectedReport.totalTasks) * 100)}%
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Completion</div>
                  </div>
                  <div className="panel-inset" style={{ textAlign: 'center', padding: '16px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{selectedReport.hoursWorked}h</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Hours</div>
                  </div>
                </div>

                {/* Summary */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem' }}>📝 Summary</h3>
                  <div className="panel-inset" style={{ padding: '16px' }}>
                    <p style={{ margin: 0, lineHeight: 1.6 }}>{selectedReport.summary}</p>
                  </div>
                </div>

                {/* Attachments */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem' }}>📎 Attachments</h3>
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

                {/* Submitted Info */}
                <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '24px' }}>
                  Submitted: {selectedReport.submittedAt}
                </p>

                {/* Actions */}
                <div className="divider"></div>
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
      </main>
    </div>
  )
}

export default AdminReports
