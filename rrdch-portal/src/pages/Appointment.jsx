import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ref, set, runTransaction } from 'firebase/database';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Check, Calendar, User, Phone, Loader, ArrowRight, 
  AlertCircle, Baby, Droplets, HelpCircle, MinusCircle, Scissors, 
  ShieldCheck, Smile, Thermometer, X, Sparkles, RefreshCw
} from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { t } from '../data/translations';
import { SYMPTOMS } from '../data/symptoms';
import { DEPARTMENTS, getDepartmentName } from '../data/departments';
import { BACKEND_URL } from '../config';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import PatientHealthCard from '../components/PatientHealthCard';
import OPDHeatmap from '../components/OPDHeatmap';
import SeverityCard from '../components/SeverityCard';
import MorphingSquare from '../components/MorphingSquare';

// Icon mapping for symptoms
const symptomIcons = {
  'tooth': Thermometer,
  'droplets': Droplets,
  'baby': Baby,
  'smile': Smile,
  'shield-check': ShieldCheck,
  'scissors': Scissors,
  'alert-circle': AlertCircle,
  'minus-circle': MinusCircle,
  'help-circle': HelpCircle
};

export default function Appointment() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedDept = searchParams.get('dept');

  const [step, setStep] = useState(preselectedDept ? 2 : 1);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [selectedDept, setSelectedDept] = useState(preselectedDept || null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [error, setError] = useState(null);

  // AI Triage state (Feature 1)
  const [symptomText, setSymptomText] = useState('');
  const [triageResult, setTriageResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showTriageResult, setShowTriageResult] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [severity, setSeverity] = useState('routine');

  const handleSymptomSelect = (symptom) => {
    setSelectedSymptom(symptom);
    setSelectedDept(symptom.department);
    setSymptomText(lang === 'kn' ? symptom.labelKn : symptom.label);
  };

  // AI Triage function (Feature 1)
  const analyzeSymptom = async () => {
    if (!symptomText.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/triage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptom: symptomText })
      });

      if (!response.ok) throw new Error('Triage failed');

      const data = await response.json();
      setTriageResult(data);
      setSelectedDept(data.department.toLowerCase().replace(/\s+/g, '-'));
      setSeverity(data.severity);
      setShowTriageResult(true);
    } catch (err) {
      console.error('Triage error:', err);
      // Fallback to icon grid on error
      setUseFallback(true);
      setError(lang === 'kn' ? 'AI ವಿಶ್ಲೇಷಣೆ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಚಿಹ್ನೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.' : 'AI analysis failed. Please select an icon below.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTriageContinue = () => {
    if (triageResult) {
      // Map the department name to department code
      const deptCode = Object.keys(DEPARTMENTS).find(key => 
        DEPARTMENTS[key].name.toLowerCase().includes(triageResult.department.toLowerCase().split(' ')[0])
      ) || 'oral-medicine';
      setSelectedDept(deptCode);
    }
    setStep(2);
  };

  const resetTriage = () => {
    setShowTriageResult(false);
    setTriageResult(null);
    setSymptomText('');
    setUseFallback(false);
    setSelectedSymptom(null);
    setSelectedDept(null);
  };

  const handleDeptSelect = (e) => {
    setSelectedDept(e.target.value);
    setSelectedSymptom(null);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || formData.phone.length !== 10 || !selectedDept) {
      setError(t('error', lang));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const today = new Date().toISOString().split('T')[0];
      const deptCode = selectedDept;
      const counterRef = ref(db, `queues/${deptCode}/tokenCounter`);

      // Use transaction to get unique token number
      const result = await runTransaction(counterRef, (current) => {
        const count = current || 0;
        // Reset counter if it's a new day (check date in separate path)
        return count + 1;
      });

      const tokenNumber = result.snapshot.val();
      const tokenId = `A-${String(tokenNumber).padStart(3, '0')}`;
      const now = Date.now();

      const patientData = {
        name: formData.name,
        phone: formData.phone,
        date: formData.date,
        tokenId,
        department: deptCode,
        departmentName: DEPARTMENTS[deptCode].name,
        departmentNameKn: DEPARTMENTS[deptCode].nameKn,
        symptom: selectedSymptom ? (lang === 'kn' ? selectedSymptom.labelKn : selectedSymptom.label) : 'General',
        bookedAt: now,
        status: 'waiting',
        today
      };

      // Write to queue patients
      await set(ref(db, `queues/${deptCode}/patients/${tokenId}`), patientData);

      // Write to appointments (keyed by phone for followup lookup)
      await set(ref(db, `appointments/${formData.phone}/${tokenId}`), patientData);

      // Update queue date for day tracking
      await set(ref(db, `queues/${deptCode}/date`), today);

      // Initialize currentToken if not set
      await runTransaction(ref(db, `queues/${deptCode}/currentToken`), (current) => {
        if (current === null) return 'A-000';
        return current;
      });

      setBookingResult({
        token: tokenId,
        department: getDepartmentName(selectedDept, lang),
        date: formData.date,
        phone: formData.phone
      });
      setStep(3);
    } catch (err) {
      console.error('Booking failed:', err);
      setError('Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(lang === 'kn' ? 'kn-IN' : 'en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step === s ? 'bg-primary text-white' :
                  step > s ? 'bg-success text-white' : 'bg-border text-text-muted'
                }`}>
                  {step > s ? <Check size={20} /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-8 h-0.5 mx-2 ${step > s ? 'bg-success' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: AI Symptom Triage + Interactive Symptom Selector */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-8">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`font-heading font-semibold text-2xl md:text-3xl text-primary mb-2 ${lang === 'kn' ? 'kannada' : ''}`}
                >
                  {t('whatBringsYou', lang)}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-text-secondary"
                >
                  {lang === 'kn' ? 'ನಿಮ್ಮ ತೊಂದರೆಯನ್ನು ವಿವರಿಸಿ ಅಥವಾ ಚಿಹ್ನೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ' : 'Describe your concern or select an icon below'}
                </motion.p>
              </div>

              {/* AI Triage Text Input (Feature 1) */}
              {!showTriageResult && (
                <div className="mb-8">
                  <div className="bg-white rounded-xl border border-[var(--border)] p-4 shadow-sm">
                    <label className="flex items-center gap-2 text-sm font-medium text-[var(--text2)] mb-3">
                      <Sparkles size={18} className="text-[var(--accent)]" />
                      {lang === 'kn' ? 'AI ವೈದ್ಯಕೀಯ ಸಹಾಯಕ' : 'AI Medical Assistant'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={symptomText}
                        onChange={(e) => setSymptomText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && analyzeSymptom()}
                        placeholder={lang === 'kn' ? 'ಉದಾ: ದವಡೆ ನೋವು ಮತ್ತು ಉಬ್ಬರವಳಿಕೆ' : 'e.g., jaw pain with swelling since yesterday'}
                        className="flex-1 px-4 py-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all"
                        disabled={isAnalyzing}
                      />
                      <button
                        onClick={analyzeSymptom}
                        disabled={isAnalyzing || !symptomText.trim()}
                        className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw size={18} className="animate-spin" />
                            {lang === 'kn' ? 'ವಿಶ್ಲೇಷಿಸು...' : 'Analyzing...'}
                          </>
                        ) : (
                          <>
                            <Sparkles size={18} />
                            {lang === 'kn' ? 'ವಿಶ್ಲೇಷಿಸು' : 'Analyze'}
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-[var(--text3)] mt-2">
                      {lang === 'kn' ? 'ಸಹಜ ಭಾಷೆಯಲ್ಲಿ ವಿವರಿಸಿ - AI ಸರಿಯಾದ ವಿಭಾಗ ಮತ್ತು ತೀವ್ರತೆಯನ್ನು ಸೂಚಿಸುತ್ತದೆ' : 'Describe in natural language - AI will suggest the right department and severity'}
                    </p>
                  </div>
                </div>
              )}

              {/* AI Triage Result Card (Feature 1) */}
              <AnimatePresence>
                {showTriageResult && triageResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-8"
                  >
                    <SeverityCard
                      result={triageResult}
                      onContinue={handleTriageContinue}
                      onChangeAnswer={resetTriage}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Fallback or Icon Grid Selection */}
              {(!showTriageResult || useFallback) && (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-[var(--border)]" />
                    <span className="text-sm text-[var(--text3)]">
                      {lang === 'kn' ? 'ಅಥವಾ ತ್ವರಿತ ಆಯ್ಕೆ' : 'Or quick select'}
                    </span>
                    <div className="flex-1 h-px bg-[var(--border)]" />
                  </div>

                  {/* 3x3 Interactive Symptom Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {SYMPTOMS.map((symptom, index) => {
                      const IconComponent = symptomIcons[symptom.icon] || HelpCircle;
                      const isSelected = selectedSymptom?.id === symptom.id;
                      
                      return (
                        <motion.button
                          key={symptom.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSymptomSelect(symptom)}
                          className={`relative min-h-[130px] p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                            isSelected 
                              ? 'border-accent bg-accent/5 shadow-lg shadow-accent/10' 
                              : 'border-border bg-white hover:border-accent/30 hover:shadow-md'
                          }`}
                        >
                          {/* Selection Indicator */}
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute top-3 right-3 w-6 h-6 bg-accent rounded-full flex items-center justify-center"
                              >
                                <Check size={14} className="text-white" />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Icon in Teal Circle */}
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                            isSelected ? 'bg-accent text-white' : 'bg-accent/10 text-accent'
                          }`}>
                            <IconComponent size={24} />
                          </div>

                          {/* Text Content */}
                          <p className={`font-semibold text-sm mb-1 ${isSelected ? 'text-accent' : 'text-primary'}`}>
                            {lang === 'kn' ? symptom.labelKn : symptom.label}
                          </p>
                          <p className="text-xs text-text-muted">
                            {DEPARTMENTS[symptom.department]?.name || ''}
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Continue Button with Slide-up Animation */}
                  <AnimatePresence>
                    {selectedDept && !showTriageResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="flex justify-center"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setStep(2)}
                          className="inline-flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-accent/20"
                        >
                          {t('continue', lang)}
                          <ArrowRight size={18} />
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          )}

          {/* Step 2: Form Layout - Personal Details */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back Button */}
              <motion.button
                whileHover={{ x: -4 }}
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-text-secondary hover:text-primary mb-6 transition-colors"
              >
                <ArrowLeft size={20} />
                {t('back', lang)}
              </motion.button>

              <h1 className={`font-heading font-semibold text-2xl md:text-3xl text-primary mb-6 ${lang === 'kn' ? 'kannada' : ''}`}>
                {t('yourDetails', lang)}
              </h1>

              {/* Selected Department Info - Teal Info Box */}
              <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-6">
                <p className="text-sm text-text-secondary mb-1">
                  {t('weWillSendYouTo', lang)}
                </p>
                <p className={`font-semibold text-primary text-lg ${lang === 'kn' ? 'kannada' : ''}`}>
                  {getDepartmentName(selectedDept, lang)}
                </p>
              </div>

              {/* Form Layout */}
              <div className="space-y-5">
                {/* Department Override Select */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    {lang === 'kn' ? 'ವಿಭಾಗ ಬದಲಾಯಿಸಿ (ಐಚ್ಛಿಕ)' : 'Change Department (Optional)'}
                  </label>
                  <select
                    value={selectedDept || ''}
                    onChange={handleDeptSelect}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                  >
                    {Object.entries(DEPARTMENTS).map(([code, dept]) => (
                      <option key={code} value={code}>
                        {lang === 'kn' ? dept.nameKn : dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Full Name Input */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    <User size={16} className="inline mr-1" />
                    {t('fullName', lang)}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                    placeholder={lang === 'kn' ? 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು' : 'Enter your full name'}
                  />
                </div>

                {/* Mobile Number Input */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    <Phone size={16} className="inline mr-1" />
                    {t('mobileNumber', lang)}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                    placeholder={lang === 'kn' ? '10 ಅಂಕೆಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : '10-digit mobile number'}
                  />
                </div>

                {/* Preferred Date Input with Calendar */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    {t('preferredDate', lang)}
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    min={new Date().toISOString().split('T')[0]}
                    max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-danger/10 text-danger rounded-lg flex items-center gap-2"
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}

              {/* OPD Heatmap - Collapsible (Feature 5) */}
              <div className="mt-6">
                <details className="group">
                  <summary className="flex items-center gap-2 text-sm text-[var(--text2)] hover:text-[var(--primary)] cursor-pointer transition-colors py-2">
                    <span className="text-[var(--accent)]">📊</span>
                    {lang === 'kn' ? 'ಜನಸಂದಣಿ ಸಮಯವನ್ನು ಪರಿಶೀಲಿಸಿ' : 'Check busy times'}
                    <span className="ml-auto transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <div className="mt-3">
                    <OPDHeatmap compact />
                  </div>
                </details>
              </div>

              {/* Submit Button - Full width, 56px height, accent-warm color */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.name || formData.phone.length !== 10}
                className="w-full mt-6 py-4 bg-accent-warm hover:bg-orange-600 text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    {t('loading', lang)}
                  </>
                ) : (
                  <>
                    {t('confirmBooking', lang)}
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && bookingResult && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check className="text-success" size={40} />
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`font-heading font-semibold text-2xl md:text-3xl text-primary mb-2 ${lang === 'kn' ? 'kannada' : ''}`}
              >
                {t('appointmentConfirmed', lang)}
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card max-w-md mx-auto mt-8 text-left shadow-xl"
              >
                <div className="text-center mb-6 pb-6 border-b border-border">
                  <p className="text-text-secondary mb-2">{t('yourToken', lang)}</p>
                  <p className="text-5xl font-heading font-bold text-accent">{bookingResult.token}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">{t('department', lang)}</span>
                    <span className={`font-medium text-primary ${lang === 'kn' ? 'kannada' : ''}`}>
                      {bookingResult.department}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">{t('date', lang)}</span>
                    <span className="font-medium">{formatDate(bookingResult.date)}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <WhatsAppButton
                    phone={bookingResult.phone}
                    token={bookingResult.token}
                    department={bookingResult.department}
                    departmentKannada={bookingResult.departmentKannada || bookingResult.department}
                    date={formatDate(bookingResult.date)}
                    lang={lang}
                  />
                </div>

                <p className="mt-4 text-sm text-text-muted text-center">
                  {t('screenshotThis', lang)}
                </p>
              </motion.div>

              {/* Patient Health Card (Feature 6) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8"
              >
                <h3 className="text-center font-semibold text-[var(--primary)] mb-4">
                  {lang === 'kn' ? 'ನಿಮ್ಮ ರೋಗಿ ಆರೋಗ್ಯ ಕಾರ್ಡ್' : 'Your Patient Health Card'}
                </h3>
                <PatientHealthCard
                  appointment={{
                    name: bookingResult.name || formData.name,
                    phone: bookingResult.phone || formData.phone,
                    token: bookingResult.token,
                    department: bookingResult.department,
                    date: formatDate(bookingResult.date),
                    time: '9:00 AM onwards',
                    severity: severity || 'routine'
                  }}
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/queue')}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
                >
                  {t('checkQueueStatus', lang)}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setStep(1);
                    setSelectedSymptom(null);
                    setSelectedDept(null);
                    setFormData({ name: '', phone: '', date: new Date().toISOString().split('T')[0] });
                    setBookingResult(null);
                  }}
                  className="px-6 py-3 border-2 border-primary text-primary hover:bg-primary/5 font-semibold rounded-lg transition-colors"
                >
                  {lang === 'kn' ? 'ಮತ್ತೊಂದು ಬುಕ್ ಮಾಡಿ' : 'Book Another'}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
