
import React from 'react';
import { EvaluationResult } from '../types';
import { Translations } from '../translations';
import { 
  CheckCircle, AlertCircle, MessageSquare, ClipboardCheck, 
  GraduationCap, Award, Target, Check, X, ListChecks, HeartPulse, Stethoscope,
  BookOpenCheck, Lightbulb, RefreshCcw, ShieldCheck, Microscope
} from 'lucide-react';

interface Props {
  result: EvaluationResult;
  onReset: () => void;
  t: Translations;
}

const GradeBadge: React.FC<{ grade: string; score: number }> = ({ grade, score }) => {
  const colors: Record<string, string> = {
    Excellent: 'bg-green-100 text-green-700 border-green-200',
    Proficient: 'bg-blue-100 text-blue-700 border-blue-200',
    Average: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Poor: 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <div className="flex flex-col items-end gap-1">
      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${colors[grade] || 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700'}`}>
        {grade}
      </span>
      <span className="text-xs font-mono font-bold text-slate-500">{score}/25</span>
    </div>
  );
};

const ChecklistItem: React.FC<{ label: string; checked: boolean }> = ({ label, checked }) => (
  <div className="flex items-center gap-3 py-1">
    <div className={`p-0.5 rounded-md ${checked ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600'}`}>
      {checked ? <Check size={14} /> : <X size={14} />}
    </div>
    <span className={`text-xs font-bold ${checked ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500 line-through decoration-slate-200 dark:decoration-slate-700'}`}>{label}</span>
  </div>
);

const EvaluationDisplay: React.FC<Props> = ({ result, onReset, t }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 65) return 'text-indigo-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  // Safe data extraction
  const checklist = result.checklist || {};
  const clinicalStructure = checklist.clinicalStructure || {};
  const suggestedQuestions = result.suggestedQuestions || [];
  const vivaAnswers = result.vivaAnswers || [];

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-slate-900 dark:bg-slate-950 rounded-2xl text-white shadow-xl">
            <GraduationCap size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">{t.finalAssessment}</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{t.oscePerformanceReport}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-700 p-4 rounded-3xl border-2 border-slate-100 dark:border-slate-600">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-[0.2em]">{t.overallScore}</p>
            <div className={`text-5xl font-black font-mono leading-none ${getScoreColor(result.totalScore)}`}>
              {result.totalScore}<span className="text-xl text-slate-300 dark:text-slate-500">/100</span>
            </div>
          </div>
          <div className="h-12 w-[2px] bg-slate-200 dark:bg-slate-600" />
          <Award size={40} className={getScoreColor(result.totalScore)} />
        </div>
      </div>

      {/* Existing Four Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <section className="p-6 rounded-3xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 uppercase tracking-tight text-sm">
              <Target size={18} className="text-indigo-600 dark:text-indigo-400" /> {t.diagnosisAndReasoning}
            </h3>
            <GradeBadge grade={result.diagnosisGrade} score={result.diagnosisScore} />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">"{result.diagnosis || t.noFeedbackProvided}"</p>
        </section>

        <section className="p-6 rounded-3xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 uppercase tracking-tight text-sm">
              <ClipboardCheck size={18} className="text-emerald-600 dark:text-emerald-400" /> {t.clinicalStructure}
            </h3>
            <GradeBadge grade={result.clinicalSkillsGrade} score={result.clinicalSkillsScore} />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">"{result.clinicalSkills || t.noFeedbackProvided}"</p>
        </section>

        <section className="p-6 rounded-3xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 uppercase tracking-tight text-sm">
              <AlertCircle size={18} className="text-amber-600 dark:text-amber-400" /> {t.problemSolving}
            </h3>
            <GradeBadge grade={result.problemSolvingGrade} score={result.problemSolvingScore} />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">"{result.problemSolving || t.noFeedbackProvided}"</p>
        </section>

        <section className="p-6 rounded-3xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 uppercase tracking-tight text-sm">
              <MessageSquare size={18} className="text-rose-600 dark:text-rose-400" /> {t.communication}
            </h3>
            <GradeBadge grade={result.communicationGrade} score={result.communicationScore} />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">"{result.communication || t.noFeedbackProvided}"</p>
        </section>
      </div>

      {/* Summary */}
      <div className="p-8 bg-indigo-600 rounded-[2rem] border-4 border-indigo-200 mb-6 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
          <Award size={120} />
        </div>
        <h3 className="font-black text-indigo-100 mb-2 uppercase tracking-[0.2em] text-[10px]">{t.chiefExaminerSummary}</h3>
        <p className="text-xl font-bold leading-snug relative z-10 italic">"{result.summary || t.summaryUnavailable}"</p>
      </div>

      {/* Revealed Diagnosis Banner */}
      {result.actualDiagnosis && (
        <div className="mb-10 animate-in zoom-in-95 duration-700">
          <div className="bg-slate-900 dark:bg-slate-950 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-xl border border-slate-700 dark:border-slate-800">
            <div className="mb-2 flex items-center gap-2 text-indigo-400">
              <Microscope size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t.finalClinicalDiagnosis}</span>
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">{result.actualDiagnosis}</h3>
          </div>
        </div>
      )}

      {/* Detailed Marking Scheme Checklist */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-700 mb-12 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-200 dark:border-slate-700 pb-4">
          <ListChecks size={24} className="text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t.standardizedMarkingScheme}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Part A: Clinical Structure Column */}
          <div className="space-y-8">
            <div>
              <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Stethoscope size={14} /> {t.partAClinicalStructure}
              </h4>
              <div className="space-y-6">
                <div>
                  <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2">{t.openingConsultation}</p>
                  {(clinicalStructure.opening || []).map((item: any, i: number) => (
                    <ChecklistItem key={i} label={item.label} checked={item.checked} />
                  ))}
                  {(!clinicalStructure.opening || clinicalStructure.opening.length === 0) && <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">{t.noChecklistItems}</p>}
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2">{t.understandingComplaint}</p>
                  {(clinicalStructure.exploration || []).map((item: any, i: number) => (
                    <ChecklistItem key={i} label={item.label} checked={item.checked} />
                  ))}
                  {(!clinicalStructure.exploration || clinicalStructure.exploration.length === 0) && <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">{t.noChecklistItems}</p>}
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2">{t.historySystemsReview}</p>
                  {(clinicalStructure.historyGating || []).map((item: any, i: number) => (
                    <ChecklistItem key={i} label={item.label} checked={item.checked} />
                  ))}
                  {(!clinicalStructure.historyGating || clinicalStructure.historyGating.length === 0) && <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">{t.noChecklistItems}</p>}
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2">{t.closingConsultation}</p>
                  {(clinicalStructure.closing || []).map((item: any, i: number) => (
                    <ChecklistItem key={i} label={item.label} checked={item.checked} />
                  ))}
                  {(!clinicalStructure.closing || clinicalStructure.closing.length === 0) && <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">{t.noChecklistItems}</p>}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
              <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <MessageSquare size={14} /> {t.partBCommunication}
              </h4>
              {(checklist.communicationSkills || []).map((item: any, i: number) => (
                <ChecklistItem key={i} label={item.label} checked={item.checked} />
              ))}
              {(!checklist.communicationSkills || checklist.communicationSkills.length === 0) && <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">{t.noChecklistItems}</p>}
            </div>
          </div>

          {/* Part C & D: Viva Reasoning Column */}
          <div className="space-y-8">
            <div>
              <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Target size={14} /> {t.partCDiagnosis}
              </h4>
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2">{t.diagnosticLogic}</p>
              {(checklist.diagnosisReasoning || []).map((item: any, i: number) => (
                <ChecklistItem key={i} label={item.label} checked={item.checked} />
              ))}
              {(!checklist.diagnosisReasoning || checklist.diagnosisReasoning.length === 0) && <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">{t.noChecklistItems}</p>}
            </div>

            <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
              <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <ShieldCheck size={14} /> {t.partDProblemSolving}
              </h4>
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2">{t.acuteManagement}</p>
              {(checklist.problemSolving || []).map((item: any, i: number) => (
                <ChecklistItem key={i} label={item.label} checked={item.checked} />
              ))}
              {(!checklist.problemSolving || checklist.problemSolving.length === 0) && <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">{t.noChecklistItems}</p>}
            </div>
            
            <div className="bg-white dark:bg-slate-700 p-4 rounded-2xl border border-slate-200 dark:border-slate-600 shadow-sm mt-6 transition-colors">
              <p className="text-[10px] text-slate-400 dark:text-slate-300 font-bold leading-relaxed italic">
                {t.checklistNote}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested History Questions Section */}
      {suggestedQuestions.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/10 rounded-[2.5rem] p-8 mb-10 border border-amber-200 dark:border-amber-800/30 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3 mb-8 border-b border-amber-200 dark:border-amber-800/30 pb-4">
            <Lightbulb size={24} className="text-amber-500 dark:text-amber-400" />
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">{t.suggestedClinicalQuestions}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedQuestions.map((item: any, i: number) => (
              <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-amber-100 dark:border-amber-900/30 group hover:border-amber-400 transition-all shadow-sm">
                <p className="text-sm font-black text-slate-800 dark:text-slate-200 mb-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">"{item.question || t.missingQuestion}"</p>
                <div className="flex gap-2 items-start opacity-70">
                  <span className="text-[9px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest pt-0.5">{t.rationale}</span>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">{item.rationale || t.noRationale}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIVA Q&A Section */}
      {vivaAnswers.length > 0 && (
        <div className="bg-white dark:bg-slate-800 border-2 border-indigo-50 dark:border-indigo-900/30 rounded-[2.5rem] p-8 mb-12 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-slate-700 pb-4">
            <BookOpenCheck size={24} className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t.vivaFeedbackCorrectAnswers}</h3>
          </div>
          <div className="space-y-6">
            {vivaAnswers.map((item: any, i: number) => (
              <div key={i} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center text-[10px] font-black">
                    {i + 1}
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 leading-tight">{item.question || t.missingQuestionText}</h4>
                </div>
                <div className="ml-8 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/50 shadow-sm relative">
                  <div className="absolute -left-2 top-4 w-4 h-4 bg-white dark:bg-slate-800 border-l border-t border-indigo-100/50 dark:border-indigo-900/50 rotate-[-45deg]" />
                  <p className="text-[9px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-[0.15em] mb-1.5 flex items-center gap-1.5">
                    <Check size={12} strokeWidth={3} /> {t.correctResponseCPG}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-bold leading-relaxed italic">"{item.answer || t.responseUnavailable}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Button */}
      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="px-12 py-5 bg-slate-900 dark:bg-slate-100 hover:bg-black dark:hover:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest rounded-2xl transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3"
        >
          <RefreshCcw size={20} />
          {t.beginNewSession}
        </button>
      </div>
    </div>
  );
};

export default EvaluationDisplay;
