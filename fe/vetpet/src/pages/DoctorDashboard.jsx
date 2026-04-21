import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, Users, Calendar, MessageCircle } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useAppointmentStore } from '../stores/appointmentStore'
import { useNotificationStore } from '../stores/notificationStore'
import { useToastStore } from '../components/ui/Toast'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { mockDoctors } from '../data/mockData'

export default function DoctorDashboard() {
  const { user } = useAuthStore()
  const { appointments, updateStatus } = useAppointmentStore()
  const { addNotification } = useNotificationStore()
  const toast = useToastStore((s) => s.show)

  // Show all appointments for demo (in real app, filter by doctorId)
  const myApts = appointments

  const stats = [
    { label: 'Total Appointments', value: myApts.length, icon: '📅', color: 'bg-primary-50 text-primary-600' },
    { label: 'Pending', value: myApts.filter((a) => a.status === 'pending').length, icon: '⏳', color: 'bg-amber-50 text-amber-600' },
    { label: 'Confirmed', value: myApts.filter((a) => a.status === 'confirmed').length, icon: '✅', color: 'bg-green-50 text-green-600' },
    { label: 'Completed', value: myApts.filter((a) => a.status === 'completed').length, icon: '🏆', color: 'bg-blue-50 text-blue-600' },
  ]

  const handleAccept = (apt) => {
    updateStatus(apt.id, 'confirmed')
    addNotification({ title: 'Appointment Confirmed', message: `Your appointment with ${apt.doctorName} is confirmed for ${apt.date}`, type: 'appointment' })
    toast(`Appointment confirmed for ${apt.petName}`, 'success')
  }

  const handleReject = (apt) => {
    updateStatus(apt.id, 'cancelled')
    toast(`Appointment cancelled`, 'info')
  }

  const handleComplete = (apt) => {
    updateStatus(apt.id, 'completed')
    toast(`Marked as completed`, 'success')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <img src={user?.avatar} alt={user?.name} className="w-16 h-16 rounded-2xl object-cover border-4 border-primary-100" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Welcome, {user?.name} 🩺
            </h1>
            <p className="text-gray-500">{user?.clinic || 'VetPet Clinic'} • {user?.specialization || 'General Practice'}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <motion.div key={s.label} whileHover={{ y: -4 }} className="card p-5 text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl text-2xl mb-3 ${s.color}`}>{s.icon}</div>
              <div className="text-3xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Appointment Requests */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Appointment Requests</h2>
          {myApts.filter((a) => a.status === 'pending').length === 0 ? (
            <div className="card p-8 text-center text-gray-400">
              <div className="text-4xl mb-2">📭</div>
              <p>No pending requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myApts.filter((a) => a.status === 'pending').map((apt, i) => (
                <motion.div key={apt.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="card p-5 border-l-4 border-amber-400">
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-2xl">🐾</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <h3 className="font-bold text-gray-900">{apt.ownerName}</h3>
                          <p className="text-sm text-gray-500">Pet: {apt.petName} • {apt.date} at {apt.time}</p>
                          {apt.reason && <p className="text-xs text-gray-400 mt-1">Reason: {apt.reason}</p>}
                        </div>
                        <Badge color="orange"><Clock size={12} /> Pending</Badge>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={() => handleAccept(apt)}><CheckCircle size={14} /> Accept</Button>
                        <Button size="sm" variant="danger" onClick={() => handleReject(apt)}><XCircle size={14} /> Reject</Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Consultations */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">All Consultations</h2>
          <div className="space-y-3">
            {myApts.filter((a) => a.status !== 'pending').map((apt, i) => (
              <motion.div key={apt.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="card p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl">🐾</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{apt.ownerName} — {apt.petName}</div>
                  <div className="text-xs text-gray-500">{apt.date} at {apt.time}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge color={apt.status === 'confirmed' ? 'green' : apt.status === 'completed' ? 'blue' : 'red'}>
                    {apt.status}
                  </Badge>
                  {apt.status === 'confirmed' && (
                    <Button size="sm" variant="outline" onClick={() => handleComplete(apt)}>Complete</Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
