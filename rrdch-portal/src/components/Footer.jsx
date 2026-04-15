import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Linkedin, Twitter, Clock } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { t } from '../data/translations';

export default function Footer() {
  const { lang } = useLang();

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - RRDCH Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg">R</span>
              </div>
              <span className="font-heading font-semibold text-lg">RRDCH</span>
            </Link>
            <p className="text-white/70 text-sm mb-4">
              {lang === 'kn' 
                ? '1992 ರಿಂದ ನಂಬಿಕಸ್ತ ದಂತ ಆರೋಗ್ಯ ಸೇವೆ'
                : 'Trusted dental care since 1992'}
            </p>
            {/* Accreditation Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium">DCI</span>
              <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium">NAAC</span>
              <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium">ISO 9001</span>
            </div>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-colors">
                <Linkedin size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-colors">
                <Youtube size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-colors">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Column 2 - Patient Services */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">
              {lang === 'kn' ? 'ರೋಗಿ ಸೇವೆಗಳು' : 'Patient Services'}
            </h3>
            <div className="space-y-2">
              <Link to="/appointment" className="block text-white/70 hover:text-white transition-colors text-sm">
                {t('bookAppointment', lang)}
              </Link>
              <Link to="/queue" className="block text-white/70 hover:text-white transition-colors text-sm">
                {lang === 'kn' ? 'ಕ್ಯೂ ಪರಿಶೀಲಿಸಿ' : 'Check Queue'}
              </Link>
              <Link to="/followup" className="block text-white/70 hover:text-white transition-colors text-sm">
                {lang === 'kn' ? 'ಫಾಲೋ-ಅಪ್ / ರಿಮೈಂಡರ್‌ಗಳು' : 'Follow-up / Reminders'}
              </Link>
              <Link to="/hostel-complaint" className="block text-white/70 hover:text-white transition-colors text-sm">
                {t('hostelComplaint', lang)}
              </Link>
              <Link to="/contact" className="block text-white/70 hover:text-white transition-colors text-sm">
                {t('contact', lang)}
              </Link>
            </div>
          </div>

          {/* Column 3 - College Info */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">
              {lang === 'kn' ? 'ಕಾಲೇಜು ಮಾಹಿತಿ' : 'College Info'}
            </h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-white/70 hover:text-white transition-colors text-sm">
                {lang === 'kn' ? 'RRDCH ಬಗ್ಗೆ' : 'About RRDCH'}
              </Link>
              <Link to="/departments" className="block text-white/70 hover:text-white transition-colors text-sm">
                {t('departments', lang)}
              </Link>
              <Link to="/academics" className="block text-white/70 hover:text-white transition-colors text-sm">
                {lang === 'kn' ? 'ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಪಠ್ಯಕ್ರಮ' : 'Academics & Courses'}
              </Link>
              <Link to="/admissions" className="block text-white/70 hover:text-white transition-colors text-sm">
                {t('admissions', lang)}
              </Link>
              <Link to="/news" className="block text-white/70 hover:text-white transition-colors text-sm">
                {lang === 'kn' ? 'ಅ연구 ಮತ್ತು ಪ್ರಕಟಣೆಗಳು' : 'Research & Publications'}
              </Link>
              <Link to="/about" className="block text-white/70 hover:text-white transition-colors text-sm">
                {lang === 'kn' ? 'ಸೌಲಭ್ಯಗಳು' : 'Facilities'}
              </Link>
            </div>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">
              {t('contact', lang)}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-white/70">
                <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  No.14, Ramohalli Cross,<br />
                  Kumbalgodu, Mysore Road,<br />
                  Bengaluru - 560 074
                </p>
              </div>
              <a href="tel:+91-80-2843-7150" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors text-sm">
                <Phone size={18} />
                +91-80-2843 7150
              </a>
              <a href="tel:+91-80-2843-7468" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors text-sm">
                <Phone size={18} />
                +91-80-2843 7468
              </a>
              <a href="mailto:principalrrdch@gmail.com" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors text-sm">
                <Mail size={18} />
                principalrrdch@gmail.com
              </a>
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <Clock size={18} />
                <span>OPD: Mon–Sat, 9AM–4PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            © 2026 RajaRajeswari Dental College & Hospital. {t('rightsReserved', lang)}.
          </p>
          <p className="text-white/60 text-sm">
            {lang === 'kn' 
              ? 'RGUHS, ಬೆಂಗಳೂರುಗೆ ಸಂಬಂಧಿತ | DCI ಮೂಲಕ ಗುರುತಿಸಲ್ಪಟ್ಟಿದೆ'
              : 'Affiliated to RGUHS, Bangalore | Recognised by DCI'}
          </p>
        </div>
      </div>
    </footer>
  );
}
