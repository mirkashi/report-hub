import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import Footer from '../../components/shared/Footer'
import { userAPI } from '../../services/api'

function AdminEmployees() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await userAPI.getUsers({ role: 'employee', limit: 100 })
      setEmployees(response.data?.users || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching employees:', err)
      setError('Failed to load employees')
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await userAPI.deleteUser(employeeId)
      setEmployees(employees.filter(emp => emp._id !== employeeId))
      setDeleteConfirm(null)
      setError(null)
    } catch (err) {
      console.error('Error deleting employee:', err)
      setError('Failed to delete employee')
    }
  }

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))]

  return (
    <div className="app-layout">
      <Sidebar type="admin" />
      
      <main className="main-content texture-leather">
        {/* Page Header */}
        <div className="page-header">
          <h1>👥 Employees</h1>
          <p>Manage registered employees</p>
        </div>

        {/* Filters */}
        <div className="panel-raised animate-slide-up" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ margin: 0, flex: 1, minWidth: '250px' }}>
              <label className="form-label" style={{ marginBottom: '8px' }}>Search</label>
              <input
                type="text"
                className="input-skeu"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="form-group" style={{ margin: 0, minWidth: '200px' }}>
              <label className="form-label" style={{ marginBottom: '8px' }}>Department</label>
              <select
                className="input-skeu"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <button className="btn-skeu btn-primary" onClick={fetchEmployees} style={{ height: 'fit-content' }}>
              <span>🔄</span>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Loading/Error State */}
        {loading && (
          <div className="panel-raised" style={{ textAlign: 'center', padding: '40px', color: '#8a7a6a' }}>
            <p>⏳ Loading employees...</p>
          </div>
        )}

        {error && (
          <div className="panel-raised" style={{ textAlign: 'center', padding: '40px', color: '#e53e3e' }}>
            <p>❌ {error}</p>
            <button className="btn-skeu btn-primary" onClick={fetchEmployees} style={{ marginTop: '16px' }}>
              <span>🔄</span>
              <span>Retry</span>
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="panel-raised animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.25rem', 
                margin: 0
              }}>
                Registered Employees ({filteredEmployees.length})
              </h2>
            </div>

            {filteredEmployees.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table className="table-skeu">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Position</th>
                      <th>Joined</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee) => (
                      <tr key={employee._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ 
                              width: '40px', 
                              height: '40px', 
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.5rem',
                              background: 'linear-gradient(145deg, #5a6a7d, #4a5a6d)',
                              borderRadius: '50%'
                            }}>
                              👤
                            </div>
                            <strong>{employee.name}</strong>
                          </div>
                        </td>
                        <td>{employee.email}</td>
                        <td>{employee.department || 'N/A'}</td>
                        <td>{employee.position || 'N/A'}</td>
                        <td>{new Date(employee.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td>
                          <span className={`task-status status-${employee.isActive ? 'completed' : 'overdue'}`}>
                            {employee.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              className="btn-skeu btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                              onClick={() => navigate(`/admin/employees/${employee._id}`)}
                            >
                              <span>👁️</span>
                              <span>View</span>
                            </button>
                            <button 
                              className="btn-skeu btn-danger"
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                              onClick={() => setDeleteConfirm(employee._id)}
                            >
                              <span>🗑️</span>
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', opacity: 0.6 }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>👥</div>
                <p>No employees found</p>
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="panel-raised" style={{ maxWidth: '400px', padding: '32px' }}>
              <h3 style={{ marginTop: 0 }}>Confirm Deletion</h3>
              <p>Are you sure you want to delete this employee? This action cannot be undone.</p>
              <div className="action-buttons" style={{ justifyContent: 'flex-end', marginTop: '24px' }}>
                <button 
                  className="btn-skeu btn-secondary"
                  onClick={() => setDeleteConfirm(null)}
                >
                  <span>↩️</span>
                  <span>Cancel</span>
                </button>
                <button 
                  className="btn-skeu btn-danger"
                  onClick={() => handleDeleteEmployee(deleteConfirm)}
                >
                  <span>🗑️</span>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default AdminEmployees
