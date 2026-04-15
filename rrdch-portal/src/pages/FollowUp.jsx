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
      setError(lang === 'kn' ? 'ವಿಫಲವಾಗಿದೆ' : 'Prescription analysis failed');
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
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      
      <main className="py-12 max-w-4xl mx-auto px-4">
        {/* Header Style as per Screenshot */}
        <div className="text-center mb-10">
          <h1 className={`text-[32px] font-bold text-[#1a365d] mb-3 ${lang === 'kn' ? 'kannada' : ''}`}>
            {t('checkYourAppointment', lang)}
          </h1>
          <p className="text-gray-500 text-sm">{t('enterRegisteredMobile', lang)}</p>
        </div>

        {/* Search Input Card as per Screenshot */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm mb-10 border border-gray-100/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-lg placeholder:text-gray-300"
                placeholder="6666666666"
              />
            </div>
            <button
              onClick={handleSearch}
              className="md:px-8 py-4 bg-[#1a4f6e] text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-sm"
            >
              {isLoading ? <Loader size={20} className="animate-spin" /> : <Search size={20} />}
              {t('checkQueue', lang)}
            </button>
          </div>

          {/* Error Message Style: Light Pink Box */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-500 text-sm">
              <AlertCircle size={20} />
              {error}
            </div>
          )}
        </div>

        {/* Search Results as per Screenshot */}
        {hasSearched && (
          <div className="mb-10">
            <h3 className="text-sm font-bold text-[#1a365d] mb-6 px-2 uppercase tracking-wide">Your Appointments</h3>
            {appointments.length > 0 ? (
              <div className="space-y-6">
                {appointments.map((apt) => (
                  <div key={apt.token} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-2">
                           <span className="text-3xl font-bold text-[#2c7a7b]">{apt.token}</span>
                           <span className="px-3 py-1 bg-[#e6fffa] text-[#2c7a7b] text-[10px] font-bold rounded-full uppercase">Confirmed</span>
                        </div>
                        <div className="font-bold text-[#1a365d] text-lg">{getDepartmentName(apt.department, lang)}</div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-2 font-medium">
                           <span className="flex items-center gap-1"><Calendar size={14} /> {apt.date}</span>
                           <span>•</span>
                           <span>Booked: {new Date(apt.bookedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-auto">
                       <WhatsAppButton 
                          phone={apt.phone || phone} 
                          token={apt.token} 
                          department={getDepartmentName(apt.department, 'en')} 
                          date={apt.date} 
                       />
                    </div>
                  </div>
                ))}
              </div>
            ) : !isLoading && (
              <div className="bg-white p-12 rounded-[2.5rem] text-center border-2 border-dashed border-gray-100">
                <p className="text-gray-400 text-sm mb-4">No appointments found for this number</p>
                <button onClick={() => navigate('/appointment')} className="font-bold text-blue-600 hover:underline">
                   {t('bookOneNow', lang)}
                </button>
              </div>
            )}
          </div>
        )}

        {/* AI Prescription Reader Card as per Screenshot (at the bottom) */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center text-center cursor-pointer group hover:bg-gray-50/50 transition-all"
             onClick={() => document.getElementById('presc-input').click()}>
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <FileText size={32} />
          </div>
          <h2 className="text-xl font-bold text-[#1a365d] mb-3">AI Prescription Reader</h2>
          <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">Upload your prescription photo and we'll automatically find the best follow-up time for you.</p>
          <div className="w-full max-w-[200px] border-2 border-dashed border-gray-100 py-3 rounded-xl text-gray-300 group-hover:border-blue-200 group-hover:text-blue-400 transition-all">
             <Upload size={24} className="mx-auto" />
          </div>
          <input type="file" id="presc-input" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </div>

        {/* Modal (Preserved Functionality) */}
        {showModal && (
          <div className="fixed inset-0 z-[1000] bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white rounded-[2.5rem] max-w-2xl w-full my-auto shadow-2xl overflow-hidden relative border border-gray-100">
               <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 p-3 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-full transition-all">
                 <X size={24} />
               </button>

               <div className="p-10">
                 <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                   <Sparkles className="text-blue-500" />
                   AI Prescription Insights
                 </h3>

                 {!result && !isAnalyzing && (
                   <div className="space-y-8 text-center">
                     <img src={prescriptionPreview} className="w-full h-72 object-contain bg-gray-50 rounded-3xl" />
                     <button onClick={analyze} className="w-full py-5 bg-[#1a4f6e] text-white font-bold text-xl rounded-2xl shadow-xl hover:opacity-90 transition-all">
                       START ANALYSIS
                     </button>
                   </div>
                 )}

                 {isAnalyzing && (
                   <div className="py-24 text-center">
                     <MorphingSquare size={70} />
                     <p className="mt-10 text-xl font-bold text-gray-700">Reading clinical details...</p>
                   </div>
                 )}

                 {result && (
                   <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                       <div className="bg-gray-50 p-6 rounded-3xl">
                         <span className="text-[10px] font-black uppercase text-blue-400 block mb-1">Patient</span>
                         <div className="font-bold text-gray-900 text-lg">{result?.patientName || 'Found'}</div>
                       </div>
                       <div className="bg-gray-50 p-6 rounded-3xl">
                         <span className="text-[10px] font-black uppercase text-indigo-400 block mb-1">Doctor</span>
                         <div className="font-bold text-gray-900 text-lg">{result?.doctorName || 'Found'}</div>
                       </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Prescribed Medicines</h4>
                        <div className="grid gap-2">
                           {result?.medicines?.map((m, i) => (
                             <div key={i} className="p-4 bg-white border border-gray-50 rounded-2xl flex items-center justify-between">
                                <span className="font-bold text-gray-800">{typeof m === 'string' ? m : m.name}</span>
                                <span className="text-xs text-gray-400">{m.dosage && `${m.dosage}`}</span>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="bg-green-50 p-6 rounded-3xl border border-green-100 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-bold text-green-600 uppercase mb-1">Suggested Dept</div>
                          <div className="font-bold text-green-900 text-xl">
                             {result?.suggestedDept ? getDepartmentName(result.suggestedDept, lang) : 'RRDCH General'}
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded-xl shadow-sm text-green-500">
                           <ArrowRight />
                        </div>
                     </div>

                     <button 
                       onClick={handleSmartBooking}
                       className="w-full py-6 bg-gray-900 text-white font-black text-xl rounded-2xl shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] transition-all"
                     >
                       <Calendar size={28} />
                       BOOK FOLLOW-UP APPOINTMENT
                     </button>
                     <p className="text-center text-[11px] text-gray-400 italic">
                        *AI-calculated follow-up date: {calculateBookingDate()}
                     </p>
                   </div>
                 )}
               </div>
             </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
