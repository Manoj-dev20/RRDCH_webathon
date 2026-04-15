import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Navigation, ExternalLink } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { t } from '../data/translations';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    items: [
      { label: 'Reception', value: '+91-80-2843 7150', href: 'tel:+91-80-28437150' },
      { label: 'Admin Office', value: '+91-80-2843 7468', href: 'tel:+91-80-28437468' },
      { label: 'Emergency', value: '+91-99015 59955', href: 'tel:+91-9901559955' }
    ]
  },
  {
    icon: Mail,
    title: 'Email',
    items: [
      { label: 'General', value: 'info@rrdch.org', href: 'mailto:info@rrdch.org' },
      { label: 'Admissions', value: 'admission@rrdch.org', href: 'mailto:admission@rrdch.org' },
      { label: 'Principal', value: 'principal@rrdch.org', href: 'mailto:principal@rrdch.org' }
    ]
  },
  {
    icon: Clock,
    title: 'OPD Hours',
    items: [
      { label: 'Monday - Saturday', value: '9:00 AM - 4:00 PM' },
      { label: 'Sunday', value: 'Closed (Emergency Only)' }
    ]
  }
];

const directions = [
  { from: 'Vidhana Soudha', distance: '19 km', route: 'Via Mysore Road' },
  { from: 'Majestic (City Center)', distance: '22 km', route: 'Via Mysore Road' },
  { from: 'Bangalore Airport', distance: '55 km', route: 'Via NH44 and Mysore Road' },
  { from: 'Kengeri', distance: '8 km', route: 'Via Mysore Road' }
];

export default function Contact() {
  const { lang } = useLang();

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main>
        {/* Hero */}
        <section className="bg-primary text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className={`font-heading font-bold text-3xl md:text-4xl mb-4 ${lang === 'kn' ? 'kannada' : ''}`}>
              {t('contact', lang)}
            </h1>
            <p className="text-white/90 text-lg">
              {lang === 'kn'
                ? 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ - ನಾವು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇವೆ'
                : 'Get in touch - We are here to help you'}
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {contactInfo.map((section, index) => (
                <div key={index} className="card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <section.icon className="text-accent" size={20} />
                    </div>
                    <h2 className="font-heading font-semibold text-lg text-primary">{section.title}</h2>
                  </div>
                  <div className="space-y-3">
                    {section.items.map((item, idx) => (
                      <div key={idx}>
                        <p className="text-xs text-text-muted">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-primary hover:underline font-medium">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-text-secondary font-medium">{item.value}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map Component - With Location Cards */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="font-heading font-semibold text-2xl md:text-3xl text-primary mb-2">
                {lang === 'kn' ? 'ನಮ್ಮ ಸ್ಥಳ' : 'Our Location'}
              </h2>
              <p className="text-text-secondary">
                {lang === 'kn' 
                  ? '19km from Vidhana Soudha on Mysore Road'
                  : '19km from Vidhana Soudha on Mysore Road'}
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Location Cards Sidebar */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                {/* Address Card */}
                <div className="card p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">
                        {lang === 'kn' ? 'ವಿಳಾಸ' : 'Address'}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        No.14, Ramohalli Cross,<br />
                        Kumbalgodu, Mysore Road,<br />
                        Bengaluru - 560 074
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="card p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="text-accent" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">
                        {lang === 'kn' ? 'ದೂರವಾಣಿ' : 'Phone'}
                      </h3>
                      <div className="space-y-1">
                        <a href="tel:+91-80-2843-7150" className="block text-text-secondary text-sm hover:text-accent transition-colors">
                          +91-80-2843 7150
                        </a>
                        <a href="tel:+91-80-2843-7468" className="block text-text-secondary text-sm hover:text-accent transition-colors">
                          +91-80-2843 7468
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Card */}
                <div className="card p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent-warm/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="text-accent-warm" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">
                        {lang === 'kn' ? 'ಇಮೇಲ್' : 'Email'}
                      </h3>
                      <a href="mailto:principalrrdch@gmail.com" className="text-text-secondary text-sm hover:text-accent-warm transition-colors">
                        principalrrdch@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* OPD Hours Card */}
                <div className="card p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="text-success" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">
                        {lang === 'kn' ? 'OPD ಸಮಯ' : 'OPD Hours'}
                      </h3>
                      <p className="text-text-secondary text-sm">
                        Mon–Sat, 9AM–4PM
                      </p>
                      <p className="text-text-muted text-xs mt-1">
                        {lang === 'kn' ? 'ಭಾನುವಾರ: ತುರ್ತು ಮಾತ್ರ' : 'Sunday: Emergency Only'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Landmark Info */}
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                  <p className="text-sm text-text-secondary">
                    <span className="font-medium text-primary">
                      {lang === 'kn' ? 'ಹೆಚ್ಚುಗೆ:' : 'Landmark:'}
                    </span>
                    {' '}19km from Vidhana Soudha on Mysore Road
                  </p>
                </div>
              </motion.div>

              {/* Map */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                <div className="card p-0 overflow-hidden h-full min-h-[400px] relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.9842464537354!2d77.4448!3d12.9052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3cc15a3c6587%3A0x2f0b21!2sRajaRajeswari%20Dental%20College%20%26%20Hospital!5e0!3m2!1sen!2sin!4v1704067200000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '100%' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="RRDCH Location"
                    className="absolute inset-0"
                  />
                </div>
              </motion.div>
            </div>

            {/* Directions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 card"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-lg text-primary">
                  {lang === 'kn' ? 'ದಿಕ್ಕುಗಳು' : 'Directions'}
                </h3>
                <a
                  href="https://maps.google.com/?q=RajaRajeswari+Dental+College+Hospital+Kumbalgodu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent hover:text-accent/80 text-sm font-medium"
                >
                  <Navigation size={16} />
                  {lang === 'kn' ? 'ಗೂಗಲ್ ಮ್ಯಾಪ್‌ನಲ್ಲಿ ತೆರೆಯಿರಿ' : 'Open in Google Maps'}
                  <ExternalLink size={14} />
                </a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {directions.map((dir, idx) => (
                  <div key={idx} className="text-center p-3 bg-surface rounded-lg">
                    <p className="font-medium text-primary text-sm">{dir.from}</p>
                    <p className="text-accent font-bold">{dir.distance}</p>
                    <p className="text-text-muted text-xs">{dir.route}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Public Transport */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card"
            >
              <h2 className="font-heading font-semibold text-xl text-primary mb-6">
                {lang === 'kn' ? 'ಸಾರ್ವಜನಿಕ ಸಾರಿಗೆ' : 'Public Transport'}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="font-semibold text-primary mb-2">BMTC Buses</h3>
                  <p className="text-text-secondary text-sm">
                    From Bangalore City Railway Station/Majestic: Bus numbers 222, 222A, 223, 224, 226, 228 go to Kumbalgodu. Get down at RajaRajeswari College stop.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="font-semibold text-primary mb-2">By Car</h3>
                  <p className="text-text-secondary text-sm">
                    Take Mysore Road (NH275) towards Mysore. After Kengeri, look for Ramohalli Cross. The college is on the left side of the highway.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
