import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import ToastContainer from './components/ui/Toast'
import { useAuthStore } from './stores/authStore'
import { useNotificationStore } from './stores/notificationStore'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Pets from './pages/Pets'
import DoctorRegister from './pages/DoctorRegister'
import NearbyVets from './pages/NearbyVets'
import Appointments from './pages/Appointments'
import DoctorDashboard from './pages/DoctorDashboard'
import LostFound from './pages/LostFound'
import Symptoms from './pages/Symptoms'
import PetDating from './pages/PetDating'
import NearbyPlaces from './pages/NearbyPlaces'

function ProtectedRoute({ children, doctorOnly = false }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (doctorOnly && user?.role !== 'doctor') return <Navigate to="/pets" replace />
  return children
}

export default function App() {
  const { addNotification } = useNotificationStore()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) return
    const messages = [
      { title: 'Reminder', message: "Don't forget Buddy's vaccination next week!", type: 'reminder' },
      { title: 'New Vet Available', message: 'Dr. Kavya Nair is now available for appointments.', type: 'info' },
    ]
    let idx = 0
    const interval = setInterval(() => {
      if (idx < messages.length) { addNotification(messages[idx]); idx++ }
      else clearInterval(interval)
    }, 15000)
    return () => clearInterval(interval)
  }, [isAuthenticated])

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/pets" element={<ProtectedRoute><Pets /></ProtectedRoute>} />
          <Route path="/doctor-register" element={<ProtectedRoute><DoctorRegister /></ProtectedRoute>} />
          <Route path="/nearby-vets" element={<ProtectedRoute><NearbyVets /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          <Route path="/doctor-dashboard" element={<ProtectedRoute doctorOnly><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/lost-found" element={<ProtectedRoute><LostFound /></ProtectedRoute>} />
          <Route path="/symptoms" element={<ProtectedRoute><Symptoms /></ProtectedRoute>} />
          <Route path="/dating" element={<ProtectedRoute><PetDating /></ProtectedRoute>} />
          <Route path="/nearby-places" element={<ProtectedRoute><NearbyPlaces /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ToastContainer />
    </div>
  )
}
