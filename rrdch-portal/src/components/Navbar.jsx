import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Phone, Mail, Clock, Calendar } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { t } from '../data/translations';
import { DEPARTMENTS } from '../data/departments';

// Departments dropdown data
const DEPARTMENTS_LIST = [
  { code: 'oral-medicine', name: 'Oral Medicine & Radiology' },
  { code: 'conservative-dentistry', name: 'Conservative Dentistry' },
  { code: 'periodontology', name: 'Periodontology' },
  { code: 'pedodontics', name: 'Pedodontics' },
  { code: 'orthodontics', name: 'Orthodontics' },
  { code: 'oral-surgery', name: 'Oral Surgery' },
  { code: 'prosthetics', name: 'Prosthodontics' },
  { code: 'public-health', name: 'Public Health Dentistry' },
  { code: 'oral-pathology', name: 'Oral Pathology' },
  { code: 'implantology', name: 'Implantology' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const { lang, toggle } = useLang();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const mainNavLinks = [
    { path: '/', label: t('home', lang) },
    { 
      path: '/departments', 
      label: t('departments', lang),
      hasDropdown: true,
      dropdownItems: DEPARTMENTS_LIST.map(d => ({
        path: `/departments?dept=${d.code}`,
        label: d.name
      }))
    },
    { path: '/appointment', label: t('appointments', lang) },
    { path: '/queue', label: t('queue', lang) },
    { path: '/academics', label: t('academics', lang) },
    { path: '/contact', label: t('contact', lang) },
  ];

  const mobileLinks = [
    { path: '/', label: t('home', lang) },
    { path: '/departments', label: t('departments', lang) },
    { path: '/appointment', label: t('appointments', lang) },
    { path: '/queue', label: t('queue', lang) },
    { path: '/academics', label: t('academics', lang) },
    { path: '/about', label: t('about', lang) },
    { path: '/admissions', label: t('admissions', lang) },
    { path: '/contact', label: t('contact', lang) },
    { path: '/followup', label: lang === 'kn' ? 'ಫಾಲೋ-ಅಪ್' : 'Follow Up' },
    { path: '/hostel-complaint', label: t('hostelComplaint', lang) },
    { path: '/news', label: t('news', lang) },
  ];

  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-primary text-white/90 text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center gap-8">
          <span className="flex items-center gap-2">
            <Phone size={12} />
            +91-80-2843 7150
          </span>
          <span className="flex items-center gap-2">
            <Mail size={12} />
            principalrrdch@gmail.com
          </span>
          <span className="flex items-center gap-2">
            <Clock size={12} />
            OPD: Mon–Sat, 9AM–4PM
          </span>
        </div>
      </div>

      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="sticky top-0 z-50 bg-white shadow-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg"
              >
                <span className="text-white font-bold text-lg">R</span>
              </motion.div>
              <div className="hidden sm:block">
                <span className="font-heading font-semibold text-primary text-lg">RRDCH</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {mainNavLinks.map((link) => (
                <div key={link.path} className="relative">
                  {link.hasDropdown ? (
                    <div 
                      className="relative"
                      onMouseEnter={() => setIsDeptDropdownOpen(true)}
                      onMouseLeave={() => setIsDeptDropdownOpen(false)}
                    >
                      <button
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                          isActive(link.path) || location.pathname.includes('/departments')
                            ? 'text-primary bg-primary/10'
                            : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                        }`}
                      >
                        {link.label}
                        <ChevronDown size={14} className={`transition-transform ${isDeptDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {isDeptDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-border py-2 z-50"
                          >
                            {DEPARTMENTS_LIST.map((dept) => (
                              <Link
                                key={dept.code}
                                to={`/departments?dept=${dept.code}`}
                                className="block px-4 py-2 text-sm text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
                              >
                                {dept.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(link.path)
                          ? 'text-primary bg-primary/10'
                          : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right Section: Book Appointment CTA + Language Toggle + Mobile Menu */}
            <div className="flex items-center gap-2">
              {/* Book Appointment CTA - Desktop */}
              <Link
                to="/appointment"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-accent-warm hover:bg-orange-600 text-white font-medium text-sm rounded-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <Calendar size={16} />
                {lang === 'kn' ? 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್' : 'Book Appointment'}
              </Link>

              {/* Language Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggle}
                className="px-3 py-1.5 rounded-md bg-accent/10 text-accent font-medium text-sm hover:bg-accent/20 transition-colors"
              >
                {lang === 'en' ? 'ಕನ್ನಡ' : 'EN'}
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Fluid Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden"
            >
              <div className="bg-primary text-white">
                <div className="px-4 py-6 space-y-2">
                  {mobileLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
                          isActive(link.path)
                            ? 'bg-white/20 text-white'
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                  
                  {/* Book Appointment Button in Mobile Menu */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: mobileLinks.length * 0.05 }}
                    className="pt-4 border-t border-white/20"
                  >
                    <Link
                      to="/appointment"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-accent-warm text-white font-medium text-lg rounded-lg"
                    >
                      <Calendar size={20} />
                      {lang === 'kn' ? 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ' : 'Book Appointment'}
                    </Link>
                  </motion.div>

                  {/* Kannada Toggle at Bottom */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: (mobileLinks.length + 1) * 0.05 }}
                    className="pt-4 text-center"
                  >
                    <button
                      onClick={() => {
                        toggle();
                        setIsMenuOpen(false);
                      }}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {lang === 'en' ? 'ಕನ್ನಡದಲ್ಲಿ ವೀಕ್ಷಿಸಿ' : 'View in English'}
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
