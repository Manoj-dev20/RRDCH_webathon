import { useState } from 'react';
import { ref, set } from 'firebase/database';
import { db } from '../firebase';
import { Home, User, Phone, FileText, Check, Loader, AlertCircle, Search } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { t } from '../data/translations';
import { useComplaintStatus } from '../hooks/useComplaintStatus';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ComplaintTimeline from '../components/ComplaintTimeline';

const CATEGORIES = [
  { id: 'plumbing', en: 'Plumbing', kn: 'ಪ್ಲಂಬಿಂಗ್' },
  { id: 'electrical', en: 'Electrical', kn: 'ವಿದ್ಯುತ್' },
  { id: 'food-quality', en: 'Food Quality', kn: 'ಆಹಾರ ಗುಣಮಟ್ಟ' },
  { id: 'cleanliness', en: 'Cleanliness', kn: 'ಸ್ವಚ್ಛತೆ' },
  { id: 'safety', en: 'Safety', kn: 'ಸುರಕ್ಷತೆ' },
  { id: 'internet', en: 'Internet', kn: 'ಇಂಟರ್ನೆಟ್' },
  { id: 'wifi', en: 'WiFi', kn: 'ವೈ-ಫೈ' },
  { id: 'other', en: 'Other', kn: 'ಇತರ' }
];

export default function HostelComplaint() {
  const { lang } = useLang();
  const [formData, setFormData] = useState({
    roomNumber: '',
    studentName: '',
    phone: '',
    category: 'plumbing',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);
  const [error, setError] = useState(null);
  
  const [trackId, setTrackId] = useState('');
  const { complaint, loading: trackingLoading } = useComplaintStatus(trackId);

  const generateComplaintId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `HC-${year}-${random}`;
  };

  const handleSubmit = async () => {
    if (!formData.roomNumber || !formData.studentName || !formData.phone || !formData.description) {
      setError(lang === 'kn' ? 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ' : 'Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const complaintId = generateComplaintId();
      const now = Date.now();

      await set(ref(db, `complaints/${complaintId}`), {
        studentName: formData.studentName,
        roomNumber: formData.roomNumber,
        phone: formData.phone,
        category: formData.category,
        description: formData.description,
        status: 'received',
        submittedAt: now,
        updatedAt: now
      });

      setSubmittedId(complaintId);
    } catch (err) {
      console.error('Error submitting complaint:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      received: 'bg-warning/10 text-warning',
      'in-progress': 'bg-accent/10 text-accent',
      resolved: 'bg-success/10 text-success'
    };
    const labels = {
      received: lang === 'kn' ? 'ಸ್ವೀಕರಿಸಲಾಗಿದೆ' : 'Received',
      'in-progress': lang === 'kn' ? 'ಪ್ರಗತಿಯಲ್ಲಿದೆ' : 'In Progress',
      resolved: lang === 'kn' ? 'ಬಗೆಹರಿಸಲಾಗಿದೆ' : 'Resolved'
    };
    const emojis = {
      received: '🟡',
      'in-progress': '🔵',
      resolved: '✅'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.received}`}>
        {emojis[status]} {labels[status] || status}
      </span>
    );
  };

  const getCategoryLabel = (id) => {
    const cat = CATEGORIES.find(c => c.id === id);
    return cat ? (lang === 'kn' ? cat.kn : cat.en) : id;
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className={`font-heading font-semibold text-2xl md:text-3xl text-primary mb-8 text-center ${lang === 'kn' ? 'kannada' : ''}`}>
            {t('hostelComplaint', lang)}
          </h1>

          {submittedId ? (
            /* Success View */
            <div className="card text-center">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="text-success" size={40} />
              </div>
              <h2 className="font-heading font-semibold text-xl text-primary mb-2">
                {t('complaintSubmitted', lang)}
              </h2>
              <p className="text-text-secondary mb-4">{t('yourComplaintId', lang)}</p>
              <p className="text-4xl font-heading font-bold text-accent mb-6">{submittedId}</p>
              <p className="text-sm text-text-muted mb-6">
                {lang === 'kn' ? 'ದಯವಿಟ್ಟು ಈ ID ಯನ್ನು ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಮಾಡಿ' : 'Please screenshot this ID'}
              </p>
              <button
                onClick={() => {
                  setSubmittedId(null);
                  setFormData({ roomNumber: '', studentName: '', phone: '', category: 'plumbing', description: '' });
                }}
                className="btn btn-primary"
              >
                {lang === 'kn' ? 'ಮತ್ತೊಂದು ದೂರು' : 'File Another Complaint'}
              </button>
            </div>
          ) : (
            /* Complaint Form */
            <div className="card mb-8">
              <h2 className="font-heading font-semibold text-xl text-primary mb-6">
                {t('fileComplaint', lang)}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    <Home size={16} className="inline mr-1" />
                    {t('roomNumber', lang)}
                  </label>
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="input"
                    placeholder={lang === 'kn' ? 'ಉದಾ: B-204' : 'e.g., B-204'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    <User size={16} className="inline mr-1" />
                    {t('studentName', lang)}
                  </label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    <Phone size={16} className="inline mr-1" />
                    {t('mobileNumber', lang)}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className="input"
                    placeholder={lang === 'kn' ? '10 ಅಂಕೆಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : '10-digit mobile number'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    {t('category', lang)}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {lang === 'kn' ? cat.kn : cat.en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    <FileText size={16} className="inline mr-1" />
                    {t('description', lang)}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input min-h-[100px] resize-y"
                    rows={4}
                    placeholder={lang === 'kn' ? 'ದಯವಿಟ್ಟು ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ...' : 'Please describe the issue...'}
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-danger/10 text-danger rounded-lg flex items-center gap-2">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn btn-accent w-full mt-6 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader size={20} className="animate-spin mr-2" />
                    {t('loading', lang)}
                  </>
                ) : (
                  t('submitComplaint', lang)
                )}
              </button>
            </div>
          )}

          {/* Complaint Tracker */}
          <div className="card">
            <h2 className="font-heading font-semibold text-xl text-primary mb-6">
              {t('trackComplaint', lang)}
            </h2>

            <div className="flex gap-4 mb-6">
              <input
                type="text"
                value={trackId}
                onChange={(e) => setTrackId(e.target.value.toUpperCase())}
                className="input flex-1"
                placeholder={t('enterComplaintId', lang)}
              />
              <button
                onClick={() => {}}
                disabled={!trackId}
                className="btn btn-primary disabled:opacity-50"
              >
                <Search size={20} />
              </button>
            </div>

            {trackingLoading ? (
              <div className="text-center py-4">
                <Loader size={24} className="animate-spin mx-auto" />
              </div>
            ) : complaint ? (
              <div className="space-y-6">
                {/* Complaint Summary Card */}
                <div className="bg-surface rounded-lg p-4 border border-[var(--border)]">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {getStatusBadge(complaint.status)}
                    <span className="text-sm text-text-muted">
                      {getCategoryLabel(complaint.category)}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mb-2">
                    {lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿ: ' : 'Student: '} {complaint.studentName}
                  </p>
                  <p className="text-sm text-text-secondary mb-2">
                    {lang === 'kn' ? 'ಕೊಠಡಿ: ' : 'Room: '} {complaint.roomNumber}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {lang === 'kn' ? 'ಸಲ್ಲಿಸಿದ ದಿನಾಂಕ: ' : 'Submitted: '}
                    {new Date(complaint.submittedAt).toLocaleString(lang === 'kn' ? 'kn-IN' : 'en-IN')}
                  </p>
                </div>

                {/* Complaint Timeline (Feature 4) */}
                <div>
                  <h3 className="font-semibold text-[var(--primary)] mb-4">
                    {lang === 'kn' ? 'ದೂರು ಸ್ಥಿತಿ ಟ್ರ್ಯಾಕರ್' : 'Complaint Status Tracker'}
                  </h3>
                  <ComplaintTimeline status={complaint.status || 'received'} submittedAt={complaint.submittedAt} />
                </div>

                {/* Action Hints */}
                <div className="bg-[var(--surface)] rounded-lg p-4">
                  {complaint.status === 'received' && (
                    <p className="text-sm text-[var(--text2)]">
                      {lang === 'kn' 
                        ? 'ನಿಮ್ಮ ದೂರು ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ನಾವು ಶೀಘ್ರದಲ್ಲೇ ಕ್ರಮ ಕೈಗೊಳ್ಳುತ್ತೇವೆ.' 
                        : 'Your complaint has been received. We will take action soon.'}
                    </p>
                  )}
                  {complaint.status === 'in-progress' && (
                    <p className="text-sm text-[var(--text2)]">
                      {lang === 'kn' 
                        ? 'ನಿಮ್ಮ ದೂರಿನ ಮೇಲೆ ಕೆಲಸ ನಡೆಯುತ್ತಿದೆ. ವಾರ್ಡನ್ ಅವರು ತುರ್ತು ದೂರಿಗೆ ಒಂದು ತಾಸಿನೊಳಗೆ ಭೇಟಿ ನೀಡುತ್ತಾರೆ.' 
                        : 'Work is in progress on your complaint. Warden visits urgent complaints within 1 hour.'}
                    </p>
                  )}
                  {complaint.status === 'resolved' && (
                    <p className="text-sm text-[var(--text2)]">
                      {lang === 'kn' 
                        ? 'ನಿಮ್ಮ ದೂರು ಬಗೆಹರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಎರಡು ದಿನಗಳಲ್ಲಿ ಇನ್ನೊಂದು ದೂರು ಸಲ್ಲಿಸಬೇಡಿ.' 
                        : 'Your complaint has been resolved. Please do not file another complaint within 2 days.'}
                    </p>
                  )}
                </div>
              </div>
            ) : trackId ? (
              <p className="text-center text-text-muted py-4">
                {lang === 'kn' ? 'ದೂರು ಕಂಡುಬಂದಿಲ್ಲ' : 'No complaint found'}
              </p>
            ) : null}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
