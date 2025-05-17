# EchoKana 🎧📖

**EchoKana** is a comprehensive Japanese learning platform that combines **dictation training**, **reading practice**, and **smart review (SRS)** to help learners deeply improve their listening, writing, and vocabulary retention.

Built with **Laravel (API backend)** and **React (frontend SPA)**, it supports full user account functionality, audio-text pairing, spaced repetition review, and cross-device progress sync.

---

## 🌟 Features

### 🎧 Dictation Practice
- Listen to native Japanese audio clips
- Sentence-by-sentence or full-paragraph input
- Real-time feedback on accuracy
- Mistakes are automatically saved for review via SRS

### 📖 Reading Mode
- Interactive reading articles with furigana and EN/CN translation
- Grammar highlights (JLPT level tagged)
- Tap words to view definitions and add to your vocabulary notebook

### 🧠 Spaced Repetition System (SRS)
- SM-2 algorithm for scheduling personalized review
- Daily review tasks based on past mistakes
- Visual stats on memory progress and retention

### 🔐 User System
- Registration / Login / Auth (Laravel Sanctum)
- Cloud-synced vocabulary and progress
- Per-user history and personalized study tracking

---

## ⚙️ Tech Stack

| Layer       | Technology                          |
|-------------|--------------------------------------|
| Frontend    | React + Vite + Tailwind CSS          |
| State Mgmt  | React Query / Zustand                |
| Backend     | Laravel 10.x (RESTful API)           |
| Auth        | Laravel Sanctum                     |
| Database    | MySQL / PostgreSQL                   |
| Storage     | Laravel File Storage (or AWS S3)     |
| Deployment  | Laravel Forge + Vercel / Docker      |

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourname/echokana.git
cd echokana
