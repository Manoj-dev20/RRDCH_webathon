import { motion } from 'framer-motion'
import { heatmapData, HEAT_COLORS, getCurrentDay, DayOfWeek, TimeSlot } from '../data/heatmapData'
import { useLang } from '../context/LanguageContext'

const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const timeSlots: TimeSlot[] = ['Morning', 'Midday', 'Afternoon', 'Evening']

interface OPDHeatmapProps {
  compact?: boolean
}

export default function OPDHeatmap({ compact = false }: OPDHeatmapProps) {
  const { lang } = useLang()
  const currentDay = getCurrentDay()

  return (
    <div className={`bg-white rounded-xl border border-[var(--border)] ${compact ? 'p-4' : 'p-6'}`}>
      {!compact && (
        <div className="mb-4">
          <h3 className="font-heading font-semibold text-lg text-[var(--primary)]">
            {lang === 'kn' ? 'ಉತ್ತಮ ಭೇಟಿ ಸಮಯ' : 'Best Time to Visit OPD'}
          </h3>
          <p className="text-sm text-[var(--text2)]">
            {lang === 'kn' ? 'ಐತಿಹಾಸಿಕ ರೋಗಿ ಪ್ರಮಾಣದ ಆಧಾರದ ಮೇಲೆ' : 'Based on historical patient volume'}
          </p>
        </div>
      )}

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Header Row - Days */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            <div className="text-xs text-[var(--text3)] font-medium text-center py-2">
              {lang === 'kn' ? 'ಸಮಯ' : 'Time'}
            </div>
            {days.map((day) => (
              <div
                key={day}
                className={`text-xs font-medium text-center py-2 rounded ${
                  day === currentDay
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--text2)]'
                }`}
              >
                {day.slice(0, 3)}
              </div>
            ))}
          </div>

          {/* Data Rows */}
          {timeSlots.map((slot) => (
            <div key={slot} className="grid grid-cols-7 gap-2 mb-2">
              <div className="text-xs text-[var(--text2)] font-medium flex items-center justify-center">
                {slot}
              </div>
              {days.map((day) => {
                const level = heatmapData[day][slot]
                const colors = HEAT_COLORS[level]
                return (
                  <motion.div
                    key={`${day}-${slot}`}
                    whileHover={{ scale: 1.05 }}
                    className="rounded-lg p-2 text-center cursor-pointer transition-all"
                    style={{
                      backgroundColor: colors.bg,
                      color: colors.text,
                    }}
                    title={`${day} ${slot}: ${colors.label}`}
                  >
                    <span className="text-xs font-semibold">
                      {compact ? level : colors.label.slice(0, 4)}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        {[0, 1, 2, 3, 4].map((level) => (
          <div key={level} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: HEAT_COLORS[level].bg, border: `1px solid ${HEAT_COLORS[level].text}` }}
            />
            <span className="text-xs text-[var(--text2)]">{HEAT_COLORS[level].label}</span>
          </div>
        ))}
      </div>

      {/* Tip */}
      {!compact && (
        <div className="mt-4 p-3 bg-[var(--surface)] rounded-lg">
          <p className="text-sm text-[var(--text2)]">
            <span className="font-semibold text-[var(--primary)]">
              {lang === 'kn' ? 'ಸಲಹೆ:' : 'Tip:'}
            </span>{' '}
            {lang === 'kn'
              ? 'ಮಂಗಳವಾರ ಮತ್ತು ಶುಕ್ರವಾರದ ಬೆಳಿಗ್ಗೆಯ ಸಮಯದಲ್ಲಿ ಅತ್ಯಂತ ಕಡಿಮೆ ಕಾಯುವ ಸಮಯ'
              : 'Tuesday and Friday mornings have the shortest wait times'}
          </p>
        </div>
      )}
    </div>
  )
}
