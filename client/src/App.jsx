import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './styles/skeuomorphic.css'
import './App.css'

// Context
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

// Employee Panel Pages
import Login from './pages/Login'
import Register from './pages/Register'
import EmployeeDashboard from './pages/employee/Dashboard'
import DailyTaskInput from './pages/employee/DailyTaskInput'
import WeeklySubmission from './pages/employee/WeeklySubmission'
import DraftReports from './pages/employee/DraftReports'
import SubmittedReports from './pages/employee/SubmittedReports'

// Admin Panel Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminReports from './pages/admin/Reports'
import AdminAnnouncements from './pages/admin/Announcements'
import AdminEmployees from './pages/admin/Employees'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Employee Routes */}
          <Route path="/employee/dashboard" element={<ProtectedRoute requiredRole="employee"><EmployeeDashboard /></ProtectedRoute>} />
          <Route path="/employee/tasks" element={<ProtectedRoute requiredRole="employee"><DailyTaskInput /></ProtectedRoute>} />
          <Route path="/employee/drafts" element={<ProtectedRoute requiredRole="employee"><DraftReports /></ProtectedRoute>} />
          <Route path="/employee/submitted" element={<ProtectedRoute requiredRole="employee"><SubmittedReports /></ProtectedRoute>} />
          <Route path="/employee/submit" element={<ProtectedRoute requiredRole="employee"><WeeklySubmission /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute requiredRole="admin"><AdminReports /></ProtectedRoute>} />
          <Route path="/admin/announcements" element={<ProtectedRoute requiredRole="admin"><AdminAnnouncements /></ProtectedRoute>} />
          <Route path="/admin/employees" element={<ProtectedRoute requiredRole="admin"><AdminEmployees /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
