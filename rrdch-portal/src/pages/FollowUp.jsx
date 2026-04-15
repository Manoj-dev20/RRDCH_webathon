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

  // Prescription Reader state
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

  // Prescription Reader Handlers
  const handlePrescriptionUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPrescriptionPreview(reader.result);
        setShowPrescriptionModal(true);
      };
      reader.readAsDataURL(file);
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
    setPrescriptionPreview(null);
    setPrescriptionResult(null);
    setShowPrescriptionModal(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className={`font-heading font-semibold text-3xl text-primary mb-2 text-center ${lang === 'kn' ? 'kannada' : ''}`}>
            {t('checkYourAppointment', lang)}
          </h1>
          <p className="text-gray-600 text-center mb-8">
            {t('enterRegisteredMobile', lang)}
          </p>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  placeholder={lang === 'kn' ? '10 ಅಂಕೆಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : '10-digit mobile number'}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isLoading || phone.length !== 10}
                className="px-8 py-3 bg-[var(--accent)] text-white font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader size={20} className="animate-spin" /> : <Search size={20} />}
                {t('checkQueue', lang)}
              </button>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="p-8 border-2 border-dashed border-[var(--accent)]/30 rounded-2xl text-center">
            <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-[var(--accent)]" size={32} />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-2">
              {lang === 'kn' ? 'AI ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಓದುಗ' : 'AI Prescription Reader'}
            </h3>
            <p className="text-gray-600 mb-4">
              {lang === 'kn' ? 'ನಿಮ್ಮ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ' : 'Upload your prescription - AI reads it!'}
            </p>

            <label className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white font-semibold rounded-lg cursor-pointer">
              <Upload size={18} />
              {lang === 'kn' ? 'ಅಪ್‌ಲೋಡ್ ಮಾಡಿ' : 'Upload Prescription'}
              <input type="file" accept="image/*" onChange={handlePrescriptionUpload} className="hidden" />
            </label>
          </div>

          {/* Modal */}
          {showPrescriptionModal && (
            <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
                <div className="flex justify-between mb-4">
                  <h3 className="text-xl font-bold">Analysis</h3>
                  <button onClick={clearPrescription}><X size={24}/></button>
                </div>

                {prescriptionPreview && !prescriptionResult && (
                  <img src={prescriptionPreview} className="w-full max-h-64 object-contain rounded-lg mb-4" />
                )}

                {!prescriptionResult && !isAnalyzingPrescription && (
                  <button onClick={analyzePrescription} className="w-full py-4 bg-[var(--accent)] text-white font-bold rounded-xl">
                    {lang === 'kn' ? 'ವಿಶ್ಲೇಷಿಸು' : 'Analyze Prescription'}
                  </button>
                )}

                {isAnalyzingPrescription && (
                  <div className="text-center py-12">
                    <MorphingSquare size={60} />
                    <p className="mt-4">Reading...</p>
                  </div>
                )}

                {prescriptionResult && (
                  <div className="space-y-4">
                    {prescriptionResult.medicines?.length > 0 ? (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h4 className="font-bold text-[var(--accent)] mb-2">Medicines</h4>
                        <ul className="space-y-2">
                          {prescriptionResult.medicines.map((m, i) => (
                            <li key={i} className="p-3 bg-white border-l-4 border-[var(--accent)] rounded shadow-sm">
                              <span className="font-bold">{typeof m === 'string' ? m : m.name}</span>
                              {m.dosage && <span className="text-gray-500 text-xs ml-2">{m.dosage}</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="p-6 bg-orange-50 rounded-xl text-center">
                        <p className="font-bold text-orange-800">No Data Found</p>
                        <details className="mt-4">
                           <summary className="text-[10px] cursor-pointer">Diagnostics</summary>
                           <pre className="text-[8px] mt-2 whitespace-pre-wrap">{JSON.stringify(prescriptionResult, null, 2)}</pre>
                        </details>
                      </div>
                    )}

                    <button onClick={clearPrescription} className="w-full py-3 border border-gray-300 rounded-lg">Close</button>
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
