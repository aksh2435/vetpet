import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const demoUser = {
  id: 'u1',
  name: 'Aksh Patel',
  email: 'aksh@vetpet.in',
  role: 'user',
  avatar: 'https://i.pravatar.cc/150?img=5',
  bio: 'Pet lover from Ahmedabad 🐾',
  location: 'Ahmedabad, Gujarat',
  phone: '+91 98765 00001',
}

const demoDoctor = {
  id: 'd_demo',
  name: 'Dr. Demo Vet',
  email: 'doctor@vetpet.in',
  role: 'doctor',
  avatar: 'https://i.pravatar.cc/150?img=12',
  bio: 'Experienced veterinarian',
  location: 'Ahmedabad, Gujarat',
  clinic: 'Demo Clinic',
  specialization: 'General',
  licenseNumber: 'VET-GJ-2024-001',
  approved: true,
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      loginAsDemo: () => set({ user: demoUser, isAuthenticated: true }),
      loginAsDoctor: () => set({ user: demoDoctor, isAuthenticated: true }),

      login: (email, password, role) => {
        if (role === 'doctor') {
          set({ user: { ...demoDoctor, email }, isAuthenticated: true })
        } else {
          set({ user: { ...demoUser, email }, isAuthenticated: true })
        }
        return true
      },

      register: (data) => {
        const newUser = { id: `u_${Date.now()}`, ...data, avatar: 'https://i.pravatar.cc/150?img=5' }
        set({ user: newUser, isAuthenticated: true })
        return true
      },

      updateProfile: (updates) => {
        set((state) => ({ user: { ...state.user, ...updates } }))
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'vetpet-auth' }
  )
)
