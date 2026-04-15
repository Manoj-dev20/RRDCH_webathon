import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('rrdch-lang') || 'en');
  
  const toggle = () => {
    const next = lang === 'en' ? 'kn' : 'en';
    setLang(next);
    localStorage.setItem('rrdch-lang', next);
  };

  const setLanguage = (language) => {
    if (language === 'en' || language === 'kn') {
      setLang(language);
      localStorage.setItem('rrdch-lang', language);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle, setLanguage }}>
      <div className={lang === 'kn' ? 'kannada' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
