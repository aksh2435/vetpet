import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockChatMessages, doctorCannedResponses } from '../data/mockData'

export const useChatStore = create(
  persist(
    (set, get) => ({
      chats: {
        d1: { doctorId: 'd1', doctorName: 'Dr. Priya Sharma', messages: mockChatMessages },
      },
      activeChat: null,

      setActiveChat: (doctorId, doctorName) => {
        set((state) => {
          if (!state.chats[doctorId]) {
            return {
              activeChat: doctorId,
              chats: { ...state.chats, [doctorId]: { doctorId, doctorName, messages: [] } },
            }
          }
          return { activeChat: doctorId }
        })
      },

      sendMessage: (doctorId, text) => {
        const userMsg = { id: Date.now(), sender: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        set((state) => ({
          chats: {
            ...state.chats,
            [doctorId]: {
              ...state.chats[doctorId],
              messages: [...(state.chats[doctorId]?.messages || []), userMsg],
            },
          },
        }))

        // Simulate doctor reply
        setTimeout(() => {
          const reply = doctorCannedResponses[Math.floor(Math.random() * doctorCannedResponses.length)]
          const doctorMsg = { id: Date.now() + 1, sender: 'doctor', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          set((state) => ({
            chats: {
              ...state.chats,
              [doctorId]: {
                ...state.chats[doctorId],
                messages: [...(state.chats[doctorId]?.messages || []), doctorMsg],
              },
            },
          }))
        }, 1200)
      },

      getMessages: (doctorId) => get().chats[doctorId]?.messages || [],
    }),
    { name: 'vetpet-chats' }
  )
)
