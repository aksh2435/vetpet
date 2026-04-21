import { create } from 'zustand'

const defaultNotifications = [
  { id: 'n1', title: 'Appointment Confirmed', message: 'Dr. Priya Sharma confirmed your appointment for Apr 2.', time: '2 min ago', read: false, type: 'appointment' },
  { id: 'n2', title: 'New Message', message: 'Dr. Rahul Mehta sent you a message.', time: '1 hour ago', read: false, type: 'chat' },
  { id: 'n3', title: 'Reminder', message: "Buddy's vaccination is due next week.", time: '3 hours ago', read: true, type: 'reminder' },
]

export const useNotificationStore = create((set, get) => ({
  notifications: defaultNotifications,

  addNotification: (notif) => {
    const newNotif = { id: `n_${Date.now()}`, time: 'Just now', read: false, ...notif }
    set((state) => ({ notifications: [newNotif, ...state.notifications] }))
  },

  markRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }))
  },

  markAllRead: () => {
    set((state) => ({ notifications: state.notifications.map((n) => ({ ...n, read: true })) }))
  },

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}))
