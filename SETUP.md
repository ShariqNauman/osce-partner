# OSCE Partner: Setup Instructions

This document provides detailed instructions for setting up the **OSCE Partner** project on your local machine.

---

## 1. Prerequisites
Before starting the installation, ensure you have the following installed:
*   **Node.js**: Version 18.0 or higher.
*   **NPM**: Usually comes bundled with Node.js.
*   **Web Browser**: Latest version of Chrome or Edge (required for MediaPipe and Web Audio API support).

---

## 2. External Service Accounts
You will need active accounts for the following services to enable full functionality:
1.  **Google AI Studio**: To obtain a Gemini API Key for the Live AI Response Generator.
2.  **Firebase Console**: To set up Authentication and Cloud Firestore for user data and practice history.

---

## 3. Installation Steps
1.  **Clone the Repository**:
    ```bash
    git clone [your-repository-url]
    cd osce-partner
    ```
2.  **Install Dependencies**:
    Run the following command to install all required packages (React, Firebase SDK, Google GenAI, Lucide Icons, etc.):
    ```bash
    npm install
    ```

---

## 4. Configuration (Environment Variables)
Create a `.env` file in the root directory of the project. This file will hold your sensitive API keys. Add the following variables:
```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration (From Firebase Console Settings)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 5. Firebase Backend Setup
1.  **Authentication**: Enable "Email/Password" sign-in method in the Firebase Auth dashboard.
2.  **Firestore Database**: 
    *   Create a database in "Production Mode" or "Test Mode".
    *   Deploy the `firestore.rules` provided in the project root to ensure secure access to user history.
    *   Create a `users` collection to store profile data.

---

## 6. Running the Application
1.  **Development Mode**:
    To start the local development server with Hot Module Replacement (HMR):
    ```bash
    npm run dev
    ```
    The application will typically be accessible at `http://localhost:3000`.

2.  **Production Build**:
    To create an optimized production build:
    ```bash
    npm run build
    ```
    The output will be generated in the `dist/` folder, ready for deployment to platforms like Vercel, Netlify, or Firebase Hosting.

---
*Disclaimer: This tool is for educational purposes only and should not be used as a substitute for professional medical training or advice.*
