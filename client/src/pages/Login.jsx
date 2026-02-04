import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../components/shared/Footer.css'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      // Navigate based on user role
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/employee/dashboard')
      }
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-container animate-slide-up">
        {/* Logo Section */}
        <div className="logo-container">
          <div className="logo">
            <span className="logo-icon">📊</span>
          </div>
          <h1 className="logo-text">ReportHub</h1>
          <p style={{ color: 'rgba(245, 240, 230, 0.6)', marginTop: '8px' }}>
            Weekly Report Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="panel-raised texture-leather">
          <h2 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '1.5rem', 
            marginBottom: '8px',
            marginTop: 0,
            textAlign: 'center' 
          }}>
            Welcome Back
          </h2>
          <p style={{ 
            textAlign: 'center', 
            color: 'rgba(245, 240, 230, 0.7)',
            marginBottom: '24px' 
          }}>
            Sign in to your account
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
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="input-skeu"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="input-skeu"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '24px' 
            }}>
              <label className="checkbox-skeu">
                <input type="checkbox" />
                <span className="checkmark"></span>
                <span style={{ fontSize: '0.9rem' }}>Remember me</span>
              </label>
              <a href="#" className="link-gold" style={{ fontSize: '0.9rem' }}>
                Forgot password?
              </a>
            </div>

            <button 
              type="submit" 
              className="btn-3d"
              style={{ width: '100%', marginBottom: '16px' }}
              disabled={isLoading}
            >
              {isLoading ? '⏳ Signing In...' : '🔐 Sign In'}
            </button>
          </form>

          <div className="divider"></div>

          <p style={{ textAlign: 'center', margin: 0, fontSize: '0.95rem' }}>
            Don't have an account?{' '}
            <Link to="/register" className="link-gold">
              Create Account
            </Link>
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="auth-footer">
        <p>
          This website was created by{' '}
          <a 
            href="https://kashifmir.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            Kashif Mir
          </a>
        </p>
      </footer>
    </div>
  )
}

export default Login
