import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Stethoscope, Building, ArrowRight, GraduationCap, Heart, Languages, MessageSquare, ShieldCheck } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { t } from '../data/translations';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TestimonialsSection from '../components/TestimonialsSection';
import SplineDNA from '../components/SplineDNA';
import ScrollMorphHero from '../components/ui/scroll-morph-hero';
import RRDCHGallerySelector from '../components/RRDCHGallerySelector';

const stats = [
  { icon: Users, value: '450+', labelEn: 'Patients Daily', labelKn: 'ದೈನಂದಿನ ರೋಗಿಗಳು' },
  { icon: Building, value: '30+', labelEn: 'Years Experience', labelKn: 'ವರ್ಷಗಳ ಅನುಭವ' },
  { icon: Stethoscope, value: '250', labelEn: 'Dental Chairs', labelKn: 'ದಂತ ಕುರ್ಳಿಗಳು' },
  { icon: Heart, value: '10', labelEn: 'Departments', labelKn: 'ವಿಭಾಗಗಳು' },
];

// Features 4 content
const features = [
  {
    icon: Calendar,
    title: 'Smart Appointment Booking',
    description: 'Select your symptom, get routed to the right department automatically. No confusion, no misdirection.'
  },
  {
    icon: Users,
    title: 'Live Queue Tracking',
    description: 'Know exactly when your turn is coming. Real-time token updates without refreshing the page.'
  },
  {
    icon: Languages,
    title: 'Kannada & English',
    description: 'Full support for Kannada language. Every patient-facing page works in your native language.'
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp Reminders',
    description: 'Get your appointment confirmation and reminder directly on WhatsApp. No app download needed.'
  },
  {
    icon: GraduationCap,
    title: 'Complete Academic Info',
    description: 'Courses, fees, faculty, timetable, syllabus — everything students need in one place.'
  },
  {
    icon: ShieldCheck,
    title: 'Trusted Since 1992',
    description: 'NAAC A-Grade, DCI Recognised, ISO Certified. 450+ patients served daily.'
  }
];

const newsItems = [
  {
    title: 'Publication Ethics Workshop',
    date: 'Feb 2026',
    description: 'Comprehensive workshop on research ethics and publication standards for dental professionals.'
  },
  {
    title: 'Dental Screening Camp',
    date: 'Jan 2026',
    description: 'Free dental screening for underprivileged children in collaboration with Children of India Foundation.'
  },
  {
    title: 'World AIDS Day Camp',
    date: 'Dec 2025',
    description: 'Oral health awareness and HIV prevention camp marking World AIDS Day.'
  }
];

export default function Home() {
  const { lang } = useLang();

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      {/* Hero Section - With ProgressiveBlur Effect */}
      <section className="relative min-h-screen bg-gradient-to-r from-[#1A5276] to-[#17A589] overflow-hidden">
        {/* Progressive Blur Background Layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1 }}
            className="absolute top-20 left-10 w-96 h-96 bg-white rounded-full blur-[120px]" 
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute bottom-20 right-10 w-80 h-80 bg-accent-warm rounded-full blur-[100px]" 
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - Timeline Animation */}
            <div className="text-center lg:text-left">
              {/* Hero Badge with Blur */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6"
              >
                <span className="text-lg">🏥</span>
                <span className="text-white/90 text-sm font-medium">
                  {lang === 'kn' ? '1992 ರಿಂದ ಬೆಂಗಳೂರಿನ ನಂಬಿಕಸ್ತ ದಂತ ಆರೋಗ್ಯ' : "Bangalore's Trusted Dental Care Since 1992"}
                </span>
              </motion.div>

              {/* Headline with Staggered Animation */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight ${lang === 'kn' ? 'kannada' : ''}`}
              >
                {lang === 'kn' 
                  ? <>ನಿಮ್ಮ ದಂತ ಆರೋಗ್ಯ,<br /><span className="text-amber-300">ಸರಳವಾಗಿ</span></>
                  : <>Your Dental Health,<br /><span className="text-amber-300">Simplified</span></>}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl text-white/90 mb-8 max-w-xl"
              >
                {lang === 'kn' 
                  ? 'ನಿಮಗೂ ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕೂ ವಿಶ್ವ-ದರ್ಜೆಯ ದಂತ ಸೇವೆ. 3 ಕ್ಲಿಕ್‌ಗಳಲ್ಲಿ ಬುಕ್ ಮಾಡಿ. ಕನ್ನಡದಲ್ಲಿ.' 
                  : 'World-class dental care for you and your family. Book in 3 clicks. In Kannada.'}
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link
                  to="/appointment"
                  className="inline-flex items-center justify-center gap-3 bg-accent-warm hover:bg-orange-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-orange-500/30"
                >
                  <Calendar size={24} />
                  {t('bookAppointment', lang)}
                </Link>
                <Link
                  to="/queue"
                  className="inline-flex items-center justify-center gap-3 bg-transparent border-2 border-white text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all hover:bg-white hover:text-primary"
                >
                  <Users size={24} />
                  {t('checkQueue', lang)}
                </Link>
              </motion.div>
            </div>

            {/* Right Content - Spline DNA 3D Model */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <SplineDNA />
              
              {/* Floating Badge */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <ShieldCheck className="text-accent" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-primary">DCI Recognised</p>
                    <p className="text-sm text-text-secondary">NAAC A-Grade</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Badge Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 py-4"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-white/80 text-sm font-medium">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                DCI Recognised
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                NAAC A-Grade
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                ISO 9001
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                Glasgow Affiliated
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center border-b-4 border-b-accent hover:-translate-y-1 transition-transform duration-200"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #EAF4FD, #D5F5E3)' }}>
                  <stat.icon className="text-accent" size={24} />
                </div>
                <p className="text-4xl font-heading font-extrabold text-primary mb-1">{stat.value}</p>
                <p className={`text-text-secondary text-sm font-medium uppercase tracking-wide ${lang === 'kn' ? 'kannada' : ''}`}>
                  {lang === 'kn' ? stat.labelKn : stat.labelEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features 4 Section - 6-Icon Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading font-semibold text-2xl md:text-3xl text-primary mb-4"
            >
              {lang === 'kn' ? 'ನಮ್ಮ ವೈಶಿಷ್ಟ್ಯಗಳು' : 'Why Choose RRDCH?'}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-text-secondary max-w-2xl mx-auto"
            >
              {lang === 'kn' 
                ? 'ನಮ್ಮ ಸೇವೆಗಳು ನಿಮ್ಮ ದಂತ ಆರೋಗ್ಯವನ್ನು ಸರಳವಾಗಿ ಮತ್ತು ಪರಿಣಾಮಕಾರಿಯಾಗಿ ಮಾಡುತ್ತವೆ'
                : 'Our services make your dental health simple, accessible, and effective'}
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(26, 82, 118, 0.15)' }}
                className="card p-6 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="text-primary" size={28} />
                </div>
                <h3 className="font-heading font-semibold text-lg text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Element 2: Brand-New Scroll Morph Hero (Virtual Scroll) */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full h-[600px] md:h-[800px] border border-[var(--border)] rounded-[2.5rem] overflow-hidden relative shadow-2xl">
            <ScrollMorphHero />
          </div>
        </div>
      </section>

      {/* Element 3: Interactive Image Selector */}
      <RRDCHGallerySelector />

      {/* Two Path Cards */}
      <section className="py-12 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Link to="/appointment" className="card group hover:shadow-card-hover transition-all">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-accent-warm/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent-warm/20 transition-colors">
                  <Heart className="text-accent-warm" size={32} />
                </div>
                <div>
                  <h2 className={`font-heading font-semibold text-2xl text-primary mb-2 ${lang === 'kn' ? 'kannada' : ''}`}>
                    {lang === 'kn' ? 'ನಾನು ರೋಗಿ' : "I'm a Patient"}
                  </h2>
                  <p className="text-text-secondary mb-4">
                    {lang === 'kn' 
                      ? 'ನೋವು, ಪರೀಕ್ಷೆ, ಅಥವಾ ಚಿಕಿತ್ಸೆಗಾಗಿ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ'
                      : 'Book appointments for pain, checkups, or treatments'}
                  </p>
                  <span className="inline-flex items-center gap-2 text-accent-warm font-medium">
                    {lang === 'kn' ? 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ' : 'Book Appointment'}
                    <ArrowRight size={18} />
                  </span>
                </div>
              </div>
            </Link>

            <Link to="/academics" className="card group hover:shadow-card-hover transition-all">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <GraduationCap className="text-primary" size={32} />
                </div>
                <div>
                  <h2 className={`font-heading font-semibold text-2xl text-primary mb-2 ${lang === 'kn' ? 'kannada' : ''}`}>
                    {lang === 'kn' ? 'ನಾನು ವಿದ್ಯಾರ್ಥಿ' : "I'm a Student"}
                  </h2>
                  <p className="text-text-secondary mb-4">
                    {lang === 'kn'
                      ? 'ವೇಳಾಪಟ್ಟಿ, ವಿದ್ಯಾರ್ಥಿವೇತನ, ವಿಭಾಗದ ಮಾಹಿತಿ ಪರಿಶೀಲಿಸಿ'
                      : 'Check schedules, syllabus, and department information'}
                  </p>
                  <span className="inline-flex items-center gap-2 text-primary font-medium">
                    {lang === 'kn' ? 'ಶೈಕ್ಷಣಿಕ ಮಾಹಿತಿ' : 'Academic Info'}
                    <ArrowRight size={18} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* About Strip */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="font-heading font-semibold text-2xl md:text-3xl text-primary mb-4">
              {lang === 'kn' ? 'ರಾಜರಾಜೇಶ್ವರಿ ದಂತ ಕಾಲೇಜು ಮತ್ತು ಆಸ್ಪತ್ರೆ' : 'RajaRajeswari Dental College & Hospital'}
            </h2>
            <p className="text-text-secondary">
              {lang === 'kn'
                ? '1992 ರಿಂದ ಬೆಂಗಳೂರಿನಲ್ಲಿ ನಂಬಿಕಸ್ತ ದಂತ ಆರೋಗ್ಯ ಸೇವೆ. ನಮ್ಮ 250 ದಂತ ಕುರ್ಳಿಗಳು ಮತ್ತು 1000 ಹಾಸಿಗೆಗಳ ಆಸ್ಪತ್ರೆ ಪ್ರತಿದಿನ 450+ ರೋಗಿಗಳಿಗೆ ಸೇವೆ ನೀಡುತ್ತದೆ.'
                : 'Trusted dental care in Bangalore since 1992. Our 250 dental chairs and 1000-bed hospital serve 450+ patients daily with world-class expertise.'}
            </p>
          </div>
          
          {/* Accreditation Logos */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="font-heading font-bold text-primary text-sm">DCI</span>
              </div>
              <span className="text-xs text-text-muted">Recognized</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="font-heading font-bold text-accent text-xs">NAAC</span>
              </div>
              <span className="text-xs text-text-muted">A-Grade</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-warm/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="font-heading font-bold text-accent-warm text-xs">ISO</span>
              </div>
              <span className="text-xs text-text-muted">9001:2015</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="font-heading font-bold text-primary text-xs">IAO</span>
              </div>
              <span className="text-xs text-text-muted">Accredited</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="font-heading font-bold text-accent text-[10px]">Glasgow</span>
              </div>
              <span className="text-xs text-text-muted">Affiliated</span>
            </div>
          </div>
        </div>
      </section>

      {/* News Strip */}
      <section className="py-12 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading font-semibold text-2xl md:text-3xl text-primary mb-8 text-center">
            {lang === 'kn' ? 'ಸುದ್ದಿ ಮತ್ತು ಘಟನೆಗಳು' : 'News & Events'}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {newsItems.map((item, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="text-sm text-accent font-medium mb-2">{item.date}</div>
                <h3 className="font-heading font-semibold text-lg text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-text-secondary text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection lang={lang} />

      <Footer />
    </div>
  );
}
