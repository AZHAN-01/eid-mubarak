// Premium Web Audio & HTML5 Audio Hybrid Player
// Plays the authentic, looping Hajj Talbiyah ("Labbaik Allahumma Labbaik")
// Bypasses browser CORS / Web Audio API source locks for maximum reliability on localhost & mobile

class SpiritualSynth {
  constructor() {
    this.ctx = null;
    this.audioElement = null;
    this.filter = null;
    this.isPlaying = false;
  }

  init() {
    if (this.audioElement) return;
    
    // 1. Create the direct HTML5 Audio element for background Talbiyah
    this.audioElement = new Audio(`${import.meta.env.BASE_URL}talbiyah.mp3`);
    this.audioElement.loop = true;
    this.audioElement.volume = 0; // Start at 0 for clean fade-in
    
    // 2. Initialize the Web Audio API context separately for the interactive lantern chimes
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
      this.filter.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Web Audio API not supported, chimes will be silent:", e);
    }
  }

  start() {
    this.init();
    
    if (this.isPlaying) return;
    this.isPlaying = true;
    
    // Resume the chime context if suspended
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    // Play the background Talbiyah chant
    this.audioElement.play().then(() => {
      console.log("Audio playing successfully!");
    }).catch(e => {
      console.log("Audio autoplay blocked by browser policy, waiting for user click:", e);
    });
    
    // Smooth 1.2-second volume fade-in directly on the Audio element
    let vol = 0;
    this.audioElement.volume = 0;
    
    const fadeInInterval = setInterval(() => {
      if (!this.isPlaying) {
        clearInterval(fadeInInterval);
        return;
      }
      vol += 0.05;
      if (vol >= 0.75) {
        this.audioElement.volume = 0.75;
        clearInterval(fadeInInterval);
      } else {
        this.audioElement.volume = vol;
      }
    }, 50);
  }

  stop() {
    if (!this.isPlaying) return;
    
    // Smooth 800ms volume fade-out directly on the Audio element
    let vol = this.audioElement.volume;
    const fadeOutInterval = setInterval(() => {
      vol -= 0.08;
      if (vol <= 0) {
        if (this.audioElement) {
          this.audioElement.volume = 0;
          this.audioElement.pause();
        }
        this.isPlaying = false;
        clearInterval(fadeOutInterval);
      } else {
        if (this.audioElement) {
          this.audioElement.volume = vol;
        }
      }
    }, 50);
  }
}

export const spiritualSynth = new SpiritualSynth();
