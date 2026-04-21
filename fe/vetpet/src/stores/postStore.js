import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockLostFoundPosts, mockDatingPosts } from '../data/mockData'

export const usePostStore = create(
  persist(
    (set, get) => ({
      lostFoundPosts: mockLostFoundPosts,
      datingPosts: mockDatingPosts,
      likedPets: [],

      addLostFoundPost: (post) => {
        const newPost = { id: `lf_${Date.now()}`, ...post, date: new Date().toISOString().split('T')[0] }
        set((state) => ({ lostFoundPosts: [newPost, ...state.lostFoundPosts] }))
      },

      toggleLike: (petId) => {
        set((state) => ({
          likedPets: state.likedPets.includes(petId)
            ? state.likedPets.filter((id) => id !== petId)
            : [...state.likedPets, petId],
          datingPosts: state.datingPosts.map((p) =>
            p.id === petId
              ? { ...p, likes: state.likedPets.includes(petId) ? p.likes - 1 : p.likes + 1 }
              : p
          ),
        }))
      },

      toggleReadyToMeet: (petId) => {
        set((state) => ({
          datingPosts: state.datingPosts.map((p) =>
            p.id === petId ? { ...p, readyToMeet: !p.readyToMeet } : p
          ),
        }))
      },
    }),
    { name: 'vetpet-posts' }
  )
)
