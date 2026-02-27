# OSCE Partner: Standardized Patient Simulator

![OSCE Partner Banner](https://picsum.photos/seed/medical/1200/400)

OSCE Partner is a professional-grade training tool designed for medical students to practice **Objective Structured Clinical Examinations (OSCE)**. It leverages the power of Google's Gemini 2.5 Flash Live API to provide a realistic, real-time interaction with a "Standardized Patient" (SP).

## 🌟 Key Features

- **Real-time Voice Interaction**: Engage in natural, low-latency conversations with a Gemini-powered patient using the Live API.
- **Interactive Physical Examination**: Use your camera and hand-tracking (via MediaPipe) to perform clinical examinations on a virtual patient interface.
- **Timed Simulations**: Realistic 10-minute OSCE stations with an 8-minute "time-pressure" warning to simulate real exam conditions.
- **Clinical Evaluation**: Receive a comprehensive breakdown of your performance based on clinical rubrics, including history taking, communication skills, and diagnostic reasoning.
- **Progress Dashboard**: Track your clinical growth over time with historical performance data stored in Firebase.
- **Case Variety**: Dynamically generated clinical scenarios covering various medical specialties.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **AI Engine**: [Google Gemini 2.5 Flash Live](https://ai.google.dev/gemini-api/docs/live-api) (`@google/genai`)
- **Backend & Auth**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **Computer Vision**: [MediaPipe Hands](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker) for real-time hand tracking
- **Icons**: [Lucide React](https://lucide.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google AI Studio API Key (for Gemini)
- A Firebase Project (for Auth and Database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/osce-partner.git
   cd osce-partner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add your credentials:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```text
├── src/
│   ├── components/       # Reusable UI components (Dashboard, Evaluation, etc.)
│   ├── utils/            # Audio processing and helper functions
│   ├── App.tsx           # Main application logic and state management
│   ├── constants.tsx     # System prompts and clinical instructions
│   ├── types.ts          # TypeScript interfaces and enums
│   └── index.css         # Global styles and Tailwind imports
├── public/               # Static assets
├── metadata.json         # App configuration and permissions
└── package.json          # Dependencies and scripts
```

## 📋 How It Works

1. **Authentication**: Users sign up/log in to save their progress.
2. **Case Selection**: The system generates a clinical brief (e.g., "54-year-old male with chest pain").
3. **The Simulation**:
   - **History Taking**: Talk to the patient naturally.
   - **Examination**: Switch to examination mode to use hand-tracking on the patient image.
   - **Viva**: Answer follow-up questions from the "Examiner."
4. **Feedback**: Gemini analyzes the transcript and provides a score based on medical standards.

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Google AI Studio for the Gemini API.
- MediaPipe for the incredible hand-tracking capabilities.
- The medical education community for providing clinical rubric standards.

---
*Disclaimer: This tool is for educational purposes only and should not be used as a substitute for professional medical training or advice.*
