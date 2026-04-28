import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
  PawPrint, MapPin, Calendar, Heart, Star, Shield, Zap, Users,
  ArrowRight, CheckCircle, Stethoscope, Search, Navigation, ChevronRight
} from 'lucide-react'

// ── Floating orbs background ──────────────────────────────────
function FloatingOrbs() {
  const orbs = [
    { size: 300, x: '10%', y: '20%', color: 'rgba(16,185,129,0.07)', dur: 8 },
    { size: 200, x: '75%', y: '10%', color: 'rgba(245,158,11,0.07)', dur: 10 },
    { size: 250, x: '60%', y: '60%', color: 'rgba(16,185,129,0.05)', dur: 12 },
    { size: 180, x: '20%', y: '70%', color: 'rgba(139,92,246,0.05)', dur: 9 },
  ]
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{ width: o.size, height: o.size, left: o.x, top: o.y, background: o.color }}
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ── Animated counter ──────────────────────────────────────────
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true) }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const num = parseInt(target.replace(/\D/g, ''))
    let start = 0
    const step = Math.ceil(num / 50)
    const timer = setInterval(() => {
      start += step
      if (start >= num) { setCount(num); clearInterval(timer) }
      else setCount(start)
    }, 30)
    return () => clearInterval(timer)
  }, [started, target])

  return <span ref={ref}>{count}{suffix}</span>
}

const features = [
  { icon: MapPin, title: 'Find Nearby Vets', desc: 'Locate trusted veterinarians near you on an interactive map with real-time availability.', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { icon: Calendar, title: 'Book Instantly', desc: 'Schedule appointments in seconds. Get confirmations and reminders automatically.', color: 'text-amber-500', bg: 'bg-amber-50' },
  { icon: Heart, title: 'Pet Dating', desc: 'Connect your pet with compatible companions for playdates and breeding.', color: 'text-rose-500', bg: 'bg-rose-50' },
  { icon: Shield, title: 'Health Tracking', desc: 'Monitor your pet\'s health records and get AI-powered symptom analysis.', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Zap, title: 'Instant Chat', desc: 'Chat directly with vets for quick advice and consultations anytime.', color: 'text-violet-500', bg: 'bg-violet-50' },
  { icon: Users, title: 'Pet Community', desc: 'Join a community of pet lovers. Share stories, tips, and lost pet alerts.', color: 'text-teal-500', bg: 'bg-teal-50' },
]

const stats = [
  { value: '500', suffix: '+', label: 'Verified Vets' },
  { value: '10000', suffix: '+', label: 'Happy Pets' },
  { value: '4.9', suffix: '★', label: 'App Rating' },
  { value: '24', suffix: '/7', label: 'Support' },
]

const testimonials = [
  { name: 'Priya Mehta', pet: 'Golden Retriever owner', text: 'Found an amazing vet within 2km. Booking was instant and the doctor was fantastic!', avatar: 'https://i.pravatar.cc/60?img=47', rating: 5 },
  { name: 'Rahul Shah', pet: 'Cat parent', text: 'The symptom checker helped me identify my cat\'s issue before the vet visit. Brilliant feature.', avatar: 'https://i.pravatar.cc/60?img=12', rating: 5 },
  { name: 'Ananya Patel', pet: 'Rabbit owner', text: 'My rabbit found a playdate through Pet Dating! The community here is so warm and helpful.', avatar: 'https://i.pravatar.cc/60?img=32', rating: 5 },
]

const howItWorks = [
  { step: '01', title: 'Create Your Profile', desc: 'Sign up and add your pet\'s details, health history, and preferences.', icon: PawPrint },
  { step: '02', title: 'Find a Vet', desc: 'Browse verified vets nearby, check ratings, and view availability.', icon: Search },
  { step: '03', title: 'Book & Connect', desc: 'Book instantly, chat with the vet, and track your appointment live.', icon: CheckCircle },
]

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="gradient-hero min-h-[92vh] flex items-center relative overflow-hidden">
        <FloatingOrbs />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-primary-100 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              Ahmedabad's #1 Pet Care Platform
            </motion.div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Your Pet Deserves{' '}
              <span className="relative">
                <span className="text-gradient">the Best</span>
                <motion.svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 0.8 }}>
                  <motion.path d="M0 6 Q50 0 100 4 Q150 8 200 2" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" fill="none"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 0.8 }} />
                </motion.svg>
              </span>
              {' '}Care
            </h1>

            <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-md">
              Connect with trusted vets, book appointments instantly, track your pet's health, and join a loving community — all in one place.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link to="/register">
                <motion.span
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="btn-primary text-base px-7 py-3.5 flex items-center gap-2 cursor-pointer"
                >
                  Get Started Free <ArrowRight size={16} />
                </motion.span>
              </Link>
              <Link to="/login">
                <motion.span
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="btn-outline text-base px-7 py-3.5 cursor-pointer"
                >
                  Sign In
                </motion.span>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4">
              {['No credit card required', 'Free forever plan', '500+ vets verified'].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-sm text-gray-500">
                  <CheckCircle size={14} className="text-primary-500" />
                  {t}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — image + floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
              <img
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=700&q=80"
                alt="Happy dog at vet"
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating card — vet */}
            <motion.div
              animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-5 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                <Stethoscope size={18} className="text-primary-600" />
              </div>
              <div>
                <div className="font-bold text-gray-800 text-sm">Dr. Priya Sharma</div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star size={10} className="text-amber-400 fill-amber-400" /> 4.9 · Available Now
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </motion.div>

            {/* Floating card — pets */}
            <motion.div
              animate={{ y: [0, 10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-1">
                <PawPrint size={16} className="text-primary-500" />
                <span className="text-sm font-bold text-gray-800">10K+ Pets</span>
              </div>
              <div className="text-xs text-gray-500">Cared for this year</div>
              <div className="flex -space-x-2 mt-2">
                {[1, 2, 3, 4].map((n) => (
                  <img key={n} src={`https://i.pravatar.cc/28?img=${n + 10}`} className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                ))}
                <div className="w-6 h-6 rounded-full bg-primary-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-primary-600">+</div>
              </div>
            </motion.div>

            {/* Floating card — rating */}
            <motion.div
              animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute top-1/2 -right-8 bg-white rounded-2xl shadow-xl p-3 border border-gray-100"
            >
              <div className="flex items-center gap-1 mb-1">
                {[1,2,3,4,5].map(s => <Star key={s} size={12} className="text-amber-400 fill-amber-400" />)}
              </div>
              <div className="text-xs font-semibold text-gray-700">4.9 App Rating</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400"
          animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-transparent" />
        </motion.div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary-600 mb-1">
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-sm text-gray-500 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="py-24 bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-600 tracking-widest uppercase">Simple Process</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              How VetPet Works
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Get started in minutes. No complicated setup required.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" />

            {howItWorks.map((h, i) => {
              const Icon = h.icon
              return (
                <motion.div
                  key={h.step}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }} viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="relative bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary-500 text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary-200">
                    <Icon size={24} />
                  </div>
                  <div className="text-xs font-bold text-primary-400 tracking-widest mb-2">STEP {h.step}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{h.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{h.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-600 tracking-widest uppercase">Features</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Everything Your Pet Needs
            </h2>
            <p className="text-gray-500 text-lg">One platform for all your pet care needs</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                  whileHover={{ y: -6, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1)' }}
                  className="card p-7 cursor-default group transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon size={22} className={f.color} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ChevronRight size={14} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-primary-50 to-amber-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-600 tracking-widest uppercase">Testimonials</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Loved by Pet Parents
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }} viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.pet}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-card" />
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur mb-6">
              <PawPrint size={28} className="text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Ready to Give Your Pet the Best?
            </h2>
            <p className="text-white/75 text-lg mb-10">
              Join thousands of pet parents in Ahmedabad who trust VetPet for their furry family members.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register">
                <motion.span
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="bg-white text-primary-600 font-bold px-8 py-4 rounded-full hover:bg-gray-50 transition-all shadow-lg inline-flex items-center gap-2 cursor-pointer"
                >
                  Start for Free <ArrowRight size={16} />
                </motion.span>
              </Link>
              <Link to="/nearby-vets">
                <motion.span
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="border-2 border-white/50 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <MapPin size={16} /> Find a Vet
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="bg-gray-950 text-gray-400 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
                <div className="bg-primary-500 p-1.5 rounded-xl"><PawPrint size={18} /></div>
                <span style={{ fontFamily: 'Playfair Display, serif' }}>VetPet</span>
              </div>
              <p className="text-sm leading-relaxed">Ahmedabad's most trusted pet care platform. Connecting pets with the care they deserve.</p>
            </div>
            {[
              { title: 'Platform', links: [{ to: '/nearby-vets', label: 'Find Vets' }, { to: '/appointments', label: 'Appointments' }, { to: '/symptoms', label: 'Symptom Check' }] },
              { title: 'Community', links: [{ to: '/lost-found', label: 'Lost & Found' }, { to: '/dating', label: 'Pet Dating' }, { to: '/nearby-places', label: 'Nearby Places' }] },
              { title: 'Account', links: [{ to: '/register', label: 'Sign Up' }, { to: '/login', label: 'Login' }, { to: '/doctor-register', label: 'For Vets' }] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="text-sm hover:text-white transition-colors">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2026 VetPet · Made with care in Ahmedabad</p>
            <div className="flex gap-4 text-sm">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
