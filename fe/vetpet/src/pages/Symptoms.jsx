import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, AlertTriangle, CheckCircle, Calendar, Brain, Zap, ChevronRight } from 'lucide-react'
import { mockSymptomResponses } from '../data/mockData'
import { useToastStore } from '../components/ui/Toast'
import Badge from '../components/ui/Badge'
import { Textarea } from '../components/ui/Input'
import { Link } from 'react-router-dom'

const severityColor = {
  'Mild': 'green',
  'Mild to Moderate': 'orange',
  'Moderate': 'orange',
  'Moderate to High': 'red',
  'High': 'red',
}

const commonSymptoms = [
  'Vomiting', 'Scratching', 'Lethargy', 'Limping',
  'Coughing', 'Diarrhea', 'Sneezing', 'Loss of appetite',
  'Excessive thirst', 'Hair loss',
]

export default function Symptoms() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const toast = useToastStore((s) => s.show)

  const analyze = () => {
    if (!input.trim()) { toast("Describe your pet's symptoms first", 'error'); return }
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
    }, 1600)
  }

  const addSymptom = (s) => setInput((prev) => prev ? `${prev}, ${s.toLowerCase()}` : s.toLowerCase())

  return (
    <div className="min-h-screen" style={{ background: '#f0f8fa' }}>

      {/* Header — deep teal */}
      <div style={{ background: 'linear-gradient(135deg, #264653 0%, #1e3d4d 100%)' }} className="px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
              style={{ background: 'rgba(42,157,143,0.2)', border: '1px solid rgba(42,157,143,0.4)' }}>
              <Brain size={28} className="text-primary-400" />
            </div>
            <div className="flex items-center justify-center gap-2 text-primary-400 text-sm font-semibold mb-2">
              <Zap size={14} /> AI-Powered Analysis
            </div>
            <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Pet Symptom Checker
            </h1>
            <p className="text-white/60">Describe your pet's symptoms and get instant AI-powered suggestions</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>

          {/* Input card */}
          <div className="bg-white rounded-3xl p-6 mb-6 border border-teal-100 shadow-sm">
            <Textarea
              label="Describe your pet's symptoms"
              placeholder="e.g., My dog has been vomiting since morning and seems lethargic..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
            />

            {/* Quick-add chips */}
            <div className="mt-4 mb-5">
              <p className="text-xs font-semibold text-teal-500 mb-2 uppercase tracking-wide">Quick Add</p>
              <div className="flex flex-wrap gap-2">
                {commonSymptoms.map((s) => (
                  <button
                    key={s}
                    onClick={() => addSymptom(s)}
                    className="text-xs px-3 py-1.5 rounded-full font-medium transition-all border border-teal-100 text-teal-600 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={analyze}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-white transition-all disabled:opacity-60"
              style={{ background: loading ? '#346478' : '#2A9D8F', boxShadow: '0 4px 14px rgba(42,157,143,0.35)' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Analyzing symptoms...
                </>
              ) : (
                <>
                  <Brain size={17} /> Get AI Suggestion
                </>
              )}
            </button>
          </div>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="rounded-3xl overflow-hidden border border-teal-100 shadow-sm"
              >
                {/* Result header */}
                <div className="px-6 py-4 flex items-center gap-3" style={{ background: '#264653' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(42,157,143,0.25)' }}>
                    <Activity size={18} className="text-primary-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Analysis Results</h2>
                  <span className="ml-auto text-xs text-white/40">AI-generated</span>
                </div>

                <div className="bg-white p-6 space-y-5">
                  {/* Conditions */}
                  <div>
                    <p className="text-xs font-semibold text-teal-500 uppercase tracking-wide mb-3">Possible Conditions</p>
                    <div className="space-y-2">
                      {result.conditions.map((c, i) => (
                        <div key={c} className="flex items-center gap-3 rounded-2xl p-3 border border-teal-50"
                          style={{ background: '#f0f8fa' }}>
                          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: '#2A9D8F' }}>{i + 1}</span>
                          <span className="font-medium text-teal-700">{c}</span>
                          <ChevronRight size={14} className="ml-auto text-teal-300" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Severity */}
                  <div className="flex items-center gap-3">
                    <p className="text-xs font-semibold text-teal-500 uppercase tracking-wide">Severity</p>
                    <Badge color={severityColor[result.severity] || 'orange'}>
                      <AlertTriangle size={11} className="mr-1" />{result.severity}
                    </Badge>
                  </div>

                  {/* Advice */}
                  <div className="rounded-2xl p-4 border" style={{ background: '#edfaf8', borderColor: '#a8e6e0' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#2A9D8F' }}>Recommendation</p>
                    <p className="text-sm text-teal-700">{result.advice}</p>
                  </div>

                  {/* Disclaimer */}
                  <div className="rounded-2xl p-4 border" style={{ background: '#fef4f0', borderColor: '#fde8e1' }}>
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={14} className="text-coral-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-coral-600">
                        This is an AI-generated suggestion for informational purposes only. Always consult a qualified veterinarian for proper diagnosis and treatment.
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link to="/nearby-vets">
                    <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: '#2A9D8F' }}>
                      <Calendar size={16} /> Book a Vet Now
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* How it works — shown when no result */}
          {!result && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-4 mt-2">
              {[
                { icon: Activity, label: 'Describe', desc: 'Type or tap symptoms' },
                { icon: Brain, label: 'AI Analyzes', desc: 'Instant processing' },
                { icon: CheckCircle, label: 'Get Results', desc: 'Conditions & advice' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="bg-white rounded-2xl p-4 text-center border border-teal-100">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                    style={{ background: '#edfaf8' }}>
                    <Icon size={18} style={{ color: '#2A9D8F' }} />
                  </div>
                  <p className="text-sm font-semibold text-teal-700">{label}</p>
                  <p className="text-xs text-teal-400 mt-0.5">{desc}</p>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
