
export const REPETITION_SEQUENCE = [2, 3, 5, 7]; // Minute sequence for wait logic

export const GET_STAGE_MESSAGE = (stage: number, lang: 'en' | 'th' = 'en') => {
  const messages: Record<string, string[]> = {
    en: [
      "Quick check-in! Let's revisit the cardiovascular basics for this case to reinforce your initial learning.",
      "Persistence pays off. Try reviewing the pathophysiology or clinical guidelines before this attempt.",
      "Deep dive required. A focused review of management protocols is recommended for this stage.",
      "Final review cycle. Focus strictly on clinical reasoning and diagnostic criteria to master this case."
    ],
    th: [
      "เช็คอินด่วน! มาทบทวนพื้นฐานโรคหัวใจและหลอดเลือดสำหรับเคสนี้เพื่อเสริมการเรียนรู้เบื้องต้นของคุณ",
      "ความพยายามคุ้มค่า ลองทบทวนพยาธิสรีรวิทยาหรือแนวทางทางคลินิกก่อนครั้งนี้",
      "จำเป็นต้องศึกษาเจาะลึก แนะนำให้ทบทวนโปรโตคอลการจัดการอย่างตั้งใจสำหรับระยะนี้",
      "รอบทบทวนสุดท้าย มุ่งเน้นเฉพาะการให้เหตุผลทางคลินิกและเกณฑ์การวินิจฉัยเพื่อเชี่ยวชาญเคสนี้"
    ]
  };
  const defaultMsg = lang === 'th' ? "ถึงเวลาทบทวนทางคลินิก" : "Time for a clinical refresher attempt.";
  return (messages[lang] || messages.en)[stage - 1] || defaultMsg;
};

// Fixed high-quality medical anatomy image for cardiology cases
// This URL points to a clean, professional medical-style human chest photo
export const FIXED_CHEST_IMAGE = "https://images.unsplash.com/photo-1579154235823-6b1b74c7fd83?auto=format&fit=crop&q=80&w=1000";

export const CASE_GENERATOR_PROMPT = (lang: 'en' | 'th' = 'en') => {
  const langName = lang === 'th' ? 'Thai' : 'English';
  return `
Generate a professional OSCE medical case strictly based on the 2021 Malaysian Clinical Practice Guidelines for Management of Non-ST Elevation Myocardial Infarction (NSTE-ACS).
THE PATIENT: Mr. Tan Ah Kok, 70 years old (701021-10-1991), plumber, experiencing central chest pain for 2 hours.

ALL text content in the JSON output MUST be in ${langName}.

# CLINICAL REQUIREMENTS (Based on NSTE-ACS CPG 2021):
- Diagnosis: Differentiation between UA and NSTEMI based on cardiac troponins (rise/fall).
- Initial Meds: 300mg Aspirin loading (chewed), P2Y12 inhibitors (Clopidogrel/Ticagrelor early).
- Oxygen: Only if SpO2 < 95%.
- Pain relief: GTN (sublingual/spray), then IV Morphine/Fentanyl if unrelieved.
- Anticoagulation: UFH/LMWH/Fondaparinux (Fondaparinux preferred for medical management).
- Risk Stratification: Use of HEART/GRACE/TIMI scores to determine invasive strategy timing.

Return ONLY a RAW JSON object. DO NOT include markdown formatting or extra text.
# VIVA QUESTION RULES:
1. DO NOT mention "NSTE-ACS", "Unstable Angina", or "NSTEMI" in the questions.
2. DO NOT reveal that the 2021 Malaysian CPG is being used.
3. Keep questions open-ended to test clinical reasoning.
4. ALL text content MUST be in ${langName}.

{
  "title": "Mr. Tan Ah Kok - Cardiovascular Case",
  "patientName": "Tan Ah Kok",
  "patientAge": "70",
  "gender": "Male",
  "icNumber": "701021-10-1991",
  "personaName": "Mr. Tan",
  "chiefComplaint": "Crushing central chest pain",
  "briefingText": "...(in ${langName})",
  "systemInstruction": "...(in ${langName})",
  "vivaQuestions": ["...(in ${langName})"]
}
`;
};

export const EXAMINER_INSTRUCTION = (caseTitle: string, questions: string[], lang: 'en' | 'th' = 'en') => {
  const langName = lang === 'th' ? 'Thai' : 'English';
  return `
# IDENTITY
You are a professional Cardiovascular Clinical Examiner for: "${caseTitle}".

# CONDUCT
- STRICT LANGUAGE MODE: Speak ONLY ${langName}.
- DO NOT reveal the diagnosis ("NSTEMI/UA") or the specific guideline name ("2021 NSTE-ACS CPG") to the student.
- NATURAL INTERACTION: Acknowledge greetings politely.
- SKIP RULE: If the student says "I don't know", "skip", or "not sure", acknowledge neutrally (e.g., 'Understood, let's move to the next question') and ask the next question immediately.
- Transition once the student gives a satisfactory clinical answer or asks to skip.
- Conclusion: Once all questions are finished, say: ${lang === 'th' ? '"ขอบคุณครับ/ค่ะ การสอบปากเปล่าเสร็จสิ้นแล้ว"' : '"Thank you, that concludes the Viva session."'}
`;
};

export const EVALUATION_PROMPT = (history: string, caseTitle: string, vivaQuestions: string[], lang: 'en' | 'th' = 'en') => {
  const langName = lang === 'th' ? 'Thai' : 'English';
  return `
# TASK
Evaluate the MEDICAL STUDENT'S performance in this Cardiovascular OSCE: "${caseTitle}".
Use the 2021 Malaysian NSTE-ACS CPG as the gold standard for management and diagnosis.

ALL feedback text in the JSON output MUST be in ${langName}.

# CLINICAL INTERACTION DATA
${history}

# RUBRIC & SCORING (Out of 100)
1. Diagnosis Accuracy & Reasoning (0-25): Testing differentiation logic (troponins).
2. Problem-Solving & Clinical Logic (0-25): Checking risk stratification (HEART/GRACE) and revascularization timing (24h/72h).
3. Communication & Rapport (0-25): Evaluates how the student handled the patient's high anxiety and acute distress.
4. Clinical Skills (0-25): Targeted history (SOCRATES) and correct dosing (300mg Aspirin).

# OUTPUT FORMAT
Return ONLY a RAW JSON object. ALL text values MUST be in ${langName}.
{
  "actualDiagnosis": "NSTE-ACS (Specifically NSTEMI)",
  "diagnosis": "Feedback on diagnostic reasoning...",
  "diagnosisGrade": "Excellent | Proficient | Average | Poor",
  "diagnosisScore": number,
  "problemSolving": "Feedback on management timing and risk scores...",
  "problemSolvingGrade": "Excellent | Proficient | Average | Poor",
  "problemSolvingScore": number,
  "communication": "Feedback on empathy and handling the patient's panic...",
  "communicationGrade": "Excellent | Proficient | Average | Poor",
  "communicationScore": number,
  "clinicalSkills": "Feedback on SOCRATES/History taking...",
  "clinicalSkillsGrade": "Excellent | Proficient | Average | Poor",
  "clinicalSkillsScore": number,
  "totalScore": number,
  "summary": "Direct constructive feedback referencing 2021 CPG gaps.",
  "checklist": {
    "clinicalStructure": {
       "opening": [{"label": "...(in ${langName})", "checked": boolean}],
       "exploration": [{"label": "...(in ${langName})", "checked": boolean}],
       "historyGating": [{"label": "...(in ${langName})", "checked": boolean}],
       "closing": [{"label": "...(in ${langName})", "checked": boolean}]
    },
    "communicationSkills": [{"label": "...(in ${langName})", "checked": boolean}],
    "diagnosisReasoning": [{"label": "...(in ${langName})", "checked": boolean}],
    "problemSolving": [{"label": "...(in ${langName})", "checked": boolean}]
  },
  "suggestedQuestions": [{"question": "...(in ${langName})", "rationale": "...(in ${langName})"}],
  "vivaAnswers": [{"question": "...(in ${langName})", "answer": "...(in ${langName})"}]
}
`;
};
