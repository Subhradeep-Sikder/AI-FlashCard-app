# AI Flashcard App 🧠

An AI-powered mobile flashcard generator built with **React Native (Expo)**, **TypeScript**, **Zustand**, and the **Gemini 1.5 Flash API**. 

The app allows users to scan their handwritten study notes or textbook pages using their camera (or select from the photo gallery) and instantly generates detailed study flashcard decks customized to their choice of difficulty level.

---

## 🚀 Key Features

* **Scan Notes & Textbooks**: Use the device camera to take photos of study materials or import pictures from your gallery.
* **Instant AI Generation**: Converts raw image text into structured flashcards using Gemini 1.5 Flash with custom prompt instructions.
* **Three Study Difficulty Settings**:
  * 🌱 **Simple**: Short & beginner-friendly questions and answers.
  * 📖 **Detailed**: Thorough explanations for deep understanding.
  * 🎯 **Exam Level**: Deep and challenging questions for exam preparation.
* **Deck Management**: Automatically groups cards into subject-specific decks (e.g. Biology, History, Math) with persistent storage powered by `@react-native-async-storage/async-storage`.
* **Interactive Study Mode**: Flip flashcards, test your memory, and mark cards as "Known" or "Need Review" to track progress.

---

## 🛠️ Technology Stack

* **Framework**: [Expo](https://expo.dev) (React Native v0.81.x) with Expo Router for file-based navigation.
* **Programming Language**: TypeScript.
* **State Management**: [Zustand](https://github.com/pmndrs/zustand) for fast, lightweight global state control.
* **Styling**: [NativeWind](https://nativewind.dev) (Tailwind CSS for React Native).
* **API Service**: [Gemini API](https://ai.google.dev/) via HTTP REST API (Axios).

---

## 📂 Project Directory Structure

```text
aiflash--app/
├── app/                      # Expo Router Screens & Navigation Layout
│   ├── _layout.tsx           # Application root layout & routing tree
│   ├── index.tsx             # Home Screen (displays generated study decks)
│   ├── camera.tsx            # Camera capture & photo selection screen
│   ├── preview.tsx           # Image preview & difficulty configuration
│   ├── generating.tsx        # Loading screen handling Gemini API requests
│   ├── study.tsx             # Interactive flashcard study interface
│   └── error.tsx             # Error fallback interface
├── assets/                   # App icons, favicon, and splash screen graphics
│   └── images/
├── services/                 # External API integrations
│   └── geminiApi.ts          # REST requests formatting raw images for Gemini API
├── store/                    # Zustand Store
│   └── flashcardStore.tsx    # State management for decks, selections, and AsyncStorage syncing
├── types/                    # TypeScript Typings
│   └── index.ts              # Data contracts for Decks, FlashCards, and Difficulties
├── app.json                  # Expo configuration
├── package.json              # Script definitions and dependency list
├── tailwind.config.js        # TailwindCSS configuration for NativeWind
└── tsconfig.json             # TypeScript configuration compiler options
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed on your machine.

### 2. Install Dependencies
Clone this repository, navigate to the folder, and run:
```bash
npm install
```

### 3. Configure the Environment
Create a `.env` file in the root directory and define your Google Gemini API Key:
```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start the Application
To run the project locally:
```bash
npm run start
```
* **Physical Device**: Download the **Expo Go** app on your physical iOS or Android device and scan the printed QR code.
* **Android Emulator / iOS Simulator**: Press `a` or `i` in the terminal to launch the project inside your local emulator/simulator (requires local Android SDK / Xcode configuration).
