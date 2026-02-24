
export const REPETITION_SEQUENCE = [2, 3, 5, 7]; // Minute sequence for wait logic

export const GET_STAGE_MESSAGE = (stage: number) => {
  const messages = [
    "Quick check-in! Let's revisit the cardiovascular basics for this case to reinforce your initial learning.",
    "Persistence pays off. Try reviewing the pathophysiology or clinical guidelines before this attempt.",
    "Deep dive required. A focused review of management protocols is recommended for this stage.",
    "Final review cycle. Focus strictly on clinical reasoning and diagnostic criteria to master this case."
  ];
  return messages[stage - 1] || "Time for a clinical refresher attempt.";
};

// Fixed high-quality medical anatomy image for cardiology cases
// This URL points to a clean, professional medical-style human chest photo
export const FIXED_CHEST_IMAGE = "https://images.unsplash.com/photo-1579154235823-6b1b74c7fd83?auto=format&fit=crop&q=80&w=1000";

export const CASE_GENERATOR_PROMPT = `
Generate a professional OSCE medical case strictly based on the 2021 Malaysian Clinical Practice Guidelines for Management of Non-ST Elevation Myocardial Infarction (NSTE-ACS).
THE PATIENT: Mr. Tan Ah Kok, 70 years old (701021-10-1991), plumber, experiencing central chest pain for 2 hours.

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

{
  "title": "Mr. Tan Ah Kok - Cardiovascular Case",
  "patientName": "Tan Ah Kok",
  "patientAge": "70",
  "gender": "Male",
  "icNumber": "701021-10-1991",
  "personaName": "Mr. Tan",
  "chiefComplaint": "Crushing central chest pain",
  "briefingText": "You are the MO in the Emergency Department. Mr. Tan Ah Kok, a 70-year-old plumber, presents with central chest pain starting 2 hours ago. Perform a targeted history and outline your immediate plan.",
  "systemInstruction": "STRICT IDENTITY: You are Tan Ah Kok, 70, Plumber. IC: 701021-10-1991. 
    LANGUAGE: English ONLY. 
    IDENTITY: Act as a patient with NSTE-ACS logic (NSTEMI/UA).
    - STATE: HIGHLY ANXIOUS and in acute distress.
    - Pain: Heavy pressure, central, radiates to left jaw and arm.
    - Behavior: Breathless, speaks in short bursts. Frequently asks 'Doctor, am I dying?', 'Is it my heart?'. 
    - Anxiety Cues: Sounds panicked, winces during the interaction, mentions worry about his wife at home.
    - Risk Factors: smoker (1 pack/day), Father died of heart attack at 68.
    - GATING: Reveal history (smoking, father's death, meds) ONLY when the student specifically asks for that category.",
  "vivaQuestions": [
    "What specific investigations would you prioritize to differentiate between the different types of acute coronary syndrome in this patient?",
    "Explain your strategy for risk-stratifying this patient and how the resulting score would influence your decision on the timing of invasive management.",
    "Describe your initial pharmacological management plan in the Emergency Department, specifically regarding antiplatelet and anticoagulant choices.",
    "Under what clinical circumstances would you recommend an immediate invasive strategy (within 2 hours) for this patient according to standard protocols?",
    "Identify the core components of the secondary prevention pharmacotherapy you would initiate before discharging this patient."
  ]
}
`;

export const EXAMINER_INSTRUCTION = (caseTitle: string, questions: string[]) => `
# IDENTITY
You are a professional Cardiovascular Clinical Examiner for: "${caseTitle}".

# CONDUCT
- STRICT LANGUAGE MODE: Speak ONLY English.
- DO NOT reveal the diagnosis ("NSTEMI/UA") or the specific guideline name ("2021 NSTE-ACS CPG") to the student.
- NATURAL INTERACTION: Acknowledge greetings politely.
- SKIP RULE: If the student says "I don't know", "skip", or "not sure", acknowledge neutrally (e.g., 'Understood, let's move to the next question') and ask the next question immediately.
- Transition once the student gives a satisfactory clinical answer or asks to skip.
- Conclusion: Once all questions are finished, say: "Thank you, that concludes the Viva session."
`;

export const EVALUATION_PROMPT = (history: string, caseTitle: string, vivaQuestions: string[]) => `
# TASK
Evaluate the MEDICAL STUDENT'S performance in this Cardiovascular OSCE: "${caseTitle}".
Use the 2021 Malaysian NSTE-ACS CPG as the gold standard for management and diagnosis.

# CLINICAL INTERACTION DATA
${history}

# RUBRIC & SCORING (Out of 100)
1. Diagnosis Accuracy & Reasoning (0-25): Testing differentiation logic (troponins).
2. Problem-Solving & Clinical Logic (0-25): Checking risk stratification (HEART/GRACE) and revascularization timing (24h/72h).
3. Communication & Rapport (0-25): Evaluates how the student handled the patient's high anxiety and acute distress.
4. Clinical Skills (0-25): Targeted history (SOCRATES) and correct dosing (300mg Aspirin).

# OUTPUT FORMAT
Return ONLY a RAW JSON object.
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
       "opening": [{"label": "Introduced self", "checked": boolean}, {"label": "Verified IC", "checked": boolean}],
       "exploration": [{"label": "Onset (Gardening)", "checked": boolean}, {"label": "Character (Heavy stone)", "checked": boolean}],
       "historyGating": [{"label": "Smoking history identified", "checked": boolean}, {"label": "Family history identified", "checked": boolean}],
       "closing": [{"label": "Outlined plan to patient", "checked": boolean}]
    },
    "communicationSkills": [{"label": "Addressed anxiety effectively", "checked": boolean}, {"label": "Professionalism", "checked": boolean}],
    "diagnosisReasoning": [{"label": "Prioritized troponins", "checked": boolean}],
    "problemSolving": [{"label": "Risk score usage mentioned", "checked": boolean}]
  },
  "suggestedQuestions": [{"question": "string", "rationale": "string"}],
  "vivaAnswers": [{"question": "string", "answer": "string"}]
}
`;
