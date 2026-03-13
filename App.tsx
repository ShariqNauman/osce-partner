
import React, { useState, useEffect, useRef, useCallback } from 'react';
// Fix: Use namespace imports and destructuring for Firebase to resolve "no exported member" errors in environments with mismatched module resolution
import * as FirebaseApp from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import * as FirebaseFirestore from 'firebase/firestore';

const { initializeApp } = FirebaseApp;
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification } = FirebaseAuth;
const { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, getDocs, orderBy, serverTimestamp } = FirebaseFirestore;

import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { SimulationState, EvaluationResult, TranscriptionItem, CaseBrief, UserData, HistoryItem } from './types';
import { CASE_GENERATOR_PROMPT, EVALUATION_PROMPT, EXAMINER_INSTRUCTION, FIXED_CHEST_IMAGE } from './constants';
import { decode, encode, decodeAudioData } from './utils/audio';
import { safeParseJSON } from './utils/json';
import EvaluationDisplay from './components/EvaluationDisplay';
import ProgressDashboard from './components/ProgressDashboard';
import SubscriptionPage from './components/SubscriptionPage';
import { 
  Heart, 
  Loader2, 
  GraduationCap, 
  StickyNote, 
  User, 
  Clock,
  SkipForward, 
  CheckCircle2, 
  Brain, 
  BarChart, 
  ArrowRight,
  LogOut, 
  ChevronDown, 
  MessageSquare, 
  Target, 
  CreditCard, 
  ScanFace, 
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  Waves,
  AlertCircle,
  Moon,
  Sun
} from 'lucide-react';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initializing Firebase modular SDK correctly outside component to prevent multiple initializations
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const App: React.FC = () => {
  const [simulationState, setSimulationState] = useState<SimulationState>(SimulationState.IDLE);
  const [timer, setTimer] = useState(600); 
  const [transcription, setTranscription] = useState<TranscriptionItem[]>([]);
  const [consultationHistory, setConsultationHistory] = useState<TranscriptionItem[]>([]);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [currentCase, setCurrentCase] = useState<CaseBrief | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [notes, setNotes] = useState('');
  const [showScenario, setShowScenario] = useState(true);

  const [handPos, setHandPos] = useState<{x: number, y: number} | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const visionCanvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<any>(null);
  const handsRef = useRef<any>(null);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('isDarkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const sessionIdRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const timerIntervalRef = useRef<number | null>(null);
  const visionIntervalRef = useRef<number | null>(null);
  const currentInputTranscriptionRef = useRef('');
  const currentOutputTranscriptionRef = useRef('');

  const getAudioContext = useCallback(() => {
    if (!outputAudioContextRef.current) {
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return outputAudioContextRef.current;
  }, []);

  const stopAudio = useCallback(() => {
    sourcesRef.current.forEach(s => {
      try { s.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  }, []);

  const cleanupSession = useCallback(() => {
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(s => {
        try { s?.close?.(); } catch(e) {}
      }).catch(() => {});
      sessionPromiseRef.current = null;
    }
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch (e) {}
      audioContextRef.current = null;
    }
    if (visionIntervalRef.current) {
      window.clearInterval(visionIntervalRef.current);
      visionIntervalRef.current = null;
    }
    currentInputTranscriptionRef.current = '';
    currentOutputTranscriptionRef.current = '';
  }, []);

  useEffect(() => {
    const isActive = [SimulationState.RUNNING, SimulationState.EXAMINATION, SimulationState.VIVA].includes(simulationState);
    if (isActive) {
      if (!timerIntervalRef.current) {
        timerIntervalRef.current = window.setInterval(() => {
          setTimer(prev => (prev <= 1 ? 0 : prev - 1));
        }, 1000);
      }
    } else {
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
    return () => { if (timerIntervalRef.current) window.clearInterval(timerIntervalRef.current); };
  }, [simulationState]);

  useEffect(() => {
    if (simulationState === SimulationState.EXAMINATION && sessionPromiseRef.current) {
      const currentSimSessionId = sessionIdRef.current;
      visionIntervalRef.current = window.setInterval(() => {
        if (sessionIdRef.current !== currentSimSessionId || !sessionPromiseRef.current) return;
        if (!visionCanvasRef.current || !currentCase?.patientImage) return;
        
        const canvas = visionCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = currentCase.patientImage!;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          if (handPos) {
            ctx.beginPath();
            ctx.arc(handPos.x * canvas.width, handPos.y * canvas.height, 45, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(79, 70, 229, 0.8)'; 
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 5;
            ctx.stroke();
          }

          canvas.toBlob((blob) => {
            if (blob && sessionIdRef.current === currentSimSessionId && sessionPromiseRef.current) {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                const base64 = (reader.result as string).split(',')[1];
                sessionPromiseRef.current?.then((session) => {
                  if (sessionIdRef.current === currentSimSessionId && session) {
                    try {
                      session.sendRealtimeInput({ media: { data: base64, mimeType: 'image/jpeg' } });
                    } catch (e) { console.error("Vision send failed:", e); }
                  }
                });
              };
            }
          }, 'image/jpeg', 0.4);
        };
      }, 1500); 
    } else {
      if (visionIntervalRef.current) {
        window.clearInterval(visionIntervalRef.current);
        visionIntervalRef.current = null;
      }
    }
  }, [simulationState, handPos, currentCase]);

  useEffect(() => {
    if (simulationState === SimulationState.EXAMINATION) {
      const initMediPipe = async () => {
        const Hands = (window as any).Hands;
        const Camera = (window as any).Camera;
        if (!Hands || !Camera) return;

        const hands = new Hands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7
        });

        hands.onResults((results: any) => {
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmark = results.multiHandLandmarks[0][8]; 
            setHandPos({ x: 1 - landmark.x, y: landmark.y });
          } else {
            setHandPos(null);
          }
        });

        handsRef.current = hands;

        if (videoRef.current) {
          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              if (handsRef.current) {
                await handsRef.current.send({ image: videoRef.current! });
              }
            },
            width: 640,
            height: 480
          });
          camera.start();
          cameraRef.current = camera;
        }
      };

      initMediPipe();
    } else {
      if (cameraRef.current) { cameraRef.current.stop(); cameraRef.current = null; }
      if (handsRef.current) { try { handsRef.current.close(); } catch(e) {} handsRef.current = null; }
    }
  }, [simulationState]);

  const initiateNewSimulation = async () => {
    cleanupSession();
    stopAudio();
    sessionIdRef.current++;
    setSimulationState(SimulationState.GENERATING);
    setCurrentCase(null);
    setTranscription([]);
    setConsultationHistory([]);
    setTimer(600); 
    setEvaluation(null);
    setNotes('');
    setShowScenario(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Step 1: Generate Case Text Data
      const caseResponse = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: CASE_GENERATOR_PROMPT,
        config: { 
          responseMimeType: 'application/json'
        }
      });
      const caseData: CaseBrief = safeParseJSON<CaseBrief>(caseResponse.text || '{}');

      // Step 2: Generate High-Quality Anatomy Image
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: "A high-quality, realistic medical clinical photograph of a real human's bare chest, directly front-facing view. Clear lighting, neutral professional medical training style. No medical equipment, no tubes, no electrodes, no background clutter. Focused exclusively on a frontal view of the human torso." }]
        },
        config: {
          imageConfig: { aspectRatio: "3:4" }
        }
      });

      let patientImage = FIXED_CHEST_IMAGE; // Keep fallback just in case
      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          patientImage = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      setCurrentCase({ ...caseData, patientImage });
      setSimulationState(SimulationState.BRIEFING);
    } catch (error) {
      console.error('Initial Generation Error:', error);
      setSimulationState(SimulationState.IDLE);
    }
  };

  const startSimulation = async (targetState: SimulationState) => {
    if (!currentCase) return;
    const currentSimSessionId = ++sessionIdRef.current;
    
    cleanupSession(); 
    stopAudio();
    
    currentInputTranscriptionRef.current = '';
    currentOutputTranscriptionRef.current = '';
    setTranscription([]);
    if (targetState === SimulationState.RUNNING) setConsultationHistory([]);

    setSimulationState(targetState);

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      console.error("Microphone access denied:", e);
      setSimulationState(SimulationState.IDLE);
      return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const isViva = targetState === SimulationState.VIVA;
    const voiceName = isViva ? 'Puck' : (currentCase.gender === 'Female' ? 'Kore' : 'Puck');

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
          if (inputCtx.state === 'suspended') inputCtx.resume();
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          
          processor.onaudioprocess = (e) => {
            if (isMuted || sessionIdRef.current !== currentSimSessionId) return;
            const input = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(input.length);
            for (let i = 0; i < input.length; i++) int16[i] = input[i] * 32768;
            
            sessionPromiseRef.current?.then((session) => {
              if (sessionIdRef.current === currentSimSessionId && session) {
                try {
                  session.sendRealtimeInput({ 
                    media: { 
                      data: encode(new Uint8Array(int16.buffer)), 
                      mimeType: 'audio/pcm;rate=16000' 
                    } 
                  });
                } catch (sendErr) { console.error("Audio send error:", sendErr); }
              }
            });
          };
          
          source.connect(processor);
          processor.connect(inputCtx.destination);
          audioContextRef.current = inputCtx;
        },
        onmessage: async (message: LiveServerMessage) => {
          if (sessionIdRef.current !== currentSimSessionId) return;

          const audioBase64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioBase64) {
            const outCtx = getAudioContext();
            if (outCtx.state === 'suspended') await outCtx.resume();
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
            const buffer = await decodeAudioData(decode(audioBase64), outCtx, 24000, 1);
            const source = outCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(outCtx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }

          if (message.serverContent?.inputTranscription) {
            const text = message.serverContent.inputTranscription.text;
            if (/^[a-zA-Z0-9\s.,?':!-]+$/.test(text)) {
              currentInputTranscriptionRef.current += text;
              updateTranscription('user', currentInputTranscriptionRef.current);
            }
          }
          if (message.serverContent?.outputTranscription) {
            currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
            updateTranscription(isViva ? 'examiner' : 'patient', currentOutputTranscriptionRef.current);
          }
          if (message.serverContent?.turnComplete) {
            currentInputTranscriptionRef.current = '';
            currentOutputTranscriptionRef.current = '';
          }
          if (message.serverContent?.interrupted) stopAudio();
        },
        onerror: (e: any) => {
          if (sessionIdRef.current !== currentSimSessionId) return;
          console.error("Live Session Error State:", e);
          setSimulationState(SimulationState.IDLE);
        },
        onclose: () => console.debug("Live Session Stream Closed")
      },
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: (isViva 
          ? EXAMINER_INSTRUCTION(currentCase.title, currentCase.vivaQuestions)
          : currentCase.systemInstruction + `
          
# STRICT BEHAVIOR
1. ENGLISH ONLY: Do not volunteer, record, or acknowledge non-English speech.
2. WAIT FOR QUESTION: Never give answers to things not asked.
3. BREVITY: Limit responses to 10 words.
4. GATING: Reveal history (smoking, father's death, meds) ONLY when the student specifically asks for that category.
5. NO ACTION CUES: NEVER include bracketed or asterisked action cues like *wince*, [gasp], or *cries* in your output. Express emotion strictly through your tone of voice and words.
`) + "\nSTRICT: ENGLISH ONLY.",
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
        inputAudioTranscription: {},
        outputAudioTranscription: {}
      }
    });

    sessionPromiseRef.current = sessionPromise;
  };

  const updateTranscription = (role: 'user' | 'patient' | 'examiner', text: string) => {
    // Regex refined to strip both [action] and *action* cues
    const filteredText = text.replace(/\[.*?\]|\*.*?\*/g, '').trim();
    if (!filteredText) return;
    
    setTranscription(prev => {
      if (prev.length === 0) return [{ role, text: filteredText, timestamp: Date.now() }];
      const last = prev[prev.length - 1];
      if (last.role === role && Date.now() - last.timestamp < 10000) {
        const updated = [...prev];
        updated[updated.length - 1] = { ...last, text: filteredText };
        return updated;
      }
      return [...prev, { role, text: filteredText, timestamp: Date.now() }];
    });
  };

  const startExamMode = () => setSimulationState(SimulationState.EXAMINATION);

  const startViva = () => {
    setConsultationHistory([...transcription]);
    cleanupSession();
    stopAudio();
    setTranscription([]); 
    setTimeout(() => startSimulation(SimulationState.VIVA), 200);
  };

  const evaluatePerformance = async () => {
    const fullHistory = [...consultationHistory, ...transcription];
    const historySnapshot = fullHistory.map(t => `[${t.role.toUpperCase()}]: ${t.text}`).join('\n');
    cleanupSession();
    stopAudio();
    setSimulationState(SimulationState.EVALUATING);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: EVALUATION_PROMPT(historySnapshot, currentCase?.title || 'OSCE Case', currentCase?.vivaQuestions || []),
        config: { 
          responseMimeType: 'application/json'
        }
      });
      const result: EvaluationResult = safeParseJSON<EvaluationResult>(response.text || '{}');
      setEvaluation(result);
      setSimulationState(SimulationState.COMPLETE);
      if (userData && auth.currentUser) {
        await addDoc(collection(db, 'users', auth.currentUser.uid, 'question'), {
          questionName: currentCase?.title || 'Cardiovascular Case',
          userScore: result.totalScore,
          summary: result.summary,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) { 
      console.error('Evaluation Error:', error);
      setSimulationState(SimulationState.IDLE); 
    }
  };

  const loadUserData = useCallback(async (user: any) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const data = userDoc.data();
      const q = query(collection(db, 'users', user.uid, 'question'), orderBy('createdAt', 'asc'));
      const historySnap = await getDocs(q);
      const history: HistoryItem[] = [];
      historySnap.forEach(doc => {
        const d = doc.data();
        history.push({ id: doc.id, caseTitle: d.questionName, score: d.userScore, date: d.createdAt?.toMillis() || Date.now(), summary: d.summary });
      });
      setUserData({ name: data?.displayName || 'Student', email: user.email || '', history, repetitionLevel: data?.repetitionLevel || 0 });
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  const handleAuth = async () => {
    if (!emailInput || !passwordInput) return setAuthError('Missing fields');
    setIsAuthLoading(true);
    setAuthError('');
    try {
      if (authMode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, emailInput, passwordInput);
        await sendEmailVerification(cred.user);
        await setDoc(doc(db, 'users', cred.user.uid), { displayName: nameInput, email: emailInput, repetitionLevel: 0 });
        setSimulationState(SimulationState.VERIFICATION_REQUIRED);
      } else {
        const cred = await signInWithEmailAndPassword(auth, emailInput, passwordInput);
        if (!cred.user.emailVerified) {
          setSimulationState(SimulationState.VERIFICATION_REQUIRED);
        } else {
          setSimulationState(SimulationState.IDLE);
          await loadUserData(cred.user);
        }
      }
    } catch (error: any) { setAuthError(error.message); }
    finally { setIsAuthLoading(false); }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        await loadUserData(user);
      } else { setUserData(null); }
      setIsCheckingAuth(false);
    });
    return () => { unsubscribe(); cleanupSession(); };
  }, [loadUserData, cleanupSession]);

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4"><Loader2 size={40} className="text-indigo-600 dark:text-indigo-400 animate-spin" /></div>;
  }

  if (!userData) {
    if (simulationState === SimulationState.VERIFICATION_REQUIRED) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700 text-center flex flex-col items-center">
            <div className="flex justify-center mb-6"><div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg"><CheckCircle2 size={40} /></div></div>
            <h1 className="text-2xl font-black text-center text-slate-900 dark:text-white mb-2">Verify Your Account</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">We've sent a verification email. Please check your inbox and click the link to verify your account.</p>
            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 text-amber-700 dark:text-amber-300 px-4 py-3 rounded-xl mb-8 flex items-start gap-3 text-left w-full">
               <span className="text-amber-500 dark:text-amber-400 mt-0.5"><AlertCircle size={18} /></span>
               <p className="text-sm font-medium leading-snug">If you don't see the email, please check your <span className="font-bold">spam or junk</span> folder.</p>
            </div>
            <button onClick={() => { setSimulationState(SimulationState.IDLE); setAuthMode('login'); }} className="w-full py-4 bg-slate-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white rounded-xl font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all">
               Back to Login <ArrowRight size={18} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700">
          <div className="flex justify-center mb-6"><div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg"><GraduationCap size={40} /></div></div>
          <h1 className="text-2xl font-black text-center text-slate-900 dark:text-white mb-2">OSCE Partner</h1>
          <p className="text-center text-slate-500 dark:text-slate-400 font-bold mb-8 uppercase text-[10px] tracking-widest text-center w-full">Clinical Training Platform</p>
          <div className="space-y-4">
            {authMode === 'signup' && <input type="text" placeholder="Full Name" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors" value={nameInput} onChange={e => setNameInput(e.target.value)} />}
            <input type="email" placeholder="Email" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors" value={emailInput} onChange={e => setEmailInput(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} />
            {authError && <p className="text-rose-500 dark:text-rose-400 text-xs font-bold text-center">{authError}</p>}
            <button onClick={handleAuth} disabled={isAuthLoading} className="w-full py-4 bg-slate-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white rounded-xl font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all">
              {isAuthLoading ? <Loader2 className="animate-spin" /> : (authMode === 'login' ? 'Login' : 'Create Account')} <ArrowRight size={18} />
            </button>
            <p className="text-center text-sm font-bold text-slate-400 dark:text-slate-500 mt-6">{authMode === 'login' ? "New student?" : "Already enrolled?"}<button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline">{authMode === 'login' ? 'Sign Up' : 'Log In'}</button></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-slate-100 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setSimulationState(SimulationState.IDLE)}
          >
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg rotate-3 group-hover:rotate-6 transition-transform"><Heart size={24} /></div>
            <div><h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">OSCE Partner</h1><p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Clinical Simulation</p></div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="p-3 rounded-xl transition-all text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setSimulationState(SimulationState.SUBSCRIPTION)} className="p-3 rounded-xl transition-all flex items-center gap-2 font-black uppercase tracking-widest text-[10px] text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700"><CreditCard size={18} /> Upgrade</button>
            <button onClick={() => setSimulationState(SimulationState.DASHBOARD)} className="p-3 rounded-xl transition-all text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700"><BarChart size={22} /></button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-1.5 pr-4 rounded-2xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">
              <div className="w-9 h-9 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400"><User size={20} /></div>
              <div className="hidden sm:block"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Student</p><p className="text-xs font-bold text-slate-700 dark:text-slate-300">{userData.name}</p></div>
              <button onClick={() => { signOut(auth); setUserData(null); }} className="ml-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400"><LogOut size={16} /></button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {simulationState === SimulationState.IDLE && (
          <div className="max-w-2xl mx-auto text-center py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-8 inline-flex p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[3rem] text-indigo-600 dark:text-indigo-400 shadow-2xl relative">
              <div className="absolute -top-4 -right-4 bg-emerald-500 dark:bg-emerald-600 text-white p-2 rounded-xl shadow-lg animate-bounce"><Sparkles size={16} /></div>
              <Brain size={64} />
            </div>
            <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight text-balance">Clinical OSCE Simulator</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-bold mb-10 max-w-lg mx-auto">Engage with standardized patients in real-time. Experience low-latency verbal feedback during physical exams.</p>
            <button onClick={initiateNewSimulation} className="px-12 py-5 bg-slate-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:scale-105 transition-all flex items-center gap-3 mx-auto">Start Clinical Case <ArrowRight /></button>
          </div>
        )}

        {simulationState === SimulationState.GENERATING && (
          <div className="max-w-md mx-auto text-center py-24 flex flex-col items-center"><Loader2 size={100} className="text-indigo-600 dark:text-indigo-400 animate-spin mb-10" /><h3 className="text-2xl font-black text-slate-900 dark:text-white">Preparing Assessment...</h3></div>
        )}

        {simulationState === SimulationState.BRIEFING && currentCase && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-900 dark:bg-slate-900 p-12 text-white relative">
              <div className="absolute top-12 right-12 opacity-10"><Heart size={120} /></div>
              <p className="text-indigo-400 dark:text-indigo-300 font-black uppercase tracking-widest text-xs mb-4">Initial Briefing</p>
              <h2 className="text-4xl font-black mb-8 leading-tight tracking-tight">{currentCase.title}</h2>
              <div className="bg-slate-800/50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-700 dark:border-slate-600 shadow-inner">
                <p className="text-xl italic font-medium leading-relaxed">"{currentCase.briefingText}"</p>
              </div>
            </div>
            <div className="p-12 text-center">
              <div className="mb-10 flex items-center justify-center gap-6 text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-2"><User size={18}/><span className="text-xs font-black uppercase tracking-widest">{currentCase.patientName}</span></div>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"/>
                <div className="flex items-center gap-2"><Clock size={18}/><span className="text-xs font-black uppercase tracking-widest">{currentCase.patientAge} Y/O</span></div>
              </div>
              <button onClick={() => startSimulation(SimulationState.RUNNING)} className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 group">Start Encounter <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" /></button>
            </div>
          </div>
        )}

        {simulationState === SimulationState.RUNNING && currentCase && (
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-top-4">
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
               <div className="p-6 cursor-pointer flex items-center justify-between group" onClick={() => setShowScenario(!showScenario)}>
                  <div className="flex items-center gap-4"><StickyNote size={20} className="text-indigo-600 dark:text-indigo-400" /><h3 className="text-lg font-black text-slate-900 dark:text-white">Patient Case File</h3></div>
                  <ChevronDown size={24} className={`text-slate-500 dark:text-slate-400 transition-transform duration-300 ${showScenario ? 'rotate-180' : ''}`} />
               </div>
               {showScenario && (
                 <div className="p-8 pt-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div><p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-3 tracking-widest">Instruction</p><p className="text-lg font-bold italic leading-relaxed text-slate-900 dark:text-slate-200">"{currentCase.briefingText}"</p></div>
                    <div className="space-y-4">
                      <div><p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-1 tracking-widest">Patient Details</p><p className="text-sm font-black text-slate-900 dark:text-white">{currentCase.patientName}, {currentCase.patientAge} Y/O, {currentCase.gender}</p></div>
                      <div><p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-1 tracking-widest">I/C Number</p><p className="text-sm font-mono font-black text-indigo-600 dark:text-indigo-400">{currentCase.icNumber}</p></div>
                    </div>
                 </div>
               )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col min-h-[600px] overflow-hidden">
                <div className="bg-slate-900 dark:bg-slate-950 px-8 py-5 flex items-center justify-between text-white shadow-lg">
                  <div className="flex items-center gap-4"><Clock size={20} className="text-indigo-400" /><p className="font-mono text-2xl font-bold">{formatTime(timer)}</p></div>
                  <button onClick={() => setIsMuted(!isMuted)} className={`p-3 rounded-xl transition-all border-2 ${isMuted ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 border-rose-100 dark:border-rose-500/20' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 border-emerald-100 dark:border-emerald-500/20'}`}>{isMuted ? <MicOff size={24} /> : <Mic size={24} />}</button>
                </div>
                <div className="flex-1 p-10 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800 text-center">
                  <div className="mb-6 p-8 bg-white dark:bg-slate-700 rounded-full shadow-xl relative border-2 border-indigo-50 dark:border-slate-600">
                    <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full animate-ping" />
                    <Waves size={64} className="text-indigo-600 dark:text-indigo-400 relative z-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Live Audio Session</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-bold max-w-xs mx-auto">Active listening mode. Speak directly to {currentCase.patientName} to begin the history taking.</p>
                  <div className="mt-8 flex items-center gap-3 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-200 dark:border-indigo-800">
                    <Volume2 size={14} /> Real-time Response Active
                  </div>
                </div>
                <div className="p-8 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-end gap-4 shadow-inner">
                  <button onClick={startExamMode} className="px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 shadow-xl transition-all hover:scale-105 group">Physical Exam <ScanFace size={24} className="group-hover:scale-110 transition-transform" /></button>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-700 p-8 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6"><StickyNote size={20} className="text-indigo-600 dark:text-indigo-400" /><h3 className="font-black uppercase text-xs tracking-widest text-slate-900 dark:text-white">Clinical Log</h3></div>
                <textarea className="flex-1 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] outline-none font-bold text-slate-700 dark:text-slate-300 text-sm resize-none shadow-inner border border-transparent dark:border-slate-700 focus:border-indigo-100 dark:focus:border-indigo-500 transition-all leading-relaxed placeholder-slate-400 dark:placeholder-slate-500" placeholder="Record findings and differentials..." value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {simulationState === SimulationState.EXAMINATION && currentCase && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-700">
             <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-700 p-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl"><ScanFace size={32} /></div>
                  <div><h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Anatomical Examination</h3><p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Feedback Active</p></div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="bg-slate-900 dark:bg-slate-950 px-8 py-4 rounded-2xl text-white font-mono text-2xl font-bold flex items-center gap-4 shadow-xl shadow-slate-200 dark:shadow-none"><Clock size={22} className="text-indigo-400" /> {formatTime(timer)}</div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl p-2 relative border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[800px]">
                   <canvas ref={visionCanvasRef} width={360} height={640} className="hidden" />
                   
                   <div className="absolute inset-0 bg-slate-900 flex items-center justify-center overflow-hidden rounded-[2.5rem]">
                      {currentCase.patientImage && <img src={currentCase.patientImage} className="h-full w-auto object-cover opacity-90 select-none pointer-events-none" alt="Anatomy" />}
                      
                      {handPos && (
                        <div className="absolute w-28 h-28 bg-indigo-500/10 border-[4px] border-indigo-400 rounded-full flex items-center justify-center z-50 transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_60px_rgba(99,102,241,0.6)] transition-all duration-75" style={{ left: `${handPos.x * 100}%`, top: `${handPos.y * 100}%` }}>
                          <div className="w-5 h-5 bg-indigo-600 rounded-full animate-pulse shadow-inner" />
                        </div>
                      )}
                   </div>
                   
                   <div className="absolute top-8 right-8 w-64 h-48 bg-black rounded-[2rem] border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden z-[60]">
                      <video ref={videoRef} className="w-full h-full object-cover scale-x-[-1]" autoPlay playsInline muted />
                   </div>
                </div>

                <div className="space-y-8 flex flex-col">
                   <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-700 p-8 flex-1 flex flex-col overflow-hidden">
                      <h4 className="font-black uppercase tracking-widest text-[10px] text-slate-400 dark:text-slate-500 mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3"><MessageSquare size={16} /> Clinical Status</h4>
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-700 mb-6">
                        <Waves size={32} className="text-indigo-300 dark:text-indigo-500 mb-4 animate-pulse" />
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 italic">Listening for verbal symptoms and clinical findings during palpation...</p>
                      </div>
                      <div className="flex items-center gap-4 mb-6 justify-center">
                        <button onClick={() => setIsMuted(!isMuted)} className={`p-6 rounded-[2rem] border-2 transition-all shadow-xl hover:scale-105 active:scale-95 ${isMuted ? 'bg-rose-500 border-rose-400 text-white' : 'bg-emerald-500 border-emerald-400 text-white'}`}>{isMuted ? <MicOff size={32} /> : <Mic size={32} />}</button>
                      </div>
                      <button onClick={startViva} className="w-full py-6 bg-slate-900 dark:bg-indigo-600 text-white font-black uppercase tracking-[0.2em] rounded-3xl flex items-center justify-center gap-3 hover:bg-black dark:hover:bg-indigo-700 transition-all shadow-2xl hover:scale-105 active:scale-95 group">End Encounter <SkipForward size={24} className="group-hover:translate-x-1 transition-transform" /></button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {simulationState === SimulationState.VIVA && currentCase && (
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8">
            <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl p-12 border border-slate-200 dark:border-slate-700">
               <div className="flex items-center justify-between mb-10 border-b border-slate-100 dark:border-slate-700 pb-8">
                 <div className="flex items-center gap-5">
                   <div className="p-5 bg-indigo-600 rounded-[2rem] text-white shadow-xl"><MessageSquare size={36} /></div>
                   <div><h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">Clinical Viva</h2><p className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-xs">Knowledge Assessment</p></div>
                 </div>
                 <div className="bg-slate-900 dark:bg-slate-950 px-8 py-4 rounded-2xl text-white font-mono text-2xl font-bold flex items-center gap-4 shadow-xl shadow-slate-200 dark:shadow-none"><Clock size={22} className="text-indigo-400" /> {formatTime(timer)}</div>
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                  <div className="lg:col-span-2 flex flex-col items-center justify-center bg-slate-900 rounded-[3rem] p-12 text-center shadow-inner relative overflow-hidden group min-h-[500px]">
                    <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors" />
                    <div className="relative z-10">
                      <div className="mb-8 p-10 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm shadow-2xl mx-auto inline-flex">
                        <Waves size={80} className="text-indigo-400 animate-pulse" />
                      </div>
                      <h3 className="text-3xl font-black text-white mb-4">Examiner Presence</h3>
                      <p className="text-slate-400 font-bold max-w-xs mx-auto leading-relaxed">Verbal response session active. Answer the questions as they are presented to you vocally.</p>
                      <div className="mt-8 flex items-center justify-center gap-2 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                         <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Live Feedback Monitoring</span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-3 space-y-8">
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-8 rounded-[2.5rem] shadow-sm flex-1">
                      <h4 className="font-black uppercase tracking-widest text-[10px] text-indigo-600 dark:text-indigo-400 mb-8 flex items-center gap-2 border-b border-indigo-50 dark:border-slate-700 pb-3"><Target size={18} /> Examination Topics</h4>
                      <ul className="space-y-5">
                        {currentCase.vivaQuestions.map((q, i) => (
                          <li key={i} className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-start gap-4 relaxed"><span className="shrink-0 w-8 h-8 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center font-black">0{i+1}</span> <span className="pt-1">{q}</span></li>
                        ))}
                      </ul>
                    </div>
                    <button onClick={evaluatePerformance} className="w-full py-7 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-black uppercase tracking-[0.25em] rounded-[2rem] shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3">Submit for Evaluation <CheckCircle2 size={28} /></button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {simulationState === SimulationState.EVALUATING && (
          <div className="max-w-md mx-auto text-center py-24 flex flex-col items-center"><Loader2 size={100} className="text-indigo-600 dark:text-indigo-400 animate-spin mb-10" /><h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Generating Reports...</h3></div>
        )}

        {simulationState === SimulationState.COMPLETE && evaluation && <EvaluationDisplay result={evaluation} onReset={() => setSimulationState(SimulationState.IDLE)} />}
        {simulationState === SimulationState.DASHBOARD && userData && <ProgressDashboard userData={userData} onBack={() => setSimulationState(SimulationState.IDLE)} onClear={() => {}} onRestartCycle={() => {}} />}
        {simulationState === SimulationState.SUBSCRIPTION && <SubscriptionPage onBack={() => setSimulationState(SimulationState.IDLE)} />}
      </main>
    </div>
  );
};
