import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PawPrint } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useToastStore } from '../components/ui/Toast'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Register() {
  const [role, setRole] = useState('user')
  const [form, setForm] = useState({ name: '', email: '', password: '', location: 'Ahmedabad, Gujarat' })
  const { register, loginAsDemo } = useAuthStore()
  const toast = useToastStore((s) => s.show)
  const navigate = useNavigate()

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast('Please fill all fields', 'error'); return }
    register({ ...form, role })
    toast('Account created! Welcome to VetPet 🐾', 'success')
    navigate(role === 'doctor' ? '/doctor-register' : '/pets')
  }

  const handleGoogle = () => {
    loginAsDemo()
    toast('Signed up with Google! 🎉', 'success')
    navigate('/pets')
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-4xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-primary-500 text-white p-3 rounded-2xl mb-4">
            <PawPrint size={28} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Join VetPet</h1>
          <p className="text-gray-500 mt-2">Create your free account today</p>
        </div>

        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
          {['user', 'doctor'].map((r) => (
            <button key={r} onClick={() => setRole(r)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${role === r ? 'bg-white shadow text-primary-600' : 'text-gray-500'}`}>
              {r === 'user' ? '🐾 Pet Owner' : '🩺 Veterinarian'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" placeholder="Aksh Patel" value={form.name} onChange={set('name')} />
          <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
          <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} />
          <Input label="Location" placeholder="Ahmedabad, Gujarat" value={form.location} onChange={set('location')} />
          <Button type="submit" className="w-full">Create Account</Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
          <div className="relative flex justify-center"><span className="bg-white px-4 text-sm text-gray-400">or</span></div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogle}>
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
          Continue with Google (Demo)
        </Button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
