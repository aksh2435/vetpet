import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Star, Phone, MessageCircle, Calendar, Stethoscope, Clock, ChevronRight, ShieldCheck } from 'lucide-react'
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
import { useNavigate } from 'react-router-dom'

const specializations = ['All', 'General', 'Surgery', 'Dermatology', 'Orthopedics', 'Dentistry', 'Ophthalmology', 'Cardiology']

function MapView({ doctors, selected, onSelect }) {
  const positions = [
    { top: '30%', left: '45%' }, { top: '20%', left: '60%' }, { top: '55%', left: '35%' },
    { top: '40%', left: '70%' }, { top: '65%', left: '55%' }, { top: '25%', left: '30%' },
    { top: '50%', left: '20%' }, { top: '70%', left: '75%' },
  ]
  return (
    <div className="relative rounded-3xl overflow-hidden h-72 border border-teal-100"
      style={{ background: 'linear-gradient(135deg, #1e3d4d 0%, #264653 60%, #2d5566 100%)' }}>
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'linear-gradient(rgba(42,157,143,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(42,157,143,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      {/* Location badge */}
      <div className="absolute top-4 left-4 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-3 py-2 text-sm font-semibold text-white flex items-center gap-2">
        <MapPin size={14} className="text-primary-400" /> Ahmedabad, Gujarat
      </div>
      {/* Map pins */}
      {doctors.map((doc, i) => {
        const pos = positions[i] || { top: '50%', left: '50%' }
        const isSelected = selected?.id === doc.id
        return (
          <motion.button
            key={doc.id}
            style={{ position: 'absolute', ...pos, transform: 'translate(-50%,-50%)' }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(doc)}
            className="flex flex-col items-center"
          >
            <div className={`w-10 h-10 rounded-full border-2 shadow-lg flex items-center justify-center font-bold text-xs transition-all
              ${isSelected
                ? 'bg-coral-500 border-white text-white scale-125 shadow-coral-500/40'
                : doc.available
                  ? 'bg-primary-500 border-white/80 text-white'
                  : 'bg-teal-600 border-white/50 text-white/70'
              }`}>
              <Stethoscope size={14} />
            </div>
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-xl px-2 py-1 mt-1 text-xs font-semibold text-teal-700 whitespace-nowrap"
              >
                {doc.name.split(' ').slice(-1)[0]}
              </motion.div>
            )}
          </motion.button>
        )
      })}
      <div className="absolute bottom-3 right-3 text-xs text-white/40 bg-black/20 rounded-lg px-2 py-1">
        Simulated Map
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
    toast('Appointment requested!', 'success')
    navigate('/appointments')
  }

  const handleChat = (doc) => {
    setActiveChat(doc.id, doc.name)
    navigate('/appointments')
    toast(`Opening chat with ${doc.name}`, 'info')
  }

  return (
    <div className="min-h-screen" style={{ background: '#f0f8fa' }}>
      {/* Page header — deep teal */}
      <div style={{ background: 'linear-gradient(135deg, #264653 0%, #1e3d4d 100%)' }} className="px-4 py-10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-primary-400 text-sm font-semibold mb-2">
              <ShieldCheck size={15} /> Verified Veterinary Professionals
            </div>
            <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Find Nearby Vets
            </h1>
            <p className="text-white/60">Trusted veterinarians near Ahmedabad — book instantly</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>

          {/* Map */}
          <div className="mb-8">
            <MapView doctors={filtered} selected={selected} onSelect={setSelected} />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap mb-6">
            {specializations.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                  filter === s
                    ? 'text-white border-transparent shadow-md'
                    : 'bg-white text-teal-700 border-teal-100 hover:border-primary-300 hover:text-primary-600'
                }`}
                style={filter === s ? { background: '#2A9D8F' } : {}}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Selected vet highlight */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="rounded-3xl p-6 mb-6 border"
                style={{ background: 'linear-gradient(135deg, #264653, #1e3d4d)', borderColor: '#2A9D8F' }}
              >
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <img src={selected.image} alt={selected.name} className="w-20 h-20 rounded-2xl object-cover ring-2 ring-primary-500/40" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-white">{selected.name}</h3>
                        <p className="text-white/60 text-sm">{selected.clinic}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
                          <span className="flex items-center gap-1">
                            <Star size={13} className="text-yellow-400 fill-yellow-400" />
                            {selected.rating} ({selected.reviews})
                          </span>
                          <span className="flex items-center gap-1"><MapPin size={13} />{selected.address}</span>
                          <span className="flex items-center gap-1"><Clock size={13} />9AM–6PM</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${selected.available ? 'bg-primary-500/20 text-primary-400' : 'bg-coral-500/20 text-coral-400'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${selected.available ? 'bg-primary-400' : 'bg-coral-400'}`} />
                          {selected.available ? 'Available' : 'Busy'}
                        </span>
                        <div className="text-2xl font-bold text-primary-400 mt-2">₹{selected.fee}</div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4 flex-wrap">
                      <button
                        onClick={() => setAptModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                        style={{ background: '#2A9D8F' }}
                      >
                        <Calendar size={15} /> Book Appointment
                      </button>
                      <button
                        onClick={() => handleChat(selected)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border border-white/20 text-white hover:bg-white/10 transition-all"
                      >
                        <MessageCircle size={15} /> Chat
                      </button>
                      <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border border-white/10 text-white/60 hover:bg-white/5 transition-all">
                        <Phone size={15} /> {selected.phone}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vet grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelected(doc)}
                className={`bg-white rounded-2xl p-4 cursor-pointer transition-all border ${
                  selected?.id === doc.id
                    ? 'border-primary-400 shadow-lg shadow-primary-100'
                    : 'border-teal-100 hover:shadow-md hover:border-primary-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img src={doc.image} alt={doc.name} className="w-12 h-12 rounded-2xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-teal-700 text-sm truncate">{doc.name}</h4>
                    <p className="text-xs text-teal-500/70 truncate">{doc.clinic}</p>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${doc.available ? 'bg-primary-500' : 'bg-coral-500'}`} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-teal-600">
                    <Star size={11} className="text-yellow-400 fill-yellow-400" />{doc.rating}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-600">{doc.specialization}</span>
                  <span className="font-bold text-primary-600">₹{doc.fee}</span>
                </div>
                {selected?.id === doc.id && (
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary-600">
                    View details <ChevronRight size={12} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Book Modal */}
      <Modal isOpen={aptModal} onClose={() => setAptModal(false)} title={`Book with ${selected?.name}`}>
        <form onSubmit={handleBook} className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl p-3" style={{ background: '#edfaf8' }}>
            <img src={selected?.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
            <div>
              <div className="font-semibold text-teal-700">{selected?.name}</div>
              <div className="text-sm text-teal-500">{selected?.clinic} · ₹{selected?.fee}</div>
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
          <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-white transition-all hover:opacity-90"
            style={{ background: '#2A9D8F' }}>
            <Calendar size={16} /> Confirm Booking
          </button>
        </form>
      </Modal>
    </div>
  )
}
