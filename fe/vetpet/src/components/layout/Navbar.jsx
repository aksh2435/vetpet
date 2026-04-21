import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PawPrint, Menu, X, Bell, ShoppingCart, ChevronDown, LogOut, User, Settings } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useNotificationStore } from '../../stores/notificationStore'
import { useStoreStore } from '../../stores/storeStore'

const userLinks = [
  { to: '/pets', label: '🐾 My Pets' },
  { to: '/nearby-vets', label: '🗺️ Find Vets' },
  { to: '/appointments', label: '📅 Appointments' },
  { to: '/store', label: '🛒 Store' },
  { to: '/lost-found', label: '🔍 Lost & Found' },
  { to: '/symptoms', label: '🩺 Symptoms' },
  { to: '/dating', label: '❤️ Pet Dating' },
  { to: '/nearby-places', label: '📍 Nearby Places' },
]

const doctorLinks = [
  { to: '/doctor-dashboard', label: '🏥 Dashboard' },
  { to: '/appointments', label: '📅 Appointments' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const { notifications, markRead, markAllRead, unreadCount } = useNotificationStore()
  const cartCount = useStoreStore((s) => s.cartCount())
  const navigate = useNavigate()
  const location = useLocation()
  const dropRef = useRef(null)
  const notifRef = useRef(null)

  const links = user?.role === 'doctor' ? doctorLinks : userLinks

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setDropOpen(false)
  }

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
            <div className="bg-primary-500 text-white p-1.5 rounded-xl">
              <PawPrint size={20} />
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif' }}>VetPet</span>
          </Link>

          {/* Desktop Nav */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${location.pathname === l.to ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Cart */}
                {user?.role !== 'doctor' && (
                  <Link to="/store" className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <ShoppingCart size={20} className="text-gray-600" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <Bell size={20} className="text-gray-600" />
                    {unreadCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {unreadCount()}
                      </span>
                    )}
                  </button>
                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                          <span className="font-semibold text-gray-800">Notifications</span>
                          <button onClick={markAllRead} className="text-xs text-primary-600 hover:underline">Mark all read</button>
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                          {notifications.slice(0, 8).map((n) => (
                            <div
                              key={n.id}
                              onClick={() => markRead(n.id)}
                              className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 ${!n.read ? 'bg-primary-50/50' : ''}`}
                            >
                              <p className="text-sm font-medium text-gray-800">{n.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Avatar dropdown */}
                <div className="relative" ref={dropRef}>
                  <button onClick={() => setDropOpen(!dropOpen)} className="flex items-center gap-2 hover:bg-gray-100 rounded-xl px-2 py-1.5 transition-colors">
                    <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full object-cover border-2 border-primary-200" />
                    <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown size={14} className="text-gray-500" />
                  </button>
                  <AnimatePresence>
                    {dropOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                      >
                        <Link to="/profile" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700">
                          <User size={16} /> Profile
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm text-red-600 w-full">
                          <LogOut size={16} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary-600 px-3 py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">Get Started</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            {isAuthenticated && (
              <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl">
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-100 py-3 overflow-hidden"
            >
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${location.pathname === l.to ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {l.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
