import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { Check, RotateCw, Clock } from 'lucide-react'

const STATUS_STEPS = ['received', 'assigned', 'in_progress', 'resolved'] as const

const STATUS_LABELS: Record<string, { en: string; kn: string }> = {
  received: { en: 'Complaint Received', kn: 'ದೂರು ಸ್ವೀಕರಿಸಲಾಗಿದೆ' },
  assigned: { en: 'Assigned to Staff', kn: 'ಸಿಬ್ಬಂದಿಗೆ ನಿಯೋಜಿಸಲಾಗಿದೆ' },
  in_progress: { en: 'Work In Progress', kn: 'ಕೆಲಸ ಪ್ರಗತಿಯಲ್ಲಿದೆ' },
  resolved: { en: 'Resolved ✅', kn: 'ಪರಿಹರಿಸಲಾಗಿದೆ ✅' },
}

interface TimelineData {
  received: string | number | null
  assigned: string | number | null
  in_progress: string | number | null
  inProgress?: string | number | null
  resolved: string | number | null
}

interface ComplaintTimelineProps {
  timeline?: TimelineData
  status: string
  submittedAt?: string | number
}

export default function ComplaintTimeline({ timeline, status, submittedAt }: ComplaintTimelineProps) {
  const { lang } = useLang()
  const currentIndex = STATUS_STEPS.indexOf(status as typeof STATUS_STEPS[number])

  // Safe date formatter - handles both ISO strings and Unix timestamps
  const formatDate = (value: string | number | null | undefined): string => {
    if (!value) return lang === 'kn' ? 'ಬಾಕಿ' : 'Pending'
    try {
      const date = typeof value === 'number' ? new Date(value) : new Date(value)
      if (isNaN(date.getTime())) return lang === 'kn' ? 'ಬಾಕಿ' : 'Pending'
      return date.toLocaleString(lang === 'kn' ? 'kn-IN' : 'en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return lang === 'kn' ? 'ಬಾಕಿ' : 'Pending'
    }
  }

  // Build safe timeline with fallback to submittedAt for received
  const safeTimeline = {
    received: timeline?.received ?? (submittedAt ? submittedAt : null),
    assigned: timeline?.assigned ?? null,
    in_progress: timeline?.in_progress ?? timeline?.inProgress ?? null,
    resolved: timeline?.resolved ?? null
  }

  return (
    <div className="space-y-4">
      {STATUS_STEPS.map((step, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex
        const isPending = index > currentIndex
        const timestamp = safeTimeline[step]

        return (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4"
          >
            {/* Status Icon */}
            <div className="flex-shrink-0">
              {isCompleted && (
                <div className="w-8 h-8 rounded-full bg-[var(--success)] flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
              )}
              {isCurrent && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-8 h-8 rounded-full bg-[var(--warning)] flex items-center justify-center"
                >
                  <RotateCw size={16} className="text-white animate-spin" />
                </motion.div>
              )}
              {isPending && (
                <div className="w-8 h-8 rounded-full bg-[var(--border)] flex items-center justify-center">
                  <Clock size={16} className="text-[var(--text3)]" />
                </div>
              )}
            </div>

            {/* Status Text */}
            <div className="flex-1 pb-4 border-b border-[var(--border)] last:border-0">
              <p className={`font-semibold ${isPending ? 'text-[var(--text3)]' : 'text-[var(--text)]'}`}>
                {lang === 'kn' ? STATUS_LABELS[step].kn : STATUS_LABELS[step].en}
              </p>
              <p className={`text-sm ${isPending ? 'text-[var(--text3)]' : 'text-[var(--text2)]'}`}>
                {formatDate(timestamp)}
              </p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
