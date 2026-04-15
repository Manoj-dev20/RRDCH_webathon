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
    setAppointments([]);
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
    <div className="min-h-screen bg-gray-50/30">
      <Navbar />
      
      <main className="py-12 max-w-4xl mx-auto px-4">
        {/* Previous Header UI */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold text-gray-900 mb-4 ${lang === 'kn' ? 'kannada' : ''}`}>
            {t('checkYourAppointment', lang)}
          </h1>
          <p className="text-gray-600">{t('enterRegisteredMobile', lang)}</p>
        </div>

        {/* Restore Previous Search UI */}
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

        {/* Restore Search Results Display */}
        {hasSearched && (
          <div className="mb-16 space-y-6">
            {appointments.length > 0 ? (
              <div className="grid gap-6">
                {appointments.map((apt) => (
                  <div key={apt.token} className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-50 flex items-center justify-between group hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-inner">
                        {apt.token}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">
                          {getDepartmentName(apt.department, lang)}
                        </div>
                        <div className="font-bold text-gray-900 text-xl">{apt.name}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                           <span className="flex items-center gap-1"><Calendar size={14} /> {apt.date}</span>
                           <span className="flex items-center gap-1 font-bold text-gray-900">
                             {apt.status === 'served' ? '✅ Served' : apt.status === 'serving' ? '🔔 Currently Serving' : '⏳ Waiting'}
                           </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate('/queue')}
                      className="p-4 bg-gray-50 text-gray-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"
                    >
                      <ArrowRight size={24} />
                    </button>
                  </div>
                ))}
              </div>
            ) : !isLoading && (
              <div className="bg-white p-12 rounded-[2.5rem] text-center border-2 border-dashed border-gray-100 shadow-sm">
                <AlertCircle className="mx-auto text-gray-300 mb-6" size={64} />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('noAppointmentsFound', lang)}</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">We couldn't find any historical records for this number. Would you like to schedule one?</p>
                <button 
                  onClick={() => navigate('/appointment')}
                  className="px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all"
                >
                   {t('bookOneNow', lang)}
                </button>
              </div>
            )}
          </div>
        )}

        {/* AI Reader Feature - Balanced as a Discovery Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-700 to-blue-600 text-white p-1 rounded-3xl group shadow-2xl shadow-blue-200 cursor-pointer"
             onClick={() => document.getElementById('presc-input').click()}>
          <div className="bg-gray-900/10 p-10 rounded-[1.4rem] h-full flex flex-col md:flex-row items-center gap-8 backdrop-blur-3xl">
            <div className="absolute top-0 right-0 -m-12 w-64 h-64 bg-white/10 rounded-full blur-[80px] group-hover:bg-white/20 transition-all"></div>
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0 border border-white/30">
               <Sparkles size={40} className="text-white animate-pulse" />
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="inline-block px-3 py-1 bg-yellow-400 text-yellow-900 text-[10px] font-black uppercase rounded-full mb-3 shadow-lg">New AI Feature</div>
              <h2 className="text-2xl font-bold mb-2">Smart Prescription Follow-up</h2>
              <p className="opacity-80">Upload your prescription and our AI will automatically suggest the right department and your next appointment date.</p>
            </div>
            <div className="px-6 py-4 bg-white text-blue-700 font-bold rounded-xl flex items-center gap-3 shadow-2xl group-hover:scale-105 transition-all">
               <Upload size={20} />
               {lang === 'kn' ? 'ಅಪ್‌ಲೋಡ್ ಮಾಡಿ' : 'Quick Analyze'}
            </div>
          </div>
          <input type="file" id="presc-input" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </div>

        {/* Modal (Preserved as is) */}
        {showModal && (
          <div className="fixed inset-0 z-[1000] bg-gray-900/90 backdrop-blur-md flex items-center justify-center p-4">
             <div className="bg-white rounded-[2.5rem] max-w-2xl w-full my-auto shadow-2xl overflow-hidden relative animate-in zoom-in duration-300">
               <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 p-3 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-full transition-all">
                 <X size={24} />
               </button>

               <div className="p-10">
                 <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                   <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                     <Sparkles className="text-blue-600" size={20} />
                   </div>
                   Prescription AI Insights
                 </h3>

                 {!result && !isAnalyzing && (
                   <div className="space-y-8 text-center">
                     <div className="rounded-3xl overflow-hidden border-4 border-gray-50 shadow-inner">
                         <img src={prescriptionPreview} className="w-full h-72 object-contain bg-gray-50" />
                     </div>
                     <button onClick={analyze} className="w-full py-5 bg-blue-600 text-white font-bold text-xl rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
                       Start Smart Analysis
                     </button>
                   </div>
                 )}

                 {isAnalyzing && (
                   <div className="py-24 text-center">
                     <MorphingSquare size={70} />
                     <p className="mt-10 text-xl font-bold text-gray-700">Llama 4 Vision is transcribing...</p>
                   </div>
                 )}

                 {result && (
                   <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                       <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
                         <span className="text-[10px] font-black uppercase text-blue-400 block mb-1">Patient</span>
                         <div className="font-bold text-gray-900">{result?.patientName || 'Unreadable'}</div>
                       </div>
                       <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
                         <span className="text-[10px] font-black uppercase text-indigo-400 block mb-1">Doctor</span>
                         <div className="font-bold text-gray-900">{result?.doctorName || 'Unreadable'}</div>
                       </div>
                     </div>

                     <div className="space-y-3">
                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Medicines</h4>
                       {result?.medicines?.map((m, i) => (
                         <div key={i} className="p-4 bg-white rounded-2xl border-2 border-gray-50 flex items-center justify-between">
                           <div className="font-bold text-gray-900">{typeof m === 'string' ? m : m.name}</div>
                           <Clock size={18} className="text-gray-300" />
                         </div>
                       ))}
                     </div>

                     <div className="p-6 rounded-3xl bg-green-50 border border-green-100 flex items-center justify-between">
                         <div className="font-bold text-green-900 text-lg">
                             {result?.suggestedDept ? getDepartmentName(result.suggestedDept, lang) : 'General Outreach'}
                         </div>
                         <div className="flex items-center gap-1 text-[10px] font-black text-green-600 uppercase">Follow-up Card <ArrowRight size={14}/></div>
                     </div>

                     <button 
                       onClick={handleSmartBooking}
                       className="w-full py-5 bg-gray-900 text-white font-black text-lg rounded-2xl shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] transition-all"
                     >
                       <Calendar size={28} />
                       BOOK FOLLOW-UP NOW
                     </button>
                     <p className="text-center text-[11px] text-gray-400 italic">
                        *AI-calculated date: {calculateBookingDate()}
                     </p>
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
