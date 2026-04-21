import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Heart, Activity } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { usePetStore } from '../stores/petStore'
import { useToastStore } from '../components/ui/Toast'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input, { Select } from '../components/ui/Input'
import { Link } from 'react-router-dom'

const breeds = { Dog: ['Labrador', 'Golden Retriever', 'German Shepherd', 'Beagle', 'Poodle', 'Bulldog', 'Other'], Cat: ['Persian', 'Siamese', 'Maine Coon', 'Bengal', 'Ragdoll', 'Other'], Bird: ['Parrot', 'Cockatiel', 'Budgie', 'Macaw', 'Other'], Other: ['Other'] }

export default function Pets() {
  const { user } = useAuthStore()
  const { getUserPets, addPet, deletePet } = usePetStore()
  const toast = useToastStore((s) => s.show)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', species: 'Dog', breed: '', age: '', weight: '', health: '', image: '' })
  const pets = getUserPets(user?.id)
  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.name || !form.breed) { toast('Fill pet name and breed', 'error'); return }
    addPet({ ...form, ownerId: user?.id, image: form.image || 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300' })
    setModal(false)
    setForm({ name: '', species: 'Dog', breed: '', age: '', weight: '', health: '', image: '' })
    toast('Pet added! 🐾', 'success')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>My Pets 🐾</h1>
          <p className="text-gray-500 mt-1">Manage your furry family members</p>
        </div>
        <Button onClick={() => setModal(true)}><Plus size={18} /> Add Pet</Button>
      </div>

      {pets.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-4">🐾</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No pets yet!</h3>
          <p className="text-gray-500 mb-6">Add your first pet to get started</p>
          <Button onClick={() => setModal(true)}><Plus size={18} /> Add Your First Pet</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet, i) => (
            <motion.div key={pet.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }} className="card overflow-hidden group">
              <div className="relative">
                <img src={pet.image} alt={pet.name} className="w-full h-48 object-cover rounded-2xl" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-full text-primary-600">{pet.species}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
                    <p className="text-gray-500 text-sm">{pet.breed}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>{pet.age} yrs</div>
                    <div>{pet.weight}</div>
                  </div>
                </div>
                {pet.health && <p className="text-xs text-gray-500 mt-3 bg-gray-50 rounded-xl p-2">{pet.health}</p>}
                <div className="flex gap-2 mt-4">
                  <Link to="/symptoms" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full"><Activity size={14} /> Check Symptoms</Button>
                  </Link>
                  <button onClick={() => { deletePet(pet.id); toast('Pet removed', 'info') }} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                    🗑️
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add a New Pet 🐾">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Pet Name" placeholder="Buddy" value={form.name} onChange={setF('name')} />
          <Select label="Species" value={form.species} onChange={setF('species')}>
            {['Dog', 'Cat', 'Bird', 'Other'].map((s) => <option key={s}>{s}</option>)}
          </Select>
          <Select label="Breed" value={form.breed} onChange={setF('breed')}>
            <option value="">Select breed</option>
            {(breeds[form.species] || breeds.Other).map((b) => <option key={b}>{b}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Age (years)" type="number" placeholder="3" value={form.age} onChange={setF('age')} />
            <Input label="Weight" placeholder="28 kg" value={form.weight} onChange={setF('weight')} />
          </div>
          <Input label="Photo URL (optional)" placeholder="https://..." value={form.image} onChange={setF('image')} />
          <Input label="Health Notes" placeholder="Vaccinated, healthy..." value={form.health} onChange={setF('health')} />
          {form.image && <img src={form.image} alt="preview" className="w-full h-32 object-cover rounded-2xl" onError={(e) => e.target.style.display = 'none'} />}
          <Button type="submit" className="w-full">Add Pet 🐾</Button>
        </form>
      </Modal>
    </div>
  )
}
