
import React from 'react';
import { EvaluationResult } from '../types';
import { 
  CheckCircle, AlertCircle, MessageSquare, ClipboardCheck, 
  GraduationCap, Award, Target, Check, X, ListChecks, HeartPulse, Stethoscope,
  BookOpenCheck, Lightbulb, RefreshCcw, ShieldCheck, Microscope
} from 'lucide-react';

interface Props {
  result: EvaluationResult;
  onReset: () => void;
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
      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${colors[grade] || 'bg-gray-100 text-gray-700'}`}>
        {grade}
      </span>
      <span className="text-xs font-mono font-bold text-slate-500">{score}/25</span>
    </div>
  );
};

const ChecklistItem: React.FC<{ label: string; checked: boolean }> = ({ label, checked }) => (
  <div className="flex items-center gap-3 py-1">
    <div className={`p-0.5 rounded-md ${checked ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-300'}`}>
      {checked ? <Check size={14} /> : <X size={14} />}
    </div>
    <span className={`text-xs font-bold ${checked ? 'text-slate-700' : 'text-slate-400 line-through decoration-slate-200'}`}>{label}</span>
  </div>
);

const EvaluationDisplay: React.FC<Props> = ({ result, onReset }) => {
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
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-xl">
            <GraduationCap size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 leading-tight">Final Assessment</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">OSCE Clinical Performance Report</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border-2 border-slate-100">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Overall Score</p>
            <div className={`text-5xl font-black font-mono leading-none ${getScoreColor(result.totalScore)}`}>
              {result.totalScore}<span className="text-xl text-slate-300">/100</span>
            </div>
          </div>
          <div className="h-12 w-[2px] bg-slate-200" />
          <Award size={40} className={getScoreColor(result.totalScore)} />
        </div>
      </div>

      {/* Existing Four Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <section className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight text-sm">
              <Target size={18} className="text-indigo-600" /> Diagnosis & Reasoning
            </h3>
            <GradeBadge grade={result.diagnosisGrade} score={result.diagnosisScore} />
          </div>
          <p className="text-sm text-slate-600 leading-relaxed font-medium italic">"{result.diagnosis || 'No feedback provided'}"</p>
        </section>

        <section className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight text-sm">
              <ClipboardCheck size={18} className="text-emerald-600" /> Clinical Structure
            </h3>
            <GradeBadge grade={result.clinicalSkillsGrade} score={result.clinicalSkillsScore} />
          </div>
          <p className="text-sm text-slate-600 leading-relaxed font-medium italic">"{result.clinicalSkills || 'No feedback provided'}"</p>
        </section>

        <section className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight text-sm">
              <AlertCircle size={18} className="text-amber-600" /> Problem-Solving
            </h3>
            <GradeBadge grade={result.problemSolvingGrade} score={result.problemSolvingScore} />
          </div>
          <p className="text-sm text-slate-600 leading-relaxed font-medium italic">"{result.problemSolving || 'No feedback provided'}"</p>
        </section>

        <section className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight text-sm">
              <MessageSquare size={18} className="text-rose-600" /> Communication
            </h3>
            <GradeBadge grade={result.communicationGrade} score={result.communicationScore} />
          </div>
          <p className="text-sm text-slate-600 leading-relaxed font-medium italic">"{result.communication || 'No feedback provided'}"</p>
        </section>
      </div>

      {/* Summary */}
      <div className="p-8 bg-indigo-600 rounded-[2rem] border-4 border-indigo-200 mb-6 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
          <Award size={120} />
        </div>
        <h3 className="font-black text-indigo-100 mb-2 uppercase tracking-[0.2em] text-[10px]">Chief Examiner's Summary</h3>
        <p className="text-xl font-bold leading-snug relative z-10 italic">"{result.summary || 'Summary unavailable'}"</p>
      </div>

      {/* Revealed Diagnosis Banner */}
      {result.actualDiagnosis && (
        <div className="mb-10 animate-in zoom-in-95 duration-700">
          <div className="bg-slate-900 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-xl border border-slate-700">
            <div className="mb-2 flex items-center gap-2 text-indigo-400">
              <Microscope size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Final Clinical Diagnosis Revealed</span>
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">{result.actualDiagnosis}</h3>
          </div>
        </div>
      )}

      {/* Detailed Marking Scheme Checklist */}
      <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-200 mb-12">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-4">
          <ListChecks size={24} className="text-indigo-600" />
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Standardized Marking Scheme</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Part A: Clinical Structure Column */}
          <div className="space-y-8">
            <div>
              <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Stethoscope size={14} /> Part A: Clinical Structure
              </h4>
              <div className="space-y-6">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Opening the consultation</p>
                  {(clinicalStructure.opening || []).map((item: any, i: number) => (
                    <ChecklistItem key={i} label={item.label} checked={item.checked} />
                  ))}
                  {(!clinicalStructure.opening || clinicalStructure.opening.length === 0) && <p className="text-[10px] text-slate-400 italic">No checklist items generated</p>}
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Understanding complaint</p>
                  {(clinicalStructure.exploration || []).map((item: any, i: number) => (
                    <ChecklistItem key={i} label={item.label} checked={item.checked} />
                  ))}
                  {(!clinicalStructure.exploration || clinicalStructure.exploration.length === 0) && <p className="text-[10px] text-slate-400 italic">No checklist items generated</p>}
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-2">History & Systems Review</p>
                  {(clinicalStructure.historyGating || []).map((item: any, i: number) => (
                    <ChecklistItem key={i} label={item.label} checked={item.checked} />
                  ))}
                  {(!clinicalStructure.historyGating || clinicalStructure.historyGating.length === 0) && <p className="text-[10px] text-slate-400 italic">No checklist items generated</p>}
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Closing the consultation</p>
                  {(clinicalStructure.closing || []).map((item: any, i: number) => (
                    <ChecklistItem key={i} label={item.label} checked={item.checked} />
                  ))}
                  {(!clinicalStructure.closing || clinicalStructure.closing.length === 0) && <p className="text-[10px] text-slate-400 italic">No checklist items generated</p>}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200">
              <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <MessageSquare size={14} /> Part B: Communication
              </h4>
              {(checklist.communicationSkills || []).map((item: any, i: number) => (
                <ChecklistItem key={i} label={item.label} checked={item.checked} />
              ))}
              {(!checklist.communicationSkills || checklist.communicationSkills.length === 0) && <p className="text-[10px] text-slate-400 italic">No checklist items generated</p>}
            </div>
          </div>

          {/* Part C & D: Viva Reasoning Column */}
          <div className="space-y-8">
            <div>
              <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Target size={14} /> Part C: Diagnosis and Reasoning
              </h4>
              <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Diagnostic logic & CPG Adherence</p>
              {(checklist.diagnosisReasoning || []).map((item: any, i: number) => (
                <ChecklistItem key={i} label={item.label} checked={item.checked} />
              ))}
              {(!checklist.diagnosisReasoning || checklist.diagnosisReasoning.length === 0) && <p className="text-[10px] text-slate-400 italic">No checklist items generated</p>}
            </div>

            <div className="pt-8 border-t border-slate-200">
              <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <ShieldCheck size={14} /> Part D: Problem Solving
              </h4>
              <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Acute Management & Therapeutics</p>
              {(checklist.problemSolving || []).map((item: any, i: number) => (
                <ChecklistItem key={i} label={item.label} checked={item.checked} />
              ))}
              {(!checklist.problemSolving || checklist.problemSolving.length === 0) && <p className="text-[10px] text-slate-400 italic">No checklist items generated</p>}
            </div>
            
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mt-6">
              <p className="text-[10px] text-slate-400 font-bold leading-relaxed italic">
                * items marked with a cross were not explicitly identified in the conversation transcript or VIVA response session.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested History Questions Section */}
      {suggestedQuestions.length > 0 && (
        <div className="bg-amber-50 rounded-[2.5rem] p-8 mb-10 border border-amber-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8 border-b border-amber-200 pb-4">
            <Lightbulb size={24} className="text-amber-500" />
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Suggested Clinical History Questions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedQuestions.map((item: any, i: number) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-amber-100 group hover:border-amber-400 transition-all shadow-sm">
                <p className="text-sm font-black text-slate-800 mb-2 leading-snug group-hover:text-amber-600 transition-colors">"{item.question || 'Missing question'}"</p>
                <div className="flex gap-2 items-start opacity-70">
                  <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest pt-0.5">Rationale:</span>
                  <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">{item.rationale || 'No rationale provided'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIVA Q&A Section */}
      {vivaAnswers.length > 0 && (
        <div className="bg-white border-2 border-indigo-50 rounded-[2.5rem] p-8 mb-12 shadow-sm">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
            <BookOpenCheck size={24} className="text-indigo-600" />
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">VIVA Feedback & Correct Answers</h3>
          </div>
          <div className="space-y-6">
            {vivaAnswers.map((item: any, i: number) => (
              <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                    {i + 1}
                  </div>
                  <h4 className="text-sm font-black text-slate-900 leading-tight">{item.question || 'Missing question text'}</h4>
                </div>
                <div className="ml-8 p-4 bg-white rounded-2xl border border-indigo-100/50 shadow-sm relative">
                  <div className="absolute -left-2 top-4 w-4 h-4 bg-white border-l border-t border-indigo-100/50 rotate-[-45deg]" />
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.15em] mb-1.5 flex items-center gap-1.5">
                    <Check size={12} strokeWidth={3} /> Correct Response (CPG Standards)
                  </p>
                  <p className="text-sm text-slate-600 font-bold leading-relaxed italic">"{item.answer || 'Response unavailable'}"</p>
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
          className="px-12 py-5 bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3"
        >
          <RefreshCcw size={20} />
          Begin New Session
        </button>
      </div>
    </div>
  );
};

export default EvaluationDisplay;
