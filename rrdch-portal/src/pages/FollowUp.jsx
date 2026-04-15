import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from '../firebase';
import { Phone, Search, Calendar, ArrowRight, Loader, AlertCircle, Upload, FileText, Sparkles, X } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { t } from '../data/translations';
import { BACKEND_URL } from '../config';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import MorphingSquare from '../components/MorphingSquare';

export default function FollowUp() {
  const { lang } = useLang();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  // Prescription Reader state (Feature 7)
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState(null);
  const [isAnalyzingPrescription, setIsAnalyzingPrescription] = useState(false);
  const [prescriptionResult, setPrescriptionResult] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  const handleSearch = async () => {
    if (!phone || phone.length !== 10) {
      setError(lang === 'kn' ? 'ಮಾನ್ಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ' : 'Please enter a valid mobile number');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setAppointments([]);

    try {
      const appointmentsRef = ref(db, `appointments/${phone}`);
      const snapshot = await get(appointmentsRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const appointmentList = Object.entries(data).map(([token, details]) => ({
          token,
          ...details
        }));
        // Sort by bookedAt (newest first)
        appointmentList.sort((a, b) => b.bookedAt - a.bookedAt);
        setAppointments(appointmentList);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(lang === 'kn' ? 'kn-IN' : 'en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString(lang === 'kn' ? 'kn-IN' : 'en-IN');
  };

  // Prescription Reader handlers (Feature 7)
  const handlePrescriptionUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setPrescriptionFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPrescriptionPreview(reader.result);
      reader.readAsDataURL(file);
      setShowPrescriptionModal(true);
    }
  };

  const analyzePrescription = async () => {
    if (!prescriptionPreview) return;

    setIsAnalyzingPrescription(true);
    setPrescriptionResult(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/prescription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: prescriptionPreview })
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setPrescriptionResult(data);
    } catch (err) {
      console.error('Prescription analysis error:', err);
      setError(lang === 'kn' ? 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ವಿಶ್ಲೇಷಣೆ ವಿಫಲವಾಗಿದೆ' : 'Prescription analysis failed');
    } finally {
      setIsAnalyzingPrescription(false);
    }
  };

  const clearPrescription = () => {
    setPrescriptionFile(null);
    setPrescriptionPreview(null);
    setPrescriptionResult(null);
    setShowPrescriptionModal(false);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className={`font-heading font-semibold text-2xl md:text-3xl text-primary mb-2 text-center ${lang === 'kn' ? 'kannada' : ''}`}>
            {t('checkYourAppointment', lang)}
          </h1>
          <p className="text-text-secondary text-center mb-8">
            {t('enterRegisteredMobile', lang)}
          </p>

          {/* Search Form */}
          <div className="card mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="input pl-12"
                  placeholder={lang === 'kn' ? '10 ಅಂಕೆಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : '10-digit mobile number'}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isLoading || phone.length !== 10}
                className="btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  <Search size={20} />
                )}
                {t('checkQueue', lang)}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-danger/10 text-danger rounded-lg flex items-center gap-2">
                <AlertCircle size={18} />
                {error}
              </div>
            )}
          </div>

          {/* Results */}
          {hasSearched && !isLoading && (
            <div>
              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-text-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="text-text-muted" size={32} />
                  </div>
                  <h2 className="font-heading font-semibold text-xl text-primary mb-2">
                    {t('noAppointmentsFound', lang)}
                  </h2>
                  <p className="text-text-secondary mb-6">
                    {lang === 'kn' ? 'ನಿಮ್ಮ ದಂತ ಆರೋಗ್ಯಕ್ಕಾಗಿ ಈಗಲೇ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ' : 'Book an appointment now for your dental health'}
                  </p>
                  <Link to="/appointment" className="btn btn-accent inline-flex items-center gap-2">
                    {t('bookOneNow', lang)}
                    <ArrowRight size={18} />
                  </Link>
                </div>
              ) : (
                <div>
                  <h2 className="font-heading font-semibold text-xl text-primary mb-4">
                    {lang === 'kn' ? 'ನಿಮ್ಮ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು' : 'Your Appointments'}
                  </h2>
                  <div className="space-y-4">
                    {appointments.map((apt) => (
                      <div key={apt.token} className="card">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl font-heading font-bold text-accent">
                                {apt.token}
                              </span>
                              <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                                {lang === 'kn' ? 'ದೃಢಪಟ್ಟಿದೆ' : 'Confirmed'}
                              </span>
                            </div>
                            <p className={`font-semibold text-primary ${lang === 'kn' ? 'kannada' : ''}`}>
                              {apt.departmentName}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-text-secondary mt-2">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {formatDate(apt.date)}
                              </span>
                              <span>
                                {lang === 'kn' ? 'ಬುಕ್ ಮಾಡಿದ್ದು: ' : 'Booked: '}
                                {formatDateTime(apt.bookedAt)}
                              </span>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <WhatsAppButton
                              phone={phone}
                              token={apt.token}
                              department={apt.departmentName}
                              date={formatDate(apt.date)}
                              lang={lang}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Prescription Reader Section (Feature 7) */}
          <div className="card mt-8 border-2 border-dashed border-[var(--accent)]/30">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-[var(--accent)]" size={32} />
              </div>
              <h3 className={`font-heading font-semibold text-xl text-[var(--primary)] mb-2 ${lang === 'kn' ? 'kannada' : ''}`}>
                {lang === 'kn' ? 'AI ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಓದುಗ' : 'AI Prescription Reader'}
              </h3>
              <p className="text-[var(--text2)] mb-4">
                {lang === 'kn' 
                  ? 'ನಿಮ್ಮ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ - AI ಬುದ್ಧಿವಂತವಾಗಿ ಔಷಧಿ ಮತ್ತು ನಿರ್ದೇಶನಗಳನ್ನು ಓದುತ್ತದೆ' 
                  : 'Upload your prescription - AI intelligently reads medicines and instructions'}
              </p>

              {/* Upload Button */}
              <label className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-semibold rounded-lg transition-colors cursor-pointer">
                <Upload size={18} />
                {lang === 'kn' ? 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ' : 'Upload Prescription'}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePrescriptionUpload}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-[var(--text3)] mt-3">
                {lang === 'kn' 
                  ? 'ಗುಣಮಟದ ಫಲಿತಾಂಶಗಳಿಗೆ ಸ್ಪಷ್ಟ ಫೋಟೋವನ್ನು ಕಳುಹಿಸಿ' 
                  : 'Send clear photo for best results'}
              </p>
            </div>
          </div>

          {/* Prescription Analysis Modal */}
          {showPrescriptionModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-semibold text-xl text-[var(--primary)]">
                    {lang === 'kn' ? 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ವಿಶ್ಲೇಷಣೆ' : 'Prescription Analysis'}
                  </h3>
                  <button onClick={clearPrescription} className="p-2 hover:bg-gray-100 rounded-full">
                    <X size={20} />
                  </button>
                </div>

                {/* Preview Image */}
                {prescriptionPreview && (
                  <div className="mb-4 rounded-lg overflow-hidden border border-[var(--border)]">
                    <img 
                      src={prescriptionPreview} 
                      alt="Prescription preview" 
                      className="w-full max-h-64 object-contain"
                    />
                  </div>
                )}

                {/* Analyze Button or Loading */}
                {!prescriptionResult && !isAnalyzingPrescription && (
                  <button
                    onClick={analyzePrescription}
                    className="w-full py-3 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles size={18} />
                    {lang === 'kn' ? 'ವಿಶ್ಲೇಷಿಸು' : 'Analyze Prescription'}
                  </button>
                )}

                {isAnalyzingPrescription && (
                  <div className="text-center py-8">
                    <MorphingSquare size={60} />
                    <p className="text-[var(--text2)] mt-4">
                      {lang === 'kn' ? 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಓದಲಾಗುತ್ತಿದೆ...' : 'Reading prescription...'}
                    </p>
                  </div>
                )}

                {/* Analysis Results */}
                {prescriptionResult && (
                  <div className="space-y-4">
                    {/* Empty Result Fallback */}
                    {!prescriptionResult.medicines?.length && !prescriptionResult.instructions && !prescriptionResult.doctorName && (
                      <div className="text-center py-6 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-sm text-gray-500">
                          {lang === 'kn' ? 'ಕ್ಷಮಿಸಿ, ಈ ಚಿತ್ರದಲ್ಲಿ ದತ್ತಾಂಶವನ್ನು ಕಂಡುಹಿಡಿಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ಪಷ್ಟವಾದ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.' : 'Sorry, could not find any readable data in this image. Please try a clearer photo.'}
                        </p>
                      </div>
                    )}

                    {/* Medicines Section */}
                    {prescriptionResult.medicines && prescriptionResult.medicines.length > 0 && (
                      <div className="bg-[var(--surface)] rounded-lg p-4">
                        <h4 className="font-semibold text-[var(--primary)] mb-3">
                          {lang === 'kn' ? '💊 ಔಷಧಿಗಳು' : '💊 Medicines'}
                        </h4>
                        <ul className="space-y-2">
                          {prescriptionResult.medicines.map((med, idx) => (
                            <li key={idx} className="text-sm text-[var(--text2)] p-3 bg-white rounded-lg border-l-4 border-[var(--accent)] shadow-sm">
                              <div className="font-bold text-[var(--primary)]">{med.name}</div>
                              {med.dosage && med.frequency && (
                                <div className="text-xs text-[var(--text3)] mt-1">
                                  {med.dosage} • {med.frequency}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Instructions Section */}
                    {prescriptionResult.instructions && (
                      <div className="bg-[var(--surface)] rounded-lg p-4">
                        <h4 className="font-semibold text-[var(--primary)] mb-3">
                          {lang === 'kn' ? '📋 ನಿರ್ದೇಶನಗಳು' : '📋 Instructions'}
                        </h4>
                        <p className="text-sm text-[var(--text2)] whitespace-pre-wrap">
                          {prescriptionResult.instructions}
                        </p>
                      </div>
                    )}

                    {/* Doctor Name */}
                    {prescriptionResult.doctorName && (
                      <div className="bg-[var(--surface)] rounded-lg p-4">
                        <h4 className="font-semibold text-[var(--primary)] mb-1">
                          {lang === 'kn' ? '👨‍⚕️ ವೈದ್ಯರು' : '👨‍⚕️ Doctor'}
                        </h4>
                        <p className="text-sm text-[var(--text2)]">{prescriptionResult.doctorName}</p>
                      </div>
                    )}

                    {/* Disclaimer */}
                    <div className="p-3 bg-warning/10 rounded-lg">
                      <p className="text-xs text-[var(--text3)]">
                        {lang === 'kn' 
                          ? '⚠️ AI ಅನುಮಾನಗಳಿರುವ ಪದಗಳನ್ನು ಹೊರತರಿಸುತ್ತದೆ. ಸಂದೇಹವಿದ್ದರೆ ಮೂಲ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ನೊಂದಿಗೆ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.' 
                          : '⚠️ AI flags uncertain words. Contact doctor with original prescription if in doubt.'}
                      </p>
                    </div>

                    <button
                      onClick={clearPrescription}
                      className="w-full py-3 border-2 border-[var(--primary)] text-[var(--primary)] font-semibold rounded-lg transition-colors"
                    >
                      {lang === 'kn' ? 'ಮುಚ್ಚು' : 'Close'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
