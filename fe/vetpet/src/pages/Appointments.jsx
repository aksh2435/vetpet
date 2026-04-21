import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, MessageCircle, Phone, Video, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useAppointmentStore } from '../stores/appointmentStore'
import { useChatStore } from '../stores/chatStore'
import { useToastStore } from '../components/ui/Toast'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import { mockDoctors } from '../data/mockData'

const statusConfig = {
  pending: { color: 'orange', icon: <AlertCircle size={14} />, label: 'Pending' },
  confirmed: { color: 'green', icon: <CheckCircle size={14} />, label: 'Confirmed' },
  completed: { color: 'blue', icon: <CheckCircle size={14} />, label: 'Completed' },
  cancelled: { color: 'red', icon: <XCircle size={14} />, label: 'Cancelled' },
}

// Chat component
function ChatPanel({ doctorId, doctorName, onClose }) {
  const { getMessages, sendMessage } = useChatStore()
  const [input, setInput] = useState('')
  const messages = getMessages(doctorId)

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(doctorId, input)
    setInput('')
  }

  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-primary-500 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
              <p>{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-100' : 'text-gray-400'}`}>{msg.time}</p>
            </div>
          </div>
        ))}
        {messages.length === 0 && <div className="text-center text-gray-400 py-8">Start a conversation with {doctorName}</div>}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
        <Button size="sm" onClick={handleSend}>Send</Button>
      </div>
    </div>
  )
}

// Call modal
function CallModal({ doctor, onClose }) {
  const [seconds, setSeconds] = useState(0)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="text-center py-4">
      <div className="flex justify-center gap-8 mb-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-4xl border-4 border-primary-300">🐾</div>
          <span className="text-sm font-medium text-gray-600">You</span>
        </div>
        <div className="flex items-center text-primary-500 font-bold text-xl">📞</div>
        <div className="flex flex-col items-center gap-2">
          <img src={doctor?.image} alt={doctor?.name} className="w-24 h-24 rounded-full object-cover border-4 border-accent-300" />
          <span className="text-sm font-medium text-gray-600">{doctor?.name}</span>
        </div>
      </div>
      <div className="text-2xl font-bold text-primary-600 mb-2">{fmt(seconds)}</div>
      <p className="text-gray-500 text-sm mb-6">In-app call in progress...</p>
      <div className="flex justify-center gap-4">
        <button onClick={() => setMuted(!muted)} className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${muted ? 'bg-red-100' : 'bg-gray-100'}`}>
          {muted ? '🔇' : '🎤'}
        </button>
        <button onClick={onClose} className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center text-xl shadow-lg">
          📵
        </button>
        <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl">📷</button>
      </div>
    </div>
  )
}

export default function Appointments() {
  const { user } = useAuthStore()
  const { getUserAppointments } = useAppointmentStore()
  const { setActiveChat } = useChatStore()
  const toast = useToastStore((s) => s.show)
  const [chatModal, setChatModal] = useState(null)
  const [callModal, setCallModal] = useState(null)
  const [filter, setFilter] = useState('all')
  const appointments = getUserAppointments(user?.id)

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter)
  const getDoctor = (id) => mockDoctors.find((d) => d.id === id)

  const openChat = (apt) => {
    setActiveChat(apt.doctorId, apt.doctorName)
    setChatModal(apt)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>My Appointments 📅</h1>
          <p className="text-gray-500 mt-1">Track and manage your vet visits</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${filter === s ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}>
              {s}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No appointments</h3>
            <p className="text-gray-500">Book a vet visit to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((apt, i) => {
              const doc = getDoctor(apt.doctorId)
              const sc = statusConfig[apt.status] || statusConfig.pending
              return (
                <motion.div key={apt.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="card p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img src={doc?.image || 'https://i.pravatar.cc/150?img=12'} alt={apt.doctorName} className="w-16 h-16 rounded-2xl object-cover" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{apt.doctorName}</h3>
                          <p className="text-gray-500 text-sm">{apt.clinic}</p>
                        </div>
                        <Badge color={sc.color} className="flex items-center gap-1">{sc.icon}{sc.label}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Calendar size={14} />{apt.date}</span>
                        <span className="flex items-center gap-1"><Clock size={14} />{apt.time}</span>
                        <span>🐾 {apt.petName}</span>
                        <span className="text-primary-600 font-semibold">₹{apt.fee}</span>
                      </div>
                      {apt.reason && <p className="text-xs text-gray-400 mt-1">Reason: {apt.reason}</p>}
                      <div className="flex gap-2 mt-4 flex-wrap">
                        <Button size="sm" variant="outline" onClick={() => openChat(apt)}><MessageCircle size={14} /> Chat</Button>
                        <Button size="sm" variant="ghost" onClick={() => { setCallModal(doc); toast('Starting call...', 'info') }}><Phone size={14} /> Call</Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* Chat Modal */}
      <Modal isOpen={!!chatModal} onClose={() => setChatModal(null)} title={`Chat with ${chatModal?.doctorName}`}>
        {chatModal && <ChatPanel doctorId={chatModal.doctorId} doctorName={chatModal.doctorName} onClose={() => setChatModal(null)} />}
      </Modal>

      {/* Call Modal */}
      <Modal isOpen={!!callModal} onClose={() => setCallModal(null)} title="In-App Call" size="sm">
        {callModal && <CallModal doctor={callModal} onClose={() => setCallModal(null)} />}
      </Modal>
    </div>
  )
}
