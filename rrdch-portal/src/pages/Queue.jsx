import { useState, useEffect } from 'react';
import { DEPARTMENTS, DEPARTMENT_CODES, getDepartmentName } from '../data/departments';
import { useQueue } from '../hooks/useQueue';
import { useLang } from '../context/LanguageContext';
import { t } from '../data/translations';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import OPDHeatmap from '../components/OPDHeatmap';
import { Clock, AlertCircle, Loader, RefreshCw, MapPin } from 'lucide-react';

export default function Queue() {
  const { lang } = useLang();
  const [selectedDept, setSelectedDept] = useState('conservative-dentistry');
  const [myToken, setMyToken] = useState('');
  const [tokensAhead, setTokensAhead] = useState(null);
  const [waitTime, setWaitTime] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const { currentToken, totalPatients, patients, loading, error } = useQueue(selectedDept);

  useEffect(() => {
    setLastUpdated(new Date());
  }, [currentToken]);

  const checkMyPosition = () => {
    if (!myToken) return;

    // Validate token format
    if (!/^A-\d{3}$/.test(myToken.trim())) {
      setTokensAhead(null);
      alert(lang === 'kn' ? 'ಮಾನ್ಯ ಟೋಕನ್ ನಮೂದಿಸಿ (ಉದಾ: A-047)' : 'Enter a valid token (e.g., A-047)');
      return;
    }

    // If queue hasn't started yet
    if (!currentToken || currentToken === 'A-000' || currentToken === 'Not started') {
      setTokensAhead(null);
      alert(lang === 'kn' ? 'ಈ ವಿಭಾಗಕ್ಕೆ ಇಂದು ಕ್ಯೂ ಇನ್ನೂ ಪ್ರಾರಂಭವಾಗಿಲ್ಲ' : 'Queue has not started yet for this department today.');
      return;
    }

    const myMatch = myToken.match(/A-(\d+)/);
    const currentMatch = currentToken.match(/A-(\d+)/);

    if (!myMatch || !currentMatch) return;

    const myNum = parseInt(myMatch[1]);
    const currentNum = parseInt(currentMatch[1]);

    if (myNum < currentNum) {
      // Token was already served
      setTokensAhead(-1);
      setWaitTime(0);
    } else if (myNum === currentNum) {
      setTokensAhead(0);
      setWaitTime(0);
    } else {
      const ahead = myNum - currentNum;
      setTokensAhead(ahead);
      const dept = DEPARTMENTS[selectedDept];
      const avgTime = dept?.avgTimePerPatient || 12;
      setWaitTime(ahead * avgTime);
    }
  };

  const getWaitStatus = () => {
    if (tokensAhead === null) return null;
    if (tokensAhead === -1) return { color: 'blue', bg: 'bg-blue-50 border-blue-400 text-blue-700', text: lang === 'kn' ? 'ನಿಮ್ಮ ಟೋಕನ್ ಈಗಾಗಲೇ ಕರೆದಿದೆ' : 'Your token was already called' };
    if (tokensAhead === 0) return { color: 'green', bg: 'bg-green-100 border-green-500 text-green-700', text: lang === 'kn' ? 'ಇದು ನಿಮ್ಮ ಪರಿ! ಈಗ ವಿಭಾಗಕ್ಕೆ ಹೋಗಿ' : "It's your turn! Go to the department now" };
    if (tokensAhead <= 3) return { color: 'green', bg: 'bg-green-50 border-green-400 text-green-600', text: lang === 'kn' ? 'ತುಂಬಾ ಹತ್ತಿರ! ಸಿದ್ಧವಾಗಿರಿ' : 'Almost there! Please get ready' };
    if (tokensAhead <= 8) return { color: 'yellow', bg: 'bg-yellow-50 border-yellow-400 text-yellow-700', text: lang === 'kn' ? 'ಸ್ವಲ್ಪ ಸಮಯ ಕಾಯಿರಿ' : 'Short wait ahead' };
    return { color: 'red', bg: 'bg-red-50 border-red-400 text-red-700', text: lang === 'kn' ? 'ದೀರ್ಘ ಕಾಯುವಿಕೆ - ದಯವಿಟ್ಟು ಸಹನೆಯಿಂದಿರಿ' : 'Long wait - please be patient' };
  };

  const status = getWaitStatus();

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className={`font-heading font-semibold text-2xl md:text-3xl text-primary mb-8 text-center ${lang === 'kn' ? 'kannada' : ''}`}>
            {t('checkQueue', lang)}
          </h1>

          {/* Department Selector */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {t('selectDepartment', lang)}
            </label>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setTokensAhead(null);
                setMyToken('');
              }}
              className="input"
            >
              {DEPARTMENT_CODES.map((code) => (
                <option key={code} value={code}>
                  {lang === 'kn' ? DEPARTMENTS[code].nameKn : DEPARTMENTS[code].name}
                </option>
              ))}
            </select>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <Loader className="animate-spin mx-auto text-primary mb-4" size={48} />
              <p className="text-text-secondary">
                {lang === 'kn' ? 'ಕ್ಯೂ ಲೋಡ್ ಆಗುತ್ತಿದೆ...' : 'Loading queue...'}
              </p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="card border-l-4 border-l-danger mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-danger flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold text-danger mb-1">
                    {lang === 'kn' ? 'ಸಂಪರ್ಕ ವಿಫಲ' : 'Connection Failed'}
                  </p>
                  <p className="text-text-secondary text-sm">
                    {error}
                  </p>
                  <p className="text-text-muted text-sm mt-2">
                    {lang === 'kn' ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ' : 'Please check your internet connection and try again'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Queue Not Started State */}
          {!loading && !error && currentToken === 'A-000' && (
            <div className="card border-l-4 border-l-warning mb-8">
              <div className="flex items-start gap-3">
                <Clock className="text-warning flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold text-primary mb-1">
                    {lang === 'kn' ? 'ಕ್ಯೂ ಇನ್ನೂ ಪ್ರಾರಂಭವಾಗಿಲ್ಲ' : 'Queue Not Started Yet'}
                  </p>
                  <p className="text-text-secondary text-sm">
                    {lang === 'kn' 
                      ? 'ಈ ವಿಭಾಗಕ್ಕೆ ಇಂದು ಇನ್ನೂ ಕ್ಯೂ ಪ್ರಾರಂಭವಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪರಿಶೀಲಿಸಿ ಅಥವಾ ರಿಸೆಪ್ಷನ್‌ನಲ್ಲಿ ವಿಚಾರಿಸಿ.'
                      : 'The queue has not started yet for this department today. Please check back later or inquire at reception.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Live Token Display - Dramatic Style */}
          {!loading && !error && (
            <div className="mb-8">
              <div 
                className="rounded-3xl p-8 md:p-12 text-center shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #1A5276 0%, #2E86C1 50%, #17A589 100%)',
                  animation: 'breathe 3s ease-in-out infinite'
                }}
              >
                <p className="text-white/60 text-xs font-bold tracking-[3px] uppercase mb-4">
                  {t('nowServing', lang)}
                </p>
                
                <p className="text-7xl md:text-8xl font-heading font-extrabold text-white tracking-tight mb-6">
                  {currentToken}
                </p>

                <div className="flex items-center justify-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: '#2ECC71',
                      animation: 'pulse 1.5s ease-in-out infinite'
                    }}
                  />
                  <span className="text-white/70 text-sm font-medium">
                    {t('live', lang)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-text-muted">
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                <span>
                  {t('lastUpdated', lang)}: {lastUpdated.toLocaleTimeString(lang === 'kn' ? 'kn-IN' : 'en-IN')}
                </span>
              </div>
            </div>
          )}

          {/* My Token Checker */}
          <div className="card mb-8">
            <h2 className="font-heading font-semibold text-xl text-primary mb-4">
              {lang === 'kn' ? 'ನಿಮ್ಮ ಟೋಕನ್ ಪರಿಶೀಲಿಸಿ' : 'Check Your Token'}
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <input
                type="text"
                value={myToken}
                onChange={(e) => setMyToken(e.target.value.toUpperCase())}
                className="input sm:flex-1"
                placeholder="A-001"
              />
              <button
                onClick={checkMyPosition}
                disabled={!myToken || !currentToken}
                className="btn btn-primary disabled:opacity-50"
              >
                {lang === 'kn' ? 'ಪರಿಶೀಲಿಸಿ' : 'Check'}
              </button>
            </div>

            {status && (
              <div className={`p-4 rounded-xl border-2 ${status.bg}`}>
                <p className="font-semibold">{status.text}</p>
                {tokensAhead > 0 && (
                  <p className="text-sm mt-2">
                    {t('tokensAhead', lang)}: <strong>{tokensAhead}</strong> | 
                    {' '}{t('estimatedWait', lang)}: <strong>{waitTime} {lang === 'kn' ? 'ನಿಮಿಷ' : 'mins'}</strong>
                  </p>
                )}
                {tokensAhead === 0 && (
                  <p className="text-sm mt-2 font-medium">
                    {lang === 'kn' ? 'ದಯವಿಟ್ಟು ಈಗ ವಿಭಾಗಕ್ಕೆ ತೆರಳಿ' : 'Please proceed to the department now'}
                  </p>
                )}
                {tokensAhead === -1 && (
                  <p className="text-sm mt-2">
                    {lang === 'kn' ? 'ದಯವಿಟ್ಟು ರಿಸೆಪ್ಷನ್‌ನಲ್ಲಿ ವಿಚಾರಿಸಿ' : 'Please check with reception'}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Info Note */}
          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
            <AlertCircle className="text-primary flex-shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-text-secondary">
              {t('queueInfoNote', lang)}
            </p>
          </div>

          {/* Queue Stats */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="card text-center border-b-4 border-b-primary">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="text-primary" size={24} />
              </div>
              <p className="text-text-muted text-sm mb-1">{lang === 'kn' ? 'ಇಂದು ಒಟ್ಟು' : 'Total Today'}</p>
              <p className="text-3xl font-heading font-bold text-primary">{totalPatients || 0}</p>
            </div>
            <div className="card text-center border-b-4 border-b-accent">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="text-accent" size={24} />
              </div>
              <p className="text-text-muted text-sm mb-1">{lang === 'kn' ? 'ಕಾಯುತ್ತಿರುವವರು' : 'Waiting'}</p>
              <p className="text-3xl font-heading font-bold text-accent">
                {patients.filter(p => p.status === 'waiting').length}
              </p>
            </div>
          </div>

          {/* OPD Wait Time Heatmap (Feature 5) */}
          <div className="card mt-8">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-[var(--accent)]" size={24} />
              <h2 className="font-heading font-semibold text-xl text-[var(--primary)]">
                {lang === 'kn' ? 'ಜನಸಂದಣಿ ಉಷ್ಣಪಟ್ಟಿ' : 'OPD Busy Times Heatmap'}
              </h2>
            </div>
            <p className="text-sm text-[var(--text2)] mb-4">
              {lang === 'kn' 
                ? 'ಸಾಪ್ತಾಹಿಕ ಓಪಿಡಿ ಜನಸಂದಣಿ ವಿಶ್ಲೇಷಣೆ - ವೇಳಾಪಟ್ಟಿಯನ್ನು ಯೋಜಿಸಲು ಸಹಾಯಕವಾಗಿದೆ' 
                : 'Weekly OPD crowd analysis - helps schedule your visit to avoid busy times'}
            </p>
            <OPDHeatmap />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
