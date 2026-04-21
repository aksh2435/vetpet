import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PawPrint, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useToastStore } from '../components/ui/Toast'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Login() {
  const [role, setRole] = useState('user')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const { login, loginAsDemo, loginAsDoctor } = useAuthStore()
  const toast = useToastStore((s) => s.show)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) { toast('Please fill all fields', 'error'); return }
    login(email, password, role)
    toast(`Welcome back! 🐾`, 'success')
    navigate(role === 'doctor' ? '/doctor-dashboard' : '/pets')
  }

  const handleGoogleLogin = () => {
    if (role === 'doctor') { loginAsDoctor(); navigate('/doctor-dashboard') }
    else { loginAsDemo(); navigate('/pets') }
    toast('Logged in as demo user 🎉', 'success')
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-4xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-primary-500 text-white p-3 rounded-2xl mb-4">
            <PawPrint size={28} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to your VetPet account</p>
        </div>

        {/* Role toggle */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
          {['user', 'doctor'].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${role === r ? 'bg-white shadow text-primary-600' : 'text-gray-500'}`}
            >
              {r === 'user' ? '🐾 Pet Owner' : '🩺 Veterinarian'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="relative">
            <Input label="Password" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-10 text-gray-400">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
          <div className="relative flex justify-center"><span className="bg-white px-4 text-sm text-gray-400">or</span></div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
          Continue with Google (Demo)
        </Button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 font-semibold hover:underline">Sign up free</Link>
        </p>
      </motion.div>
    </div>
  )
}
