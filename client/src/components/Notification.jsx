import { useEffect, useState, useCallback } from 'react'
import '../styles/notification.css'

function Notification({ type = 'success', title, message, onClose, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const handleClose = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      if (onClose) onClose()
    }, 300)
  }, [onClose])

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10)

    // Auto-close after duration
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, handleClose])

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }

  return (
    <div className={`notification-overlay ${isVisible ? 'visible' : ''}`}>
      <div className={`notification notification-${type} ${isVisible && !isExiting ? 'notification-enter' : ''} ${isExiting ? 'notification-exit' : ''}`}>
        <div className="notification-icon-wrapper">
          <div className="notification-icon">{icons[type]}</div>
        </div>
        <div className="notification-content">
          <h3 className="notification-title">{title}</h3>
          {message && <p className="notification-message">{message}</p>}
        </div>
        <button 
          className="notification-close" 
          onClick={handleClose}
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default Notification
