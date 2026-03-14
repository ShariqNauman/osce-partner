
import React from 'react';
import { Translations } from '../translations';
import { Check, ArrowLeft, Zap, Shield, Building2, CreditCard, Sparkles } from 'lucide-react';

interface Props {
  onBack: () => void;
  t: Translations;
}

const SubscriptionPage: React.FC<Props> = ({ onBack, t }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-medical-900 dark:text-white mb-4 tracking-tight">{t.upgradeTitle}</h2>
        <p className="text-medical-500 dark:text-medical-400 font-bold max-w-2xl mx-auto">
          {t.upgradeDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Tier 1: Basic */}
        <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] p-8 border border-medical-200 dark:border-medical-800 shadow-xl flex flex-col hover:border-medical-300 dark:hover:border-medical-600 transition-all">
          <div className="mb-8">
            <span className="px-4 py-1.5 bg-medical-50 dark:bg-dark-bg text-medical-600 dark:text-medical-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-medical-200 dark:border-medical-800">
              {t.basic}
            </span>
            <h3 className="text-2xl font-black text-medical-900 dark:text-white mt-4">{t.foundation}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-black text-medical-900 dark:text-white">RM 0</span>
              <span className="text-medical-400 dark:text-medical-500 font-bold text-sm">/ {t.forever}</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 mb-10">
            <FeatureItem label={t.unlimitedVoice} />
            <FeatureItem label={t.physicalExamCases} />
            <FeatureItem label={t.basicCardiology} />
            <FeatureItem label={t.communitySupport} />
            <FeatureItem label={t.spacedRepetition} crossed />
          </div>

          <button className="w-full py-4 bg-medical-50 dark:bg-dark-bg text-medical-900 dark:text-white font-black uppercase tracking-widest rounded-2xl hover:bg-medical-100 dark:hover:bg-medical-900 transition-all border border-medical-200 dark:border-medical-800">
            {t.currentPlan}
          </button>
        </div>

        {/* Tier 2: Pro */}
        <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] p-8 border-4 border-medical-600 dark:border-medical-500 shadow-2xl flex flex-col relative scale-105 z-10">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-medical-600 dark:bg-medical-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
            <Sparkles size={14} fill="currentColor" /> {t.mostPopular}
          </div>
          
          <div className="mb-8">
            <span className="px-4 py-1.5 bg-medical-50 dark:bg-medical-900/10 text-medical-600 dark:text-medical-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-medical-100 dark:border-medical-800">
              {t.pro}
            </span>
            <h3 className="text-2xl font-black text-medical-900 dark:text-white mt-4">{t.clinicalExcellence}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-black text-medical-600 dark:text-medical-400">RM 29</span>
              <span className="text-medical-400 dark:text-medical-500 font-bold text-sm">/ {t.month}</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 mb-10">
            <FeatureItem label={t.fullZAxis} highlight />
            <FeatureItem label={t.unlimitedPhysical} highlight />
            <FeatureItem label={t.advancedSpaced} highlight />
            <FeatureItem label={t.priorityAI} />
            <FeatureItem label={t.personalizedDashboard} />
            <FeatureItem label={t.clinicalGuidelineLinks} />
          </div>

          <button onClick={() => window.open('https://buy.stripe.com/test_eVq9ASa2B532c0w3ELafS03', '_blank')} className="w-full py-4 bg-medical-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-medical-700 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
            <CreditCard size={18} /> {t.upgradeToPro}
          </button>
        </div>

        {/* Tier 3: B2B */}
        <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] p-8 border border-medical-200 dark:border-medical-800 shadow-xl flex flex-col hover:border-medical-300 dark:hover:border-medical-600 transition-all">
          <div className="mb-8">
            <span className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">
              {t.b2b}
            </span>
            <h3 className="text-2xl font-black text-medical-900 dark:text-white mt-4">{t.uniLink}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black text-medical-900 dark:text-white">{t.customQuote}</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 mb-10">
            <FeatureItem label={t.bulkStudent} />
            <FeatureItem label={t.tutorDashboard} highlight />
            <FeatureItem label={t.customCaseCreator} highlight />
            <FeatureItem label={t.apiIntegration} />
            <FeatureItem label={t.dedicatedManager} />
            <FeatureItem label={t.institutionalAnalytics} />
          </div>

          <button className="w-full py-4 bg-medical-900 dark:bg-medical-50 text-white dark:text-medical-900 font-black uppercase tracking-widest rounded-2xl hover:bg-black dark:hover:bg-white transition-all flex items-center justify-center gap-2">
            <Building2 size={18} /> {t.contactSales}
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="flex items-center gap-3 px-10 py-4 bg-medical-50 dark:bg-dark-surface hover:bg-medical-100 dark:hover:bg-medical-800 text-medical-700 dark:text-medical-200 font-black uppercase tracking-widest rounded-2xl transition-all group"
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

const FeatureItem: React.FC<{ label: string; crossed?: boolean; highlight?: boolean }> = ({ label, crossed, highlight }) => (
  <div className={`flex items-start gap-3 ${crossed ? 'opacity-40' : 'opacity-100'}`}>
    <div className={`mt-0.5 p-0.5 rounded-full ${crossed ? 'bg-medical-100 dark:bg-dark-bg text-medical-400 dark:text-medical-500' : (highlight ? 'bg-medical-100 dark:bg-medical-900/50 text-medical-600 dark:text-medical-400' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400')}`}>
      <Check size={12} strokeWidth={4} />
    </div>
    <span className={`text-xs font-bold leading-relaxed ${crossed ? 'line-through' : (highlight ? 'text-medical-900 dark:text-medical-100' : 'text-medical-600 dark:text-medical-300')}`}>
      {label}
    </span>
  </div>
);

export default SubscriptionPage;
