import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Star, Clock, Phone, MessageCircle, Calendar, Filter } from 'lucide-react'
import { mockDoctors } from '../data/mockData'
import { useAuthStore } from '../stores/authStore'
import { useAppointmentStore } from '../stores/appointmentStore'
import { usePetStore } from '../stores/petStore'
import { useNotificationStore } from '../stores/notificationStore'
import { useToastStore } from '../components/ui/Toast'
import { useChatStore } from '../stores/chatStore'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input, { Select } from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import { useNavigate } from 'react-router-dom'

const specializations = ['All', 'General', 'Surgery', 'Dermatology', 'Orthopedics', 'Dentistry', 'Ophthalmology', 'Cardiology']

// Simple SVG map placeholder (no API key needed)
function MapView({ doctors, selected, onSelect }) {
  return (
    <div className="relative bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl overflow-hidden h-80 border border-primary-200">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800)', backgroundSize: 'cover' }} />
      <div className="absolute inset-0 bg-primary-500/10" />
      <div className="absolute top-4 left-4 bg-white rounded-2xl px-3 py-2 shadow-md text-sm font-semibold text-gray-700 flex items-center gap-2">
        <MapPin size={14} className="text-primary-500" /> Ahmedabad, Gujarat
      </div>
      {/* Simulated map pins */}
      {doctors.map((doc, i) => {
        const positions = [
          { top: '30%', left: '45%' }, { top: '20%', left: '60%' }, { top: '55%', left: '35%' },
          { top: '40%', left: '70%' }, { top: '65%', left: '55%' }, { top: '25%', left: '30%' },
          { top: '50%', left: '20%' }, { top: '70%', left: '75%' },
        ]
        const pos = positions[i] || { top: '50%', left: '50%' }
        return (
          <motion.button
            key={doc.id}
            style={{ position: 'absolute', ...pos, transform: 'translate(-50%, -50%)' }}
            whileHover={{ scale: 1.2 }}
            onClick={() => onSelect(doc)}
            className={`flex flex-col items-center ${selected?.id === doc.id ? 'z-10' : ''}`}
          >
            <div className={`w-10 h-10 rounded-full border-3 shadow-lg flex items-center justify-center text-white text-xs font-bold ${selected?.id === doc.id ? 'bg-accent-500 border-white scale-125' : 'bg-primary-500 border-white'}`}>
              {doc.available ? '🏥' : '🔴'}
            </div>
            {selected?.id === doc.id && (
              <div className="bg-white rounded-xl shadow-xl px-2 py-1 mt-1 text-xs font-semibold text-gray-800 whitespace-nowrap">
                {doc.name.split(' ').slice(-1)[0]}
              </div>
            )}
          </motion.button>
        )
      })}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white/80 rounded-xl px-2 py-1">
        🗺️ Interactive Map (Replace with Google Maps API)
      </div>
    </div>
  )
}

export default function NearbyVets() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [aptModal, setAptModal] = useState(false)
  const [aptForm, setAptForm] = useState({ date: '', time: '10:00 AM', petId: '', reason: '' })
  const { user } = useAuthStore()
  const { addAppointment } = useAppointmentStore()
  const { getUserPets } = usePetStore()
  const { addNotification } = useNotificationStore()
  const toast = useToastStore((s) => s.show)
  const { setActiveChat } = useChatStore()
  const navigate = useNavigate()
  const pets = getUserPets(user?.id)

  const filtered = filter === 'All' ? mockDoctors : mockDoctors.filter((d) => d.specialization === filter)

  const handleBook = (e) => {
    e.preventDefault()
    if (!aptForm.date || !aptForm.petId) { toast('Fill all fields', 'error'); return }
    const pet = pets.find((p) => p.id === aptForm.petId)
    addAppointment({ doctorId: selected.id, doctorName: selected.name, clinic: selected.clinic, petId: aptForm.petId, petName: pet?.name, ownerId: user?.id, ownerName: user?.name, ...aptForm, fee: selected.fee })
    addNotification({ title: 'Appointment Requested', message: `Request sent to ${selected.name}`, type: 'appointment' })
    setAptModal(false)
    toast('Appointment requested! 📅', 'success')
    navigate('/appointments')
  }

  const handleChat = (doc) => {
    setActiveChat(doc.id, doc.name)
    navigate('/appointments')
    toast(`Opening chat with ${doc.name}`, 'info')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Nearby Vets 🗺️</h1>
          <p className="text-gray-500 mt-1">Find trusted veterinarians near Ahmedabad</p>
        </div>

        {/* Map */}
        <div className="mb-8">
          <MapView doctors={filtered} selected={selected} onSelect={setSelected} />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {specializations.map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === s ? 'bg-primary-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Selected vet card */}
        <AnimatePresence>
          {selected && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="card p-6 mb-6 border-2 border-primary-200 bg-primary-50/30">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <img src={selected.image} alt={selected.name} className="w-20 h-20 rounded-2xl object-cover" />
                <div className="flex-1">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selected.name}</h3>
                      <p className="text-gray-500">{selected.clinic}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400 fill-yellow-400" />{selected.rating} ({selected.reviews})</span>
                        <span className="flex items-center gap-1"><MapPin size={14} />{selected.address}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge color={selected.available ? 'green' : 'red'}>{selected.available ? '● Available' : '● Busy'}</Badge>
                      <div className="text-lg font-bold text-primary-600 mt-1">₹{selected.fee}</div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4 flex-wrap">
                    <Button size="sm" onClick={() => { setAptModal(true) }}><Calendar size={14} /> Book Appointment</Button>
                    <Button size="sm" variant="outline" onClick={() => handleChat(selected)}><MessageCircle size={14} /> Chat</Button>
                    <Button size="sm" variant="ghost"><Phone size={14} /> {selected.phone}</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vet list */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((doc, i) => (
            <motion.div key={doc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }}
              onClick={() => setSelected(doc)}
              className={`card p-4 cursor-pointer transition-all ${selected?.id === doc.id ? 'border-2 border-primary-400 bg-primary-50/30' : 'hover:shadow-lg'}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={doc.image} alt={doc.name} className="w-12 h-12 rounded-2xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm truncate">{doc.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{doc.clinic}</p>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${doc.available ? 'bg-primary-500' : 'bg-red-400'}`} />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1"><Star size={11} className="text-yellow-400 fill-yellow-400" />{doc.rating}</span>
                <Badge color="blue">{doc.specialization}</Badge>
                <span className="font-semibold text-primary-600">₹{doc.fee}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Book Appointment Modal */}
      <Modal isOpen={aptModal} onClose={() => setAptModal(false)} title={`Book with ${selected?.name}`}>
        <form onSubmit={handleBook} className="space-y-4">
          <div className="flex items-center gap-3 bg-primary-50 rounded-2xl p-3">
            <img src={selected?.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
            <div>
              <div className="font-semibold text-gray-800">{selected?.name}</div>
              <div className="text-sm text-gray-500">{selected?.clinic} • ₹{selected?.fee}</div>
            </div>
          </div>
          <Select label="Select Pet" value={aptForm.petId} onChange={(e) => setAptForm((f) => ({ ...f, petId: e.target.value }))}>
            <option value="">Choose your pet</option>
            {pets.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.breed})</option>)}
          </Select>
          <Input label="Date" type="date" value={aptForm.date} onChange={(e) => setAptForm((f) => ({ ...f, date: e.target.value }))} min={new Date().toISOString().split('T')[0]} />
          <Select label="Time Slot" value={aptForm.time} onChange={(e) => setAptForm((f) => ({ ...f, time: e.target.value }))}>
            {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map((t) => <option key={t}>{t}</option>)}
          </Select>
          <Input label="Reason for Visit" placeholder="Annual checkup, vaccination..." value={aptForm.reason} onChange={(e) => setAptForm((f) => ({ ...f, reason: e.target.value }))} />
          <Button type="submit" className="w-full">Confirm Booking 📅</Button>
        </form>
      </Modal>
    </div>
  )
}
