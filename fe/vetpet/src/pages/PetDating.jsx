import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, MapPin, Filter } from 'lucide-react'
import { usePostStore } from '../stores/postStore'
import { useToastStore } from '../components/ui/Toast'
import { useChatStore } from '../stores/chatStore'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const speciesFilters = ['All', 'Dog', 'Cat', 'Bird']

export default function PetDating() {
  const { datingPosts, likedPets, toggleLike, toggleReadyToMeet } = usePostStore()
  const toast = useToastStore((s) => s.show)
  const [filter, setFilter] = useState('All')
  const [meetRequests, setMeetRequests] = useState([])

  const filtered = filter === 'All' ? datingPosts : datingPosts.filter((p) => p.species === filter)

  const handleMeetRequest = (pet) => {
    if (meetRequests.includes(pet.id)) {
      toast(`Already sent a meet request to ${pet.petName}!`, 'info')
      return
    }
    setMeetRequests((prev) => [...prev, pet.id])
    toast(`Meet request sent to ${pet.ownerName} for ${pet.petName}! 🐾`, 'success')
  }

  const handleLike = (pet) => {
    toggleLike(pet.id)
    if (!likedPets.includes(pet.id)) {
      toast(`You liked ${pet.petName}! ❤️`, 'success')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Pet Dating & Meetup ❤️</h1>
          <p className="text-gray-500 mt-2">Find the perfect playdate companion for your pet</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 justify-center mb-8 flex-wrap">
          {speciesFilters.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${filter === f ? 'bg-primary-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}>
              {f === 'Dog' ? '🐶' : f === 'Cat' ? '🐱' : f === 'Bird' ? '🦜' : '🐾'} {f}
            </button>
          ))}
        </div>

        {/* Pet Cards - Swipeable style */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pet, i) => (
            <motion.div
              key={pet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="card overflow-hidden group"
            >
              <div className="relative">
                <img src={pet.image} alt={pet.petName} className="w-full h-64 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{pet.petName}</h3>
                  <p className="text-sm text-white/80">{pet.breed} • {pet.age} yrs • {pet.gender}</p>
                </div>
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  {pet.readyToMeet && (
                    <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">✅ Ready to Meet</span>
                  )}
                </div>
                {/* Like button */}
                <button
                  onClick={() => handleLike(pet)}
                  className={`absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${likedPets.includes(pet.id) ? 'bg-red-500 text-white scale-110' : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'}`}
                >
                  <Heart size={18} className={likedPets.includes(pet.id) ? 'fill-white' : ''} />
                </button>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={13} className="text-primary-500" />
                    <span>{pet.distance} away</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Heart size={13} className="text-red-400" />
                    <span>{pet.likes}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pet.bio}</p>
                <div className="text-xs text-gray-500 mb-3">Owner: {pet.ownerName} • {pet.location}</div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    variant={meetRequests.includes(pet.id) ? 'outline' : 'primary'}
                    onClick={() => handleMeetRequest(pet)}
                  >
                    {meetRequests.includes(pet.id) ? '✅ Requested' : '🐾 Send Meet Request'}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">🐾</div>
            <p>No pets found for this filter</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
