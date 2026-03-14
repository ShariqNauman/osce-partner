
import React from 'react';
import { UserData } from '../types';
import { Translations } from '../translations';
import { TrendingUp, Calendar, Award, User, ChevronRight, BarChart3, Clock, ArrowLeft, Trash2, AlertCircle, RefreshCcw, EyeOff, BookOpen } from 'lucide-react';

interface Props {
  userData: UserData;
  onBack: () => void;
  onClear: () => void;
  onRestartCycle: () => void;
  t: Translations;
}

// Spaced Repetition Sequence
const REPETITION_SEQUENCE = [2, 3, 5, 7]; 

const ProgressDashboard: React.FC<Props> = ({ userData, onBack, onClear, onRestartCycle, t }) => {
  const avgScore = userData.history.length > 0 
    ? Math.round(userData.history.reduce((acc, curr) => acc + curr.score, 0) / userData.history.length)
    : 0;

  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-50 border-emerald-100';
    if (score >= 65) return 'text-medical-600 bg-medical-50 border-medical-100';
    if (score >= 50) return 'text-amber-500 bg-amber-50 border-amber-100';
    return 'text-rose-500 bg-rose-50 border-rose-100';
  };

  const currentLevel = userData.repetitionLevel ?? 0;
  const currentWaitMinutes = (currentLevel >= 1 && currentLevel <= 4) ? REPETITION_SEQUENCE[currentLevel - 1] : 0;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] shadow-2xl border border-medical-200 dark:border-medical-800 overflow-hidden mb-8 transition-colors duration-300">
        <div className="bg-medical-900 dark:bg-black p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-300">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-medical-400 to-medical-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-3">
              <User size={40} className="text-white" />
            </div>
            <div>
              <p className="text-medical-300 font-black uppercase tracking-[0.2em] text-[10px] mb-1">{t.studentProfile}</p>
              <h2 className="text-3xl font-black">{userData.name}</h2>
              <p className="text-medical-400 dark:text-medical-500 font-bold text-sm">{userData.history.length} {t.encountersCompleted}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-medical-800 p-4 rounded-2xl border border-medical-700 min-w-[120px]">
              <p className="text-[9px] font-black text-medical-500 uppercase tracking-widest mb-1">{t.avgProficiency}</p>
              <div className="text-3xl font-black font-mono flex items-baseline gap-1">
                {avgScore}<span className="text-sm text-medical-500">%</span>
              </div>
            </div>
            <div className="bg-medical-800 p-4 rounded-2xl border border-medical-700 min-w-[120px]">
              <p className="text-[9px] font-black text-medical-500 uppercase tracking-widest mb-1">{t.repetitionStatus}</p>
              <div className="text-lg font-black uppercase tracking-tight text-medical-400 flex items-center gap-2">
                {currentLevel === 5 ? (
                  <span className="text-rose-400 flex items-center gap-2"><EyeOff size={16} /> {t.exhausted}</span>
                ) : (currentLevel >= 1 && currentLevel <= 4) ? (
                  <><RefreshCcw size={16} /> {t.stage} {currentLevel}</>
                ) : (
                  <><TrendingUp size={16} /> {t.healthy}</>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-medical-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
              <BarChart3 className="text-medical-600 dark:text-medical-400" size={20} /> {t.performanceLog}
            </h3>
            {userData.history.length > 0 && (
              <button 
                onClick={onClear}
                className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-medical-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
              >
                <Trash2 size={12} /> {t.resetData}
              </button>
            )}
          </div>

          <div className="space-y-4">
            {userData.history.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-medical-100 dark:border-medical-800 rounded-[2rem]">
                <Calendar className="mx-auto text-medical-200 dark:text-medical-600 mb-4" size={48} />
                <p className="text-medical-400 dark:text-medical-500 font-bold italic">{t.noSimulationHistory}</p>
              </div>
            ) : (
              [...userData.history].reverse().map((item, index) => {
                const isLatest = index === 0;
                return (
                  <div key={item.id} className="flex flex-col gap-2">
                    <div className="group p-5 bg-medical-50 dark:bg-dark-surface hover:bg-white dark:hover:bg-medical-800 rounded-2xl border border-transparent hover:border-medical-200 dark:hover:border-medical-700 hover:shadow-xl transition-all duration-300 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-dark-surface rounded-xl border border-medical-200 dark:border-medical-800 flex items-center justify-center text-medical-400 dark:text-medical-500 group-hover:bg-medical-50 dark:group-hover:bg-medical-900 group-hover:text-medical-600 dark:group-hover:text-medical-400 group-hover:border-medical-100 dark:group-hover:border-medical-800 transition-colors shadow-sm">
                          <Clock size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-medical-800 dark:text-medical-100 leading-none mb-1">{item.caseTitle}</h4>
                          {item.actualDiagnosis && (
                            <p className="text-[10px] font-black text-medical-500 tracking-tight mb-1.5">{item.actualDiagnosis}</p>
                          )}
                          <p className="text-[10px] text-medical-400 dark:text-medical-500 font-bold uppercase tracking-wider flex items-center gap-2">
                            {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className={`px-4 py-2 rounded-xl border font-black text-xl font-mono shadow-sm ${getScoreColorClass(item.score)}`}>
                          {item.score}<span className="text-[10px] ml-1 opacity-70">/100</span>
                        </div>
                        <ChevronRight size={20} className="text-medical-300 group-hover:text-medical-600 transition-colors" />
                      </div>
                    </div>
                    
                    {/* Status note for the latest entry if failed */}
                    {(item.score < 50 && isLatest) && (
                      <div className={`mx-4 flex flex-col gap-2 px-6 py-4 border rounded-[1.5rem] animate-in slide-in-from-top-2 duration-500 ${currentLevel === 5 ? 'bg-rose-50 border-rose-100' : 'bg-medical-50 border-medical-100'}`}>
                        <div className="flex items-center gap-2">
                          {currentLevel === 5 ? <AlertCircle size={16} className="text-rose-500" /> : <RefreshCcw size={16} className="text-medical-600" />}
                          <p className={`text-xs font-black uppercase tracking-tight ${currentLevel === 5 ? 'text-rose-600' : 'text-medical-600'}`}>
                            {currentLevel === 5 ? t.remediationCycleExhausted : `${t.spacedRepetitionActive} ${currentLevel}`}
                          </p>
                        </div>
                        
                        {currentLevel === 5 ? (
                          <div className="flex flex-col gap-3">
                            <p className="text-xs font-bold text-medical-600 italic leading-relaxed">
                              {t.failedMoreThan5}
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs font-bold text-medical-600 italic">
                            {t.nextRefresher} {currentWaitMinutes} {t.minutes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="flex items-center gap-3 px-10 py-4 bg-medical-900 border border-transparent dark:border-medical-800 hover:bg-black text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-2xl hover:scale-105 active:scale-95 group"
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

export default ProgressDashboard;
