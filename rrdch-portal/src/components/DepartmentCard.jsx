import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getDepartmentName } from '../data/departments';
import { useLang } from '../context/LanguageContext';

export default function DepartmentCard({ departmentCode, department }) {
  const { lang } = useLang();
  const [isExpanded, setIsExpanded] = useState(false);

  const displayName = lang === 'kn' ? department.nameKn : department.name;

  return (
    <div className="card">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className={`font-heading font-semibold text-lg text-primary ${lang === 'kn' ? 'kannada' : ''}`}>
              {displayName}
            </h3>
            <p className="text-text-secondary text-sm mt-1">
              {department.description}
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex-shrink-0"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {isExpanded && (
          <div className="pt-3 border-t border-border">
            <p className="text-sm text-text-secondary font-medium mb-2">
              {lang === 'kn' ? 'ಚಿಕಿತ್ಸೆ ನೀಡುವ ರೋಗಗಳು:' : 'Treats:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {department.treats.map((condition, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full"
                >
                  {condition}
                </span>
              ))}
            </div>
            <p className="text-sm text-text-muted mt-3">
              {lang === 'kn' ? 'ಪ್ರತಿ ರೋಗಿಗೆ ಅಂದಾಜು ಸಮಯ: ' : 'Avg time per patient: '}
              {department.avgTimePerPatient} {lang === 'kn' ? 'ನಿಮಿಷ' : 'mins'}
            </p>
          </div>
        )}

        <Link
          to={`/appointment?dept=${departmentCode}`}
          className="btn btn-accent text-sm mt-2"
        >
          {lang === 'kn' ? 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ' : 'Book Appointment'}
        </Link>
      </div>
    </div>
  );
}
