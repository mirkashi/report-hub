import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate registration
    setTimeout(() => {
      setIsLoading(false)
      navigate('/employee/dashboard')
    }, 1500)
  }

  return (
    <div className="auth-layout">
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
                <option value="engineering">Engineering</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="hr">Human Resources</option>
                <option value="finance">Finance</option>
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
