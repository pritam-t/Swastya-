<br/>
<div align="center">
  <img src="https://img.icons8.com/color/150/000000/leaf.png" alt="Swastya+ Logo" width="100"/>
  <h1 align="center">Swastya+</h1>
  <p align="center">
    <strong>Your AI-Powered Clinical Health Companion</strong>
    <br/>
    <em>"Your health, brilliantly informed."</em>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Supabase-18181A?style=for-the-badge&logo=supabase&logoColor=3ECF8E" alt="Supabase" />
    <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini Vision" />
  </p>
</div>

<br/>

## 📖 Overview

**Swastya+** is an intelligent, high-fidelity web application built to merge dining choices with clinical safety. By cross-referencing your personal clinical profile (allergens, health conditions, and current medications) against restaurant menus via Google Gemini Vision AI, Swastya+ grades your meal choices in real-time.

It ensures every bite is a confident, healthy choice, preventing fatal allergen interactions and dangerous medication conflicts.

<div align="center">
  <img src="https://placehold.co/1200x600/1E3231/FFFFFF/png?text=Upload+Your+Dashboard+Screenshot+Here" alt="Dashboard Preview" width="100%" />
</div>

---

## 🚀 Key Features

*   **🎙️ Smart Menu Scanner (OCR)**: Upload an image or point your camera at a restaurant menu. Powered by **Google Gemini 1.5 Flash**, the app automatically extracts menu items, descriptions, and likely ingredients.
*   **🩺 Real-Time Clinical Grading**: The custom _Grading Engine_ algorithm mathematically cross-references your selected meals against your clinical profile, detecting hidden allergens (e.g., Peanuts, Shellfish) and medication conflicts (e.g., _Lisinopril + Grapefruit_).
*   **🔐 End-to-End Secure Analytics**: Powered by **Supabase Auth** ensures pure data privacy.
*   **📊 Health Trends Dashboard**: Tracks optimal meals vs. risk meals intelligently over the week using `recharts`.

---

## 📷 Screenshots

| Smart Scanner | Clinical Dashboard | Health Trends |
| :---: | :---: | :---: |
| <img src="https://placehold.co/400x500/1a2a2c/FFFFFF/png?text=Upload+Scanner+Here" width="250"/> | <img src="https://placehold.co/400x500/F5F0E8/3a2e1a/png?text=Upload+Dashboard+Here" width="250"/> | <img src="https://placehold.co/400x500/E8F1EF/3a2e1a/png?text=Upload+Trends+Here" width="250"/> |
| *Gemini Vision bounding boxes* | *Conflict grading (Optimal / Risk)* | *Weekly macro visualization* |

> **Note**: To replace these placeholders, drop your actual screenshots into a `./screenshots/` folder and update the image tags above.

---

## 🛠️ Tech Stack & Architecture

Built with a focus on enterprise-grade code quality, efficiency, and security:

*   **Frontend Ecosystem**: React 18, Vite, React Router DOM, Recharts.
*   **Backend & Auth**: Supabase (PostgreSQL Auth integration).
*   **AI Engine**: Google Gemini REST API (`generativelanguage.googleapis.com`).
*   **Architecture Hardening**:
    *   **Performance**: Utilizes `React.lazy()` for route-level code splitting and Web Workers (`browser-image-compression`) to shrink multi-megapixel menu uploads to under 1MB on the client side.
    *   **Reliability**: Wrapped in rigorous React `<ErrorBoundary>` boundaries. Heavy data-grids are stabilized via `useMemo`.
    *   **Testing**: Achieves deep logic validation via a **Vitest** + **jsdom** unit-testing suite enforcing zero-false-negatives in the clinical grading logic.

---

## 💻 Running Locally

### Prerequisites
*   Node.js (v18+ recommended)
*   Supabase Project URL & Anon Key
*   Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/swastya-plus.git
   cd swastya-plus/app_build
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Run the testing suite:**
   ```bash
   npm run test
   ```

---

## 🛡️ License

This project was built for the AMD Slingshot Campus Days / Ideathon. 
All rights reserved by the respective creator.
