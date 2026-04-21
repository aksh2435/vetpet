import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Star, Navigation } from 'lucide-react'
import { mockNearbyPlaces } from '../data/mockData'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const typeFilters = ['All', 'Park', 'Hotel', 'Cafe']
const typeColors = { Park: 'green', Hotel: 'blue', Cafe: 'orange' }
const typeEmoji = { Park: '🌳', Hotel: '🏨', Cafe: '☕' }

function MapView({ places, selected, onSelect }) {
  const positions = [
    { top: '35%', left: '48%' }, { top: '25%', left: '62%' }, { top: '45%', left: '38%' },
    { top: '60%', left: '55%' }, { top: '20%', left: '30%' }, { top: '70%', left: '70%' },
  ]
  return (
    <div className="relative bg-gradient-to-br from-green-50 to-teal-100 rounded-3xl overflow-hidden h-72 border border-primary-200 mb-8">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800)', backgroundSize: 'cover' }} />
      <div className="absolute top-4 left-4 bg-white rounded-2xl px-3 py-2 shadow-md text-sm font-semibold text-gray-700 flex items-center gap-2">
        <MapPin size={14} className="text-primary-500" /> Pet-Friendly Places — Ahmedabad
      </div>
      {places.map((place, i) => {
        const pos = positions[i] || { top: '50%', left: '50%' }
        return (
          <motion.button
            key={place.id}
            style={{ position: 'absolute', ...pos, transform: 'translate(-50%, -50%)' }}
            whileHover={{ scale: 1.2 }}
            onClick={() => onSelect(place)}
            className="flex flex-col items-center"
          >
            <div className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-lg border-2 border-white ${selected?.id === place.id ? 'scale-125 ring-2 ring-accent-400' : ''} bg-white`}>
              {typeEmoji[place.type] || '📍'}
            </div>
            {selected?.id === place.id && (
              <div className="bg-white rounded-xl shadow-xl px-2 py-1 mt-1 text-xs font-semibold text-gray-800 whitespace-nowrap">
                {place.name.split(' ').slice(0, 2).join(' ')}
              </div>
            )}
          </motion.button>
        )
      })}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white/80 rounded-xl px-2 py-1">
        🗺️ Interactive Map (Replace with Google Maps API)
      </div>
    </div>
  )
}

export default function NearbyPlaces() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const filtered = filter === 'All' ? mockNearbyPlaces : mockNearbyPlaces.filter((p) => p.type === filter)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Nearby Pet-Friendly Places 📍</h1>
          <p className="text-gray-500 mt-1">Discover parks, hotels, and cafes that welcome your pets</p>
        </div>

        <MapView places={filtered} selected={selected} onSelect={setSelected} />

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {typeFilters.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${filter === f ? 'bg-primary-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}>
              {typeEmoji[f] || '🐾'} {f}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((place, i) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              onClick={() => setSelected(place)}
              className={`card overflow-hidden cursor-pointer transition-all ${selected?.id === place.id ? 'border-2 border-primary-400 bg-primary-50/30' : 'hover:shadow-xl'}`}
            >
              <img src={place.image} alt={place.name} className="w-full h-40 object-cover rounded-2xl" />
              <div className="mt-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{place.name}</h3>
                  <Badge color={typeColors[place.type] || 'gray'}>{typeEmoji[place.type]} {place.type}</Badge>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                  <span className="flex items-center gap-1"><Star size={13} className="text-yellow-400 fill-yellow-400" />{place.rating}</span>
                  <span className="flex items-center gap-1"><MapPin size={13} />{place.address}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{place.description}</p>
                <div className="flex gap-2">
                  <Badge color="green">🐾 Pet Friendly</Badge>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(place.name + ' ' + place.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-1 text-primary-600 text-sm font-semibold hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Navigation size={13} /> Directions
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
