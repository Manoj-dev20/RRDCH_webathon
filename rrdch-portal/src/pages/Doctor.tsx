import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, User, ArrowRight, RotateCw } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Hardcoded credentials for hackathon
const DOCTOR_CREDENTIALS = { username: 'doctor', password: 'rrdch2026' }

export default function Doctor() {
  const { lang } = useLang()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate API delay
    setTimeout(() => {
      if (username === DOCTOR_CREDENTIALS.username && password === DOCTOR_CREDENTIALS.password) {
        localStorage.setItem('doctorAuth', 'true')
        navigate('/doctor/dashboard')
      } else {
        setError(lang === 'kn' ? 'ಅಮಾನ್ಯ ಪ್ರವೇಶ ಪದ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್' : 'Invalid username or password')
      }
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-[var(--border)] p-8 shadow-lg"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="text-white" size={28} />
              </div>
              <h1 className="font-heading font-bold text-2xl text-[var(--primary)] mb-2">
                {lang === 'kn' ? 'ಡಾಕ್ಟರ್ ಲಾಗಿನ್' : 'Doctor Login'}
              </h1>
              <p className="text-[var(--text2)]">
                {lang === 'kn' ? 'PG ಡಾಕ್ಟರ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಪ್ರವೇಶಿಸಿ' : 'Access PG Doctor Dashboard'}
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text2)] mb-2">
                  {lang === 'kn' ? 'ಬಳಕೆದಾರಹೆಸರು' : 'Username'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text3)]" size={18} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all"
                    placeholder={lang === 'kn' ? 'ಬಳಕೆದಾರಹೆಸರು ನಮೂದಿಸಿ' : 'Enter username'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text2)] mb-2">
                  {lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text3)]" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all"
                    placeholder={lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ' : 'Enter password'}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RotateCw size={18} />
                  </motion.div>
                ) : (
                  <>
                    {lang === 'kn' ? 'ಲಾಗಿನ್ ಮಾಡಿ' : 'Login'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
              <p className="text-xs text-[var(--text3)]">
                {lang === 'kn' ? 'ನೆರವು ಬೇಕೇ? ಕರೆ ಮಾಡಿ: ' : 'Need help? Call: '}
                <a href="tel:+918028437150" className="text-[var(--accent)] hover:underline">
                  080-2843 7150
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
