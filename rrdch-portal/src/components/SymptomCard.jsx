import { Droplets, Baby, Smile, ShieldCheck, Scissors, AlertCircle, MinusCircle, HelpCircle } from 'lucide-react';

// Custom Tooth SVG icon since lucide-react doesn't export "Tooth" in this version
function ToothIcon({ size = 24, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2C9.5 2 7 3.5 7 6c0 2 .5 3.5 0 6-.5 2.5-1.5 5-1 7 .5 1.5 2 2 3 1s1.5-2 3-2 2 1 3 2 2.5.5 3-1c.5-2-.5-4.5-1-7-.5-2.5 0-4 0-6 0-2.5-2.5-4-5-4z" />
    </svg>
  );
}

const iconMap = {
  tooth: ToothIcon,
  droplets: Droplets,
  baby: Baby,
  smile: Smile,
  'shield-check': ShieldCheck,
  scissors: Scissors,
  'alert-circle': AlertCircle,
  'minus-circle': MinusCircle,
  'help-circle': HelpCircle,
};

export default function SymptomCard({ symptom, selected, onClick, lang }) {
  const IconComponent = iconMap[symptom.icon] || HelpCircle;
  const label = lang === 'kn' ? symptom.labelKn : symptom.label;

  return (
    <button
      onClick={onClick}
      className={`relative p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 text-center ${
        selected
          ? 'border-accent bg-accent/10 shadow-md'
          : 'border-border bg-white hover:border-primary-light hover:shadow-card'
      }`}
    >
      <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
        selected ? 'bg-accent text-white' : 'bg-primary/10 text-primary'
      }`}>
        <IconComponent size={32} />
      </div>
      <span className={`font-medium ${lang === 'kn' ? 'kannada' : ''}`}>
        {label}
      </span>
      {selected && (
        <div className="absolute top-2 right-2">
          <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
    </button>
  );
}
