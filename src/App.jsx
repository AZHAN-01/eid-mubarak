import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Moon,
  Volume2,
  VolumeX,
  Share2,
  Copy,
  Sparkles,
  Heart,
  Clock,
  Compass,
  BookOpen,
  ChevronRight,
  RefreshCw,
  Gift,
  Check,
  Send,
  User,
  Music,
  Menu,
  X
} from 'lucide-react';
import CanvasParticles from './components/CanvasParticles';
import { spiritualSynth } from './utils/audio';
import {
  EID_WISHES,
  ISLAMIC_QUOTES,
  ISLAMIC_DUAS,
  LANTERN_BLESSINGS,
  TAKBEERAT
} from './utils/wishesData';

export default function App() {
  // Sound states
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showAudioTooltip, setShowAudioTooltip] = useState(true);

  // Handle automatic loop start on mount / click unlock
  useEffect(() => {
    // Attempt standard start immediately
    try {
      spiritualSynth.start();
      setIsAudioPlaying(true);
    } catch (e) {
      console.log('Autoplay blocked by browser policy, waiting for user interaction to play...');
    }

    const unlockAudio = () => {
      try {
        spiritualSynth.start();
        setIsAudioPlaying(true);
        // Clean up listeners
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('scroll', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      } catch (err) {
        console.error('Failed to unlock audio context:', err);
      }
    };

    // Listen on multiple common user interactions to unlock context
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
    window.addEventListener('scroll', unlockAudio);
    window.addEventListener('keydown', unlockAudio);

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('scroll', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Mobile nav state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isEidArrived, setIsEidArrived] = useState(false);

  // Blessing Lantern States
  const [activeBlessing, setActiveBlessing] = useState('');
  const [isLanternLit, setIsLanternLit] = useState(false);
  const [lanternClickCount, setLanternClickCount] = useState(0);

  // Interactive Card Customizer States
  const [customTo, setCustomTo] = useState('My Beloved Family');
  const [customFrom, setCustomFrom] = useState('With Prayers');
  const [selectedWish, setSelectedWish] = useState(EID_WISHES[0]);
  const [selectedTheme, setSelectedTheme] = useState('emerald'); // emerald, velvet, gold
  const [selectedFont, setSelectedFont] = useState('playfair'); // playfair, arabic, cinzel
  const [copiedWish, setCopiedWish] = useState(false);

  // Spiritual Hub active tab state
  const [activeHubTab, setActiveHubTab] = useState('duas'); // 'duas', 'quotes', 'takbeerat'

  // Quotes Slide State
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Expanded Dua Card State
  const [expandedDua, setExpandedDua] = useState(0);

  // Celebration trigger
  const triggerConfetti = () => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ['#e0981b', '#f7b73c', '#fde8ab', '#0b9550']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ['#e0981b', '#f7b73c', '#fde8ab', '#0b9550']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  // Audio Toggle
  const toggleAudio = () => {
    if (isAudioPlaying) {
      spiritualSynth.stop();
      setIsAudioPlaying(false);
    } else {
      spiritualSynth.start();
      setIsAudioPlaying(true);
      setShowAudioTooltip(false);
    }
  };

  // Audio Auto-play tooltip fadeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAudioTooltip(false);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  // Countdown calculations
  useEffect(() => {
    const targetDate = new Date('2026-05-27T00:00:00');

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setIsEidArrived(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const m = Math.floor((difference / 1000 / 60) % 60);
        const s = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Rotate quotes automatically in carousel tab
  useEffect(() => {
    if (activeHubTab !== 'quotes') return;
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % ISLAMIC_QUOTES.length);
    }, 6000);
    return () => clearInterval(quoteInterval);
  }, [activeHubTab]);

  // Kindle Lantern handler
  const kindleLantern = () => {
    setIsLanternLit(true);
    triggerConfetti();
    
    const newBlessing = LANTERN_BLESSINGS[lanternClickCount % LANTERN_BLESSINGS.length];
    setActiveBlessing(newBlessing);
    setLanternClickCount((prev) => prev + 1);

    if (isAudioPlaying && spiritualSynth.ctx) {
      const now = spiritualSynth.ctx.currentTime;
      const osc = spiritualSynth.ctx.createOscillator();
      const gain = spiritualSynth.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(Math.random() > 0.5 ? 987.77 : 1318.51, now); // B5 or E6 sparkle
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      osc.connect(gain);
      gain.connect(spiritualSynth.filter);
      osc.start();
      setTimeout(() => osc.stop(), 700);
    }
  };

  // Copy WhatsApp greeting wish
  const copyWishToClipboard = () => {
    const header = `🌙 *EID UL ADHA MUBARAK* 🌙\n\nTo: *${customTo}*`;
    const arabicPart = `\n\n${selectedWish.arabic}\n_${selectedWish.transliteration}_\n"${selectedWish.meaning}"`;
    const wishText = `\n\n${selectedWish.text}`;
    const footer = `\n\nWith warm blessings from *${customFrom}*\n\n✨ Crafted on Eid ul Adha Wishes 2026 — 27 May 2026 ✨`;
    
    const fullText = `${header}${arabicPart}${wishText}${footer}`;
    
    navigator.clipboard.writeText(fullText).then(() => {
      setCopiedWish(true);
      setTimeout(() => setCopiedWish(false), 3000);
    });
  };

  // Smooth scroll helper
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Get current font family name for custom card text
  const getCardFontClass = () => {
    if (selectedFont === 'arabic') return 'font-arabic tracking-wide';
    if (selectedFont === 'cinzel') return 'font-cinzel font-bold tracking-wider';
    return 'font-playfair italic';
  };

  return (
    <div className="relative min-h-screen bg-[#02110c] text-gray-100 font-sans selection:bg-gold-500 selection:text-islamic-950 overflow-x-hidden antialiased">
      
      {/* 1. Canvas particle background layer */}
      <CanvasParticles />

      {/* 2. Sticky Glassmorphic Navigation Bar */}
      <header className="sticky top-0 left-0 w-full z-50 glass-card border-b border-gold-500/20 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Logo Brand */}
          <button 
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-2 text-left bg-transparent border-0 outline-none cursor-pointer focus:outline-none"
          >
            <span className="text-2xl animate-float-slow select-none">🌙</span>
            <div className="flex flex-col">
              <span className="font-cinzel text-sm font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-gold-200 to-gold-400">
                EID MUBARAK
              </span>
              <span className="text-[9px] text-emerald-400 font-semibold tracking-wider -mt-0.5">
                27 May 2026
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-xs font-bold tracking-widest text-gray-300 hover:text-gold-400 uppercase transition-colors duration-200 bg-transparent border-0 cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('lantern-blessings')}
              className="text-xs font-bold tracking-widest text-gray-300 hover:text-gold-400 uppercase transition-colors duration-200 bg-transparent border-0 cursor-pointer"
            >
              Kindle Lantern
            </button>
            <button
              onClick={() => scrollToSection('card-creator')}
              className="text-xs font-bold tracking-widest text-gray-300 hover:text-gold-400 uppercase transition-colors duration-200 bg-transparent border-0 cursor-pointer"
            >
              Card Creator
            </button>
            <button
              onClick={() => scrollToSection('spiritual-hub')}
              className="text-xs font-bold tracking-widest text-gray-300 hover:text-gold-400 uppercase transition-colors duration-200 bg-transparent border-0 cursor-pointer"
            >
              Spiritual Library
            </button>
          </nav>

          {/* Audio Visualizer & Toggle */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <AnimatePresence>
                {showAudioTooltip && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute right-14 glass-card text-[10px] text-gold-300 font-semibold px-3.5 py-1.5 rounded-full shadow-lg border border-gold-500/30 whitespace-nowrap hidden sm:flex items-center gap-1.5 animate-bounce"
                  >
                    <Sparkles className="w-3 h-3 text-gold-400 animate-pulse" />
                    <span>Play ambient spiritual soundscape</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={toggleAudio}
                className="w-10 h-10 rounded-full glass-card border border-gold-500/30 flex items-center justify-center text-gold-400 hover:text-gold-200 transition-all duration-300 hover:scale-105 active:scale-95 bg-transparent cursor-pointer shadow-md group"
                aria-label="Toggle spiritual music background"
              >
                {isAudioPlaying ? (
                  <div className="flex items-end h-3 gap-0.5">
                    <span className="audio-bar" style={{ animationDuration: '0.6s' }}></span>
                    <span className="audio-bar" style={{ animationDuration: '0.8s', animationDelay: '0.2s' }}></span>
                    <span className="audio-bar" style={{ animationDuration: '0.5s', animationDelay: '0.4s' }}></span>
                    <span className="audio-bar" style={{ animationDuration: '0.7s', animationDelay: '0.1s' }}></span>
                  </div>
                ) : (
                  <VolumeX className="w-4.5 h-4.5 text-gold-500/80 group-hover:text-gold-400 transition-colors" />
                )}
              </button>
            </div>

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-gray-300 hover:text-gold-400 bg-transparent border-0 cursor-pointer focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden glass-card border-t border-gold-500/20 overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                <button
                  onClick={() => scrollToSection('home')}
                  className="w-full text-left py-2 text-sm font-bold tracking-widest text-gray-300 hover:text-gold-400 uppercase bg-transparent border-0 cursor-pointer"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('lantern-blessings')}
                  className="w-full text-left py-2 text-sm font-bold tracking-widest text-gray-300 hover:text-gold-400 uppercase bg-transparent border-0 cursor-pointer"
                >
                  Kindle Lantern
                </button>
                <button
                  onClick={() => scrollToSection('card-creator')}
                  className="w-full text-left py-2 text-sm font-bold tracking-widest text-gray-300 hover:text-gold-400 uppercase bg-transparent border-0 cursor-pointer"
                >
                  Card Creator
                </button>
                <button
                  onClick={() => scrollToSection('spiritual-hub')}
                  className="w-full text-left py-2 text-sm font-bold tracking-widest text-gray-300 hover:text-gold-400 uppercase bg-transparent border-0 cursor-pointer"
                >
                  Spiritual Library
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 3. Swaying Lanterns (Header Visual Overlay) */}
      <div className="absolute top-16 left-0 w-full h-[320px] pointer-events-none z-20 hidden lg:block overflow-hidden">
        {/* Left swaying lantern */}
        <div className="absolute left-[8%] top-0 origin-top animate-sway">
          <div className="w-[1px] h-24 bg-gradient-to-b from-gold-500/10 to-gold-500/60 mx-auto"></div>
          <div className="relative w-8 h-14 bg-gradient-to-b from-gold-600/90 to-gold-400/90 rounded-md border border-gold-300/30 flex items-center justify-center shadow-lg lantern-glow">
            <div className="w-3.5 h-7 bg-amber-100/95 rounded-full blur-[2px] animate-pulse"></div>
            <div className="absolute -top-1 left-0.5 right-0.5 h-1 bg-gold-700 rounded-sm"></div>
            <div className="absolute -bottom-1 left-1 right-1 h-1 bg-gold-700 rounded-sm"></div>
          </div>
        </div>

        {/* Right swaying lantern */}
        <div className="absolute right-[10%] top-0 origin-top animate-sway" style={{ animationDelay: '2s' }}>
          <div className="w-[1px] h-36 bg-gradient-to-b from-gold-500/10 to-gold-500/60 mx-auto"></div>
          <div className="relative w-9 h-16 bg-gradient-to-b from-gold-600/90 to-gold-400/90 rounded-md border border-gold-300/30 flex items-center justify-center shadow-lg lantern-glow">
            <div className="w-4 h-8 bg-amber-100/95 rounded-full blur-[2px] animate-pulse"></div>
            <div className="absolute -top-1 left-0.5 right-0.5 h-1.5 bg-gold-700 rounded-sm"></div>
            <div className="absolute -bottom-1 left-1.5 right-1.5 h-1.5 bg-gold-700 rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* 4. Ambient Halo Background Ornaments */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-emerald-500/15 via-gold-500/5 to-transparent rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Main Core Container */}
      <main className="relative max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-20 z-20 flex flex-col items-center">
        
        {/* Section: HOME & HERO HEADER */}
        <section id="home" className="w-full flex flex-col items-center text-center pt-8 mb-16 scroll-mt-20">
          
          {/* Shimmering Moon */}
          <div className="relative w-28 h-28 md:w-32 md:h-32 mb-6 animate-float-slow select-none cursor-pointer group" onClick={triggerConfetti}>
            <div className="absolute inset-0 bg-gold-400/20 rounded-full blur-xl group-hover:bg-gold-400/30 transition-colors duration-300 animate-pulse"></div>
            <svg viewBox="0 0 100 100" className="w-full h-full text-gold-400 fill-current drop-shadow-[0_0_12px_rgba(247,183,60,0.6)] transition-all duration-300 group-hover:scale-105 active:scale-95">
              <path d="M 50 10 A 40 40 0 1 0 90 50 A 30 30 0 1 1 50 10 Z" />
            </svg>
            <div className="absolute top-[22%] right-[18%] text-gold-100 text-xs animate-ping">⭐</div>
          </div>

          {/* Arabic Scripture Calligraphy */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="mb-4"
          >
            <span className="font-arabic text-3xl md:text-5xl lg:text-6xl text-gold-300 font-bold tracking-wide text-glow-gold select-none block">
              عِيد الأَضْحَى المُبَارَك
            </span>
          </motion.div>
          
          {/* Main English Cinematic Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="font-cinzel text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-400 to-gold-600 tracking-widest mb-3 text-glow-gold"
          >
            EID UL ADHA 2026
          </motion.h1>
          
          {/* Core Values Sub-text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-playfair text-lg md:text-2xl text-emerald-300/90 italic tracking-widest mb-10"
          >
            Sacrifice • Devotion • Spiritual Harmony
          </motion.p>

          {/* Premium Countdown Clock Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="w-full max-w-2xl glass-card rounded-2xl p-5 md:p-7 text-center shadow-2xl relative overflow-hidden group border border-gold-500/25"
          >
            {/* Ornaments in corners */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-gold-500/40"></div>
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-gold-500/40"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-gold-500/40"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-gold-500/40"></div>

            <div className="absolute inset-0 bg-gradient-to-b from-gold-500/[0.03] to-transparent pointer-events-none"></div>

            <span className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-gold-400 uppercase mb-5 flex items-center justify-center gap-2 select-none">
              <Clock className="w-3.5 h-3.5 text-gold-400 animate-spin-slow" />
              <span>Time Left Until 27 May 2026</span>
            </span>

            {isEidArrived ? (
              <div className="py-4">
                <motion.h3
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="font-cinzel text-3xl md:text-4xl font-bold text-gold-300 text-glow-gold"
                >
                  🎉 EID MUBARAK! 🎉
                </motion.h3>
                <p className="text-gray-300 mt-2 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                  The holy festival of sacrifice is finally here. May your acts of piety, prayers, and sacrifices be accepted in abundance.
                </p>
                <button
                  onClick={triggerConfetti}
                  className="mt-5 px-5 py-2 rounded-full bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-islamic-950 font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md flex items-center gap-2 mx-auto cursor-pointer border-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Shower Blessings</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2.5 md:gap-5 max-w-xl mx-auto relative z-10">
                {/* Timer block helper */}
                {[
                  { label: 'Days', val: timeLeft.days },
                  { label: 'Hours', val: timeLeft.hours },
                  { label: 'Minutes', val: timeLeft.minutes },
                  { label: 'Seconds', val: timeLeft.seconds }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-xl glass-card flex items-center justify-center border border-gold-500/20 shadow-inner group-hover:border-gold-500/35 transition-colors duration-300 overflow-hidden">
                      {/* Ambient card back light */}
                      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-emerald-900/10 pointer-events-none"></div>
                      
                      {/* Glowing gold border circle segment */}
                      <div className="absolute inset-1 rounded-lg border border-gold-500/5 opacity-40"></div>
                      
                      <span className="font-cinzel text-xl md:text-3xl font-black text-gold-300 text-glow-gold relative z-10">
                        {item.val.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-[9px] md:text-[10px] text-emerald-400 font-bold tracking-widest mt-2 uppercase select-none">{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

        </section>


        {/* Section: KINDLE SACRED LANTERN */}
        <section id="lantern-blessings" className="w-full max-w-4xl px-4 py-8 mb-16 scroll-mt-20">
          <div className="relative glass-card rounded-3xl p-6 md:p-10 overflow-hidden shadow-2xl border border-gold-500/20 text-center flex flex-col items-center">
            
            {/* Elegant Background Watermark */}
            <div className="absolute inset-0 geometric-bg opacity-10 pointer-events-none"></div>
            
            <div className="max-w-2xl mx-auto relative z-10 flex flex-col items-center w-full">
              <span className="text-[10px] text-gold-400 font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5 justify-center select-none">
                <Gift className="w-3.5 h-3.5 text-gold-500" />
                <span>Interactive Sufi Blessings</span>
              </span>
              
              <h2 className="font-cinzel text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 to-gold-400 mb-3">
                Kindle the Sacred Eid Lantern
              </h2>
              
              <p className="text-gray-300 text-xs md:text-sm mb-6 leading-relaxed max-w-lg">
                Light the lantern's spiritual candle by clicking it. Each kindle summons a beautiful, heartfelt Eid blessing and prayer created to bring peace to your heart.
              </p>

              {/* Lantern Button Wrapper - explicitly bg-transparent border-0 shadow-none to fix the white box issue */}
              <button
                onClick={kindleLantern}
                className="relative w-32 h-44 md:w-40 md:h-52 focus:outline-none group mb-6 transition-all duration-300 hover:scale-105 active:scale-95 bg-transparent border-0 p-0 outline-none shadow-none cursor-pointer"
                aria-label="Kindle the sacred lantern"
              >
                {/* Glow ring */}
                <div className={`absolute inset-0 bg-gold-400/20 rounded-full blur-[25px] transition-all duration-700 ${isLanternLit ? 'scale-150 opacity-100' : 'scale-100 opacity-50 group-hover:opacity-75'}`}></div>
                
                {/* SVG Graphic */}
                <svg
                  viewBox="0 0 100 130"
                  className={`w-full h-full transition-all duration-500 drop-shadow-[0_0_10px_rgba(224,152,27,0.35)] group-hover:drop-shadow-[0_0_20px_rgba(224,152,27,0.6)] ${isLanternLit ? 'text-gold-300 fill-current' : 'text-gold-600/90 fill-current'}`}
                >
                  {/* Top hang ring */}
                  <circle cx="50" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  
                  {/* Top crown Cap */}
                  <path d="M35 25 L50 15 L65 25 Z" fill="currentColor" opacity="0.95" />
                  <rect x="30" y="25" width="40" height="5" rx="1.5" fill="currentColor" />

                  {/* Main chamber */}
                  {/* If lit, fill with beautiful radial glow gradient */}
                  <path d="M30 30 L24 84 L76 84 L70 30 Z" fill={isLanternLit ? "url(#sacredLanternGlow)" : "rgba(224,152,27,0.12)"} stroke="currentColor" strokeWidth="2" />
                  
                  {/* Chamber structural bars */}
                  <line x1="50" y1="30" x2="50" y2="84" stroke="currentColor" strokeWidth="1.5" opacity="0.75" />
                  <line x1="39" y1="31" x2="35" y2="83" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                  <line x1="61" y1="31" x2="65" y2="83" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />

                  {/* Base platform */}
                  <rect x="20" y="84" width="60" height="7" rx="1.5" fill="currentColor" />
                  <path d="M26 91 L33 103 L67 103 L74 91 Z" fill="currentColor" opacity="0.95" />
                  
                  {/* Bottom ornaments (Tassels) */}
                  <path d="M50 103 L50 118 M42 103 L40 113 M58 103 L60 113" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
                  
                  {/* Dynamic burning flame */}
                  {isLanternLit && (
                    <g className="animate-pulse">
                      {/* Innermost core */}
                      <circle cx="50" cy="56" r="13" fill="#ffffff" filter="blur(2.5px)" />
                      {/* Main flame body */}
                      <path d="M50 35 C41 51 43 65 50 65 C57 65 59 51 50 35 Z" fill="#ffb000" opacity="0.9" />
                      {/* Secondary hot core */}
                      <path d="M50 43 C46 53 47 61 50 61 C53 61 54 53 50 43 Z" fill="#ff6200" opacity="0.95" />
                    </g>
                  )}

                  {/* SVG Gradients definition */}
                  <defs>
                    <radialGradient id="sacredLanternGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fffcee" stopOpacity="0.95" />
                      <stop offset="30%" stopColor="#fde8ab" stopOpacity="0.75" />
                      <stop offset="65%" stopColor="#e0981b" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#02140e" stopOpacity="0.05" />
                    </radialGradient>
                  </defs>
                </svg>

                {/* Shimmering label */}
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-gold-300 font-bold text-[10px] uppercase tracking-widest animate-pulse flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-gold-400 animate-spin-slow" />
                  {isLanternLit ? 'Kindled' : 'Tap to Kindle'}
                </span>
              </button>

              {/* Glowing Custom Blessing Box */}
              <AnimatePresence mode="wait">
                {isLanternLit && activeBlessing && (
                  <motion.div
                    key={activeBlessing}
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-islamic-900/60 to-emerald-950/80 border border-gold-500/40 relative z-20 shadow-xl max-w-xl text-center flex flex-col items-center justify-center animate-glow-pulse"
                  >
                    <p className="font-playfair text-[15px] md:text-lg text-gold-50 font-medium leading-relaxed italic">
                      "{activeBlessing}"
                    </p>
                    <div className="w-16 h-[0.5px] bg-gold-500/35 my-3"></div>
                    <span className="text-[9px] tracking-widest uppercase text-gold-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Heavenly blessing for you</span>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {isLanternLit && (
                <button
                  onClick={kindleLantern}
                  className="mt-5 flex items-center gap-2 text-[10px] font-bold text-gold-400 hover:text-gold-200 transition-colors bg-gold-500/10 hover:bg-gold-500/25 px-4.5 py-2 rounded-full border border-gold-500/30 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-gold-400 animate-spin-slow" />
                  <span>Receive Another Blessing</span>
                </button>
              )}
            </div>
          </div>
        </section>


        {/* Section: EID GREETING CARD CUSTOMIZER */}
        <section id="card-creator" className="w-full max-w-6xl px-4 py-8 mb-16 scroll-mt-20">
          <div className="text-center mb-10">
            <span className="text-[10px] text-gold-400 font-bold uppercase tracking-[0.25em] mb-2 block select-none">
              Card Customizer Engine
            </span>
            <h2 className="font-cinzel text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-400 to-gold-600 mb-3">
              Craft Your Golden Eid Card
            </h2>
            <p className="text-gray-300 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
              Design a gorgeous digital Eid card. Personalize greetings, select from professional tones, customize typefaces, choose luxurious background backdrops, and instantly export to share!
            </p>
          </div>

          {/* Customizer Layout Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Control Panel (5 cols) */}
            <div className="lg:col-span-5 glass-card rounded-2xl p-5 md:p-7 flex flex-col gap-5 shadow-xl border border-gold-500/20 relative">
              
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-gold-500/10"></div>
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-gold-500/10"></div>

              {/* 1. Recipient input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest text-gold-400 uppercase flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gold-500" />
                  <span>Recipient's Name (To):</span>
                </label>
                <input
                  type="text"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  placeholder="e.g. Dearest Sister, Family..."
                  maxLength={30}
                  className="w-full bg-[#02100a]/80 border border-gold-500/20 hover:border-gold-500/40 focus:border-gold-500 focus:outline-none px-4 py-2 rounded-lg text-gold-100 text-xs font-medium transition-all focus:ring-1 focus:ring-gold-500"
                />
              </div>

              {/* 2. Sender signature input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest text-gold-400 uppercase flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gold-500" />
                  <span>Sender Signature (From):</span>
                </label>
                <input
                  type="text"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  placeholder="e.g. Your Brother Sameer..."
                  maxLength={30}
                  className="w-full bg-[#02100a]/80 border border-gold-500/20 hover:border-gold-500/40 focus:border-gold-500 focus:outline-none px-4 py-2 rounded-lg text-gold-100 text-xs font-medium transition-all focus:ring-1 focus:ring-gold-500"
                />
              </div>

              {/* 3. Luxury Backdrop Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-widest text-gold-400 uppercase">
                  Select Luxurious Card Canvas:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'emerald', label: 'Royal Emerald', color: 'bg-emerald-950' },
                    { id: 'velvet', label: 'Velvet Black', color: 'bg-neutral-900' },
                    { id: 'gold', label: 'Golden Glory', color: 'bg-[#b87614]' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedTheme(item.id)}
                      className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg border text-[10px] font-bold transition-all bg-transparent cursor-pointer ${
                        selectedTheme === item.id 
                          ? 'border-gold-400 text-gold-300 ring-1 ring-gold-400 bg-gold-500/5' 
                          : 'border-gold-500/20 text-gray-400 hover:border-gold-500/40 hover:text-gray-200'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full ${item.color} border border-gold-500/30 mb-1`}></div>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Font Typography Style Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-widest text-gold-400 uppercase">
                  Select Greeting Font Family:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'playfair', label: 'Playfair', labelStyle: 'font-playfair italic' },
                    { id: 'arabic', label: 'Arabic', labelStyle: 'font-arabic' },
                    { id: 'cinzel', label: 'Cinzel', labelStyle: 'font-cinzel' }
                  ].map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setSelectedFont(font.id)}
                      className={`py-2 px-1 rounded-lg border text-[10px] font-bold transition-all bg-transparent cursor-pointer ${
                        selectedFont === font.id
                          ? 'border-gold-400 text-gold-300 ring-1 ring-gold-400 bg-gold-500/5'
                          : 'border-gold-500/20 text-gray-400 hover:border-gold-500/40 hover:text-gray-200'
                      }`}
                    >
                      <span className={`${font.labelStyle} block text-center text-[11px]`}>{font.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Wish Message Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-widest text-gold-400 uppercase">
                  Select Blessing Tone & Message:
                </label>
                <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {EID_WISHES.map((wish) => (
                    <button
                      key={wish.id}
                      onClick={() => setSelectedWish(wish)}
                      className={`text-left p-2.5 rounded-lg border text-[11px] transition-all bg-transparent cursor-pointer flex flex-col gap-1 relative ${
                        selectedWish.id === wish.id 
                          ? 'bg-gold-500/10 border-gold-400 text-gold-100 ring-1 ring-gold-400/25' 
                          : 'bg-[#02100a]/40 border-gold-500/10 text-gray-400 hover:border-gold-500/30 hover:text-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="font-bold tracking-wide text-gold-400 text-[10px] uppercase">{wish.category}</span>
                        {selectedWish.id === wish.id && (
                          <span className="text-[9px] text-emerald-400 bg-emerald-500/15 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="font-playfair text-[12px] font-semibold text-gray-300 italic">"{wish.title}"</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Live Card Renderer (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              
              {/* Card Aspect box */}
              <div
                id="eid-greeting-card"
                className={`relative w-full aspect-[4/3] min-h-[380px] md:min-h-[420px] rounded-2xl overflow-hidden shadow-2xl border-2 border-gold-500/40 p-6 md:p-8 flex flex-col justify-between transition-all duration-700 ${
                  selectedTheme === 'emerald'
                    ? 'bg-gradient-to-br from-[#021d13] via-[#053d26] to-[#01140d]'
                    : selectedTheme === 'velvet'
                    ? 'bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950'
                    : 'bg-gradient-to-br from-[#4d2a05] via-[#241301] to-[#120700]'
                }`}
              >
                {/* Core design borders */}
                <div className="absolute inset-3.5 border border-gold-500/25 rounded-xl pointer-events-none z-10"></div>
                <div className="absolute inset-4.5 border border-gold-500/10 rounded-lg pointer-events-none z-10"></div>
                
                {/* Geometric Grid overlay */}
                <div className="absolute inset-0 geometric-bg opacity-15 pointer-events-none"></div>

                {/* Corner stars */}
                <div className="absolute top-6 left-6 text-gold-500/70 font-serif text-[10px] select-none z-10">✦</div>
                <div className="absolute top-6 right-6 text-gold-500/70 font-serif text-[10px] select-none z-10">✦</div>
                <div className="absolute bottom-6 left-6 text-gold-500/70 font-serif text-[10px] select-none z-10">✦</div>
                <div className="absolute bottom-6 right-6 text-gold-500/70 font-serif text-[10px] select-none z-10">✦</div>

                {/* Left/Right Hanging lanterns inside card */}
                <div className="absolute top-5 left-10 text-gold-500/30 opacity-60 w-6 h-10 pointer-events-none">
                  <svg viewBox="0 0 100 130" className="w-full h-full fill-current">
                    <circle cx="50" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="4" />
                    <path d="M35 25 L50 15 L65 25 Z M30 25 H70 V31 H30 Z M30 31 L25 85 L75 85 L70 31 Z" stroke="currentColor" strokeWidth="3" fill="none" />
                  </svg>
                </div>
                <div className="absolute top-5 right-10 text-gold-500/30 opacity-60 w-6 h-10 pointer-events-none">
                  <svg viewBox="0 0 100 130" className="w-full h-full fill-current">
                    <circle cx="50" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="4" />
                    <path d="M35 25 L50 15 L65 25 Z M30 25 H70 V31 H30 Z M30 31 L25 85 L75 85 L70 31 Z" stroke="currentColor" strokeWidth="3" fill="none" />
                  </svg>
                </div>

                {/* Card Top Block: Recipient */}
                <div className="relative z-10 flex justify-between items-start pt-1">
                  <div className="flex flex-col">
                    <span className="text-[9px] md:text-[10px] font-bold text-gold-400/80 uppercase tracking-widest select-none">To my beloved</span>
                    <span className="font-playfair text-base md:text-lg font-bold text-gold-50 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
                      {customTo || 'Loved One'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-arabic text-lg md:text-xl text-gold-400/90 block select-none">
                      {selectedWish.arabic.split(' ').slice(0, 2).join(' ')}
                    </span>
                  </div>
                </div>

                {/* Card Core Content (Render selected Typography class) */}
                <div className="relative z-10 text-center my-auto px-2 md:px-6 py-2">
                  <div className="w-14 h-[1px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent mx-auto mb-3.5"></div>
                  
                  {/* Arabic block */}
                  <p className="font-arabic text-xl md:text-2xl lg:text-3xl text-gold-300 text-glow-gold mb-1.5 tracking-wide select-none leading-normal">
                    {selectedWish.arabic}
                  </p>
                  
                  {/* Transliteration */}
                  <p className="text-[9px] md:text-[10px] text-gold-200/50 italic tracking-widest mb-3.5">
                    "{selectedWish.transliteration}"
                  </p>

                  {/* Wish Text - dynamically sized based on character counts and applying selected font family */}
                  <p className={`text-xs leading-relaxed text-gray-200 max-w-xl mx-auto font-light ${getCardFontClass()}`}>
                    {selectedWish.text}
                  </p>

                  <div className="w-14 h-[1px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent mx-auto mt-3.5"></div>
                </div>

                {/* Card Bottom Signature */}
                <div className="relative z-10 flex justify-between items-end pb-1">
                  <div className="text-left flex flex-col">
                    <span className="text-[8px] md:text-[9px] font-bold text-gold-400/80 uppercase tracking-widest block select-none">With Prayers:</span>
                    <span className="font-playfair text-xs md:text-sm font-semibold text-gold-200">
                      {customFrom || 'Warm Blessings'}
                    </span>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="font-cinzel text-[9px] md:text-[10px] font-bold text-gold-400 tracking-wider">
                      Eid ul Adha Mubarak
                    </span>
                    <span className="text-[8px] text-gray-400/85">
                      27 May 2026
                    </span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {/* Trigger Confetti celebrate */}
                <button
                  onClick={triggerConfetti}
                  className="py-3 px-5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-islamic-950 font-bold transition-all duration-300 hover:scale-103 active:scale-97 shadow-md flex items-center justify-center gap-2 group text-xs md:text-sm cursor-pointer border-0"
                >
                  <Sparkles className="w-4 h-4 text-islamic-950 group-hover:animate-ping" />
                  <span>Shower Celebration Confetti</span>
                </button>

                {/* WhatsApp Share / Copy link */}
                <button
                  onClick={copyWishToClipboard}
                  className={`py-3 px-5 rounded-xl border font-bold transition-all duration-300 hover:scale-103 active:scale-97 flex items-center justify-center gap-2 text-xs md:text-sm cursor-pointer bg-transparent ${
                    copiedWish
                      ? 'bg-emerald-600/15 border-emerald-400 text-emerald-300'
                      : 'border-gold-500/40 text-gold-300 hover:bg-gold-500/10 hover:border-gold-500'
                  }`}
                >
                  {copiedWish ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
                      <span>Wish Copied! Ready to Paste</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-gold-400" />
                      <span>Copy Wish for WhatsApp</span>
                    </>
                  )}
                </button>
              </div>

              {/* Tip Banner */}
              <p className="text-[10px] text-gray-400 text-center italic mt-1 flex items-center justify-center gap-1 select-none">
                <span>💡</span> 
                Copies with elegant emojis and styled markdown formatting perfectly suited for sharing on WhatsApp or SMS.
              </p>

            </div>

          </div>
        </section>


        {/* Section: SPIRITUAL LIBRARY HUB (Tabs: Duas, Quotes, Takbeerat) */}
        <section id="spiritual-hub" className="w-full max-w-5xl px-4 py-8 mb-12 scroll-mt-20">
          
          <div className="text-center mb-8">
            <span className="text-[10px] text-gold-400 font-bold uppercase tracking-[0.25em] mb-2 block select-none">
              Ummah Spiritual Resources
            </span>
            <h2 className="font-cinzel text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-400 to-gold-600 mb-3">
              The Spiritual Library
            </h2>
            <p className="text-gray-300 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
              Explore deep Quranic reminders on sacrifice, learn authentic duas recited by prophets, or recite the holy Takbeerat with correct translations.
            </p>
          </div>

          {/* Premium Tab Bar Selector */}
          <div className="flex justify-center border-b border-gold-500/20 max-w-xl mx-auto mb-8 p-1 glass-card rounded-full shadow-md">
            {[
              { id: 'duas', label: 'Sacred Duas', icon: Heart },
              { id: 'quotes', label: 'Islamic Quotes', icon: BookOpen },
              { id: 'takbeerat', label: 'Takbeerat Reader', icon: Compass }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeHubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveHubTab(tab.id);
                    // Reset sub-state values
                    setCurrentQuoteIndex(0);
                  }}
                  className={`flex-1 py-2 px-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer bg-transparent border-0 focus:outline-none ${
                    isActive 
                      ? 'bg-gradient-to-r from-gold-600 to-gold-400 text-islamic-950 shadow-md font-black' 
                      : 'text-gray-400 hover:text-gold-300'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Tab Panes */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              
              {/* Tab 1: DUAS Supplication grid */}
              {activeHubTab === 'duas' && (
                <motion.div
                  key="duas"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
                >
                  {ISLAMIC_DUAS.map((dua, index) => {
                    const isExpanded = expandedDua === index;
                    return (
                      <div
                        key={dua.id}
                        onClick={() => setExpandedDua(index)}
                        className={`glass-card rounded-xl p-5 border text-left cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                          isExpanded 
                            ? 'border-gold-400 bg-gold-500/[0.05] ring-1 ring-gold-400/20 shadow-lg' 
                            : 'border-gold-500/10 bg-[#02100a]/40 hover:border-gold-500/30'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-5 h-5 rounded-full bg-gold-500/10 border border-gold-500/35 flex items-center justify-center text-[10px] font-sans font-black text-gold-400">
                              {index + 1}
                            </span>
                            <span className="font-playfair text-sm md:text-base font-bold text-gold-300">
                              {dua.title}
                            </span>
                          </div>

                          {/* Arabic */}
                          <p className="font-arabic text-right text-lg md:text-xl text-gold-200 leading-relaxed py-1.5 select-none tracking-wide">
                            {dua.arabic}
                          </p>

                          {/* Transliteration */}
                          <p className="text-[10px] text-gold-300/60 italic mb-3 leading-relaxed">
                            "{dua.transliteration}"
                          </p>

                          {/* Translation */}
                          <p className="text-[11px] text-gray-200 font-light leading-relaxed mb-3">
                            <span className="font-bold text-gold-400/80 tracking-wider text-[8px] uppercase block mb-0.5">Meaning</span>
                            "{dua.translation}"
                          </p>
                        </div>

                        {/* Benefit Footer */}
                        <div className="mt-3 pt-3 border-t border-gold-500/10">
                          <p className="text-[9.5px] text-emerald-400 leading-relaxed italic">
                            💡 <strong>Virtue:</strong> {dua.benefit}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {/* Tab 2: ISLAMIC QUOTES Carousel Panel */}
              {activeHubTab === 'quotes' && (
                <motion.div
                  key="quotes"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="max-w-2xl mx-auto glass-card rounded-2xl p-6 md:p-8 border border-gold-500/25 shadow-2xl text-center relative min-h-[250px] flex flex-col justify-between"
                >
                  <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-gold-500/30"></div>
                  <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-gold-500/30"></div>

                  <div className="my-auto py-2">
                    <span className="text-[9px] text-gold-400 font-bold uppercase tracking-widest mb-3 block">
                      Quran Verse & Hadith Wisdom
                    </span>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQuoteIndex}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col items-center"
                      >
                        <p className="font-playfair text-[15px] md:text-lg leading-relaxed text-gray-100 font-medium italic max-w-xl mb-4">
                          "{ISLAMIC_QUOTES[currentQuoteIndex].text}"
                        </p>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gold-400 font-bold">
                            — {ISLAMIC_QUOTES[currentQuoteIndex].source}
                          </span>
                          <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.2 rounded-full border border-emerald-500/20 font-bold uppercase tracking-wider">
                            {ISLAMIC_QUOTES[currentQuoteIndex].theme}
                          </span>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Carousel Page Dots */}
                  <div className="flex justify-center gap-1.5 mt-6">
                    {ISLAMIC_QUOTES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuoteIndex(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 bg-transparent p-0 border-0 cursor-pointer ${
                          currentQuoteIndex === idx 
                            ? 'bg-gold-400 w-4 shadow-sm shadow-gold-500/40' 
                            : 'bg-gold-500/30'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      ></button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tab 3: HOLY TAKBEERAT Reader */}
              {activeHubTab === 'takbeerat' && (
                <motion.div
                  key="takbeerat"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="max-w-4xl mx-auto glass-card rounded-2xl p-6 md:p-8 border border-gold-500/25 shadow-2xl relative"
                >
                  {/* Corner Ornaments */}
                  <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-gold-500/30"></div>
                  <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-gold-500/30"></div>
                  <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-gold-500/30"></div>
                  <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-gold-500/30"></div>

                  <div className="text-center">
                    <span className="text-[9px] text-gold-400 font-bold uppercase tracking-widest mb-3 block select-none">
                      Chanted throughout the days of Tashreeq
                    </span>

                    {/* Big Calligraphy */}
                    <p className="font-arabic text-2xl md:text-3xl lg:text-4xl text-gold-300 leading-relaxed max-w-3xl mx-auto mb-5 text-glow-gold tracking-wide select-none">
                      {TAKBEERAT.arabic}
                    </p>

                    {/* Transliteration */}
                    <p className="font-serif text-xs md:text-sm text-gold-200/60 italic max-w-2xl mx-auto mb-4 leading-relaxed">
                      "{TAKBEERAT.transliteration}"
                    </p>

                    <div className="w-16 h-[0.5px] bg-gold-500/20 my-3 mx-auto"></div>

                    {/* English Translation */}
                    <div className="max-w-xl mx-auto mt-2">
                      <span className="font-bold text-gold-400/80 tracking-widest text-[8px] uppercase block mb-1">
                        English Translation
                      </span>
                      <p className="font-sans text-[11px] md:text-xs text-gray-300 leading-relaxed font-light">
                        "{TAKBEERAT.translation}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </section>

      </main>

      {/* 5. Stunning Mosque Skyline Silhouette Footer */}
      <footer className="relative w-full overflow-hidden bg-gradient-to-t from-black via-[#010906] to-transparent pt-32 pb-8 z-30">
        
        {/* Layered mosque silhouette vector block */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none select-none z-10 flex flex-col justify-end">
          
          {/* Layer A: Back Silhouette (Taller, semi-transparent) */}
          <div className="w-full opacity-30 text-[#033b23] fill-current -mb-8 scale-[1.02]">
            <svg viewBox="0 0 1440 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 220H1440V120C1400 125 1370 140 1330 142C1280 144 1250 115 1235 95C1220 75 1205 75 1190 95C1175 115 1145 144 1095 142C1055 140 1025 125 985 120C920 112 880 75 850 40C820 5 805 5 775 40C745 75 705 112 640 120C600 125 570 140 530 142C480 144 450 115 435 95C420 75 405 75 390 95C375 115 345 144 295 142C255 140 225 125 185 120C120 112 80 75 50 40C30 15 20 15 0 35V220Z" />
            </svg>
          </div>

          {/* Layer B: Front Silhouette (Shorter, deep solid black/gold) */}
          <div className="w-full opacity-95 text-[#000402] fill-current">
            <svg viewBox="0 0 1440 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-[0_-4px_12px_rgba(4,43,26,0.65)]">
              <path d="M0 180H1440V90C1410 93 1380 102 1350 105C1300 110 1270 85 1255 70C1240 55 1225 55 1210 70C1195 85 1165 110 1115 105C1085 102 1055 93 1025 90C965 83 930 55 905 28C880 1 865 1 840 28C815 55 780 83 720 90C690 93 660 102 630 105C580 110 550 85 535 70C520 55 505 55 490 70C475 85 445 110 395 105C365 102 335 93 305 90C245 83 210 55 185 28C160 1 145 1 120 28C95 55 60 83 0 90V180Z" />
            </svg>
          </div>

        </div>

        {/* Footer Text & Credentials */}
        <div className="relative max-w-4xl mx-auto px-4 text-center z-20 pt-10 pb-4 flex flex-col items-center">
          
          {/* Scroll Divider */}
          <div className="flex items-center gap-3 mb-5 select-none opacity-80">
            <div className="w-16 md:w-24 h-[1px] bg-gradient-to-r from-transparent to-gold-500"></div>
            <span className="text-gold-400 font-serif text-sm">🌙</span>
            <div className="w-16 md:w-24 h-[1px] bg-gradient-to-l from-transparent to-gold-500"></div>
          </div>

          <h3 className="font-cinzel text-base md:text-lg font-bold tracking-[0.25em] text-gold-300 text-glow-gold mb-2 select-none">
            EID UL ADHA MUBARAK
          </h3>

          <p className="text-gray-400 text-[11px] md:text-xs font-light max-w-md leading-relaxed mb-5 select-none">
            "May the sacred spirit of Prophet Ibrahim's sacrifice fill your heart with pure trust, sublime devotion, and infinite celestial peace."
          </p>

          <p className="font-cinzel text-[10px] md:text-xs text-gold-400/90 tracking-widest font-bold mb-4 uppercase">
            Eid ul Adha Mubarak — 27 May 2026
          </p>

          <div className="w-full h-[0.5px] bg-gold-500/10 my-3"></div>

          <p className="text-[10px] text-gray-400 font-mono tracking-wider">
            Designed & Developed by <span className="text-gold-300 font-bold text-glow-gold">Mohammad Azhan Najar</span>
          </p>

          <a
            href="https://www.instagram.com/azhanmuzaffar56/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-gold-400 hover:text-gold-200 transition-all duration-300 mt-2.5 hover:scale-105 active:scale-95 font-medium tracking-wide bg-gold-500/5 hover:bg-gold-500/10 px-4 py-1.5 rounded-full border border-gold-500/20 shadow-md"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 text-gold-400 animate-pulse"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <span>@azhanmuzaffar56</span>
          </a>

          <p className="text-[9px] text-gray-600 font-mono tracking-wider mt-4">
            All rights reserved • © 2026
          </p>

        </div>
      </footer>

    </div>
  );
}
