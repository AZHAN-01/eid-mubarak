# 🌙 Eid ul Adha 2026 — Premium Wishes, Countdown & Blessings

[![React](https://img.shields.io/badge/React-19.2.6-61DAFB?logo=react&logoColor=white&style=flat-square)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0.12-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3.0-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.40.0-FF00C1?logo=framer&logoColor=white&style=flat-square)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-008080?style=flat-square)](LICENSE)

An immersive, cinematic, and premium web experience celebrating **Eid ul Adha 2026**. Built with React 19, Tailwind CSS v4, and Framer Motion, this platform offers a luxurious digital hub featuring live audio, custom countdown timers, interactive blessing lanterns, and a personalized Eid greeting card generator.

---

## ✨ Key Features

### 🕌 1. Spiritual & Ambient Immersion
*   **Talbiyah Background Soundscape:** Ambient looping Hajj chant with interactive volume fade-in/fade-out controls.
*   **Animated Gold Starry Particles:** High-performance HTML5 `<canvas>` background that renders floating golden particles, sparkles, and reactive cosmic dust.
*   **Swaying Lantern Overlays:** Hanging traditional lanterns that sway gently using fluid CSS keyframe animations.

### ⏳ 2. Premium Countdown Clock
*   **Live Time Tracker:** Displays standard Days, Hours, Minutes, and Seconds remaining until Eid (May 27, 2026).
*   **Active Celebration State:** Automatically switches to a festive celebration layout with automatic confetti triggers once Eid arrives.
*   **Custom Particle Showers:** Active cursor spark triggers and golden showers powered by `canvas-confetti`.

### 🕯️ 3. Kindle the Sacred Lantern (Interactive Sufi Blessings)
*   **Interactive SVG Physics:** A bespoke vector lantern that lights up with glowing radial gradients and a dynamic, flickering flame upon touch or click.
*   **Sufi Blessings Generator:** Dispenses soulful, personalized blessings and prayers that encourage spiritual tranquility.
*   **Synthesized Chimes:** Uses browser-level Web Audio oscillators to dynamically synthesize celestial chimes on click.

### 🎨 4. Golden Eid Card Customizer Engine
*   **Personalization Inputs:** Custom "To" (recipient) and "From" (sender) signature lines.
*   **Luxury Themes & Typography:**
    *   *Canvases:* Royal Emerald, Velvet Black, and Golden Glory.
    *   *Typography:* Elegant Playfair Display (Serif), Amiri Arabic scripture, and Cinzel royal style.
*   **Pre-composed Blessing Tones:** Select from Spiritual, Loving, Cinematic, or Short messages containing Arabic text, transliteration, and meanings.
*   **One-Click WhatsApp Sharing:** Instantly copies a beautifully formatted message to the clipboard with bold titles, clean dividers, translations, and holiday emojis.

### 📚 5. Spiritual Library & Islamic Hub
*   **Duas Guide:** Detailed spiritual cards covering Mercy, Acceptance, and Inner Peace with expandable detail sections.
*   **Quranic Carousel:** Dynamic sliding quotes from Surah Al-Hajj and Al-An'am celebrating the virtues of sacrifice and piety.
*   **Eid Takbeerat:** Accessible audio and textual dictionary of the Eid chants.

---

## 🛠️ Technology Stack

The project utilizes a state-of-the-art frontend stack tailored for animations, micro-interactions, and premium typography:

*   **React 19** — Core Architecture (Component-driven UI, state management, and lifecycle hooks)
*   **Vite** — Build Tooling (Lightning-fast Hot Module Replacement and optimized bundler)
*   **Tailwind CSS v4** — Design System (Utility-first modern layout, HSL custom palette, and @theme declarations)
*   **Framer Motion** — Cinematic Transitions (Page overlays, dynamic accordion expansions, and entrance animations)
*   **Web Audio API** — Dynamic Soundscapes (Synthesized oscillator chimes for interactive actions)
*   **Canvas Confetti** — Celebration Feedback (Physics-based particle explosions in brand colors)
*   **Lucide React** — Modern Iconography (Sleek, light-weight vector icons)

---

## 📁 Project Structure

The project has been organized following modern, clean modular architectural guidelines:

```bash
eid-wish/
├── public/                 # Static Assets
│   └── talbiyah.mp3        # Soulful background Hajj chant
├── src/
│   ├── assets/             # Brand logos and vector elements
│   ├── components/
│   │   └── CanvasParticles.jsx  # Interactive background engine
│   ├── utils/
│   │   ├── audio.js        # Hybrid HTML5/Web Audio synthesizer manager
│   │   └── wishesData.js   # Structured DB for prayers, quotes, and wishes
│   ├── App.css             # Main styling rules and custom keyframes
│   ├── App.jsx             # Comprehensive page layout & states
│   ├── index.css           # Tailwind v4 theme, custom scrollbars & glassmorphism tokens
│   └── main.jsx            # Application entry point
├── package.json            # Configuration and dependencies
├── tailwind.config.js      # Legacy configuration compatibility layer
└── vite.config.js          # Vite configuration
```

---

## 🚀 Getting Started

Follow these steps to run the development server locally and explore the project features:

### Prerequisites
Make sure you have Node.js (version 18 or above) installed on your system.

### 1. Clone & Enter Directory
```bash
git clone https://github.com/YOUR_USERNAME/eid-wish.git
cd "eid wish"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 4. Build for Production
To bundle the project with optimal tree-shaking and assets compression:
```bash
npm run build
npm run preview
```

---

## 📱 WhatsApp Card Export Template

When a user crafts a card using the **Golden Eid Card Customizer**, copying it creates a highly stylized text template perfect for messaging platforms:

```text
🌙 EID UL ADHA MUBARAK 🌙

To: My Beloved Family

تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ
_Taqabbalallahu Minna Wa Minkum_
"May Allah accept [this worship] from us and from you."

On this sacred day of Eid ul Adha, we commemorate the profound devotion of Prophet Ibrahim (AS) and Ismail (AS). May Allah SWT shower your life with infinite blessings, accept your sacrifices, and grant you a steadfast heart filled with faith and peace. Eid Mubarak!

With warm blessings from With Prayers

✨ Crafted on Eid ul Adha Wishes 2026 — 27 May 2026 ✨
```

---

## 🎨 Premium Custom Tokens (from `index.css`)

The project implements custom design tokens declared in the Tailwind v4 configuration layer:

```css
@theme {
  /* Royal Gold Palette */
  --color-gold-50: #fffdf5;
  --color-gold-500: #e0981b;
  --color-gold-950: #3f1c05;

  /* Islamic Emerald Palette */
  --color-islamic-50: #eefdf5;
  --color-islamic-500: #15b865;
  --color-islamic-950: #042b1a;

  /* Traditional Typography */
  --font-arabic: 'Amiri', serif;
  --font-cinzel: 'Cinzel', serif;
  --font-playfair: 'Playfair Display', serif;
}
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center" style="font-family: serif; font-style: italic; font-size: 1.1em; color: #fad270;">
  🌙 May the divine blessings of Eid ul Adha bring you immense peace, harmony, and joy! 🌙
</p>
