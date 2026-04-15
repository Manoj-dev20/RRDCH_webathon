import { Building, Award, Users, Stethoscope, Clock, GraduationCap } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { t } from '../data/translations';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const milestones = [
  { year: '1992', title: 'Founded', description: 'Established with 40 BDS admissions under Moogambigai Charitable and Educational Trust' },
  { year: '2000s', title: 'PG Expansion', description: 'Expanded to full postgraduate institution with MDS programs' },
  { year: '2014', title: 'Glasgow RCPS Tie-up', description: 'Collaboration with Royal College of Physicians & Surgeons of Glasgow; Orthognathic Surgery Workshop' },
  { year: '2015', title: 'CBCT Technology', description: 'Installed CBCT imaging unit — one of the first in Karnataka dental colleges' },
  { year: '2020', title: 'NAAC A-Grade', description: 'Accredited with A-Grade by National Assessment and Accreditation Council' },
  { year: '2026', title: 'Implantology Course', description: 'New Certificate Course in Implantology — admissions open' }
];

const stats = [
  { icon: Building, value: '30+', label: 'Years of Excellence' },
  { icon: Users, value: '1000', label: 'Hospital Beds' },
  { icon: Stethoscope, value: '250', label: 'Dental Chairs' },
  { icon: Clock, value: '450+', label: 'Daily Patients' },
  { icon: GraduationCap, value: '10', label: 'Departments' },
  { icon: Award, value: '50+', label: 'Awards Won' }
];

export default function About() {
  const { lang } = useLang();

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="bg-primary text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className={`font-heading font-bold text-3xl md:text-5xl mb-6 ${lang === 'kn' ? 'kannada' : ''}`}>
              {lang === 'kn' 
                ? 'ರಾಜರಾಜೇಶ್ವರಿ ದಂತ ಕಾಲೇಜು ಮತ್ತು ಆಸ್ಪತ್ರೆ' 
                : 'RajaRajeswari Dental College & Hospital'}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {lang === 'kn'
                ? '1992 ರಿಂದ ಬೆಂಗಳೂರಿನಲ್ಲಿ ನಂಬಿಕಸ್ತ ದಂತ ಆರೋಗ್ಯ ಸೇವೆ'
                : 'Trusted dental care in Bangalore since 1992'}
            </p>
          </div>
        </section>

        {/* History Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading font-semibold text-2xl md:text-3xl text-primary mb-6">
                  {lang === 'kn' ? 'ನಮ್ಮ ಇತಿಹಾಸ' : 'Our History'}
                </h2>
                <p className="text-text-secondary mb-4">
                  {lang === 'kn'
                    ? 'ರಾಜರಾಜೇಶ್ವರಿ ದಂತ ಕಾಲೇಜು ಮತ್ತು ಆಸ್ಪತ್ರೆಯನ್ನು 1992ರಲ್ಲಿ ಮೂಗಾಂಬಿಗೈ ಚಾರಿಟೇಬಲ್ ಮತ್ತು ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ ಸ್ಥಾಪಿಸಿತು. 30 ವರ್ಷಗಳಿಗೂ ಹೆಚ್ಚು ಕಾಲ ನಾವು ಬೆಂಗಳೂರು ಮತ್ತು ಸುತ್ತಮುತ್ತಲಿನ ಪ್ರದೇಶಗಳಿಗೆ ಉತ್ತಮ ದಂತ ಶಿಕ್ಷಣ ಮತ್ತು ಸೇವೆ ನೀಡುತ್ತಿದ್ದೇವೆ.'
                    : 'RajaRajeswari Dental College & Hospital was established in 1992 under the Moogambigai Charitable and Educational Trust. For over 30 years, we have been providing exceptional dental education and services to Bangalore and surrounding areas.'}
                </p>
                <p className="text-text-secondary mb-4">
                  {lang === 'kn'
                    ? 'ನಮ್ಮ 1000 ಹಾಸಿಗೆಗಳ ಆಸ್ಪತ್ರೆ ಪ್ರತಿದಿನ 450ಕ್ಕೂ ಹೆಚ್ಚು ರೋಗಿಗಳಿಗೆ ಸೇವೆ ನೀಡುತ್ತದೆ. 250 ದಂತ ಕುರ್ಳಿಗಳು ಮತ್ತು 10 ವಿಶೇಷತೆಯ ವಿಭಾಗಗಳು ಸಮಗ್ರ ದಂತ ಆರೋಗ್ಯ ಸೇವೆಗಳನ್ನು ಒದಗಿಸುತ್ತವೆ.'
                    : 'Our 1000-bed hospital serves over 450 patients daily. With 250 dental chairs and 10 specialized departments, we provide comprehensive dental healthcare services.'}
                </p>
                <p className="text-text-secondary">
                  {lang === 'kn'
                    ? 'ನಾವು ರಾಜೀವ್ ಗಾಂಧಿ ಆರೋಗ್ಯ ವಿಶ್ವವಿದ್ಯಾಲಯದಿಂದ ಅನುಮೋದನೆ ಪಡೆದಿದ್ದೇವೆ ಮತ್ತು ದಂತ ಕೌನ್ಸಿಲ್ ಆಫ್ ಇಂಡಿಯಾ (DCI) ಮಾನ್ಯತೆ ಪಡೆದಿದ್ದೇವೆ.'
                    : 'We are recognized by Rajiv Gandhi University of Health Sciences and accredited by the Dental Council of India (DCI).'}
                </p>
              </div>
              <div className="card">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-surface rounded-lg">
                      <stat.icon className="text-accent mx-auto mb-2" size={28} />
                      <p className="text-2xl font-heading font-bold text-primary">{stat.value}</p>
                      <p className="text-xs text-text-secondary">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chairman's Message */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card max-w-3xl mx-auto">
              <h2 className="font-heading font-semibold text-2xl text-primary mb-6 text-center">
                {lang === 'kn' ? 'ಚೇರ್ಮನ್ ಸಂದೇಶ' : "Chairman's Message"}
              </h2>
              <blockquote className="text-text-secondary italic text-center">
                "Our vision is to be a center of excellence in dental education and healthcare. We are committed to nurturing skilled professionals who will serve humanity with compassion and expertise."
              </blockquote>
              <p className="text-center mt-4 font-semibold text-primary">
                - Dr. A.C. Shanmugam
              </p>
              <p className="text-center text-sm text-text-muted">
                Chairman, Moogambigai Charitable and Educational Trust
              </p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-semibold text-2xl md:text-3xl text-primary mb-12 text-center">
              {lang === 'kn' ? 'ಮೈಲುಗಲ್ಲುಗಳು' : 'Milestones'}
            </h2>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0 w-20 text-right">
                    <span className="font-heading font-bold text-primary text-lg">{milestone.year}</span>
                  </div>
                  <div className="flex-shrink-0 relative">
                    <div className="w-4 h-4 bg-accent rounded-full" />
                    {index < milestones.length - 1 && (
                      <div className="absolute top-4 left-1.5 w-0.5 h-full bg-border -translate-x-1/2" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="font-heading font-semibold text-lg text-primary">{milestone.title}</h3>
                    <p className="text-text-secondary">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-semibold text-2xl md:text-3xl text-primary mb-12 text-center">
              {lang === 'kn' ? 'ನಾಯಕತ್ವ' : 'Leadership'}
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="card text-center border-b-4 border-b-primary">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white" size={40} />
                </div>
                <p className="text-sm text-accent font-medium mb-1">Principal</p>
                <h3 className="font-heading font-semibold text-xl text-primary">Dr. S. Savita</h3>
                <p className="text-text-secondary text-sm mt-2">RajaRajeswari Dental College & Hospital</p>
              </div>
              <div className="card text-center border-b-4 border-b-accent">
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="text-white" size={40} />
                </div>
                <p className="text-sm text-accent font-medium mb-1">Vice Principal / HOD Orthodontics</p>
                <h3 className="font-heading font-semibold text-xl text-primary">Dr. Raj Kumar S. Alle</h3>
                <p className="text-text-secondary text-sm mt-2">Professor & Head of Department</p>
              </div>
            </div>
          </div>
        </section>

        {/* Accreditations */}
        <section className="py-16 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-semibold text-2xl md:text-3xl text-primary mb-12 text-center">
              {lang === 'kn' ? 'ಮಾನ್ಯತೆ ಮತ್ತು ಗುರುತು' : 'Accreditations & Recognition'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'NAAC', sub: 'A-Grade', color: 'bg-accent' },
                { name: 'DCI', sub: 'Recognized', color: 'bg-primary' },
                { name: 'ISO', sub: '9001:2015', color: 'bg-amber-500' },
                { name: 'IAO', sub: 'Accredited', color: 'bg-purple-500' },
                { name: 'Glasgow', sub: 'RCPSG Affiliate', color: 'bg-blue-600' },
                { name: 'SLMC', sub: 'Recognized', color: 'bg-teal-500' }
              ].map((acc, index) => (
                <div key={index} className="card text-center hover:shadow-card-hover transition-all">
                  <div className={`w-16 h-16 ${acc.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <Award className="text-white" size={28} />
                  </div>
                  <p className="font-heading font-bold text-primary">{acc.name}</p>
                  <p className="text-text-secondary text-sm">{acc.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
