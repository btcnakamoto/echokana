# EchoKana 🎧📖

**EchoKana** is a web-based Japanese learning platform that combines **dictation**, **reading**, and **smart review (SRS)** to help learners deeply internalize Japanese listening and writing skills.

---

## 🌟 Features

### 🎧 Dictation Practice
- Listen to native Japanese audio clips and type what you hear
- Supports sentence-by-sentence and full-paragraph modes
- Instant feedback on correctness
- Mistakes are automatically saved for review

### 📖 Reading Mode
- Interactive Japanese articles with optional furigana and translations
- Grammar point highlighting (JLPT level-tagged)
- Tap any word to view definition and add to vocabulary notebook

### 🧠 Spaced Repetition Review (SRS)
- Mistakes from dictation and unfamiliar vocabulary are scheduled for future review
- Based on the SuperMemo-2 algorithm
- Daily personalized review session

### 📊 Learning Stats
- Track your progress over time
- Mistake frequency, review efficiency, and vocabulary growth

### 🎙️ Coming Soon...
- Shadowing + voice recording comparison
- User-generated dictation packs
- JLPT Listening simulation mode

---

## 🚀 Tech Stack

- **Frontend**: React.js + Tailwind CSS  
- **Backend**: Node.js / Express  
- **Database**: MongoDB (or Firebase for auth + storage)  
- **Audio Processing**: Web Audio API, Whisper ASR (optional)  
- **SRS Engine**: Custom-built SM2 algorithm  
- **Others**: IndexedDB for offline storage, i18n ready

---

## 🛠️ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/echokana.git
cd echokana
