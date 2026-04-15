// OPD Wait Time Heatmap Data (Feature 5)
// Hardcoded based on historical patient volume

export const heatmapData = {
  Monday:    { Morning: 2, Midday: 3, Afternoon: 2, Evening: 1 },
  Tuesday:   { Morning: 1, Midday: 2, Afternoon: 1, Evening: 1 },
  Wednesday: { Morning: 4, Midday: 4, Afternoon: 3, Evening: 2 },
  Thursday:  { Morning: 2, Midday: 3, Afternoon: 2, Evening: 1 },
  Friday:    { Morning: 1, Midday: 2, Afternoon: 1, Evening: 1 },
  Saturday:  { Morning: 4, Midday: 4, Afternoon: 4, Evening: 3 },
}

export const HEAT_COLORS: Record<number, { bg: string; text: string; label: string }> = {
  0: { bg: '#D5F5E3', text: '#1E8449', label: 'Very Low' },
  1: { bg: '#A9DFBF', text: '#1E8449', label: 'Low' },
  2: { bg: '#F9E79F', text: '#B7950B', label: 'Moderate' },
  3: { bg: '#F0B27A', text: '#A04000', label: 'Busy' },
  4: { bg: '#F1948A', text: '#922B21', label: 'Very Busy' },
}

export type TimeSlot = 'Morning' | 'Midday' | 'Afternoon' | 'Evening'
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'

// Get current day highlight
export const getCurrentDay = (): DayOfWeek | null => {
  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayIndex = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.
  if (dayIndex === 0 || dayIndex === 6) return null // Sunday (closed) or already Saturday
  return days[dayIndex - 1]
}
