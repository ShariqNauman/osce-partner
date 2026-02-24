
import React from 'react';
import { Check, ArrowLeft, Zap, Shield, Building2, CreditCard, Sparkles } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const SubscriptionPage: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Upgrade Your Clinical Edge</h2>
        <p className="text-slate-500 font-bold max-w-2xl mx-auto">
          Choose the plan that fits your stage of medical education. From individual mastery to institutional-scale licensing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Tier 1: Basic */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl flex flex-col hover:border-slate-300 transition-all">
          <div className="mb-8">
            <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
              Basic
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-4">Foundation</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-900">RM 0</span>
              <span className="text-slate-400 font-bold text-sm">/ forever</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 mb-10">
            <FeatureItem label="Unlimited AI Voice History Taking" />
            <FeatureItem label="2 Physical Exam Cases / Month" />
            <FeatureItem label="Basic Cardiology Question Bank" />
            <FeatureItem label="Community Support" />
            <FeatureItem label="Spaced Repetition" crossed />
          </div>

          <button className="w-full py-4 bg-slate-100 text-slate-900 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all border border-slate-200">
            Current Plan
          </button>
        </div>

        {/* Tier 2: Pro */}
        <div className="bg-white rounded-[2.5rem] p-8 border-4 border-indigo-600 shadow-2xl flex flex-col relative scale-105 z-10">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
            <Sparkles size={14} fill="currentColor" /> Most Popular
          </div>
          
          <div className="mb-8">
            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
              Pro
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-4">Clinical Excellence</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-black text-indigo-600">RM 29</span>
              <span className="text-slate-400 font-bold text-sm">/ month</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 mb-10">
            <FeatureItem label="Full Z-Axis Hand-Tracking Access" highlight />
            <FeatureItem label="Unlimited Physical Exam Cases" highlight />
            <FeatureItem label="Advanced Spaced Repetition" highlight />
            <FeatureItem label="Priority AI Processing" />
            <FeatureItem label="Personalized Performance Dashboard" />
            <FeatureItem label="Clinical Guideline Deep-Links" />
          </div>

          <button className="w-full py-4 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
            <CreditCard size={18} /> Upgrade to Pro
          </button>
        </div>

        {/* Tier 3: B2B */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl flex flex-col hover:border-slate-300 transition-all">
          <div className="mb-8">
            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              B2B
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-4">Uni-Link</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">Custom Quote</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 mb-10">
            <FeatureItem label="Bulk Student Account Provisioning" />
            <FeatureItem label="Tutor Dashboard & Tracking" highlight />
            <FeatureItem label="Custom Case Creator for Lecturers" highlight />
            <FeatureItem label="API Integration with LMS" />
            <FeatureItem label="Dedicated Success Manager" />
            <FeatureItem label="Institutional Analytics Report" />
          </div>

          <button className="w-full py-4 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2">
            <Building2 size={18} /> Contact Sales
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="flex items-center gap-3 px-10 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black uppercase tracking-widest rounded-2xl transition-all group"
        >
          <div className="group-hover:-translate-x-1 transition-transform">
            <ArrowLeft size={20} />
          </div>
          Back to Simulation
        </button>
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{ label: string; crossed?: boolean; highlight?: boolean }> = ({ label, crossed, highlight }) => (
  <div className={`flex items-start gap-3 ${crossed ? 'opacity-40' : 'opacity-100'}`}>
    <div className={`mt-0.5 p-0.5 rounded-full ${crossed ? 'bg-slate-100 text-slate-400' : (highlight ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600')}`}>
      <Check size={12} strokeWidth={4} />
    </div>
    <span className={`text-xs font-bold leading-relaxed ${crossed ? 'line-through' : (highlight ? 'text-indigo-900' : 'text-slate-600')}`}>
      {label}
    </span>
  </div>
);

export default SubscriptionPage;
