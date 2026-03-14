
import React from 'react';
import { ArrowLeft, Globe, Moon, Sun } from 'lucide-react';
import { Language, Translations } from '../translations';

interface Props {
  onBack: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
  t: Translations;
}

const SettingsPage: React.FC<Props> = ({ onBack, language, onLanguageChange, isDarkMode, onDarkModeToggle, t }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{t.settings}</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Language Setting */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">{t.language}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">{t.languageDescription}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => onLanguageChange('en')}
              className={`flex-1 py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-sm transition-all border-2 ${
                language === 'en'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl'
                  : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500'
              }`}
            >
              {t.english}
            </button>
            <button
              onClick={() => onLanguageChange('th')}
              className={`flex-1 py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-sm transition-all border-2 ${
                language === 'th'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl'
                  : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500'
              }`}
            >
              {t.thai}
            </button>
          </div>
        </div>

        {/* Dark Mode Setting */}
        <div className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-2xl">
                {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{t.darkMode}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">{t.darkModeDescription}</p>
              </div>
            </div>
            <button
              onClick={onDarkModeToggle}
              className={`px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border-2 ${
                isDarkMode
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
              }`}
            >
              {isDarkMode ? t.on : t.off}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={onBack}
          className="flex items-center gap-3 px-10 py-4 bg-slate-900 border border-transparent dark:border-slate-700 hover:bg-black text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-2xl hover:scale-105 active:scale-95 group"
        >
          <div className="group-hover:-translate-x-1 transition-transform">
            <ArrowLeft size={20} />
          </div>
          {t.backToSimulation}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
