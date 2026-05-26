// Premium Web Audio Synthesizer for ambient spiritual music
// Uses the traditional Middle Eastern "Hijaz" scale for an authentic, cinematic soundscape

class SpiritualSynth {
  constructor() {
    this.ctx = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.filter = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.melodyTimer = null;
    
    // Hijaz scale frequencies based on A3 (220 Hz)
    // A (220), Bb (233.08), C# (277.18), D (293.66), E (329.63), F (349.23), G (392.00), A4 (440)
    this.hijazScale = [220.00, 233.08, 277.18, 293.66, 329.63, 349.23, 392.00, 440.00, 466.16, 554.37, 587.33, 659.25];
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create master gain node
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    
    // Create lowpass filter for warmth
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(1.5, this.ctx.currentTime);
    
    // Connect filter to master gain and master gain to destination
    this.filter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  start() {
    this.init();
    
    if (this.isPlaying) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    this.isPlaying = true;
    
    // Fade in master gain smoothly
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(0.35, now + 3); // 3 seconds fade in

    // 1. Start continuous spiritual drone (Root + Fifth: A1 = 55Hz, E2 = 82.4Hz)
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'triangle'; // Warm, hollow sound
    this.droneOsc1.frequency.setValueAtTime(55.00, now); // A1
    
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'sawtooth'; // Richer harmonics
    this.droneOsc2.frequency.setValueAtTime(82.41, now); // E2 (Perfect Fifth)
    
    // Lower gain for saw drone to prevent harshness
    const droneGain1 = this.ctx.createGain();
    droneGain1.gain.setValueAtTime(0.08, now);
    
    const droneGain2 = this.ctx.createGain();
    droneGain2.gain.setValueAtTime(0.04, now);
    
    // Connect drone oscillators through filter
    this.droneOsc1.connect(droneGain1);
    droneGain1.connect(this.filter);
    
    this.droneOsc2.connect(droneGain2);
    droneGain2.connect(this.filter);
    
    this.droneOsc1.start();
    this.droneOsc2.start();

    // 2. Start organic filter sweeping
    this.sweepFilter();

    // 3. Start generative ambient Hijaz melody
    this.playNextMelodyNote();
  }

  sweepFilter() {
    if (!this.isPlaying) return;
    const now = this.ctx.currentTime;
    // Sweep the lowpass filter frequency between 400Hz and 1000Hz every 8 seconds
    this.filter.frequency.cancelScheduledValues(now);
    this.filter.frequency.setValueAtTime(this.filter.frequency.value, now);
    this.filter.frequency.linearRampToValueAtTime(400 + Math.random() * 600, now + 4 + Math.random() * 4);
    
    setTimeout(() => this.sweepFilter(), 8000);
  }

  playNextMelodyNote() {
    if (!this.isPlaying) return;
    
    const now = this.ctx.currentTime;
    
    // Play a note 70% of the time, rest 30% of the time for organic feel
    if (Math.random() > 0.3) {
      // Pick a random note from the Hijaz scale, prefer middle-high range (index 3 to 10)
      const noteIndex = 3 + Math.floor(Math.random() * 7);
      const freq = this.hijazScale[noteIndex];
      
      // Create synth voice for the melody note
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      // Warm sine wave for flute-like texture
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      // Subtle vibrato (LFO)
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(4.5 + Math.random() * 2, now); // vibrato rate
      lfoGain.gain.setValueAtTime(1.5, now); // vibrato depth (Hz)
      
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();
      
      // Volume Envelope (Very slow attack, long release)
      gainNode.gain.setValueAtTime(0, now);
      const attackTime = 0.8 + Math.random() * 0.8;
      const decayTime = 1.0;
      const sustain = 0.3;
      const releaseTime = 1.5 + Math.random() * 1.5;
      
      gainNode.gain.linearRampToValueAtTime(0.12, now + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(sustain * 0.12, now + attackTime + decayTime);
      
      // Trigger release
      const noteDuration = attackTime + decayTime + 0.5;
      gainNode.gain.setValueAtTime(sustain * 0.12, now + noteDuration);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + noteDuration + releaseTime);
      
      // Connect and start
      osc.connect(gainNode);
      gainNode.connect(this.filter);
      
      osc.start();
      
      // Stop oscillator after note is fully faded
      const totalTime = (noteDuration + releaseTime) * 1000;
      setTimeout(() => {
        try {
          osc.stop();
          lfo.stop();
        } catch (e) {
          // Prevent errors if context stopped in the middle
        }
      }, totalTime);
    }
    
    // Schedule next note in 2 to 5 seconds
    const nextInterval = 2000 + Math.random() * 3500;
    this.melodyTimer = setTimeout(() => this.playNextMelodyNote(), nextInterval);
  }

  stop() {
    if (!this.isPlaying) return;
    
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    // Smooth fade out to prevent clicks
    this.masterGain.gain.linearRampToValueAtTime(0, now + 1.5);
    
    setTimeout(() => {
      if (this.masterGain.gain.value === 0) {
        try {
          if (this.droneOsc1) { this.droneOsc1.stop(); this.droneOsc1 = null; }
          if (this.droneOsc2) { this.droneOsc2.stop(); this.droneOsc2 = null; }
        } catch (e) {}
        this.isPlaying = false;
        if (this.melodyTimer) {
          clearTimeout(this.melodyTimer);
          this.melodyTimer = null;
        }
      }
    }, 1600);
  }
}

export const spiritualSynth = new SpiritualSynth();
