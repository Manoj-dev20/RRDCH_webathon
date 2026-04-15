import { DEPARTMENTS } from '../data/departments';
import { useLang } from '../context/LanguageContext';
import { t } from '../data/translations';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DepartmentCard from '../components/DepartmentCard';

export default function Departments() {
  const { lang } = useLang();

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className={`font-heading font-semibold text-3xl md:text-4xl text-primary mb-4 ${lang === 'kn' ? 'kannada' : ''}`}>
              {t('departments', lang)}
            </h1>
            <p className="text-text-secondary max-w-2xl mx-auto">
              {lang === 'kn' 
                ? '10 ವಿಶೇಷತೆಯ ವಿಭಾಗಗಳು ಸಮಗ್ರ ದಂತ ಆರೋಗ್ಯ ಸೇವೆಗಳನ್ನು ನೀಡುತ್ತವೆ'
                : '10 specialized departments offering comprehensive dental care services'}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(DEPARTMENTS).map(([code, department]) => (
              <DepartmentCard
                key={code}
                departmentCode={code}
                department={department}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
