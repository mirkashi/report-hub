import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './styles/skeuomorphic.css'
import './App.css'

// Employee Panel Pages
import Login from './pages/Login'
import Register from './pages/Register'
import EmployeeDashboard from './pages/employee/Dashboard'
import DailyTaskInput from './pages/employee/DailyTaskInput'
import WeeklySubmission from './pages/employee/WeeklySubmission'

// Admin Panel Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminReports from './pages/admin/Reports'
import AdminAnnouncements from './pages/admin/Announcements'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/tasks" element={<DailyTaskInput />} />
        <Route path="/employee/submit" element={<WeeklySubmission />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
      </Routes>
    </Router>
  )
}

export default App
