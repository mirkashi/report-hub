import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Notification from '../components/Notification'

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [validationError, setValidationError] = useState('')
  const [showNotification, setShowNotification] = useState(false)
  const { register, isLoading } = useAuth()
  const navigate = useNavigate()

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match')
      return false
    }
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setValidationError('')
    
    if (!validateForm()) {
      return
    }
    
    const result = await register(formData)
    
    if (result.success) {
      // Show success notification
      setShowNotification(true)
    } else {
      setError(result.error)
    }
  }

  const handleNotificationClose = () => {
    setShowNotification(false)
    // Navigate to login page after notification closes
    setTimeout(() => {
      navigate('/login')
    }, 300)
  }

  return (
    <div className="auth-layout">
      {showNotification && (
        <Notification
          type="success"
          title="Account Created Successfully!"
          message="Your account has been created. Please log in to continue."
          onClose={handleNotificationClose}
          duration={4000}
        />
      )}
      <div className="auth-container animate-slide-up" style={{ maxWidth: '560px' }}>
        {/* Logo Section */}
        <div className="logo-container">
          <div className="logo">
            <span className="logo-icon">📊</span>
          </div>
          <h1 className="logo-text">ReportHub</h1>
          <p style={{ color: 'rgba(245, 240, 230, 0.6)', marginTop: '8px' }}>
            Create your account
          </p>
        </div>

        {/* Registration Card */}
        <div className="panel-raised texture-leather">
          <h2 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '1.5rem', 
            marginBottom: '8px',
            marginTop: 0,
            textAlign: 'center' 
          }}>
            Employee Registration
          </h2>
          <p style={{ 
            textAlign: 'center', 
            color: 'rgba(245, 240, 230, 0.7)',
            marginBottom: '24px' 
          }}>
            Fill in your details to get started
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '16px',
                fontSize: '0.9rem',
                border: '1px solid #f5c6cb'
              }}>
                ⚠️ {error}
              </div>
            )}
            
            {validationError && (
              <div style={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '16px',
                fontSize: '0.9rem',
                border: '1px solid #f5c6cb'
              }}>
                ⚠️ {validationError}
              </div>
            )}
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="input-skeu"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="input-skeu"
                  placeholder="Smith"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="input-skeu"
                placeholder="john.smith@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                className="input-skeu"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="input-skeu"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="input-skeu"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="checkbox-skeu">
                <input type="checkbox" required />
                <span className="checkmark"></span>
                <span style={{ fontSize: '0.9rem' }}>
                  I agree to the <a href="#" className="link-gold">Terms of Service</a> and{' '}
                  <a href="#" className="link-gold">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              className="btn-3d"
              style={{ width: '100%', marginBottom: '16px' }}
              disabled={isLoading}
            >
              {isLoading ? '⏳ Creating Account...' : '✨ Create Account'}
            </button>
          </form>

          <div className="divider"></div>

          <p style={{ textAlign: 'center', margin: 0, fontSize: '0.95rem' }}>
            Already have an account?{' '}
            <Link to="/login" className="link-gold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
