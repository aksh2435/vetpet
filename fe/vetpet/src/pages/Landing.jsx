import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PawPrint, MapPin, Calendar, Heart, Star, Shield, Zap, Users } from 'lucide-react'

const features = [
  { icon: <MapPin className="text-primary-500" size={28} />, title: 'Find Nearby Vets', desc: 'Locate trusted veterinarians near you on an interactive map.' },
  { icon: <Calendar className="text-accent-500" size={28} />, title: 'Book Instantly', desc: 'Schedule appointments in seconds with real-time availability.' },
  { icon: <Heart className="text-red-400" size={28} />, title: 'Pet Dating', desc: 'Connect your pet with compatible companions for playdates.' },
  { icon: <Shield className="text-blue-500" size={28} />, title: 'Health Tracking', desc: 'Monitor your pet\'s health and get AI-powered symptom analysis.' },
  { icon: <Zap className="text-yellow-500" size={28} />, title: 'Instant Chat', desc: 'Chat directly with vets for quick advice and consultations.' },
  { icon: <Users className="text-purple-500" size={28} />, title: 'Pet Community', desc: 'Join a community of pet lovers in Ahmedabad and beyond.' },
]

const stats = [
  { value: '500+', label: 'Verified Vets' },
  { value: '10K+', label: 'Happy Pets' },
  { value: '4.9★', label: 'App Rating' },
  { value: '24/7', label: 'Support' },
]

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero min-h-[90vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['🐶', '🐱', '🐰', '🦜', '🐾', '🌿'].map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-20"
              style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-primary-200">
              <PawPrint size={16} /> Ahmedabad's #1 Pet Care Platform
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Your Pet Deserves the{' '}
              <span className="text-gradient">Best Care</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Find Vets • Book Instantly • Connect with Pet Parents
            </p>
            <p className="text-gray-500 mb-10">
              VetPet connects pet owners with trusted veterinarians, pet stores, and a loving community — all in one warm, friendly platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                🐾 Get Started Free
              </Link>
              <Link to="/login" className="btn-outline text-lg px-8 py-4">
                Sign In
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-10">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative">
            <div className="relative rounded-4xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600"
                alt="Happy dog at vet"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 to-transparent" />
            </div>
            {/* Floating cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
            >
              <div className="bg-primary-100 p-2 rounded-xl"><Star className="text-primary-500" size={20} /></div>
              <div>
                <div className="font-bold text-gray-800">Dr. Priya Sharma</div>
                <div className="text-xs text-gray-500">⭐ 4.9 • Available Now</div>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4"
            >
              <div className="text-2xl mb-1">🐾</div>
              <div className="text-sm font-bold text-gray-800">10K+ Pets</div>
              <div className="text-xs text-gray-500">Cared for</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Everything Your Pet Needs
            </h2>
            <p className="text-gray-500 text-lg">One platform for all your pet care needs</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="card p-8 hover:shadow-xl transition-all"
              >
                <div className="bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-card text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <div className="text-6xl mb-6">🐾</div>
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Ready to Give Your Pet the Best?
            </h2>
            <p className="text-white/80 text-lg mb-8">Join thousands of pet parents in Ahmedabad who trust VetPet.</p>
            <Link to="/register" className="bg-white text-primary-600 font-bold px-10 py-4 rounded-full hover:bg-gray-50 transition-all shadow-lg inline-block">
              Start for Free 🚀
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-white font-bold text-xl">
              <PawPrint size={24} className="text-primary-400" />
              <span style={{ fontFamily: 'Playfair Display, serif' }}>VetPet</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/nearby-vets" className="hover:text-white transition-colors">Find Vets</Link>
              <Link to="/store" className="hover:text-white transition-colors">Store</Link>
              <Link to="/lost-found" className="hover:text-white transition-colors">Lost & Found</Link>
              <Link to="/dating" className="hover:text-white transition-colors">Pet Dating</Link>
            </div>
            <p className="text-sm">© 2026 VetPet • Made with ❤️ in Ahmedabad</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
