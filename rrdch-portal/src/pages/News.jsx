import { Calendar, ExternalLink, ChevronRight } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { t } from '../data/translations';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const newsItems = [
  {
    id: 1,
    title: 'Publication Ethics Workshop',
    date: 'February 2026',
    category: 'Academic',
    description: 'Comprehensive workshop on research ethics and publication standards for dental professionals and postgraduate students.',
    image: null
  },
  {
    id: 2,
    title: 'Dental Screening Camp - Children of India Foundation',
    date: 'January 2026',
    category: 'Community',
    description: 'Free dental screening and treatment camp organized for underprivileged children in collaboration with Children of India Foundation.',
    image: null
  },
  {
    id: 3,
    title: 'World AIDS Day Camp',
    date: 'December 2025',
    category: 'Health Camp',
    description: 'Oral health awareness program and HIV prevention camp marking World AIDS Day at various community centers.',
    image: null
  },
  {
    id: 4,
    title: 'World No Tobacco Day',
    date: 'May 2025',
    category: 'Awareness',
    description: 'Awareness program on tobacco cessation and oral cancer screening conducted across Bangalore.',
    image: null
  },
  {
    id: 5,
    title: 'Orthognathic Surgery Workshop',
    date: 'October 2014',
    category: 'Workshop',
    description: 'International workshop on orthognathic surgery in collaboration with Royal College of Physicians & Surgeons of Glasgow.',
    image: null
  },
  {
    id: 6,
    title: 'NAAC A-Grade Accreditation',
    date: '2020',
    category: 'Achievement',
    description: 'RajaRajeswari Dental College & Hospital accredited with A-Grade by National Assessment and Accreditation Council.',
    image: null
  }
];

const upcomingEvents = [
  {
    title: 'Dental Health Awareness Week',
    date: 'April 15-21, 2026',
    description: 'Free dental checkups and awareness programs for the local community.'
  },
  {
    title: 'Research Methodology Workshop',
    date: 'May 10, 2026',
    description: 'Workshop on research methodology for postgraduate students.'
  }
];

export default function News() {
  const { lang } = useLang();

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main>
        {/* Hero */}
        <section className="bg-primary text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className={`font-heading font-bold text-3xl md:text-4xl mb-4 ${lang === 'kn' ? 'kannada' : ''}`}>
              {t('news', lang)}
            </h1>
            <p className="text-white/90 text-lg">
              {lang === 'kn'
                ? 'ಈವೆಂಟ್‌ಗಳು, ಶಿಬಿರಗಳು ಮತ್ತು ಸಾಧನೆಗಳ ಲೇಟೆಸ್ಟ್ ಅಪ್ಡೇಟ್‌ಗಳು'
                : 'Latest updates on events, camps, and achievements'}
            </p>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-semibold text-2xl text-primary mb-6">
              {lang === 'kn' ? 'ಆಗಲಿರುವ ಈವೆಂಟ್‌ಗಳು' : 'Upcoming Events'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="card border-l-4 border-l-accent">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="text-accent" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-accent font-medium">{event.date}</p>
                      <h3 className="font-heading font-semibold text-primary mt-1">{event.title}</h3>
                      <p className="text-text-secondary text-sm mt-2">{event.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-semibold text-2xl text-primary mb-6">
              {lang === 'kn' ? 'ಸುದ್ದಿ ಮತ್ತು ಘಟನೆಗಳು' : 'News & Events'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsItems.map((item) => (
                <article key={item.id} className="card hover:shadow-card-hover transition-all group">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                      {item.category}
                    </span>
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <Calendar size={12} />
                      {item.date}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-primary mb-2 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4">
                    {item.description}
                  </p>
                  <button className="inline-flex items-center gap-1 text-sm text-accent hover:underline">
                    Read More
                    <ChevronRight size={16} />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter/Archive */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card bg-primary text-white">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="font-heading font-semibold text-2xl mb-4">
                    {lang === 'kn' ? 'ಹಳೆಯ ಈವೆಂಟ್‌ಗಳು' : 'Past Events Archive'}
                  </h2>
                  <p className="text-white/80 mb-4">
                    {lang === 'kn'
                      ? 'ಹಿಂದಿನ ವರ್ಷಗಳ ಈವೆಂಟ್‌ಗಳು ಮತ್ತು ಶಿಬಿರಗಳ ಮಾಹಿತಿಗಾಗಿ ನಮ್ಮ ಆರ್ಕೈವ್ ಪರಿಶೀಲಿಸಿ.'
                      : 'Check our archive for information on past years events and camps.'}
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors"
                  >
                    View Archive
                    <ExternalLink size={16} />
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <p className="text-3xl font-heading font-bold text-white">200+</p>
                    <p className="text-white/70 text-sm">Health Camps</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <p className="text-3xl font-heading font-bold text-white">50K+</p>
                    <p className="text-white/70 text-sm">Patients Treated</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <p className="text-3xl font-heading font-bold text-white">100+</p>
                    <p className="text-white/70 text-sm">Workshops</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <p className="text-3xl font-heading font-bold text-white">30+</p>
                    <p className="text-white/70 text-sm">Years of Service</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
