import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Plus, Minus, Trash2, Star, Filter } from 'lucide-react'
import { mockProducts } from '../data/mockData'
import { useStoreStore } from '../stores/storeStore'
import { useToastStore } from '../components/ui/Toast'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'

const petFilters = ['All', 'Dog', 'Cat', 'Bird']
const categoryFilters = ['All', 'Food', 'Toy', 'Grooming', 'Accessories']

export default function Store() {
  const [petFilter, setPetFilter] = useState('All')
  const [catFilter, setCatFilter] = useState('All')
  const [cartOpen, setCartOpen] = useState(false)
  const [quickView, setQuickView] = useState(null)
  const { cart, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount } = useStoreStore()
  const toast = useToastStore((s) => s.show)

  const filtered = mockProducts.filter((p) => {
    const petMatch = petFilter === 'All' || p.pet === petFilter
    const catMatch = catFilter === 'All' || p.category === catFilter
    return petMatch && catMatch
  })

  const handleAdd = (product) => {
    addToCart(product)
    toast(`${product.name} added to cart 🛒`, 'success')
  }

  const inCart = (id) => cart.find((i) => i.id === id)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Pet Store 🛒</h1>
            <p className="text-gray-500 mt-1">Quality products for your furry friends</p>
          </div>
          <button onClick={() => setCartOpen(true)} className="relative bg-primary-500 text-white p-3 rounded-2xl shadow-md hover:bg-primary-600 transition-colors">
            <ShoppingCart size={22} />
            {cartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                {cartCount()}
              </span>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {petFilters.map((f) => (
              <button key={f} onClick={() => setPetFilter(f)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${petFilter === f ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}>
                {f === 'Dog' ? '🐶' : f === 'Cat' ? '🐱' : f === 'Bird' ? '🦜' : '🐾'} {f}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {categoryFilters.map((f) => (
              <button key={f} onClick={() => setCatFilter(f)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${catFilter === f ? 'bg-accent-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-accent-300'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">{filtered.length} products found</p>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileHover={{ y: -6 }} className="card overflow-hidden group">
              <div className="relative cursor-pointer" onClick={() => setQuickView(product)}>
                <img src={product.image} alt={product.name} className="w-full h-44 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300" />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                    <span className="bg-white text-gray-700 font-semibold px-3 py-1 rounded-full text-sm">Out of Stock</span>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge color="orange">{product.pet}</Badge>
                </div>
                {product.originalPrice > product.price && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </div>
                )}
              </div>
              <div className="mt-3">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">{product.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-gray-500">{product.rating} ({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <span className="text-lg font-bold text-primary-600">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-gray-400 line-through ml-1">₹{product.originalPrice}</span>
                    )}
                  </div>
                  {inCart(product.id) ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(product.id, inCart(product.id).qty - 1)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{inCart(product.id).qty}</span>
                      <button onClick={() => updateQty(product.id, inCart(product.id).qty + 1)} className="w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600">
                        <Plus size={12} />
                      </button>
                    </div>
                  ) : (
                    <button disabled={!product.inStock} onClick={() => handleAdd(product)} className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white p-2 rounded-xl transition-colors">
                      <Plus size={16} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Cart Modal */}
      <Modal isOpen={cartOpen} onClose={() => setCartOpen(false)} title="Your Cart 🛒" size="md">
        {cart.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-5xl mb-3">🛒</div>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div>
            <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-primary-600 font-bold">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 rounded-full bg-white border flex items-center justify-center"><Minus size={12} /></button>
                    <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center"><Plus size={12} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-700">Total</span>
                <span className="text-2xl font-bold text-primary-600">₹{cartTotal()}</span>
              </div>
              <Button className="w-full" onClick={() => { clearCart(); setCartOpen(false); toast('Order placed! 🎉', 'success') }}>
                Place Order (Demo)
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Quick View Modal */}
      <Modal isOpen={!!quickView} onClose={() => setQuickView(null)} title={quickView?.name || ''}>
        {quickView && (
          <div>
            <img src={quickView.image} alt={quickView.name} className="w-full h-48 object-cover rounded-2xl mb-4" />
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-2xl font-bold text-primary-600">₹{quickView.price}</span>
                {quickView.originalPrice > quickView.price && <span className="text-sm text-gray-400 line-through ml-2">₹{quickView.originalPrice}</span>}
              </div>
              <div className="flex items-center gap-1"><Star size={14} className="text-yellow-400 fill-yellow-400" /><span className="text-sm text-gray-600">{quickView.rating} ({quickView.reviews} reviews)</span></div>
            </div>
            <div className="flex gap-2 mb-4">
              <Badge color="orange">{quickView.pet}</Badge>
              <Badge color="blue">{quickView.category}</Badge>
              <Badge color={quickView.inStock ? 'green' : 'red'}>{quickView.inStock ? 'In Stock' : 'Out of Stock'}</Badge>
            </div>
            <Button className="w-full" disabled={!quickView.inStock} onClick={() => { handleAdd(quickView); setQuickView(null) }}>
              Add to Cart
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
