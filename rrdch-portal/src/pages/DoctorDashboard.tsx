import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ref, onValue, update } from 'firebase/database'
import { db } from '../firebase'
import { Check, SkipForward, Phone, LogOut, Activity, Users } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { DEPARTMENTS, DEPARTMENT_CODES } from '../data/departments'

interface Patient {
  name: string
  phone: string
  symptom?: string
  severity?: 'routine' | 'urgent' | 'emergency'
  department?: string
  status?: 'waiting' | 'serving' | 'completed' | 'skipped'
  checkedIn?: string
  checked_in?: string
  bookedAt?: number
  date?: string
  today?: string
  tokenId?: string
}

const severityEmoji: Record<string, string> = {
  routine: '🟢',
  urgent: '🟡',
  emergency: '🔴',
}

// Type for department access
type DeptRecord = Record<string, { name: string; nameKn: string }>

export default function DoctorDashboard() {
  const { lang } = useLang()
  const navigate = useNavigate()
  const [selectedDept, setSelectedDept] = useState<string>('conservative-dentistry')
  const [currentToken, setCurrentToken] = useState<string | null>(null)
  const [patients, setPatients] = useState<Record<string, Patient>>({})
  const [loading, setLoading] = useState(true)

  // Check auth
  useEffect(() => {
    const isAuth = localStorage.getItem('doctorAuth')
    if (!isAuth) {
      navigate('/doctor')
    }
  }, [navigate])

  // Real-time Firebase listener - FIXED: read from queues/{dept}
  useEffect(() => {
    const isAuth = localStorage.getItem('doctorAuth')
    if (!isAuth || !selectedDept) {
      setLoading(false)
      return
    }

    setLoading(true)
    const queueRef = ref(db, `queues/${selectedDept}`)
    
    const unsubscribe = onValue(queueRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setCurrentToken(data.currentToken || null)
        setPatients(data.patients || {})
      } else {
        setCurrentToken(null)
        setPatients({})
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [selectedDept])

  const handleLogout = () => {
    localStorage.removeItem('doctorAuth')
    navigate('/doctor')
  }

  // FIXED: Mark done - updates correct Firebase path
  const markDone = async (tokenId: string) => {
    if (!patients || Object.keys(patients).length === 0) return

    const patientKeys = Object.keys(patients).sort()
    const currentIndex = patientKeys.indexOf(tokenId)
    const nextToken = patientKeys[currentIndex + 1] || null

    try {
      const updates: Record<string, any> = {
        [`queues/${selectedDept}/patients/${tokenId}/status`]: 'completed',
        [`queues/${selectedDept}/lastUpdated`]: new Date().toISOString(),
      }

      if (nextToken) {
        updates[`queues/${selectedDept}/currentToken`] = nextToken
        updates[`queues/${selectedDept}/patients/${nextToken}/status`] = 'serving'
      } else {
        updates[`queues/${selectedDept}/currentToken`] = 'Done'
      }

      await update(ref(db), updates)
    } catch (err) {
      console.error('Error marking done:', err)
    }
  }

  // FIXED: Skip token - updates correct path
  const skipToken = async (tokenId: string) => {
    try {
      await update(ref(db, `queues/${selectedDept}/patients/${tokenId}`), {
        status: 'skipped'
      })
    } catch (err) {
      console.error('Error skipping token:', err)
    }
  }

  // Call next patient when queue is idle
  const callNextPatient = async () => {
    if (waitingPatients.length === 0) return
    const [nextTokenId] = waitingPatients[0]
    
    try {
      const updates: Record<string, any> = {
        [`queues/${selectedDept}/currentToken`]: nextTokenId,
        [`queues/${selectedDept}/patients/${nextTokenId}/status`]: 'serving',
        [`queues/${selectedDept}/lastUpdated`]: new Date().toISOString(),
      }
      await update(ref(db), updates)
    } catch (err) {
      console.error('Error calling next patient:', err)
    }
  }

  // Get current patient being served
  const currentPatient = currentToken && patients[currentToken] ? { token: currentToken, ...patients[currentToken] } : null
  
  // Get waiting patients (sorted by token)
  const waitingPatients = Object.entries(patients || {})
    .filter(([_, patient]) => patient.status === 'waiting' || !patient.status)
    .sort(([a], [b]) => a.localeCompare(b))

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Activity className="text-white" size={24} />
              </div>
              <div>
                <h1 className="font-heading font-bold text-xl">RRDCH Doctor Dashboard</h1>
                <p className="text-white/80 text-sm flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Live
                  </span>
                  {(DEPARTMENTS as Record<string, { name: string }>)[selectedDept]?.name || 'Select Department'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">{lang === 'kn' ? 'ಲಾಗ್ ಔಟ್' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Department Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--text2)] mb-2">
            {lang === 'kn' ? 'ವಿಭಾಗ ಆಯ್ಕೆ ಮಾಡಿ' : 'Select Department'}
          </label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-4 py-2 rounded-lg border border-[var(--border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            {DEPARTMENT_CODES.map((code) => (
              <option key={code} value={code}>
                {lang === 'kn' ? (DEPARTMENTS as Record<string, { name: string; nameKn: string }>)[code]?.nameKn : (DEPARTMENTS as Record<string, { name: string; nameKn: string }>)[code]?.name}
              </option>
            ))}
          </select>
        </div>
        {/* Now Serving Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-lg font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
            {lang === 'kn' ? 'ಈಗ ಸೇವೆ ನೀಡಲಾಗುತ್ತಿದೆ' : 'NOW SERVING'}
          </h2>

          {currentPatient ? (
            <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold">{currentPatient.token}</span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      {currentPatient.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90 text-sm">
                    {currentPatient.severity && (
                      <span className="flex items-center gap-1">
                        {severityEmoji[currentPatient.severity]}
                        {currentPatient.severity.charAt(0).toUpperCase() + currentPatient.severity.slice(1)}
                      </span>
                    )}
                    <span>•</span>
                    <span>{currentPatient.symptom || 'General checkup'}</span>
                  </div>
                  {(currentPatient.checkedIn || currentPatient.checked_in) && (
                    <p className="text-white/70 text-xs mt-2">
                      Checked in: {currentPatient.checkedIn || currentPatient.checked_in}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => markDone(currentPatient.token)}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--success)] hover:bg-[var(--success)]/90 rounded-lg font-semibold transition-colors"
                  >
                    <Check size={18} />
                    {lang === 'kn' ? 'ಮುಗಿದಿದೆ' : 'Mark Done'}
                  </button>
                  <button
                    onClick={() => skipToken(currentPatient.token)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <SkipForward size={18} />
                    {lang === 'kn' ? 'ಮುಂದೆ ಹೋಗಿ' : 'Skip'}
                  </button>
                  {currentPatient.phone && (
                    <a
                      href={`tel:+91${currentPatient.phone}`}
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <Phone size={18} />
                      {lang === 'kn' ? 'ಕರೆ' : 'Call'}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[var(--border)] p-8 text-center shadow-sm">
              <div className="max-w-md mx-auto">
                <Users className="w-12 h-12 text-[var(--text3)] mx-auto mb-4 opacity-50" />
                <p className="text-[var(--text)] font-semibold text-lg mb-1">
                  {lang === 'kn' ? 'ಯಾವುದೇ ರೋಗಿಗಳು ಸೇವೆ ಪಡೆಯುತ್ತಿಲ್ಲ' : 'No patient being served'}
                </p>
                <p className="text-[var(--text2)] text-sm mb-6">
                  {waitingPatients.length > 0
                    ? (lang === 'kn' ? `${waitingPatients.length} ರೋಗಿಗಳು ಕಾಯುತ್ತಿದ್ದಾರೆ` : `${waitingPatients.length} patients are currently in the waiting list.`)
                    : (lang === 'kn' ? 'ಯಾವುದೇ ರೋಗಿಗಳು ಕಾಯುತ್ತಿಲ್ಲ' : 'The waiting list is currently empty.')}
                </p>
                
                {waitingPatients.length > 0 && (
                  <button
                    onClick={callNextPatient}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                  >
                    <Activity size={20} />
                    {lang === 'kn' ? 'ಮುಂದಿನ ರೋಗಿಯನ್ನು ಕರೆ ಮಾಡಿ' : `Start Serving Next Patient (${waitingPatients[0][0]})`}
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Waiting List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
            <Users size={20} className="text-[var(--text2)]" />
            {lang === 'kn' ? 'ಕಾಯುತ್ತಿರುವವರು' : 'WAITING'}
            <span className="text-sm font-normal text-[var(--text2)]">
              ({waitingPatients.length} {lang === 'kn' ? 'ರೋಗಿಗಳು' : 'patients'})
            </span>
          </h2>

          <div className="space-y-2">
            {waitingPatients.length > 0 ? (
              waitingPatients.map(([id, patient], index) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl border border-[var(--border)] p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-[var(--primary)]">{id}</span>
                    <span className="text-[var(--text)]">{patient.name}</span>
                    {patient.severity && (
                      <span className="text-sm">{severityEmoji[patient.severity]}</span>
                    )}
                    <span className="text-sm text-[var(--text2)]">
                      {patient.symptom || 'General checkup'}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--text3)]">
                    {patient.status === 'waiting' || !patient.status ? 'Waiting' : patient.status}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="bg-white rounded-xl border border-[var(--border)] p-6 text-center">
                <p className="text-[var(--text2)]">
                  {lang === 'kn' ? 'ಯಾವುದೇ ರೋಗಿಗಳು ಕಾಯುತ್ತಿಲ್ಲ' : 'No patients in waiting list'}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
