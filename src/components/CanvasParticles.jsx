import React, { useEffect, useRef } from 'react';

export default function CanvasParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates to attract/repel particles
    const mouse = {
      x: null,
      y: null,
      radius: 120,
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Particle class
    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        // Start from bottom if not initializing, otherwise place randomly
        this.y = init ? Math.random() * height : height + 10;
        this.size = Math.random() * 2.5 + 0.5; // size between 0.5 and 3
        this.speedX = Math.random() * 0.4 - 0.2; // drifting speed X
        this.speedY = -(Math.random() * 0.5 + 0.2); // rising speed Y
        this.alpha = Math.random() * 0.5 + 0.1; // random opacity
        this.glow = Math.random() > 0.8; // some particles have extra glow
        this.flickerSpeed = Math.random() * 0.02 + 0.005;
        this.angle = Math.random() * 360;
        this.angleSpeed = Math.random() * 0.02 - 0.01;
      }

      update() {
        this.y += this.speedY;
        // Sway sideways
        this.x += this.speedX + Math.sin(this.angle) * 0.15;
        this.angle += this.angleSpeed;

        // Flicker effect
        this.alpha += this.flickerSpeed;
        if (this.alpha > 0.8 || this.alpha < 0.1) {
          this.flickerSpeed = -this.flickerSpeed;
        }

        // Mouse interaction: push away gently
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            // Push away
            this.x += (dx / distance) * force * 1.5;
            this.y += (dy / distance) * force * 1.5;
          }
        }

        // If particle moves off the top or sides, reset to bottom
        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        // Warm golden glow
        if (this.glow) {
          ctx.shadowBlur = this.size * 5;
          ctx.shadowColor = '#f7b73c';
          ctx.fillStyle = '#fffdf0';
        } else {
          ctx.fillStyle = '#fde8ab';
        }
        
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize particle array
    const particleCount = Math.min(80, Math.floor((width * height) / 18000));
    const particles = Array.from({ length: particleCount }, () => new Particle());

    // Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
