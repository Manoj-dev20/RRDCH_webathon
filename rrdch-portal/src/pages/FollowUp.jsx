import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from '../firebase';
import { 
  Phone, Search, Calendar, ArrowRight, Loader, AlertCircle, 
  Upload, FileText, Sparkles, X, User, Clock, Stethoscope 
} from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { t } from '../data/translations';
import { getDepartmentName } from '../data/departments';
import { BACKEND_URL } from '../config';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import MorphingSquare from '../components/MorphingSquare';

export default function FollowUp() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  // Prescription Reader state
  const [prescriptionPreview, setPrescriptionPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSearch = async () => {
    if (!phone || phone.length !== 10) return;
    setIsLoading(true);
    setHasSearched(true);
    setError(null);
    try {
      const snapshot = await get(ref(db, `appointments/${phone}`));
      if (snapshot.exists()) {
        const list = Object.entries(snapshot.val()).map(([t, d]) => ({ token: t, ...d }));
        setAppointments(list.sort((a,b) => b.bookedAt - a.bookedAt));
      }
    } catch (err) { setError(err.message); }
    finally { setIsLoading(false); }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPrescriptionPreview(reader.result);
        setResult(null);
        setShowModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyze = async () => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/prescription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: prescriptionPreview })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(lang === 'kn' ? 'ವಿಫಲವಾಗಿದೆ' : 'Analysis failed');
    } finally { setIsAnalyzing(false); }
  };

  const calculateBookingDate = () => {
    if (!result?.durationDays) return new Date().toISOString().split('T')[0];
    const date = new Date();
    date.setDate(date.getDate() + (parseInt(result.durationDays) || 7) + 1);
    return date.toISOString().split('T')[0];
  };

  const handleSmartBooking = () => {
    const date = calculateBookingDate();
    const dept = result.suggestedDept || 'oral-medicine';
    const name = result.patientName || '';
    navigate(`/appointment?dept=${dept}&name=${encodeURIComponent(name)}&date=${date}`);
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Navbar />
      
      <main className="py-12 max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold text-gray-900 mb-4 ${lang === 'kn' ? 'kannada' : ''}`}>
            {t('checkYourAppointment', lang)}
          </h1>
          <p className="text-gray-600">{t('enterRegisteredMobile', lang)}</p>
        </div>

        {/* Existing Search */}
        <div className="bg-white p-2 rounded-2xl shadow-xl shadow-gray-200/50 mb-12 flex flex-col md:flex-row gap-2 border border-blue-50">
          <div className="relative flex-1">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-lg"
              placeholder={lang === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'Mobile Number'}
            />
          </div>
          <button
            onClick={handleSearch}
            className="md:px-10 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-3 shadow-lg"
          >
            {isLoading ? <Loader size={20} className="animate-spin" /> : <Search size={20} />}
            {t('checkQueue', lang)}
          </button>
        </div>

        {/* New Feature: AI Reader */}
        <div className="relative overflow-hidden bg-[var(--accent)] text-white p-10 rounded-3xl shadow-2xl shadow-[var(--accent)]/30 group cursor-pointer" 
             onClick={() => document.getElementById('presc-input').click()}>
          <div className="absolute top-0 right-0 -m-8 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <FileText size={40} className="text-white" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold mb-2">Smart Prescription Reader</h2>
              <p className="opacity-80">Upload your prescription - We'll find your doctor, medicines, and suggest your next visit!</p>
            </div>
            <div className="px-6 py-3 bg-white text-[var(--accent)] font-bold rounded-xl flex items-center gap-2 group-hover:scale-105 transition-all">
              <Upload size={20} />
              {lang === 'kn' ? 'ಅಪ್‌ಲೋಡ್ ಮಾಡಿ' : 'Quick Upload'}
            </div>
          </div>
          <input type="file" id="presc-input" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[1000] bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-[2rem] max-w-2xl w-full my-auto shadow-2xl overflow-hidden relative">
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-900">
                <X size={24} />
              </button>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Sparkles className="text-blue-500" />
                  Prescription Analysis
                </h3>

                {!result && !isAnalyzing && (
                  <div className="space-y-6">
                    <img src={prescriptionPreview} className="w-full h-64 object-cover rounded-2xl shadow-inner border border-gray-100" />
                    <button onClick={analyze} className="w-full py-5 bg-blue-600 text-white font-bold text-lg rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
                      Start Smart Analysis
                    </button>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="py-20 text-center">
                    <MorphingSquare size={70} />
                    <p className="mt-8 text-lg font-medium text-gray-600">Our Llama 4 AI is reading your prescription...</p>
                  </div>
                )}

                {result && (
                  <div className="space-y-6">
                    {/* Top Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                          <User size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">Patient</span>
                        </div>
                        <div className="font-bold text-gray-900">{result.patientName || 'Not found'}</div>
                      </div>
                      <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                        <div className="flex items-center gap-2 text-purple-600 mb-1">
                          <Stethoscope size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">Doctor</span>
                        </div>
                        <div className="font-bold text-gray-900">{result.doctorName || 'Not found'}</div>
                      </div>
                    </div>

                    {/* Medicines */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Prescribed Medicines</h4>
                      {result.medicines?.map((m, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <div>
                            <div className="font-bold text-gray-900">{typeof m === 'string' ? m : m.name}</div>
                            <div className="text-xs text-gray-500">{m.dosage && `${m.dosage} • `}{m.frequency}</div>
                          </div>
                          <Clock size={18} className="text-gray-300" />
                        </div>
                      ))}
                    </div>

                    {/* Smart Suggested Dept */}
                    <div className="bg-green-50 p-5 rounded-2xl border border-green-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-green-600 uppercase mb-1">Suggested for Follow-up</div>
                        <div className="font-bold text-green-900 text-lg">
                          {result.suggestedDept ? getDepartmentName(result.suggestedDept, lang) : 'General Outreach'}
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm">
                        <ArrowRight />
                      </div>
                    </div>

                    {/* Action */}
                    <div className="pt-2">
                       <button 
                         onClick={handleSmartBooking}
                         className="w-full py-5 bg-gray-900 text-white font-bold text-lg rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-4"
                       >
                         <Calendar size={22} />
                         Book Follow-up Appointment
                       </button>
                       <p className="text-center text-[11px] text-gray-400 mt-3 italic">
                         *Auto-calculated for {calculateBookingDate()} based on medication duration.
                       </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
