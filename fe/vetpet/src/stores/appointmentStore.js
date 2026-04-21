import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const defaultAppointments = [
  { id: 'apt1', doctorId: 'd1', doctorName: 'Dr. Priya Sharma', clinic: 'PawCare Clinic', petName: 'Buddy', petId: 'pet1', ownerId: 'u1', ownerName: 'Aksh Patel', date: '2026-04-02', time: '10:00 AM', reason: 'Annual checkup', status: 'confirmed', fee: 500, createdAt: '2026-03-28' },
  { id: 'apt2', doctorId: 'd2', doctorName: 'Dr. Rahul Mehta', clinic: 'Happy Paws Vet', petName: 'Mittens', petId: 'pet2', ownerId: 'u1', ownerName: 'Aksh Patel', date: '2026-04-05', time: '2:00 PM', reason: 'Skin issue', status: 'pending', fee: 700, createdAt: '2026-03-29' },
]

export const useAppointmentStore = create(
  persist(
    (set, get) => ({
      appointments: defaultAppointments,

      addAppointment: (apt) => {
        const newApt = { id: `apt_${Date.now()}`, status: 'pending', createdAt: new Date().toISOString().split('T')[0], ...apt }
        set((state) => ({ appointments: [...state.appointments, newApt] }))
        return newApt
      },

      updateStatus: (id, status) => {
        set((state) => ({
          appointments: state.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
        }))
      },

      getUserAppointments: (userId) => get().appointments.filter((a) => a.ownerId === userId),
      getDoctorAppointments: (doctorId) => get().appointments.filter((a) => a.doctorId === doctorId),
    }),
    { name: 'vetpet-appointments' }
  )
)
