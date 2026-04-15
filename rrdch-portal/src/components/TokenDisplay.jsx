import { t } from '../data/translations';

export default function TokenDisplay({ currentToken, lang = 'en' }) {
  return (
    <div className="bg-primary text-white rounded-2xl p-8 text-center shadow-card">
      <p className="text-white/80 text-sm mb-2 uppercase tracking-wide">
        {t('nowServing', lang)}
      </p>
      <div className="flex items-center justify-center gap-3">
        <div className="pulse-dot"></div>
        <span className="text-white/60 text-sm">{t('live', lang)}</span>
      </div>
      <p className="text-6xl md:text-7xl font-heading font-bold mt-4 tracking-tight">
        {currentToken}
      </p>
    </div>
  );
}
