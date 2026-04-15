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
    const dept = result?.suggestedDept || 'oral-medicine';
    const name = result?.patientName || '';
    navigate(`/appointment?dept=${dept}&name=${encodeURIComponent(name)}&date=${date}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-12 max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold text-gray-900 mb-4 ${lang === 'kn' ? 'kannada' : ''}`}>
            {t('checkYourAppointment', lang)}
          </h1>
          <p className="text-gray-600 font-medium">{t('enterRegisteredMobile', lang)}</p>
        </div>

        {/* Existing Search */}
        <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 mb-16 flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-lg"
              placeholder={lang === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'Mobile Number'}
            />
          </div>
          <button
            onClick={handleSearch}
            className="md:px-10 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg flex items-center justify-center gap-3"
          >
            {isLoading ? <Loader size={20} className="animate-spin" /> : <Search size={20} />}
            {t('checkQueue', lang)}
          </button>
        </div>

        {/* AI Reader Feature */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-10 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center gap-8 cursor-pointer group" 
             onClick={() => document.getElementById('presc-input').click()}>
          <div className="absolute top-0 right-0 -m-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
          <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md shrink-0">
            <Sparkles size={48} className="text-white animate-pulse" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">Smart Prescription AI</h2>
            <p className="text-blue-100 text-lg">Instant follow-up booking & medicine analysis from your prescription photo.</p>
          </div>
          <div className="md:ml-auto flex flex-col items-center">
             <div className="px-8 py-4 bg-white text-blue-700 font-black rounded-2xl shadow-xl flex items-center gap-2 group-hover:bg-blue-50 transition-colors">
                <Upload size={22} />
                UPLOAD NOW
             </div>
             <p className="mt-2 text-[10px] text-blue-200">Supports Clear Photos & PDFs</p>
          </div>
          <input type="file" id="presc-input" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[1000] bg-gray-900/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-[3rem] max-w-2xl w-full my-auto shadow-2xl overflow-hidden relative">
              <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-full transition-all">
                <X size={24} />
              </button>

              <div className="p-10">
                <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Sparkles className="text-blue-600" size={20} />
                  </div>
                  AI Clinical Insights
                </h3>

                {!result && !isAnalyzing && (
                  <div className="space-y-8 text-center">
                    <div className="relative group rounded-3xl overflow-hidden shadow-inner border-4 border-gray-50">
                        <img src={prescriptionPreview} className="w-full h-72 object-contain" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                    </div>
                    <button onClick={analyze} className="w-full py-6 bg-blue-600 text-white font-black text-xl rounded-2xl shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all">
                      ANALYZE DOCUMENT
                    </button>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="py-24 text-center">
                    <MorphingSquare size={80} />
                    <p className="mt-10 text-xl font-bold text-gray-700">Llama 4 Vision is transcribing...</p>
                    <p className="text-gray-400 text-sm mt-2">Identifying patient, doctor & medicines</p>
                  </div>
                )}

                {result && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                          <User size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Patient</span>
                        </div>
                        <div className="font-bold text-gray-900 text-lg">{result?.patientName || 'Unreadable'}</div>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                        <div className="flex items-center gap-2 text-indigo-600 mb-2">
                          <Stethoscope size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Doctor</span>
                        </div>
                        <div className="font-bold text-gray-900 text-lg">{result?.doctorName || 'Unreadable'}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Identified Medications</h4>
                      <div className="grid gap-3">
                        {result?.medicines?.map((m, i) => (
                          <div key={i} className="group p-5 bg-white rounded-2xl border-2 border-gray-50 flex items-center justify-between hover:border-blue-100 transition-colors">
                            <div>
                              <div className="font-black text-gray-900">{typeof m === 'string' ? m : m.name}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{m.dosage || ''} • {m.frequency || ''}</div>
                            </div>
                            <Clock size={20} className="text-gray-200 group-hover:text-blue-300 transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-green-50 border border-green-100 flex items-center justify-between">
                         <div>
                            <div className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Clinic Suggestion</div>
                            <div className="font-bold text-green-900 text-xl">
                               {result?.suggestedDept ? getDepartmentName(result.suggestedDept, lang) : 'General OPD'}
                            </div>
                         </div>
                         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-green-500 shadow-sm border border-green-50">
                            <ArrowRight size={24} />
                         </div>
                    </div>

                    <div className="pt-2">
                       <button 
                         onClick={handleSmartBooking}
                         className="w-full py-6 bg-gray-900 text-white font-black text-xl rounded-2xl shadow-2xl flex items-center justify-center gap-4 hover:bg-black hover:scale-[1.02] transition-all"
                       >
                         <Calendar size={28} />
                         BOOK FOLLOW-UP APPOINTMENT
                       </button>
                       <p className="text-center text-[11px] text-gray-400 mt-4 font-medium italic">
                         *Automated booking set for {calculateBookingDate()}
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
