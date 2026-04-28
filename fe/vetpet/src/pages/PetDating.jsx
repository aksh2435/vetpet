import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, MapPin, Users, Sparkles, ChevronRight } from 'lucide-react'
import { usePostStore } from '../stores/postStore'
import { useToastStore } from '../components/ui/Toast'
import { useChatStore } from '../stores/chatStore'

const speciesFilters = ['All', 'Dog', 'Cat', 'Bird']

const speciesIcon = { Dog: '🐕', Cat: '🐈', Bird: '🦜', All: null }

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
    toast(`Meet request sent to ${pet.ownerName} for ${pet.petName}!`, 'success')
  }

  const handleLike = (pet) => {
    toggleLike(pet.id)
    if (!likedPets.includes(pet.id)) toast(`You liked ${pet.petName}!`, 'success')
  }

  return (
    <div className="min-h-screen" style={{ background: '#f0f8fa' }}>

      {/* Header — deep teal */}
      <div style={{ background: 'linear-gradient(135deg, #264653 0%, #1e3d4d 100%)' }} className="px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
              style={{ background: 'rgba(231,111,81,0.15)', border: '1px solid rgba(231,111,81,0.3)' }}>
              <Heart size={28} className="text-coral-400" style={{ color: '#E76F51' }} />
            </div>
            <div className="flex items-center justify-center gap-2 text-sm font-semibold mb-2" style={{ color: '#E76F51' }}>
              <Sparkles size={14} /> Find the Perfect Match
            </div>
            <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Pet Dating & Meetup
            </h1>
            <p className="text-white/60">Connect your pet with compatible companions for playdates and more</p>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-8 mt-6">
              {[
                { icon: Users, value: `${datingPosts.length} Pets`, label: 'Looking to Meet' },
                { icon: Heart, value: `${likedPets.length}`, label: 'Liked' },
                { icon: MapPin, value: 'Ahmedabad', label: 'Area' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-lg font-bold text-white">{value}</div>
                  <div className="text-xs text-white/40">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>

          {/* Species filters */}
          <div className="flex gap-2 justify-center mb-8 flex-wrap">
            {speciesFilters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  filter === f
                    ? 'text-white border-transparent shadow-md'
                    : 'bg-white text-teal-700 border-teal-100 hover:border-primary-300 hover:text-primary-600'
                }`}
                style={filter === f ? { background: '#2A9D8F' } : {}}
              >
                {speciesIcon[f] && <span>{speciesIcon[f]}</span>}
                {f}
              </button>
            ))}
          </div>

          {/* Pet cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pet, i) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl overflow-hidden border border-teal-100 shadow-sm group"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={pet.image} alt={pet.petName}
                    className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Pet info on image */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{pet.petName}</h3>
                    <p className="text-sm text-white/75">{pet.breed} · {pet.age}y · {pet.gender}</p>
                  </div>

                  {/* Ready to meet badge */}
                  {pet.readyToMeet && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ background: '#2A9D8F' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Ready to Meet
                    </div>
                  )}

                  {/* Like button */}
                  <button
                    onClick={() => handleLike(pet)}
                    className={`absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                      likedPets.includes(pet.id)
                        ? 'text-white scale-110'
                        : 'bg-white/90 text-teal-400 hover:text-coral-500'
                    }`}
                    style={likedPets.includes(pet.id) ? { background: '#E76F51' } : {}}
                  >
                    <Heart size={17} className={likedPets.includes(pet.id) ? 'fill-white' : ''} />
                  </button>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="flex items-center gap-1 text-teal-500">
                      <MapPin size={13} style={{ color: '#2A9D8F' }} />
                      {pet.distance} away
                    </span>
                    <span className="flex items-center gap-1 text-teal-400">
                      <Heart size={13} style={{ color: '#E76F51' }} />
                      {pet.likes}
                    </span>
                  </div>

                  <p className="text-sm text-teal-600 mb-3 line-clamp-2">{pet.bio}</p>
                  <p className="text-xs text-teal-400 mb-4">Owner: {pet.ownerName} · {pet.location}</p>

                  {/* Action button */}
                  <button
                    onClick={() => handleMeetRequest(pet)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all ${
                      meetRequests.includes(pet.id)
                        ? 'border-2 text-teal-600'
                        : 'text-white hover:opacity-90'
                    }`}
                    style={meetRequests.includes(pet.id)
                      ? { borderColor: '#2A9D8F', background: '#edfaf8' }
                      : { background: '#264653' }
                    }
                  >
                    {meetRequests.includes(pet.id) ? (
                      <><CheckIcon /> Request Sent</>
                    ) : (
                      <><Heart size={15} /> Send Meet Request</>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: '#edfaf8' }}>
                <Heart size={28} style={{ color: '#2A9D8F' }} />
              </div>
              <p className="text-teal-500 font-medium">No pets found for this filter</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
