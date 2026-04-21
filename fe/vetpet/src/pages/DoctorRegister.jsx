import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Stethoscope } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useToastStore } from '../components/ui/Toast'
import Button from '../components/ui/Button'
import Input, { Select } from '../components/ui/Input'

const specializations = ['General Practice', 'Surgery', 'Dermatology', 'Orthopedics', 'Dentistry', 'Ophthalmology', 'Cardiology', 'Oncology', 'Neurology']

export default function DoctorRegister() {
  const { user, updateProfile } = useAuthStore()
  const toast = useToastStore((s) => s.show)
  const [submitted, setSubmitted] = useState(user?.approved || false)
  const [approved, setApproved] = useState(user?.approved || false)
  const [form, setForm] = useState({ licenseNumber: '', clinic: '', specialization: 'General Practice', address: 'Ahmedabad, Gujarat', experience: '', fee: '' })
  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.licenseNumber || !form.clinic) { toast('Fill all required fields', 'error'); return }
    updateProfile({ ...form, pendingApproval: true })
    setSubmitted(true)
    toast('Application submitted!', 'success')
  }

  const handleAdminApprove = () => {
    updateProfile({ approved: true, pendingApproval: false, role: 'doctor' })
    setApproved(true)
    toast('Doctor profile approved! 🎉', 'success')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-blue-100 text-blue-600 p-4 rounded-3xl mb-4">
            <Stethoscope size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Doctor Registration</h1>
          <p className="text-gray-500 mt-2">Join VetPet as a verified veterinarian</p>
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Full Name" value={user?.name || ''} disabled className="bg-gray-50" />
                <Input label="License Number *" placeholder="VET-GJ-2024-001" value={form.licenseNumber} onChange={setF('licenseNumber')} />
                <Input label="Clinic Name *" placeholder="PawCare Clinic" value={form.clinic} onChange={setF('clinic')} />
                <Select label="Specialization" value={form.specialization} onChange={setF('specialization')}>
                  {specializations.map((s) => <option key={s}>{s}</option>)}
                </Select>
                <Input label="Clinic Address" placeholder="Satellite, Ahmedabad" value={form.address} onChange={setF('address')} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Experience (years)" type="number" placeholder="5" value={form.experience} onChange={setF('experience')} />
                  <Input label="Consultation Fee (₹)" type="number" placeholder="500" value={form.fee} onChange={setF('fee')} />
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-700">
                  📋 Your profile will be reviewed by our admin team within 24 hours.
                </div>
                <Button type="submit" className="w-full">Submit for Verification</Button>
              </form>
            </motion.div>
          ) : !approved ? (
            <motion.div key="pending" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card p-8 text-center">
              <div className="text-6xl mb-4">⏳</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Pending Verification</h2>
              <p className="text-gray-500 mb-6">Your application is under review. We'll notify you within 24 hours.</p>
              <div className="bg-gray-50 rounded-2xl p-4 text-left text-sm text-gray-600 mb-6 space-y-2">
                <div>🏥 Clinic: {form.clinic}</div>
                <div>📋 License: {form.licenseNumber}</div>
                <div>🩺 Specialization: {form.specialization}</div>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-6">
                <p className="text-xs text-gray-400 mb-3">— Demo: Admin Panel —</p>
                <Button variant="secondary" onClick={handleAdminApprove}>✅ Admin: Approve Doctor</Button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="approved" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card p-8 text-center">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}>
                <CheckCircle size={64} className="text-primary-500 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Approved! 🎉</h2>
              <p className="text-gray-500 mb-6">You are now a verified VetPet veterinarian.</p>
              <Button onClick={() => window.location.href = '/doctor-dashboard'}>Go to Dashboard</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
