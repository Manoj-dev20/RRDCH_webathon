import { CheckCircle, GraduationCap, Phone, Mail, FileText, Calendar, AlertCircle } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { t } from '../data/translations';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const eligibilityCriteria = [
  {
    course: 'BDS',
    requirements: [
      '10+2 with Physics, Chemistry, Biology, and English',
      'Minimum 50% aggregate in PCB (40% for SC/ST/OBC)',
      'Valid NEET score',
      'Age: 17+ years at admission'
    ]
  },
  {
    course: 'MDS',
    requirements: [
      'BDS degree from DCI recognized institution',
      'Valid NEET-MDS score',
      'Completion of internship',
      'Permanent registration with DCI'
    ]
  }
];

const applicationSteps = [
  { step: 1, title: 'NEET Examination', description: 'Clear NEET/NEET-MDS with qualifying score' },
  { step: 2, title: 'Counseling Registration', description: 'Register for Karnataka state counseling or COMEDK' },
  { step: 3, title: 'Choice Filling', description: 'Select RRDCH as preferred college during counseling' },
  { step: 4, title: 'Seat Allotment', description: 'Get seat allotted through counseling process' },
  { step: 5, title: 'Document Verification', description: 'Verify documents and pay fees to confirm admission' }
];

export default function Admissions() {
  const { lang } = useLang();

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main>
        {/* Hero */}
        <section className="bg-primary text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className={`font-heading font-bold text-3xl md:text-4xl mb-4 ${lang === 'kn' ? 'kannada' : ''}`}>
              {t('admissions', lang)}
            </h1>
            <p className="text-white/90 text-lg">
              {lang === 'kn'
                ? 'ದೇಶದ ಅತ್ಯುತ್ತಮ ದಂತ ಕಾಲೇಜುಗಳಲ್ಲಿ ಒಂದಕ್ಕೆ ಪ್ರವೇಶ ಪಡೆಯಿರಿ'
                : 'Join one of the finest dental colleges in the country'}
            </p>
          </div>
        </section>

        {/* Important Notice */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card bg-warning/10 border-warning/30">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-warning flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="font-semibold text-warning mb-1">
                    {lang === 'kn' ? 'ಮುಖ್ಯ ಸೂಚನೆ' : 'Important Notice'}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Admissions for BDS and MDS are through NEET counseling only. We do not accept direct admissions. 
                    Please check the Karnataka Examination Authority (KEA) website for counseling schedules.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Eligibility */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-semibold text-2xl text-primary mb-8">
              {lang === 'kn' ? 'ಅರ್ಹತಾ ಮಾನದಂಡ' : 'Eligibility Criteria'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {eligibilityCriteria.map((item, index) => (
                <div key={index} className="card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <GraduationCap className="text-primary" size={20} />
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-primary">{item.course}</h3>
                  </div>
                  <ul className="space-y-2">
                    {item.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                        <CheckCircle size={16} className="text-success flex-shrink-0 mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-semibold text-2xl text-primary mb-8">
              {lang === 'kn' ? 'ಅಪ್ಲಿಕೇಶನ್ ಪ್ರಕ್ರಿಯೆ' : 'Application Process'}
            </h2>
            <div className="space-y-4">
              {applicationSteps.map((item, index) => (
                <div key={index} className="card flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-primary">{item.title}</h3>
                    <p className="text-text-secondary text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fee Structure Table */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-accent" size={24} />
                <h2 className="font-heading font-semibold text-xl text-primary">
                  {lang === 'kn' ? 'ಶುಲ್ಕ ವಿನ್ಯಾಸ' : 'Fee Structure'}
                </h2>
              </div>
              <p className="text-text-secondary mb-6">
                {lang === 'kn'
                  ? 'ಶುಲ್ಕ ವಿನ್ಯಾಸವು ಸರ್ಕಾರದ ನಿಯಮಗಳಿಗೆ ಅನುಗುಣವಾಗಿರುತ್ತದೆ ಮತ್ತು ಪ್ರತಿ ವರ್ಷ ಕಾರ್ಯನಿರ್ವಹಣಾ ಸಮಿತಿಯಿಂದ ನಿಗದಿಪಡಿಸಲಾಗುತ್ತದೆ.'
                  : 'Fee structure is as per government regulations and is fixed by the Managing Committee every year.'}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary/5">
                      <th className="text-left py-3 px-4 font-semibold text-primary rounded-tl-lg">Course</th>
                      <th className="text-left py-3 px-4 font-semibold text-primary">Govt Quota</th>
                      <th className="text-left py-3 px-4 font-semibold text-primary">Private Quota</th>
                      <th className="text-left py-3 px-4 font-semibold text-primary rounded-tr-lg">NRI Quota</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium">BDS</td>
                      <td className="py-3 px-4 text-text-secondary">₹96,058/year</td>
                      <td className="py-3 px-4 text-text-secondary">₹4,12,700/year</td>
                      <td className="py-3 px-4 text-text-secondary">₹5,12,700–7,53,750/year</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium">MDS - Oral Surgery</td>
                      <td className="py-3 px-4 text-text-secondary">₹3,72,576/year</td>
                      <td className="py-3 px-4 text-text-secondary">₹6,20,676/year</td>
                      <td className="py-3 px-4 text-text-secondary">₹12,15,500/year</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium">MDS - Orthodontics</td>
                      <td className="py-3 px-4 text-text-secondary">₹3,72,576/year</td>
                      <td className="py-3 px-4 text-text-secondary">₹6,20,676/year</td>
                      <td className="py-3 px-4 text-text-secondary">₹14,15,500/year</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium">MDS - Conservative Dentistry</td>
                      <td className="py-3 px-4 text-text-secondary">₹3,72,576/year</td>
                      <td className="py-3 px-4 text-text-secondary">₹6,20,676/year</td>
                      <td className="py-3 px-4 text-text-secondary">₹14,15,500/year</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium">MDS - Periodontology</td>
                      <td className="py-3 px-4 text-text-secondary">₹3,72,576/year</td>
                      <td className="py-3 px-4 text-text-secondary">₹6,20,676/year</td>
                      <td className="py-3 px-4 text-text-secondary">—</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">MDS - Pedodontics</td>
                      <td className="py-3 px-4 text-text-secondary">₹3,72,576/year</td>
                      <td className="py-3 px-4 text-text-secondary">₹6,20,676/year</td>
                      <td className="py-3 px-4 text-text-secondary">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 text-sm">
                  <strong>📢 Certificate Course in Implantology (2026-27)</strong> — Applications now open! Contact admission office for details.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Important Dates */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-semibold text-2xl text-primary mb-8 flex items-center gap-2">
              <Calendar size={24} />
              {lang === 'kn' ? 'ಮುಖ್ಯ ದಿನಾಂಕಗಳು' : 'Important Dates'}
            </h2>
            <div className="card">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-primary">Event</th>
                    <th className="text-left py-3 px-4 font-semibold text-primary">Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">NEET Examination</td>
                    <td className="py-3 px-4 text-text-secondary">May (Annually)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">NEET-MDS Examination</td>
                    <td className="py-3 px-4 text-text-secondary">January/February (Annually)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">Counseling Registration</td>
                    <td className="py-3 px-4 text-text-secondary">After NEET Results</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">Academic Session Start</td>
                    <td className="py-3 px-4 text-text-secondary">August/September</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-semibold text-2xl text-primary mb-8">
              {t('contact', lang)}
            </h2>
            <div className="card">
              <p className="text-text-secondary mb-6">
                {lang === 'kn'
                  ? 'ಪ್ರವೇಶದ ಕುರಿತು ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ದಯವಿಟ್ಟು ಸಂಪರ್ಕಿಸಿ:'
                  : 'For more information regarding admissions, please contact:'}
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <a href="mailto:admission@rrdch.org" className="flex items-center gap-3 p-4 bg-surface rounded-lg hover:bg-primary/5 transition-colors">
                  <Mail className="text-accent" size={20} />
                  <span className="text-primary">admission@rrdch.org</span>
                </a>
                <a href="tel:+91-9901559955" className="flex items-center gap-3 p-4 bg-surface rounded-lg hover:bg-primary/5 transition-colors">
                  <Phone className="text-accent" size={20} />
                  <span className="text-primary">+91-99015 59955</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
