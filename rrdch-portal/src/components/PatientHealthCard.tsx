import { useRef } from 'react'
import html2canvas from 'html2canvas'
import { useLang } from '../context/LanguageContext'

interface AppointmentData {
  name: string
  phone: string
  token: string
  department: string
  date: string
  time?: string
  severity: 'routine' | 'urgent' | 'emergency'
}

interface PatientHealthCardProps {
  appointment: AppointmentData
}

export default function PatientHealthCard({ appointment }: PatientHealthCardProps) {
  const { lang } = useLang()
  const cardRef = useRef<HTMLDivElement>(null)

  const downloadCard = async () => {
    if (!cardRef.current) return
    // Wait for DOM to be ready before capturing
    await new Promise(resolve => setTimeout(resolve, 100))
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    })
    const link = document.createElement('a')
    link.download = `RRDCH-${appointment.token}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const severityEmoji = { routine: '🟢', urgent: '🟡', emergency: '🔴' }

  const details = [
    { icon: '🎫', label: lang === 'kn' ? 'ಟೋಕನ್' : 'Token', value: appointment.token },
    { icon: '🏥', label: lang === 'kn' ? 'ವಿಭಾಗ' : 'Department', value: appointment.department },
    { icon: '📅', label: lang === 'kn' ? 'ದಿನಾಂಕ' : 'Date', value: appointment.date },
    { icon: '⏰', label: lang === 'kn' ? 'ಸಮಯ' : 'Time', value: appointment.time || '9:00 AM onwards' },
    { icon: severityEmoji[appointment.severity], label: lang === 'kn' ? 'ತೀವ್ರತೆ' : 'Severity', value: appointment.severity.charAt(0).toUpperCase() + appointment.severity.slice(1) },
  ]

  return (
    <div className="w-full max-w-[380px] mx-auto">
      {/* The card div — this is what gets converted to PNG */}
      <div
        ref={cardRef}
        className="w-[340px] p-6 bg-white border-2 border-[var(--primary)] rounded-2xl mx-auto"
        style={{ fontFamily: 'Sora, sans-serif' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🦷</span>
          <div>
            <div className="font-extrabold text-[var(--primary)] text-lg">RRDCH</div>
            <div className="text-xs text-[var(--text2)]">RajaRajeswari Dental College & Hospital</div>
          </div>
        </div>

        <hr className="border-[var(--border)] my-3" />

        {/* Patient Name & Phone */}
        <div className="text-xl font-extrabold text-[var(--text)] mb-0.5">
          {appointment.name}
        </div>
        <div className="text-sm text-[var(--text2)] mb-4">
          📱 {appointment.phone}
        </div>

        {/* Details rows */}
        {details.map(({ icon, label, value }) => (
          <div
            key={label}
            className="flex justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <span className="text-[var(--text2)] text-sm">{icon} {label}</span>
            <span className="font-bold text-sm text-[var(--text)]">{value}</span>
          </div>
        ))}

        <hr className="border-[var(--border)] my-3" />

        <div className="text-center text-xs text-[var(--text2)] mb-1">
          {lang === 'kn' ? 'ಈ ಕಾರ್ಡ್ ಅನ್ನು OPD ರಿಸೆಪ್ಷನ್‌ನಲ್ಲಿ ತೋರಿಸಿ' : 'Show this card at OPD Reception'}
        </div>
        <div className="text-center text-sm text-[var(--primary)] font-bold">
          📞 080-2843 7150
        </div>
      </div>

      {/* Download button — OUTSIDE cardRef, will NOT appear in PNG */}
      <button
        onClick={downloadCard}
        className="mt-4 w-full py-3.5 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
        style={{ fontFamily: 'Sora, sans-serif' }}
      >
        <span>📥</span>
        {lang === 'kn' ? 'ಕಾರ್ಡ್ ಉಳಿಸಿ' : 'Save Card to Phone'}
      </button>
    </div>
  )
}
