import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const defaultPets = [
  { id: 'pet1', name: 'Buddy', species: 'Dog', breed: 'Golden Retriever', age: 3, weight: '28 kg', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300', health: 'Healthy, vaccinated up to date', ownerId: 'u1', readyToMeet: true },
  { id: 'pet2', name: 'Mittens', species: 'Cat', breed: 'Persian', age: 2, weight: '4 kg', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300', health: 'Healthy, indoor cat', ownerId: 'u1', readyToMeet: false },
]

export const usePetStore = create(
  persist(
    (set, get) => ({
      pets: defaultPets,

      addPet: (pet) => {
        const newPet = { id: `pet_${Date.now()}`, ...pet }
        set((state) => ({ pets: [...state.pets, newPet] }))
      },

      updatePet: (id, updates) => {
        set((state) => ({
          pets: state.pets.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }))
      },

      deletePet: (id) => {
        set((state) => ({ pets: state.pets.filter((p) => p.id !== id) }))
      },

      getUserPets: (userId) => get().pets.filter((p) => p.ownerId === userId),
    }),
    { name: 'vetpet-pets' }
  )
)
