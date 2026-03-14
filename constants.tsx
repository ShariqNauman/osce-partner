
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

export const CASE_GENERATOR_PROMPT = (lang: 'en' | 'th' = 'en', caseType: 'jaundice' | 'cardiology' = 'jaundice') => {
  const langName = lang === 'th' ? 'Thai' : 'English';
  
  if (caseType === 'cardiology') {
    return `
Generate a professional OSCE medical case strictly based on the following patient profile.
THE PATIENT: Mr. Tan Ah Kok, 70 years old, Male, IC: 701021-10-1991.
Setting: A city hospital emergency department.

ALL text content in the JSON output MUST be in ${langName} except the exact JSON keys.

# CLINICAL REQUIREMENTS (Cardiology - STEMI/MI):
- Chief Complaint: Heavy central chest pain for 2 hours, started while gardening.
- The Pain: "Like a heavy stone or elephant sitting on my chest". Radiates to left arm and jaw. Rated 8 or 9 out of 10.
- Associated Symptoms: Sweaty and nauseous. Sometimes felt heart racing recently.
- Background: High blood pressure, diabetes, and high cholesterol due to diet. Smokes 1 packet a day for 25 years.
- Family History: Father passed away from a heart attack at 68.
- Medications: Amlodypin and simvarsatin.
- Social: Plumber, lives with wife.
- Physical Exam Hotspots:
  1. Chest: Normal heart sounds, but patient looks distressed and sweaty.
  2. Pulse: Rapid and slightly irregular (Tachycardia).
  3. Blood Pressure: Elevated.
  4. Lungs: Clear.

# VIVA QUESTION RULES:
You MUST output EXACTLY these 4 questions (translated to ${langName}):
1. What is your most likely diagnosis?
2. What are the major risk factors this patient has for this condition?
3. What is the immediate first-line investigation required?
4. What is the definitive management if the ECG shows ST elevation?

Return ONLY a RAW JSON object. DO NOT include markdown formatting or extra text.
{
  "title": "Mr. Tan Ah Kok - Acute Chest Pain",
  "patientName": "Mr. Tan Ah Kok",
  "patientAge": "70",
  "gender": "Male",
  "icNumber": "701021-10-1991",
  "personaName": "Mr. Tan",
  "chiefComplaint": "Heavy central chest pain which started suddenly while gardening 2 hours ago.",
  "briefingText": "...(in ${langName})",
  "systemInstruction": "You are Mr. Tan, 70 years old. Tone: Distressed, in significant pain, worried. ... (Include instructions for the chest pain details, radiation, associated symptoms, and family history. Mention smoking only if asked. Reveal medications if asked.) ... ALL in ${langName}",
  "vivaQuestions": ["...(The 4 exact Viva questions translated to ${langName})"]
}
`;
  }

  // Default: Jaundice case
  return `
Generate a professional OSCE medical case strictly based on the following patient profile.
THE PATIENT: Mr. Somchai, 58 years old, Male, IC: 680412-10-5533.
Setting: A GP clinic in the UK (the patient is a Thai expat) or a city hospital in Bangkok.

ALL text content in the JSON output MUST be in ${langName} except the exact JSON keys.

# CLINICAL REQUIREMENTS (The "Yellow Jaundice" of the Northeast):
- Chief Complaint: Yellowing of the eyes (jaundice) and dull pain in the upper right stomach for 3 weeks.
- The Hook: If asked about pain, say it's a "heavy, dull ache" in the right side, NOT sharp.
- The Secret (Only reveal if asked about diet or origin): "I grew up in Khon Kaen (Northeast Thailand). I love traditional food. I still eat Pla Ra (raw fermented fish) that my sister sends me from home. I've eaten it raw since I was a little boy."
- Other Symptoms: "My urine is very dark, like Coca-Cola, and my poo is pale, almost like clay."
- Weight: "I've lost about 8kg in two months without trying."
- Physical Exam Hotspots (If the doctor specifically performs a physical exam by looking or touching these areas, provide these findings):
  1. Eyes (Sclera): Deep Yellow tint (Scleral icterus).
  2. Right Upper Quadrant: Firm, non-tender mass felt 3cm below the ribs (Hepatomegaly / Courvoisier's Sign).
  3. Left Supraclavicular Notch: Small, hard, pea-sized lump (Virchow's Node).
  4. Hands (Palms): Scratch marks (Excoriations due to intense itching).

# VIVA QUESTION RULES:
You MUST output EXACTLY these 4 questions (translated to ${langName}):
1. What is your leading diagnosis?
2. Why did you ask about his hometown/diet?
3. What specific parasite is responsible?
4. What is the first-line imaging you would order?

Return ONLY a RAW JSON object. DO NOT include markdown formatting or extra text.
{
  "title": "Mr. Somchai - The 'Yellow Jaundice' of the Northeast",
  "patientName": "Mr. Somchai",
  "patientAge": "58",
  "gender": "Male",
  "icNumber": "680412-10-5533",
  "personaName": "Mr. Somchai",
  "chiefComplaint": "Yellowing of the eyes (jaundice) and dull pain in the upper right stomach for 3 weeks.",
  "briefingText": "...(in ${langName})",
  "systemInstruction": "You are Mr. Somchai, 58 years old. Tone: Tired, a bit anxious, but stoic. ... (Include instructions for The Hook, The Secret, Other Symptoms, Weight loss, and EXACTLY what to say if the doctor touches/examines the 4 Physical Exam hotspots) ... ALL in ${langName}",
  "vivaQuestions": ["...(The 4 exact Viva questions translated to ${langName})"]
}
`;
};

export const EXAMINER_INSTRUCTION = (caseTitle: string, questions: string[], lang: 'en' | 'th' = 'en', caseType: 'jaundice' | 'cardiology' = 'jaundice') => {
  const langName = lang === 'th' ? 'Thai' : 'English';
  const correctAnswers = caseType === 'cardiology' 
    ? '1. Acute Myocardial Infarction (STEMI). 2. Smoking, Diabetes, Hypertension, Hypercholesterolemia, Family History. 3. 12-lead ECG. 4. Immediate Primary PCI or Thrombolysis.'
    : '1. Cholangiocarcinoma (Bile Duct Cancer) 2. Northeast Thailand is a hotspot for liver flukes in raw fermented fish (Pla Ra). 3. Opisthorchis viverrini. 4. Abdominal Ultrasound.';

  return `
# IDENTITY
You are a professional Medical Clinical Examiner for: "${caseTitle}".

# CONDUCT
- STRICT LANGUAGE MODE: Speak ONLY ${langName}.
- DO NOT reveal the correct diagnosis to the student prematurely.
- NATURAL INTERACTION: Acknowledge greetings politely.
- SKIP RULE: If the student says "I don't know", "skip", or "not sure", acknowledge neutrally and ask the next question immediately.
- Transition once the student gives a satisfactory clinical answer or asks to skip. The correct answers for reference: ${correctAnswers}
- Conclusion: Once all questions are finished, say: ${lang === 'th' ? '"ขอบคุณครับ/ค่ะ การสอบปากเปล่าเสร็จสิ้นแล้ว"' : '"Thank you, that concludes the Viva session."'}
`;
};

export const EVALUATION_PROMPT = (history: string, caseTitle: string, vivaQuestions: string[], lang: 'en' | 'th' = 'en', caseType: 'jaundice' | 'cardiology' = 'jaundice') => {
  const langName = lang === 'th' ? 'Thai' : 'English';
  
  const goldStandard = caseType === 'cardiology'
    ? 'Acute Myocardial Infarction (STEMI/NSTEMI) secondary to significant cardiovascular risk factors (Smoking, DM, HTN).'
    : 'Cholangiocarcinoma (Bile Duct Cancer) secondary to chronic Opisthorchis viverrini (Southeast Asian Liver Fluke) infection.';

  const rubricDetails = caseType === 'cardiology'
    ? `1. Diagnosis Accuracy & Reasoning (0-25): Must identify Acute Coronary Syndrome. Differentiate from stable angina (this is new, severe, sudden).
2. Problem-Solving & Clinical Logic (0-25): Checking if they ordered 12-lead ECG first-line.
3. Communication & Rapport (0-25): Empathy during severe pain.
4. Clinical Skills (0-25): Did they identify the major risk factors (smoking, family history, DM, HTN)?`
    : `1. Diagnosis Accuracy & Reasoning (0-25): Must distinguish from Gallstones. Gallstones cause sharp colicky pain after eating fat. This patient has painless/dull jaundice and weight loss (malignancy).
2. Problem-Solving & Clinical Logic (0-25): Checking if they ordered Abdominal Ultrasound first-line.
3. Communication & Rapport (0-25): Evaluates how they gathered the diet/hometown history and their empathy.
4. Clinical Skills (0-25): Did they discover the "Pla Ra" (raw fermented fish) / Khon Kaen history?`;

  return `
# TASK
Evaluate the MEDICAL STUDENT'S performance in this OSCE: "${caseTitle}".
The Gold Standard Diagnosis is: ${goldStandard}

ALL feedback text in the JSON output MUST be in ${langName}.

# CLINICAL INTERACTION DATA
${history}

# RUBRIC & SCORING (Out of 100)
${rubricDetails}

# OUTPUT FORMAT
Return ONLY a RAW JSON object. ALL text values MUST be in ${langName}.
{
  "actualDiagnosis": "${caseType === 'cardiology' ? 'Acute Myocardial Infarction' : 'Cholangiocarcinoma secondary to Opisthorchis viverrini'}",
  "diagnosis": "Feedback on diagnostic reasoning. ...(in ${langName})",
  "diagnosisGrade": "Excellent | Proficient | Average | Poor",
  "diagnosisScore": number,
  "problemSolving": "Feedback on imaging/investigation choice and logic. ...(in ${langName})",
  "problemSolvingGrade": "Excellent | Proficient | Average | Poor",
  "problemSolvingScore": number,
  "communication": "Feedback on empathy and bedside manner...(in ${langName})",
  "communicationGrade": "Excellent | Proficient | Average | Poor",
  "communicationScore": number,
  "clinicalSkills": "Feedback on history taking and identifying risk factors/hook history. ...(in ${langName})",
  "clinicalSkillsGrade": "Excellent | Proficient | Average | Poor",
  "clinicalSkillsScore": number,
  "totalScore": number,
  "summary": "Direct constructive feedback on their overall performance.",
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
