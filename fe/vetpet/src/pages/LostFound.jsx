import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, MapPin, Phone, Calendar } from 'lucide-react'
import { usePostStore } from '../stores/postStore'
import { useToastStore } from '../components/ui/Toast'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Input, { Select } from '../components/ui/Input'
import { Textarea } from '../components/ui/Input'

export default function LostFound() {
  const { lostFoundPosts, addLostFoundPost } = usePostStore()
  const toast = useToastStore((s) => s.show)
  const [modal, setModal] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({ type: 'lost', petName: '', species: 'Dog', breed: '', color: '', lastSeen: '', description: '', ownerName: '', phone: '', image: '' })
  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const filtered = filter === 'all' ? lostFoundPosts : lostFoundPosts.filter((p) => p.type === filter)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.petName || !form.lastSeen || !form.ownerName) { toast('Fill required fields', 'error'); return }
    addLostFoundPost({ ...form, image: form.image || 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300' })
    setModal(false)
    setForm({ type: 'lost', petName: '', species: 'Dog', breed: '', color: '', lastSeen: '', description: '', ownerName: '', phone: '', image: '' })
    toast('Post submitted! 🐾', 'success')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Lost & Found 🔍</h1>
            <p className="text-gray-500 mt-1">Help reunite pets with their families</p>
          </div>
          <Button onClick={() => setModal(true)}><Plus size={18} /> Post</Button>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {['all', 'lost', 'found'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all ${filter === f ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}>
              {f === 'lost' ? '😢 Lost' : f === 'found' ? '😊 Found' : '🐾 All'}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }} className="card overflow-hidden">
              <div className="relative">
                <img src={post.image} alt={post.petName} className="w-full h-44 object-cover rounded-2xl" />
                <div className="absolute top-3 left-3">
                  <Badge color={post.type === 'lost' ? 'red' : 'green'}>
                    {post.type === 'lost' ? '😢 Lost' : '😊 Found'}
                  </Badge>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-gray-900 text-lg">{post.petName}</h3>
                <p className="text-sm text-gray-500">{post.breed} {post.species} • {post.color}</p>
                <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                  <MapPin size={13} className="text-primary-500" />
                  <span>{post.lastSeen}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                  <Calendar size={12} />
                  <span>{post.date}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{post.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600 font-medium">{post.ownerName}</div>
                  <a href={`tel:${post.phone}`} className="flex items-center gap-1 text-primary-600 text-sm font-semibold hover:underline">
                    <Phone size={13} /> Contact
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">🔍</div>
            <p>No {filter === 'all' ? '' : filter} posts yet</p>
          </div>
        )}
      </motion.div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Post Lost or Found Pet" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex bg-gray-100 rounded-2xl p-1">
            {['lost', 'found'].map((t) => (
              <button key={t} type="button" onClick={() => setF('type')({ target: { value: t } })} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${form.type === t ? 'bg-white shadow text-primary-600' : 'text-gray-500'}`}>
                {t === 'lost' ? '😢 Lost Pet' : '😊 Found Pet'}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Pet Name *" placeholder="Bruno" value={form.petName} onChange={setF('petName')} />
            <Select label="Species" value={form.species} onChange={setF('species')}>
              {['Dog', 'Cat', 'Bird', 'Other'].map((s) => <option key={s}>{s}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Breed" placeholder="Labrador" value={form.breed} onChange={setF('breed')} />
            <Input label="Color" placeholder="Golden" value={form.color} onChange={setF('color')} />
          </div>
          <Input label="Last Seen Location *" placeholder="Satellite Road, Ahmedabad" value={form.lastSeen} onChange={setF('lastSeen')} />
          <Textarea label="Description" placeholder="Describe the pet, any distinctive features..." value={form.description} onChange={setF('description')} rows={3} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Your Name *" placeholder="Raj Patel" value={form.ownerName} onChange={setF('ownerName')} />
            <Input label="Phone" placeholder="+91 98765 00000" value={form.phone} onChange={setF('phone')} />
          </div>
          <Input label="Pet Photo URL (optional)" placeholder="https://..." value={form.image} onChange={setF('image')} />
          {form.image && <img src={form.image} alt="preview" className="w-full h-32 object-cover rounded-2xl" onError={(e) => e.target.style.display = 'none'} />}
          <Button type="submit" className="w-full">Submit Post</Button>
        </form>
      </Modal>
    </div>
  )
}
