import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStoreStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) => {
        set((state) => {
          const existing = state.cart.find((i) => i.id === product.id)
          if (existing) {
            return { cart: state.cart.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i) }
          }
          return { cart: [...state.cart, { ...product, qty: 1 }] }
        })
      },

      removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),

      updateQty: (id, qty) => {
        if (qty <= 0) {
          set((state) => ({ cart: state.cart.filter((i) => i.id !== id) }))
        } else {
          set((state) => ({ cart: state.cart.map((i) => i.id === id ? { ...i, qty } : i) }))
        }
      },

      clearCart: () => set({ cart: [] }),

      cartTotal: () => get().cart.reduce((sum, i) => sum + i.price * i.qty, 0),
      cartCount: () => get().cart.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: 'vetpet-cart' }
  )
)
