import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, AlertTriangle, CheckCircle, Calendar } from 'lucide-react'
import { mockSymptomResponses } from '../data/mockData'
import { useToastStore } from '../components/ui/Toast'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { Textarea } from '../components/ui/Input'
import { Link } from 'react-router-dom'

const severityColor = { 'Mild': 'green', 'Mild to Moderate': 'orange', 'Moderate': 'orange', 'Moderate to High': 'red', 'High': 'red' }

const commonSymptoms = ['Vomiting', 'Scratching', 'Lethargy', 'Limping', 'Coughing', 'Diarrhea', 'Sneezing', 'Loss of appetite', 'Excessive thirst', 'Hair loss']

export default function Symptoms() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const toast = useToastStore((s) => s.show)

  const analyze = () => {
    if (!input.trim()) { toast('Describe your pet\'s symptoms first', 'error'); return }
    setLoading(true)
    setResult(null)
    setTimeout(() => {
      const lower = input.toLowerCase()
      let response = mockSymptomResponses.default
      for (const [key, val] of Object.entries(mockSymptomResponses)) {
        if (key !== 'default' && lower.includes(key)) { response = val; break }
      }
      setResult(response)
      setLoading(false)
    }, 1500)
  }

  const addSymptom = (s) => setInput((prev) => prev ? `${prev}, ${s.toLowerCase()}` : s.toLowerCase())

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-blue-100 text-blue-600 p-4 rounded-3xl mb-4">
            <Activity size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Pet Symptom Checker 🩺</h1>
          <p className="text-gray-500 mt-2">Describe your pet's symptoms for AI-powered suggestions</p>
        </div>

        <div className="card p-6 mb-6">
          <Textarea
            label="Describe your pet's symptoms"
            placeholder="e.g., My dog has been vomiting since morning and seems lethargic..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
          />
          <div className="mt-3 mb-4">
            <p className="text-xs text-gray-500 mb-2">Quick add:</p>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((s) => (
                <button key={s} onClick={() => addSymptom(s)} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-primary-50 hover:text-primary-600 rounded-full transition-colors font-medium">
                  {s}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={analyze} disabled={loading} className="w-full">
            {loading ? (
              <span className="flex items-center gap-2"><span className="animate-spin">⚙️</span> Analyzing...</span>
            ) : (
              <span>🤖 Get AI Suggestion</span>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-xl"><Activity size={20} className="text-blue-600" /></div>
                <h2 className="text-xl font-bold text-gray-900">Analysis Results</h2>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-600 mb-2">Possible Conditions:</p>
                <div className="space-y-2">
                  {result.conditions.map((c, i) => (
                    <div key={c} className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
                      <span className="text-primary-500 font-bold text-sm">{i + 1}.</span>
                      <span className="font-medium text-gray-800">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <p className="text-sm font-semibold text-gray-600">Severity:</p>
                <Badge color={severityColor[result.severity] || 'orange'}>
                  <AlertTriangle size={12} className="mr-1" />{result.severity}
                </Badge>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
                <p className="text-sm font-semibold text-amber-800 mb-1">💡 Advice:</p>
                <p className="text-sm text-amber-700">{result.advice}</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 text-xs text-red-600">
                ⚠️ This is an AI-generated suggestion for informational purposes only. Always consult a qualified veterinarian for proper diagnosis and treatment.
              </div>

              <Link to="/nearby-vets">
                <Button className="w-full"><Calendar size={16} /> Book Vet Now</Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
