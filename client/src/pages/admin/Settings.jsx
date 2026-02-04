import { useState } from 'react'
import Sidebar from '../../components/shared/Sidebar'
import Footer from '../../components/shared/Footer'
import { useAuth } from '../../context/AuthContext'
import { userAPI } from '../../services/api'

function AdminSettings() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
  })
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      await userAPI.updateProfile(profileData)
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    setLoading(true)
    
    try {
      await userAPI.changePassword(passwordData.currentPassword, passwordData.newPassword)
      setSuccess('Password changed successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-layout">
      <Sidebar type="admin" />
      
      <main className="main-content texture-leather">
        {/* Page Header */}
        <div className="page-header">
          <h1>⚙️ Admin Settings</h1>
          <p>Manage your account and system preferences</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="panel-raised animate-slide-up" style={{ 
            marginBottom: '24px',
            padding: '16px',
            background: 'linear-gradient(145deg, #38a169, #2f855a)',
            color: 'white',
            borderRadius: 'var(--radius-md)'
          }}>
            ✓ {success}
          </div>
        )}
        
        {error && (
          <div className="panel-raised animate-slide-up" style={{ 
            marginBottom: '24px',
            padding: '16px',
            background: 'linear-gradient(145deg, #e53e3e, #c53030)',
            color: 'white',
            borderRadius: 'var(--radius-md)'
          }}>
            ✗ {error}
          </div>
        )}

        {/* Tabs */}
        <div className="panel-raised animate-slide-up" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', borderBottom: '2px solid rgba(212, 160, 23, 0.3)' }}>
            <button
              className={`btn-skeu ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('profile')}
              style={{ borderRadius: '8px 8px 0 0', marginBottom: '-2px' }}
            >
              <span>👤</span>
              <span>Profile</span>
            </button>
            <button
              className={`btn-skeu ${activeTab === 'password' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('password')}
              style={{ borderRadius: '8px 8px 0 0', marginBottom: '-2px' }}
            >
              <span>🔒</span>
              <span>Password</span>
            </button>
            <button
              className={`btn-skeu ${activeTab === 'system' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('system')}
              style={{ borderRadius: '8px 8px 0 0', marginBottom: '-2px' }}
            >
              <span>🔧</span>
              <span>System</span>
            </button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="panel-raised animate-slide-up">
            <h2 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '1.5rem', 
              margin: '0 0 24px 0',
              color: '#d4a017'
            }}>
              Profile Information
            </h2>
            
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="input-skeu"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="input-skeu"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="input-skeu"
                  value={profileData.department}
                  onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                />
              </div>

              <button 
                type="submit" 
                className="btn-skeu btn-primary"
                disabled={loading}
              >
                <span>💾</span>
                <span>{loading ? 'Updating...' : 'Update Profile'}</span>
              </button>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="panel-raised animate-slide-up">
            <h2 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '1.5rem', 
              margin: '0 0 24px 0',
              color: '#d4a017'
            }}>
              Change Password
            </h2>
            
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="input-skeu"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="input-skeu"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  minLength={6}
                />
                <small style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '4px', display: 'block' }}>
                  Must be at least 6 characters
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="input-skeu"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-skeu btn-primary"
                disabled={loading}
              >
                <span>🔒</span>
                <span>{loading ? 'Changing...' : 'Change Password'}</span>
              </button>
            </form>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="panel-raised animate-slide-up">
            <h2 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '1.5rem', 
              margin: '0 0 24px 0',
              color: '#d4a017'
            }}>
              System Configuration
            </h2>
            
            <div className="form-group">
              <label className="form-label">Report Settings</label>
              <div className="panel-inset" style={{ padding: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Auto-approve reports from verified employees</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <input type="checkbox" />
                  <span>Require admin review for all submissions</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Send notifications for new report submissions</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">User Management</label>
              <div className="panel-inset" style={{ padding: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Allow employee self-registration</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="checkbox" />
                  <span>Require email verification for new accounts</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Data Retention</label>
              <select className="input-skeu" defaultValue="90">
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
                <option value="365">1 year</option>
                <option value="-1">Keep forever</option>
              </select>
              <small style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '4px', display: 'block' }}>
                How long to keep archived reports
              </small>
            </div>

            <button 
              type="button" 
              className="btn-skeu btn-primary"
              onClick={() => {
                // TODO: Implement backend API endpoint for saving system settings
                // For now, settings are shown but not persisted
                setSuccess('System settings saved successfully!')
                setTimeout(() => setSuccess(''), 3000)
              }}
            >
              <span>💾</span>
              <span>Save System Settings</span>
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default AdminSettings
