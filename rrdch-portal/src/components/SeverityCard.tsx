import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { Phone, ArrowRight, RefreshCw } from 'lucide-react'

export type SeverityLevel = 'routine' | 'urgent' | 'emergency'

interface TriageResult {
  department: string
  severity: SeverityLevel
  reason: string
  kannada_reason: string
  advice: string
}

interface SeverityCardProps {
  result: TriageResult
  onContinue: () => void
  onChangeAnswer: () => void
}

const SEVERITY_CONFIG: Record<SeverityLevel, { 
  color: string
  textColor: string 
  icon: string 
  label: string 
  badge: string 
}> = {
  routine: { 
    color: 'bg-green-100 border-green-300', 
    textColor: 'text-green-800', 
    icon: '🟢', 
    label: 'Routine Visit', 
    badge: '#27AE60' 
  },
  urgent: { 
    color: 'bg-yellow-100 border-yellow-300', 
    textColor: 'text-yellow-800', 
    icon: '🟡', 
    label: 'Urgent — Visit Today', 
    badge: '#F39C12' 
  },
  emergency: { 
    color: 'bg-red-100 border-red-300', 
    textColor: 'text-red-800', 
    icon: '🔴', 
    label: 'Emergency — Go Immediately', 
    badge: '#E74C3C' 
  },
}

const DEFAULT_CONFIG = SEVERITY_CONFIG.routine

export default function SeverityCard({ result, onContinue, onChangeAnswer }: SeverityCardProps) {
  const { lang } = useLang()
  // Normalize severity to lowercase and use fallback to prevent undefined
  const severity = result.severity?.toLowerCase() as SeverityLevel || 'routine'
  const config = SEVERITY_CONFIG[severity] || DEFAULT_CONFIG

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border-2 p-6 ${config.color}`}
    >
      {/* Severity Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{config.icon}</span>
        <span 
          className={`font-bold text-lg uppercase tracking-wide ${config.textColor}`}
          style={{ color: config.badge }}
        >
          {config.label}
        </span>
      </div>

      {/* Department */}
      <div className="mb-4">
        <p className="text-sm text-[var(--text2)] mb-1">
          {lang === 'kn' ? 'ಶಿಫಾರಸು ಮಾಡಿದ ವಿಭಾಗ:' : 'Recommended Department:'}
        </p>
        <p className="font-heading font-bold text-xl text-[var(--primary)]">
          {result.department}
        </p>
      </div>

      {/* Reason */}
      <div className="mb-4 bg-white/50 rounded-lg p-4">
        <p className="text-sm text-[var(--text2)] mb-2">
          {lang === 'kn' ? 'ಏಕೆ:' : 'Why:'}
        </p>
        <p className="text-[var(--text)] mb-3">{result.reason}</p>
        <p 
          className="text-[var(--text2)] text-sm border-t border-[var(--border)] pt-3"
          style={{ fontFamily: 'var(--font-kn)' }}
        >
          {result.kannada_reason}
        </p>
      </div>

      {/* Advice */}
      <div className="mb-6">
        <p className="text-sm text-[var(--text2)] mb-1">
          {lang === 'kn' ? 'ಮಾಡಬೇಕಾದದ್ದು:' : 'What to do:'}
        </p>
        <p className="font-medium text-[var(--text)]">{result.advice}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onContinue}
          className="flex-1 py-3 px-4 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {lang === 'kn' ? 'ಬುಕ್ ಮಾಡಲು ಮುಂದುವರಿಸಿ' : 'Continue to Book'}
          <ArrowRight size={18} />
        </button>
        
        <a
          href="tel:+918028437150"
          className="py-3 px-4 bg-white hover:bg-gray-50 text-[var(--primary)] font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 border border-[var(--border)]"
        >
          <Phone size={18} />
          {lang === 'kn' ? 'ರಿಸೆಪ್ಷನ್‌ಗೆ ಕರೆ ಮಾಡಿ' : 'Call Reception'}
        </a>
      </div>

      {/* Change Answer Link */}
      <button
        onClick={onChangeAnswer}
        className="mt-4 text-sm text-[var(--text2)] hover:text-[var(--primary)] transition-colors flex items-center justify-center gap-1 w-full"
      >
        <RefreshCw size={14} />
        {lang === 'kn' ? 'ನನ್ನ ಉತ್ತರವನ್ನು ಬದಲಾಯಿಸಿ' : 'Change my answer'}
      </button>
    </motion.div>
  )
}
