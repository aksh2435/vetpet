import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, MapPin, Phone, Edit2, Save, Plus, Trash2 } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { usePetStore } from '../stores/petStore'
import { useToastStore } from '../components/ui/Toast'
import Button from '../components/ui/Button'
import Input, { Select, Textarea } from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import Card from '../components/ui/Card'

const breeds = { Dog: ['Labrador', 'Golden Retriever', 'German Shepherd', 'Beagle', 'Poodle', 'Bulldog', 'Other'], Cat: ['Persian', 'Siamese', 'Maine Coon', 'Bengal', 'Ragdoll', 'Other'], Bird: ['Parrot', 'Cockatiel', 'Budgie', 'Macaw', 'Other'], Other: ['Other'] }

export default function Profile() {
  const { user, updateProfile } = useAuthStore()
  const { pets, addPet, deletePet, getUserPets } = usePetStore()
  const toast = useToastStore((s) => s.show)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name, bio: user?.bio, location: user?.location, phone: user?.phone })
  const [petModal, setPetModal] = useState(false)
  const [petForm, setPetForm] = useState({ name: '', species: 'Dog', breed: '', age: '', weight: '', health: '', image: '', ownerId: user?.id })
  const userPets = getUserPets(user?.id)

  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const setPF = (k) => (e) => setPetForm((f) => ({ ...f, [k]: e.target.value }))

  const saveProfile = () => {
    updateProfile(form)
    setEditing(false)
    toast('Profile updated!', 'success')
  }

  const handleAddPet = (e) => {
    e.preventDefault()
    if (!petForm.name || !petForm.breed) { toast('Fill pet name and breed', 'error'); return }
    addPet({ ...petForm, ownerId: user?.id, image: petForm.image || `https://images.unsplash.com/photo-1552053831-71594a27632d?w=300` })
    setPetModal(false)
    setPetForm({ name: '', species: 'Dog', breed: '', age: '', weight: '', health: '', image: '', ownerId: user?.id })
    toast('Pet added! 🐾', 'success')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Profile Card */}
        <Card className="p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative">
              <img src={user?.avatar} alt={user?.name} className="w-24 h-24 rounded-3xl object-cover border-4 border-primary-100" />
              <button className="absolute -bottom-2 -right-2 bg-primary-500 text-white p-1.5 rounded-full shadow-md">
                <Camera size={14} />
              </button>
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="space-y-3">
                  <Input label="Name" value={form.name} onChange={setF('name')} />
                  <Input label="Bio" value={form.bio} onChange={setF('bio')} />
                  <Input label="Location" value={form.location} onChange={setF('location')} />
                  <Input label="Phone" value={form.phone} onChange={setF('phone')} />
                  <div className="flex gap-3">
                    <Button onClick={saveProfile}><Save size={16} /> Save</Button>
                    <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                    <Button variant="ghost" size="sm" onClick={() => setEditing(true)}><Edit2 size={16} /> Edit</Button>
                  </div>
                  <p className="text-gray-500 mb-3">{user?.bio}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={14} className="text-primary-500" />{user?.location}</span>
                    {user?.phone && <span className="flex items-center gap-1"><Phone size={14} className="text-primary-500" />{user?.phone}</span>}
                  </div>
                  <div className="mt-3">
                    <span className={`badge ${user?.role === 'doctor' ? 'bg-blue-50 text-blue-700' : 'bg-primary-50 text-primary-700'}`}>
                      {user?.role === 'doctor' ? '🩺 Veterinarian' : '🐾 Pet Owner'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Pets Section */}
        {user?.role !== 'doctor' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>My Pets</h2>
              <Button onClick={() => setPetModal(true)} size="sm"><Plus size={16} /> Add Pet</Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPets.map((pet) => (
                <motion.div key={pet.id} whileHover={{ y: -4 }} className="card overflow-hidden">
                  <img src={pet.image} alt={pet.name} className="w-full h-40 object-cover rounded-2xl mb-4" />
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{pet.name}</h3>
                      <p className="text-sm text-gray-500">{pet.breed} • {pet.age} yrs</p>
                      <p className="text-xs text-gray-400 mt-1">{pet.weight}</p>
                    </div>
                    <button onClick={() => { deletePet(pet.id); toast('Pet removed', 'info') }} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {pet.health && <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded-xl p-2">{pet.health}</p>}
                </motion.div>
              ))}
              {userPets.length === 0 && (
                <div className="col-span-3 text-center py-12 text-gray-400">
                  <div className="text-5xl mb-3">🐾</div>
                  <p>No pets yet. Add your first pet!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Add Pet Modal */}
      <Modal isOpen={petModal} onClose={() => setPetModal(false)} title="Add a New Pet 🐾">
        <form onSubmit={handleAddPet} className="space-y-4">
          <Input label="Pet Name" placeholder="Buddy" value={petForm.name} onChange={setPF('name')} />
          <Select label="Species" value={petForm.species} onChange={setPF('species')}>
            {['Dog', 'Cat', 'Bird', 'Other'].map((s) => <option key={s}>{s}</option>)}
          </Select>
          <Select label="Breed" value={petForm.breed} onChange={setPF('breed')}>
            <option value="">Select breed</option>
            {(breeds[petForm.species] || breeds.Other).map((b) => <option key={b}>{b}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Age (years)" type="number" placeholder="3" value={petForm.age} onChange={setPF('age')} />
            <Input label="Weight" placeholder="28 kg" value={petForm.weight} onChange={setPF('weight')} />
          </div>
          <Input label="Photo URL (optional)" placeholder="https://..." value={petForm.image} onChange={setPF('image')} />
          <Input label="Health Notes" placeholder="Vaccinated, healthy..." value={petForm.health} onChange={setPF('health')} />
          {petForm.image && <img src={petForm.image} alt="preview" className="w-full h-32 object-cover rounded-2xl" onError={(e) => e.target.style.display = 'none'} />}
          <Button type="submit" className="w-full">Add Pet 🐾</Button>
        </form>
      </Modal>
    </div>
  )
}
